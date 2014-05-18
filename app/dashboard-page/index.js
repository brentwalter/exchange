var express = require('express');
var app = module.exports = express();
var request = require('request');
var async = require('async');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/paypal/activity', function(req, res){
  res.render('dash');
});
