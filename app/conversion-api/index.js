
var express = require('express');
var app = module.exports = express();

var exchange = require('../../exchange-module')({logging:true});

//mock out model if in development mode (default)
var model = (app.get('env') === "development") ? '../models/transactions/mock' : '../models/transactions';

//initialize campaigns models
var campaign = require(model);

app.get('/paypal/currencyConversion', function(req, res) {
  if (req.query && req.query.amount && req.query.to && req.query.from) {
    exchange.convert({
      from: req.query.from,
      to: req.query.to,
      amount: req.query.amount
    }, function(err, amount, country, symbol) {
      if (err) return res.send(500, {error: 'something broke'});
      res.json({
        amount: amount,
        currencyCode: country,
        currencySymbol: encodeURIComponent(symbol)
      });
    });
  }
  else {
    res.send(400, { error: 'Please send an appropriate query'});
  }
});
