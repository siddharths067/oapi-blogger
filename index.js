'use strict';

var path = require('path');
var http = require('http');
var logger = require(`./logger`);

var oas3Tools = require('oas3-tools');
var serverPort = 8080;

// SQL Model Initialization
const User = require(`./database/models/User`);
const StoryEntries = require(`./database/models/Story`);
const DistinctReaders = require(`./database/models/DistinctReaders`);

User.sync({force: false, logging: console.log}).then(() => {
    logger.info(`User Model Initialized`);
}).catch(err => {
    logger.error(`Error Occurred ${err}`);
});


StoryEntries.sync({force: false,  logging: console.log}).then(() => {
    logger.info(`Story Model Initialized`);
}).catch(err => {
    logger.error(`Error Occurred ${err}`);
});

DistinctReaders.sync({force: false,  logging: console.log}).then(() => {
    logger.info(`Story Stats Model Initialized`);
}).catch(err => {
    logger.error(`Error Occurred ${err}`);
});

// SQL Model Initialization Ends

// swaggerRouter configuration
var options = {
    controllers: path.join(__dirname, './controllers')
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
expressAppConfig.addValidator();
var app = expressAppConfig.getApp();


//Allowing cors
var cors = require(`cors`);
app.use(cors({
    origin: '*'
}));
// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

