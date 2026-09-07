# Boiler controller — reconnect notes

Saved: 2026-09-05
Updated: 2026-09-07

## Confirmed device identity

- **App:** **Smart Life**
- **Device page name in Smart Life:** `Electric`
- **Deco client name:** `ESP_ABB4B8`
- **Wi‑Fi band:** **2.4 GHz**
- **MAC address:** `a4:e5:7c:ab:b4:b8`
- **Virtual ID / Tuya Device ID:** `20415515a4e57cabb4b8`
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
- **Tank / storage type:** closed storage water heater
- **Nominal tank volume:** **150 L**
- **Electric heating element:** **2,500 W (2.5 kW)**
- **Serial number:** **4150829477**
- Energy label references Israeli standard **ת״י 69.1, סעיף 4.5.1** for thermal losses.

Important: the Chromagen branding includes references to solar-water systems, but the photos do **not** prove that this specific installation has active solar collectors or a working solar loop. Do not assume solar contribution unless separately confirmed.

This hardware rating matches the meter experiment: when the boiler was heating, the measured incremental load was about **2.5 kW**.

## Post-repair test — 2026-09-06

Both the **heating element and thermostat were replaced** on **6 Sep 2026**. The boiler was then switched on at **14:30** for a controlled observation through Smart Life.

Observed checkpoints:

- **15:01** — Power **2474.9 W**, Current **10.779 A**, Voltage **228.9 V**, Today **3.72 kWh**, Total **4837.93 kWh**.
- **15:50** — Power **2474.9 W**, Today **5.73 kWh**, Total **4839.94 kWh**. Increase of **2.01 kWh in 49 min**, almost exactly what a continuously energized ~2.5 kW element should consume.
- **17:47** — Power **2461.5 W**, Current **10.731 A**, Voltage **228.9 V**, Today **10.54 kWh**, Total **4844.75 kWh**.
- **18:55** — Power **2454.9 W**, Current **10.713 A**, Voltage **227.9 V**, Today **13.35 kWh**, Total **4847.56 kWh**.
- **~19:00** — the boiler was **manually switched OFF by the user**. Therefore later 0 W readings do **not** demonstrate thermostat cut-off.
- **23:39** — Power **0 W**, Current **0 mA**, Voltage **233.4 V**, Today **14.59 kWh**, Total **4848.80 kWh**, September **110.61 kWh**. This is an OFF-state reading after the manual shutdown.
- **7 Sep 07:54** — Power **0 W**, Current **0 mA**, Voltage **233.7 V**, Today **0.00 kWh**, Total **4848.80 kWh**, September **110.61 kWh**.

From **15:01 to 18:55**, the total-energy counter increased by **9.63 kWh in 3 h 54 min**, equivalent to an average of about **2.47 kW**. No significant thermostat cut-off is visible in those measurements.

The unchanged Total reading from **23:39 to 07:54** confirms zero controller-recorded boiler consumption overnight while the Smart Life switch was OFF.

Note: Total Ele rose from **4847.56 kWh at 18:55** to **4848.80 kWh at 23:39**, even though the switch was manually turned off around 19:00. Because the exact 19:00 Total value was not captured, this 1.24 kWh difference should not be used to infer a thermostat cut-off time; delayed/batched Smart Life energy accounting is one possible explanation.

Interpretation: replacing **both the heating element and thermostat** did not yet demonstrate normal thermostat cycling. If hot-water use during the test was limited, the remaining suspects include incorrect thermostat installation/placement, a thermostat probe not correctly seated, incorrect setpoint or a defective new thermostat, wiring that bypasses the thermostat, another control fault, or continuous hot-water loss / cold-water replenishment. Significant hot-water draw during the test could extend the heating period and must be considered before assigning root cause.

## Thermostat / control behavior

A normal electric storage heater should stop energizing the 2.5 kW heating element once the thermostat reaches its set temperature, and restart only after the water cools enough to call for heat again. The very high historic consumption (~55–60 kWh/day) is therefore not normal thermostat-controlled behavior and remains a key diagnostic clue.

Possible causes to investigate now include incorrect thermostat installation or placement, the probe not being fully seated in its pocket, wrong thermostat setpoint, a defective replacement thermostat, wiring that bypasses the thermostat, relay/contactor behavior, or continuous hot-water loss / cold-water replenishment. These are hypotheses, not yet proven.

## Tuya Cloud / API status

The Smart Life account is linked to Tuya Cloud project **HA Danz** in the **Central Europe Data Center**.

Confirmed cloud device:

- Product/device group: `Boiler Smart Switch`
- Device name: `Boiler Smart Switch`
- Device ID: `20415515a4e57cabb4b8`
- API endpoint: `https://openapi.tuyaeu.com`

GitHub repository secrets are configured for the project's Access ID and Access Secret. The repository includes an automated Tuya sync workflow that attempts to retrieve current device status plus daily and monthly electricity history.

The original IoT Core / Cloud Development trial expired on **2026-05-10**. After extension, current device/status/specification access resumed, but the historical energy endpoint currently responds:

`No permissions. This API is not subscribed.`

The fallback time-series endpoint currently responds:

`token invalid`

So the current Tuya blocker is specifically **historical energy API authorization/subscription**, not basic device connectivity. The collector is already configured to request:

- current device information/status/specification;
- daily electricity history over the latest 90 days, in 7-day chunks;
- monthly history over the latest 12 months.

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
- Exact replacement thermostat model / set temperature.
- Confirmation that the replacement thermostat probe is correctly seated and that the element is electrically routed through the thermostat contacts.
- Whether this installation has active solar collectors or an active solar loop.
- Whether there was significant hot-water draw during the post-repair 14:30–18:55 test.
- Tuya historical energy API authorization and historical daily-data retrieval.

The water tank itself is identified: Chromagen, 150 L, 2.5 kW, serial 4150829477.