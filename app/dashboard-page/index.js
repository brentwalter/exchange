var express = require('express');
var app = module.exports = express();

// Use environment variable to toggle mock/read DB requests
// Only mock model has been created for this demo
var modelPath = (app.get('env') === "development") ? '../models/transactions/mock' : '../models/transactions';
var transactions = require(modelPath);

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/paypal/activity', function(req, res) {

  transactions.getTransactions(function(err, activities) {
    if (err) throw err;
    console.log('dashboard-page | activities length', activities.length);
    res.render('dash', {activities:activities, activitiesString:JSON.stringify(activities)});
  });


});
