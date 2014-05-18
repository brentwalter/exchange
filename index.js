
var http = require('http');
var fs = require('fs');

/*
 *  Configure the exchange module
 *  @config {object}
 *  @config.hostname {string} domain to 3rd party rates API
 *  @config.path {string} path for 3rd party rates API
 *  @config.apiID {string} path to 3rd party rates API
 *  @config.fileStore {string} path and filename of where to cache rates
 */
module.exports = function(config) {

  'strict mode';

  config          = config || {};
  var hostname    = config.hostname || 'openexchangerates.org';
  var path        = config.path || '/api/latest.json?app_id=';
  var id          = config.apiID || '3e2ebdb2317b453fa6a3bb88d3bd59c1';
  var cacheFile   = config.fileStore || './data/ratesCache.txt';
  var ratesCache = null;


  /****************
   * PUBLIC METHODS
   ****************/

  /*
   *  Convert dollar amount to new currency
   *  @options {object}
   *  @options.amount {float} amount to be converted
   *  @options.from {string} [optional] three character currency code of amount. Default "USD".
   *  @options.to {string}  three character currency code of the converted amount
   */
  function convert (options, callback) {
    if (!options) throw 'convert method requires options object as first argument';

    var amount = options.amount || callback( new Error('convert method requires options.amount') );
    var from = options.from || 'USD';
    var to = options.to || callback( new Error('convert method requires options.to') );

    // TODO: this needs to be fleshed out

  }

  /*
   *  Return the conversion rate for a given 3-letter country code
   *  @fromCountry {string} three letter country code
   *  @toCountry {string} three letter country code
   */
  function getConversionRate(fromCountry, toCountry, callback) {
    _getCurrencyInfo(fromCountry, function fromCountry(err, data) {
      if (err) return callback(err);
      var fromRate = data.rate;
      _getCurrencyInfo(toCountry, function toCountry(err, data) {
        if (err) return callack(err);
        var toRate = data.rate;
        var conversionRate = Math.round(toRate / fromRate * 1000000) / 1000000;
        callback(conversionRate);
      });
    });
  }

  /*
   *  Returns the full rates object, ensuring up-to-date data
   *  This method tries to performantly return the latest data
   *  based on the fact that the API only updates every hour.
   *  Also, for performance, this method first looks to the memory cache,
   *  then the local file cache, and finally makes the http, API request.
   */
  function _getCurrencyInfo(countryCode, callback) {

    // if data is in memory (JSON): return it
    if ( ratesCache && !_isDataExpired(ratesCache.timestamp) ) {
      return callback(null, ratesCache);
    }
    // if data is in memory but expired: fetch new data [and process to file and into memory]
    // (if data in memory is stale, it's safe to assume data in file is stale)
    else if ( ratesCache && _isDataExpired(ratesCache.timestamp) ) {
      return _getNewRates(callback);
    }
    // if no data in memory but data in file: check if it is expired
    else if ( !ratesCache && fs.existsSync(cacheFile) ) {
      _readCacheFile(cacheFile, function cacheFile(err, data) {
        if (err) return callback(err);
        // if data expired, fetch new data [and process to file and into memory]
        if ( _isDataExpired(data.timestamp) ) {
          return _getNewRates(callback);
        }
        // if data is fresh, put it in memory and return it
        else {
          ratesCache = data;
          return callback(null, data);
        }
      });
    }
    // else no data in memory and no data in file, fetch new data [and process to file and into memory]
    else {
      return _getNewRates(callback);
    }
  }

  function _readCacheFile(file, callback) {}





    // if data is in memory and fresh, return it
  //   if ( ratesCache && !_isDataExpired(ratesCache.timestamp ) {
  //     return callback(null, ratesCache);
  //   }
  //   // if data is in memory but expired, fetch new data
  //   // (if data in memory is stale, it's safe to assume data in file is stale)
  //   else if ( ratesCache && _isDataExpired(ratesCache.timestamp) ) {
  //     return _getNewRates(callback);
  //   }
  //   // if no data in memory but data in file, check if it is expired
  //   else if ( !ratesCache && fs.existsSync(cacheFile) ) {
  //     fs.readFile(cacheFile, 'utf8', function(err, data) {
  //       if (err) callback(err);
  //       // if data expired, fetch new data
  //       if ( _isDataExpired(data.timestamp) ) {
  //         return _getNewRates(callback);
  //       }
  //       // if data is fresh, put it in memory and return it
  //       else {
  //         ratesCache = data;
  //         return callback(null, data);
  //       }
  //     });
  //   }
  //   // else no data in memory and no data in file, fetch new data
  //   else {
  //     return _getNewRates(callback);
  //   }
  // }


  /******************
   * PRIVATE METHODS
   ******************/

  /*
   *  Load rates file into memory
   *  TODO: THIS NEEDS TO BE FLESHED OUT!!!!!!
   */
  function _getNewRates(callack) {
    var options = {
      hostname: hostname,
      path: path+id
    };
    http.get(options, function(res) {
      // save rates to file
      res.pipe(fs.createWriteStream(cacheFile));
      // cache rates in memory
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        console.log('updateRatesCache', chunk);
        ratesCache = chunk;
        if (next) next();
      });
    }).on('error', console.error);



  }

  /*
   *  Determines if the data needs to be refreshed
   *  @timestamp {string} UNIX time, needs *1000 to make into miliseconds
   */
  function _isDataExpired(timestamp) {
    var now = new Date();
    timestamp = new Date(timestamp*1000);
    var expiration = new Date( timestamp.setHours(timestamp.getHours()+1) );

    if ( now > expiration ) return true;
    return false;
  }


   /********************
    * DEFINE PUBLIC API
    ********************/

  return {
    convert: convert,
    getConversionRate: getConversionRate
  };
};
