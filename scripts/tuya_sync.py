from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from tuya_connector import TuyaOpenAPI

DEVICE_ID = os.getenv("TUYA_DEVICE_ID", "20415515a4e57cabb4b8")
ENDPOINT = os.getenv("TUYA_ENDPOINT", "https://openapi.tuyaeu.com")
ACCESS_ID = os.getenv("TUYA_ACCESS_ID", "")
ACCESS_SECRET = os.getenv("TUYA_ACCESS_SECRET", "")
OPTIONAL = os.getenv("TUYA_SYNC_OPTIONAL", "0") == "1"
TZ = ZoneInfo("Asia/Jerusalem")
OUT = Path("data/tuya")
OUT.mkdir(parents=True, exist_ok=True)


def dump(path: Path, payload: object) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def load_json(path: Path, default: object) -> object:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def response_error(resp: object) -> str | None:
    if not isinstance(resp, dict):
        return f"Unexpected response type: {type(resp).__name__}"
    if resp.get("success") is True:
        return None
    return str(resp.get("msg") or resp.get("message") or resp.get("code") or "unknown Tuya error")


def parse_values(raw: object) -> dict:
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str) and raw:
        try:
            obj = json.loads(raw)
            return obj if isinstance(obj, dict) else {}
        except json.JSONDecodeError:
            return {}
    return {}


def normalized_status(status_resp: dict, spec_resp: dict) -> dict:
    spec_items = ((spec_resp.get("result") or {}).get("status") or []) if isinstance(spec_resp, dict) else []
    specs = {item.get("code"): parse_values(item.get("values")) for item in spec_items if isinstance(item, dict)}
    out: dict[str, dict] = {}
    for item in status_resp.get("result") or []:
        if not isinstance(item, dict) or not item.get("code"):
            continue
        code = item["code"]
        raw = item.get("value")
        spec = specs.get(code, {})
        scale = spec.get("scale", 0)
        unit = spec.get("unit")
        value = raw
        if isinstance(raw, (int, float)) and isinstance(scale, int) and scale > 0:
            value = raw / (10 ** scale)
        out[code] = {"raw": raw, "value": value, "unit": unit, "scale": scale}
    return out


def month_shift(year: int, month: int, delta: int) -> tuple[int, int]:
    idx = year * 12 + (month - 1) + delta
    return idx // 12, idx % 12 + 1


def flatten_energy(resp: dict) -> list[dict]:
    result = resp.get("result")
    if not isinstance(result, list):
        return []
    rows = []
    for item in result:
        if isinstance(item, dict):
            time = item.get("time")
            value = item.get("value")
            if time is not None and value is not None:
                rows.append({"time": str(time), "value": value})
    return rows


def merge_rows(path: Path, rows: list[dict]) -> list[dict]:
    old = load_json(path, {"data": []})
    existing = old.get("data", []) if isinstance(old, dict) else []
    merged = {str(x.get("time")): x for x in existing if isinstance(x, dict) and x.get("time") is not None}
    for row in rows:
        merged[str(row["time"])] = row
    return [merged[k] for k in sorted(merged)]


def main() -> int:
    if not ACCESS_ID or not ACCESS_SECRET:
        msg = "TUYA_ACCESS_ID / TUYA_ACCESS_SECRET are not configured"
        print(msg)
        if OPTIONAL:
            return 0
        return 2

    now = datetime.now(TZ)
    meta = {
        "device_id": DEVICE_ID,
        "endpoint": ENDPOINT,
        "timezone": "Asia/Jerusalem",
        "synced_at": now.isoformat(),
        "errors": [],
    }

    api = TuyaOpenAPI(ENDPOINT, ACCESS_ID, ACCESS_SECRET)
    token = api.connect()
    err = response_error(token)
    if err:
        meta["errors"].append({"stage": "connect", "error": err})
        dump(OUT / "sync_meta.json", meta)
        print(f"Tuya connect failed: {err}")
        return 1

    calls = {
        "device": f"/v1.0/iot-03/devices/{DEVICE_ID}",
        "status": f"/v1.0/iot-03/devices/{DEVICE_ID}/status",
        "specification": f"/v1.0/iot-03/devices/{DEVICE_ID}/specification",
    }
    raw: dict[str, object] = {}
    for name, path in calls.items():
        resp = api.get(path)
        raw[name] = resp
        call_err = response_error(resp)
        if call_err:
            meta["errors"].append({"stage": name, "error": call_err})

    status_resp = raw.get("status") if isinstance(raw.get("status"), dict) else {}
    spec_resp = raw.get("specification") if isinstance(raw.get("specification"), dict) else {}
    latest = {
        "synced_at": now.isoformat(),
        "device_id": DEVICE_ID,
        "normalized_status": normalized_status(status_resp, spec_resp),
        "raw": raw,
    }
    dump(OUT / "latest.json", latest)

    energy_path = "/v1.0/iot-03/energy/electricity/devices/statistics-trend"

    # Daily history: Tuya documents a maximum of 7 days per request, last 90 days.
    daily_rows: list[dict] = []
    cursor = now.date() - timedelta(days=89)
    while cursor <= now.date():
        chunk_end = min(cursor + timedelta(days=6), now.date())
        params = {
            "energy_action": "consume",
            "statistics_type": "day",
            "start_time": cursor.strftime("%Y%m%d"),
            "end_time": chunk_end.strftime("%Y%m%d"),
            "device_id": DEVICE_ID,
        }
        resp = api.get(energy_path, params)
        call_err = response_error(resp)
        if call_err:
            meta["errors"].append({"stage": "energy_day", "range": [params["start_time"], params["end_time"]], "error": call_err})
        else:
            daily_rows.extend(flatten_energy(resp))
        cursor = chunk_end + timedelta(days=1)

    if daily_rows:
        daily_path = OUT / "energy_daily.json"
        merged = merge_rows(daily_path, daily_rows)
        dump(daily_path, {"unit": "kWh", "statistics_type": "day", "data": merged, "updated_at": now.isoformat()})

    # Monthly history: one request covers the latest 12 months.
    start_y, start_m = month_shift(now.year, now.month, -11)
    month_params = {
        "energy_action": "consume",
        "statistics_type": "month",
        "start_time": f"{start_y:04d}{start_m:02d}",
        "end_time": f"{now.year:04d}{now.month:02d}",
        "device_id": DEVICE_ID,
    }
    month_resp = api.get(energy_path, month_params)
    month_err = response_error(month_resp)
    if month_err:
        meta["errors"].append({"stage": "energy_month", "error": month_err})
    else:
        monthly_path = OUT / "energy_monthly.json"
        merged = merge_rows(monthly_path, flatten_energy(month_resp))
        dump(monthly_path, {"unit": "kWh", "statistics_type": "month", "data": merged, "updated_at": now.isoformat()})

    meta["success"] = not any(x["stage"] in {"connect", "device", "status"} for x in meta["errors"])
    dump(OUT / "sync_meta.json", meta)
    print(f"Tuya sync complete; {len(daily_rows)} daily energy rows received; errors={len(meta['errors'])}")
    return 0 if meta["success"] else 1


if __name__ == "__main__":
    sys.exit(main())
