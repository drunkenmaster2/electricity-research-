# Boiler controller — reconnect notes

Saved: 2026-09-05

## Confirmed device identity

- **App:** **Smart Life**
- **Device page name in Smart Life:** `Electric`
- **Deco client name:** `ESP_ABB4B8`
- **Wi‑Fi band:** **2.4 GHz**
- **MAC address:** `a4:e5:7c:ab:b4:b8`
- **Virtual ID:** `20415515a4e57cabb4b8`
- **Time zone:** `Asia/Jerusalem`
- **Signal strength observed:** about **-50 dBm** (previous screenshot showed about -53 dBm)
- **Public IP shown by the app:** `79.177.141.*` (partial; likely dynamic, so do not use it as the main identifier)

## Smart Life account

- **Region:** Israel
- **Linked email (masked as shown in Smart Life):** `Ami****nziger@gmail.com`
- Do **not** store the Smart Life password in this public repository.
- The Smart Life screen also shows an account **User Code**; it is intentionally not copied here because this repository is public and the code may be account-sensitive.

## Boiler / tank hardware

Confirmed from the physical labels and photos:

- **Manufacturer:** Chromagen (כרומגן)
- **System:** solar water system with electric backup heating
- **Tank type:** closed electric water heater / storage tank
- **Nominal tank volume:** **150 L**
- **Electric heating element:** **2,500 W (2.5 kW)**
- **Serial number:** **4150829477**
- Energy label references Israeli standard **ת״י 69.1, סעיף 4.5.1** for thermal losses.

This hardware rating matches the meter experiment: when the boiler was heating, the measured incremental load was about **2.5 kW**.

## Why we are confident this is the boiler controller

Smart Life shows MAC `a4:e5:7c:ab:b4:b8` for the device page `Electric`. In the Deco client list, the client `ESP_ABB4B8` appears under the **2.4 GHz** section. The suffix `ABB4B8` matches the final three bytes of the MAC address exactly.

So the best durable identifiers are:

1. Smart Life device `Electric`
2. `ESP_ABB4B8`
3. MAC `a4:e5:7c:ab:b4:b8`
4. Virtual ID `20415515a4e57cabb4b8`
5. Smart Life region `Israel`
6. Linked email as masked in the app: `Ami****nziger@gmail.com`
7. Chromagen tank, **150 L / 2.5 kW**, serial **4150829477**

## Reconnect checklist

1. Make sure the Deco **2.4 GHz** network is enabled.
2. In the Deco app, check the 2.4 GHz client list for `ESP_ABB4B8`.
3. Verify that its MAC is `a4:e5:7c:ab:b4:b8`.
4. Open **Smart Life** and use the account whose region is **Israel** and whose linked email matches `Ami****nziger@gmail.com`.
5. Look for the device named **Electric**.
6. Open Device Information and verify the Virtual ID `20415515a4e57cabb4b8` and MAC `a4:e5:7c:ab:b4:b8`.
7. If the controller is online in Deco but missing from Smart Life, treat this as an app/account pairing issue rather than a Wi‑Fi issue.
8. If `ESP_ABB4B8` is not present in Deco, reconnect/pair the controller to the 2.4 GHz network.

## Still missing

- Exact Smart Life controller/switch hardware model number.
- Exact pairing/reset procedure for the Smart Life controller.

The water tank itself is identified: Chromagen, 150 L, 2.5 kW, serial 4150829477.
