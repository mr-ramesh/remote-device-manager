const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('./config.ini', 'utf8'));
const environment = ini.parse(fs.readFileSync(`${config.env.prefix + config.env.value}.ini`, 'utf8'));

const db_connector = require('./src/repository/connector');
const connection = new db_connector(environment.db).getConnection();

const interceptor = require('./src/controller/interceptor');
const securityRoutes = require('./src/controller/security');
const deviceRoutes = require('./src/controller/device');

const server = require('./server');
server.init(environment);
server.addRoutes(null, securityRoutes);
server.addRoutes(null, interceptor);
server.addRoutes('/device', deviceRoutes);
