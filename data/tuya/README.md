# Tuya snapshots

This folder is written automatically by `.github/workflows/tuya-sync.yml`.

Expected generated files:

- `latest.json` — current device info/status/specification plus normalized datapoints.
- `energy_daily.json` — daily electricity consumption history returned by Tuya (last 90 days, accumulated across syncs).
- `energy_monthly.json` — monthly electricity consumption history returned by Tuya (latest 12 months).
- `sync_meta.json` — last sync timestamp and any API/authorization errors.

Credentials are **not** stored in this repository. The workflow reads `TUYA_ACCESS_ID` and `TUYA_ACCESS_SECRET` from GitHub Actions repository secrets.
