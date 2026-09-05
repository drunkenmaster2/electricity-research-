# Electricity research — Balfour 67

Public dashboard and evidence log for investigating the 2026 electricity-consumption spike.

Live site: https://drunkenmaster2.github.io/electricity-research-/

## Tuya / Smart Life API bridge

The boiler smart switch is linked to the Tuya Cloud project **HA Danz** in the **Central Europe** data center.

Confirmed device:

- Device: `Boiler Smart Switch`
- Device ID: `20415515a4e57cabb4b8`
- Smart Life device page: `Electric`
- Deco client: `ESP_ABB4B8`
- API endpoint: `https://openapi.tuyaeu.com`

### One-time secret setup

In Tuya Developer Platform → **Cloud → Development → HA Danz → Overview**, copy the project's **Access ID / Client ID** and **Access Secret / Client Secret**.

Do not commit or paste the secret into this public repository.

In GitHub open:

**Settings → Secrets and variables → Actions → New repository secret**

Create exactly these two repository secrets:

- `TUYA_ACCESS_ID`
- `TUYA_ACCESS_SECRET`

The device ID and EU endpoint are not secret and are already configured in the workflow.

### Run it

After adding the two secrets:

1. Open **Actions → Sync Tuya Boiler**.
2. Choose **Run workflow**.
3. The workflow queries device info, current status and specifications.
4. It also requests Tuya electricity statistics:
   - daily data in 7-day chunks for the latest 90 days;
   - monthly data for the latest 12 months.
5. Results are committed under `data/tuya/`, which triggers the Pages deployment.

The sync also runs automatically every 6 hours.

If the energy-statistics endpoint returns an authorization error, use Tuya's API Explorer for **Query Energy Consumption Trend** and authorize/subscribe the required API product for `HA Danz`. Current status/device calls can still work independently.

## Key files

- `data.js` — manually curated research data used by the dashboard.
- `boiler-reconnect.md` — Smart Life/Deco/boiler hardware recovery notes.
- `scripts/tuya_sync.py` — Tuya OpenAPI collector.
- `.github/workflows/tuya-sync.yml` — scheduled API sync.
- `data/tuya/` — generated Tuya snapshots/history.
