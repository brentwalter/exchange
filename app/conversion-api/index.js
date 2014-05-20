
var express = require('express');
var app = module.exports = express();

var exchange = require('../../exchange-module')({logging:true});

app.get('/paypal/currencyConversion', function(req, res) {
  if (req.query && req.query.amount && req.query.to && req.query.from) {
    exchange.convert({
      from: req.query.from,
      to: req.query.to,
      amount: req.query.amount
    }, function(err, amount, country, symbol) {
      if (err) {
        console.error(err);
        return res.send(500, {error: err.message});
      }
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
