# ❄️ Fridge Monitor ❄️

A monitoring system for refrigerators.

Using Raspberry Pi Pico W and sensor hardware, we can monitor the status of a refrigerator. This data can be used to help modify user behavior and improve energy conservation (e.g. keeping the refrigerator door open too long, or opening it too often).

## Features
- Play an alert sound if the refrigerator door is open too long.
- Monitor refrigerator temperature over time.
- Monitor refrigerator door open/close events over time.

![dashboard.png](images%2Fdashboard.png)

## Components:
- `/dashboard` - A Front-End for viewing data interactively.
- `/device` - Code for running on the Raspberry Pi hardware.
- `/infrastructure` - IaC (Infrastructure as Code) for configuring the cloud components.
- `/schematic` - Hardware schematics for how to wire the Raspberry Pi and sensors.

TODO: high level system diagram

## Usage

- TODO:

## Potential Future Improvements

- Add a weekly report email generator to get updates and trends on usage without having to view the dashboard.
