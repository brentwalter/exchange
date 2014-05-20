
var express = require('express');
var app = module.exports = express();

var exchange = require('../../exchange-module')({logging:true});

app.get('/paypal/conversionRate', function(req, res) {
  if (req.query && req.query.to && req.query.from) {
    exchange.getConversionRate(req.query.from, req.query.to, function(err, rate) {
      if (err) {
        console.error(err);
        return res.send(500, {error: err.message});
      }
      res.json({
        conversionRate: rate
      });
    });
  }
  else {
    res.send(400, { error: 'Please send an appropriate query'});
  }
});
