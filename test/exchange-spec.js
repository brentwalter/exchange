var exchangeFileOnly = require('../exchange')({useFileStoreOnly:true});
var exchangeHttp = require('../exchange')();



// exchangeFileOnly.getConversionRate('USD', 'EUR', function conversionRate(err, data){
//   if (err) return console.error(err);
//   console.log('exchange-spec | exchangeFileOnly | conversionRate:', data);
// });


exchangeHttp.getConversionRate('USD', 'EUR', function conversionRate(err, data){
  if (err) return console.error(err);
  console.log('exchange-spec | exchangeHttp | conversionRate:', data);
});
