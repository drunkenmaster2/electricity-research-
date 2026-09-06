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

### Credentials

The GitHub repository already has the Tuya Access ID and Access Secret configured as Actions secrets:

- `TUYA_ACCESS_ID`
- `TUYA_ACCESS_SECRET`

Do not commit or paste the secret into this public repository.

### Current blocker — IoT Core trial expired

The credentials are detected correctly by the GitHub Action, but Tuya currently rejects device/status/history requests with:

`No permissions. Your subscription to cloud development plan has expired.`

The original IoT Core / Cloud Development trial ran from **2026-04-10 to 2026-05-10**. A second Trial Edition cannot be activated because this Tuya account has already used a trial.

On **2026-09-05**, an extension application was submitted through Tuya Developer Platform. The project UI showed:

`Your application for extension is being reviewed.`

Once that extension is approved, rerun **Actions → Sync Tuya Boiler**. No GitHub secret or code changes should be needed.

### What the sync requests

The workflow queries:

1. device info, current status and specifications;
2. daily electricity history in 7-day chunks for the latest 90 days;
3. monthly electricity history for the latest 12 months.

Results are committed under `data/tuya/`, which triggers the Pages deployment. The sync also runs automatically every 6 hours.

## Key files

- `data.js` — manually curated research data used by the dashboard.
- `boiler-reconnect.md` — Smart Life/Deco/boiler hardware recovery notes plus the 6 Sep post-repair test and Tuya API status.
- `scripts/tuya_sync.py` — Tuya OpenAPI collector.
- `.github/workflows/tuya-sync.yml` — scheduled API sync.
- `data/tuya/` — generated Tuya snapshots/history and diagnostics.
