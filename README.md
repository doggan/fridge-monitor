# ❄️ Fridge Monitor ❄️

A monitoring system for refrigerators.

Using Raspberry Pi Pico W and sensor hardware, we can monitor the status of a refrigerator. This data can be used to help modify user behavior and improve energy conservation (e.g. keeping the refrigerator door open too long, or opening it too often).

## Features
- Play an alert sound if the refrigerator door is open too long.
- Monitor refrigerator temperature over time.
- Monitor refrigerator door open/close events over time.

![dashboard.png](images%2Fdashboard.png)

## Components
- `/dashboard` - A Front-End for viewing data interactively.
- `/device` - Code for running on the Raspberry Pi hardware.
- `/infrastructure` - IaC (Infrastructure as Code) for configuring the cloud components.
- `/schematic` - Hardware schematics for how to wire the Raspberry Pi and sensors.

![system-design.png](schematic%2Fsystem-design.png)

## Usage

### Dashboard

For local development:
- Create a `.env.local` file with the following values:
    - `NEXT_PUBLIC_BASE_API_URL=XXXXX` - This can be anything when using mock data, since the actual device id is not used.
    - `NEXT_PUBLIC_BASE_API_URL=http://localhost:3001` - The default API URL for retrieving data.
    - For Auth0 login, add:
        - `AUTH0_SECRET='XXXXX'`
        - `AUTH0_BASE_URL='http://localhost:3000'`
        - `AUTH0_ISSUER_BASE_URL='XXXXX'`
        - `AUTH0_CLIENT_ID='XXXXX'`
        - `AUTH0_CLIENT_SECRET='XXXXX'`
- Run the project:
  - `npm run dev`
- Start a local API server to mock data, available at [http://localhost:3001](http://localhost:3001) by default:
  - `npm run mock-server`
- Access [http://localhost:3000](http://localhost:3000) to view the result.

For deploying to Vercel, the above environment variables must be defined.

### Device

- Configure the hardware as illustrated in the schematic below.
- Modify the required constants in `config.py`.
- Deploy code to hardware (Raspberry Pi Pico W).

#### Schematic

TODO:

### Infrastructure

TODO:

## Potential Future Improvements

- Add a weekly report email generator to get updates and trends on usage without having to view the dashboard.
