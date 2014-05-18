var express = require('express');
var app = express();

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

console.log('Application running in', app.get('env'), 'mode.');

//load sub-applications
var dashboard    = require('./app/dashboard-page');
var conversionApi = require('./app/conversion-api');
var conversionRateApi = require('./app/conversionRate-api');

//serve static files out of /public directory
app.use(express.static(__dirname + '/public'));

//attach sub-applications to this server
app.use(dashboard);
app.use(conversionApi);
app.use(conversionRateApi);
