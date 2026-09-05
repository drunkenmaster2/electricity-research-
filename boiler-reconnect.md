# Boiler controller — reconnect notes

Saved: 2026-09-05

## Confirmed device identity

- **Deco client name:** `ESP_ABB4B8`
- **Wi‑Fi band:** **2.4 GHz**
- **MAC address:** `a4:e5:7c:ab:b4:b8`
- **Virtual ID:** `20415515a4e57cabb4b8`
- **Time zone:** `Asia/Jerusalem`
- **Signal strength observed:** about **-50 dBm** (previous screenshot showed about -53 dBm)
- **Public IP shown by the app:** `79.177.141.*` (partial; likely dynamic, so do not use it as the main identifier)

## Why we are confident this is the boiler controller

The boiler app shows MAC `a4:e5:7c:ab:b4:b8`. In the Deco client list, the client `ESP_ABB4B8` appears under the **2.4 GHz** section. The suffix `ABB4B8` matches the final three bytes of the MAC address exactly.

So the best durable identifiers are:

1. `ESP_ABB4B8`
2. MAC `a4:e5:7c:ab:b4:b8`
3. Virtual ID `20415515a4e57cabb4b8`

## Reconnect checklist

1. Make sure the Deco **2.4 GHz** network is enabled.
2. In the Deco app, check the 2.4 GHz client list for `ESP_ABB4B8`.
3. Verify that its MAC is `a4:e5:7c:ab:b4:b8`.
4. Open the boiler app and look for the device page titled **Electric**.
5. If the controller is online in Deco but missing from the boiler app, treat this as an app/account pairing issue rather than a Wi‑Fi issue.
6. If `ESP_ABB4B8` is not present in Deco, reconnect/pair the controller to the 2.4 GHz network.

## Still missing

- Exact **boiler app name** is not visible in the screenshots we saved.
- Exact pairing/reset procedure for this controller has not yet been documented.

When we identify the app name/controller model, add those details here.
