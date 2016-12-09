const Influx = require('influx');
const Restify = require('restify');
const restify = Restify.createServer();
const bunyan = require('bunyan');

const log = bunyan.createLogger({
    name: 'car-obd',
    stream: process.stdout,
    level: 'debug'
});

let speed = 10;

const PID_DICT = require('./pid_dictionary.json');

const DATABASE_NAME = process.env.DB_NAME || 'car_obd';
const DATABASE_HOST = process.env.DB_HOST || 'localhost';
const HTTP_PORT = parseInt(process.env.HTTP_PORT || '3001');

const influx = new Influx.InfluxDB({
    host: DATABASE_HOST,
    database: DATABASE_NAME
});

influx.getDatabaseNames()
    .then(names => {
        if (!names.includes(DATABASE_NAME)) {
            log.info(`Created database "${DATABASE_NAME}".`);
            return influx.createDatabase(DATABASE_NAME);
        } else {
            log.info(`Database "${DATABASE_NAME}" already exists.`);
        }
    })
    .then(() => {
        restify.use(Restify.queryParser());
        restify.listen(HTTP_PORT, function () {
            log.info(`Listening on port ${HTTP_PORT}.`);
        });

        restify.get('/torque', (req, res, next) => {
            log.info({
                query: req.query
            }, 'Got /torque');

            let keys = {};

            for(const k in req.query) {
                if (Object.hasOwnProperty.call(req.query, k) && /^k/.test(k)) {
                    const val = parseFloat(req.query[k]);
                    const name = PID_DICT[k];
                    log.debug({
                        key: k,
                        keyName: name,
                        value: val
                    }, 'Got Torque queryString parameter');
                    keys[name || k] = val;
                } else {
                    log.debug({
                        key: k,
                        value: req.query[k]
                    }, 'Ignored queryString parameter');
                }
            }

            log.debug({
                keys: keys
            }, 'queryString parameters are parsed');

            influx.writeMeasurement('car', [
                {
                    fields: keys,
                    timestamp: new Date(parseInt(req.query.time))
                }
            ]).then(() => {
                log.debug('Wrote points to influx');
            }).catch(err => {
                log.error(`Error saving data to InfluxDB! ${err}`)
            });
            res.send(200, 'OK!');
            log.debug('Sent response, 200: OK!');
            next();
            return;
        });

    })
    .catch(err => {
        log.error(`Error creating Influx database "${DATABASE_NAME}"!`, err);
    });

