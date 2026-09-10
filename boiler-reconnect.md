# Boiler controller — reconnect notes

Saved: 2026-09-05
Updated: 2026-09-10

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
- **8 Sep 22:09** — Power **0 W**, Current **0 mA**, Voltage **231.1 V**, Today **0.00 kWh**, Total **4848.80 kWh**, September **110.61 kWh**.

From **15:01 to 18:55**, the total-energy counter increased by **9.63 kWh in 3 h 54 min**, equivalent to an average of about **2.47 kW**. No significant thermostat cut-off was visible during that test.

The unchanged Total reading from **6 Sep 23:39 through 10 Sep 09:33** ultimately confirmed zero controller-recorded boiler consumption for about **81 h 54 min** while the Smart Life switch was OFF.

This is a strong control result for the Smart Life switch: **OFF fully removes the boiler load**.

Note: Total Ele rose from **4847.56 kWh at 18:55** to **4848.80 kWh at 23:39**, even though the switch was manually turned off around 19:00. Because the exact 19:00 Total value was not captured, this 1.24 kWh difference should not be used to infer a thermostat cut-off time; delayed/batched Smart Life energy accounting is one possible explanation.

## Thermostat-cycle test — 2026-09-10

A second controlled test was run with the replacement thermostat. The important difference is that the Smart Life switch was deliberately left **ON** until the end of the test so thermostat behavior could be distinguished from a manual app shutdown.

Observed checkpoints:

- **09:33 — start / ON:** Power **2445.1 W**, Current **10.817 A**, Voltage **233.4 V**, Today **0.0 kWh**, Total **4848.80 kWh**, September **110.61 kWh**.
- **17:33 — whole-house meter:** **118,439 kWh**. Previous meter checkpoint was **118,286 kWh at 7 Sep 18:40**, so the house used **153 kWh in 70 h 53 min**, equivalent to about **51.8 kWh/day**.
- **17:34 — thermostat OFF observed while Smart Life remained ON:** Power **0 W**, Current **0 mA**, Voltage **232.1 V**, Today **8.09 kWh**, Total **4856.88 kWh**, September **118.70 kWh**.
- **19:48 — heating resumed without a manual toggle:** Power **2478.2 W**, Current **10.788 A**, Voltage **228.9 V**, Today **12.61 kWh**, Total **4861.40 kWh**, September **123.22 kWh**.
- **~19:50 — manual shutdown:** after the 19:48 observation, the user manually switched the boiler OFF, ending the test.

### What this proves

The sequence **ON at 09:33 → 0 W at 17:34 while Smart Life remained ON → ~2.48 kW again at 19:48 without a manual toggle** is direct evidence that the replacement thermostat/control path can now **cut power to the heating element and later re-energize it**.

From 09:33 to 17:34, Total Ele increased by only **8.08 kWh** over **8 h 01 min**. At a full heating power of ~2.45 kW, that is equivalent to only about **3.3 hours of full-power heating**, so the element could not have been energized continuously throughout the interval.

From 17:34 to 19:48, Total Ele increased another **4.52 kWh** over **2 h 14 min**. The 19:48 live reading shows the element was fully energized again, proving a restart after the earlier cut-off. Exact cut-off and restart times are not known because only checkpoint screenshots were taken.

Across the whole 09:33–19:48 test, Total Ele increased **12.60 kWh** in **10 h 15 min**, equivalent to about **5.1 hours of full-power heating** at ~2.45 kW. That is roughly a 50% effective duty cycle over the observed window, although hot-water use and thermostat hysteresis can strongly affect that figure.

### Important new implication for the house-level investigation

The whole-house meter used **153 kWh** between **7 Sep 18:40** and **10 Sep 17:33** (~**51.8 kWh/day**). The boiler was OFF for most of that interval and had accumulated only about **8.08 kWh** by the 17:34 boiler checkpoint.

Therefore, while the boiler clearly explains a major part of the extreme June–July anomaly, the current household still has a substantial **non-boiler load** that needs separate quantification — most likely starting with the two air-conditioning systems and other continuous loads.

## Thermostat / control behavior

A normal electric storage heater should stop energizing the 2.5 kW heating element once the thermostat reaches its set temperature, and restart only after the water cools enough to call for heat again.

The **10 Sep test directly demonstrated that behavior**. This materially changes the current diagnosis: the replacement thermostat/control path is now observed to cycle the element rather than leaving it continuously energized.

What remains unexplained is the history. The very high May–July consumption (~55–60 kWh/day on many days) was not normal thermostat-controlled behavior. The 6 Sep test also showed at least 4 h 25 min of continuous full-power heating after the replacement, whereas the 10 Sep test showed a cut-off and later restart. Starting water temperature, hot-water draw, thermostat hysteresis and the historic fault mechanism still need to be distinguished.

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

## Still missing / next investigation

- Exact Smart Life controller/switch hardware model number.
- Exact pairing/reset procedure for the Smart Life controller.
- Exact replacement thermostat model / set temperature.
- Exact thermostat cut-off and restart timestamps on 10 Sep; only checkpoint observations are available.
- Why the 6 Sep run stayed continuously energized for at least 4 h 25 min, while the 10 Sep run showed normal cycling; hot-water use and starting water temperature are relevant unknowns.
- Root cause of the historic May–July near-continuous boiler consumption.
- Whether there is or was continuous hot-water loss / cold-water replenishment, especially given the water-consumption alerts.
- Quantification of the remaining ~50 kWh/day household load when the boiler is mostly OFF, especially both AC systems and other continuous loads.
- Exact lower-floor AC specification.
- Whether this installation has active solar collectors or an active solar loop.
- Tuya historical energy API authorization and historical daily-data retrieval.

The water tank itself is identified: Chromagen, 150 L, 2.5 kW, serial 4150829477.