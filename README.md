node-torque-bhp-influx
======================
Purpose
-------
The purpose of this service is to expose an API to use in the Torque Android app and put all metrics into InfluxDb.

Usage
-----
Run the service `node . | bunyan`. 
Optionally, configure environment variables

```
DB_NAME=car_obd
DB_HOST=localhost
HTTP_PORT=3001
```
