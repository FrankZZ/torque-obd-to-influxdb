torque-obd-to-influxdb
======================
Purpose
-------
The purpose of this service is to expose an API to use in the Torque Android app and put all metrics into InfluxDb.

Usage
-----
Run the service using docker-compose `docker-compose up -d` and you can access Grafana on `localhost:3000`.

*If your docker-machine ip is not localhost, please change it as needed*

Please keep in mind that you have to add the influxdb datasource in Grafana.
