
var http = require('http');
var fs = require('fs');

/*
 *  Configure the exchange module
 *  @config {object}
 *  @config.hostname {string} domain to 3rd party rates API
 *  @config.path {string} path for 3rd party rates API
 *  @config.apiID {string} path to 3rd party rates API
 *  @config.fileStore {string} path and filename of where to cache rates
 *  @config.useFileStoreOnly {bool} if true, won't make 3rd party API requests
 */
module.exports = function(config) {

  'strict mode';

  config          = config || {};
  var hostname    = config.hostname || 'openexchangerates.org';
  var path        = config.path || '/api/latest.json?app_id=';
  var id          = config.apiID || '3e2ebdb2317b453fa6a3bb88d3bd59c1';
  var cacheFile   = config.fileStore || './data/ratesCache.txt';
  var useFileOnly = config.useFileStoreOnly || false;

  var ratesCache = null;
  var symbolsFile = './data/symbols_utf8.json';


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
   *
   *  Stack: getConversinoRate -> _getCurrencyInfo -> _getData -> [return from memory OR _readCacheFile OR _getNewRates]
   *        IF _readCacheFile -> return from file
   *        IF _getNewRates -> _formatResponse -> _writeCacheFile -> return after file write completed
   */
  function getConversionRate(fromCountry, toCountry, callback) {
    _getCurrencyInfo(fromCountry, function fromCountry(err, data) {
      if (err) return callback(err);
      var fromRate = data.rate;
      console.log('getConversionRate | fromRate:', fromRate);
      _getCurrencyInfo(toCountry, function toCountry(err, data) {
        if (err) return callack(err);
        var toRate = data.rate;
        console.log('getConversionRate | toRate:', toRate);
        var conversionRate = Math.round(toRate / fromRate * 1000000) / 1000000;
        console.log('getConversionRate | conversionRate:', conversionRate);
        callback(null, conversionRate);
      });
    });
  }

  /*
   *  Returns only the portion of data needed
   *  @countryCode {string} 3 letter country code
   */
  function _getCurrencyInfo(countryCode, callback) {
    _getData(function currencyInfo(err, data) {
      if (err) return callback(err);
      console.log('_getCurrencyInfo | data["'+countryCode+'"]:', data.rates[countryCode]);
      callback(null, data.rates[countryCode]);
    });
  }

  /*
   *  Returns the full rates object, ensuring up-to-date data
   *  This method tries to performantly return the latest data
   *  based on the fact that the API only updates every hour.
   *  Also, for performance, this method first looks to the memory cache,
   *  then the local file cache, and finally makes the http, API request.
   */
  function _getData(callback) {
    console.log('_getData | ratesCache: ', (ratesCache)? 'cache is primed' : ratesCache);
    console.log('_getData | useFileOnly', useFileOnly);
    // if data is in memory (JSON) and not expired or configured to use file only: return it
    if ( ratesCache && (!_isDataExpired(ratesCache.timestamp) || useFileOnly) ) {
      console.log('_getData | path 1');
      callback(null, ratesCache);
    }
    // if no data in memory and configured to only use file: fetch data from file into memory
    else if ( !ratesCache && useFileOnly ) {
      console.log('_getData | path 2');
      _readCacheFile(cacheFile, function cacheFile1(err, data) {
        if (err) return callback(err);
        ratesCache = data;
        console.log('_getData | cacheFile1 | data:', data);
        callback(null, data);
      });
    }
    // if data is in memory but expired: fetch new data [and process to file and into memory]
    // (if data in memory is stale, it's safe to assume data in file is stale)
    else if ( ratesCache && !useFileOnly && _isDataExpired(ratesCache.timestamp) ) {
      console.log('_getData | path 3');
      _getNewRates(callback);
    }
    // if no data in memory and config allows http request and file exists: check if it is expired
    else if ( !ratesCache && !useFileOnly && fs.existsSync(cacheFile) ) {
      console.log('_getData | path 4');
      _readCacheFile(cacheFile, function cacheFile2(err, data) {
        if (err) return callback(err);
        // if data expired, fetch new data [and process to file and into memory]
        if ( _isDataExpired(data.timestamp) ) {
          _getNewRates(callback);
        }
        // if data is fresh, put it in memory and return it
        else {
          ratesCache = data;
          callback(null, data);
        }
      });
    }
    // else no data in memory and no data in file, fetch new data [and process to file and into memory]
    else if (!useFileOnly) {
      console.log('_getData | path 5');
      _getNewRates(callback);
    }
  }

  /*
   *  Read text file, parse into JSON
   */
  function _readCacheFile(file, callback) {
    var currencyRegex = /([A-Z]{3})=(.+)\s([0-9.]+)/gm;
    var timestampRegex = /timestamp=\s(\d+)/;
    var ary = [];
    var obj = {};
    obj.rates = {};
    var timestamp;
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) return callback(err);
      while ((ary = currencyRegex.exec(data)) !== null)
      {
        obj.rates[ary[1]] = {
          symbol: ary[2],
          rate: parseFloat(ary[3])
        };
      }
      timestamp = timestampRegex.exec(data);
      obj['timestamp'] = parseInt(timestamp[1], 10);
      console.log('_readCacheFile:', obj);
      callback(null, obj);
    });
  }

  /*
   *  Refomats data to file format and saves to disk
   */
  function _writeCacheFile(file, data, callback) {
    var rateTemplate = '{{country}}={{symbol}} {{rate}}';
    var timestampTemplate = 'timestamp= {{time}}';
    var timestamp = data.timestamp;
    var ratesObj = data.rates;
    var symbol;
    var rate;
    var text = timestampTemplate.replace('{{time}}', timestamp);

    for (var currency in ratesObj) {
      symbol = ratesObj[currency].symbol;
      rate = ratesObj[currency].rate;
      text += '\n'+rateTemplate
                .replace('{{country}}', currency)
                .replace('{{symbol}}', symbol)
                .replace('{{rate}}', rate);
    }
    console.log('_writeCacheFile | text:', text);
    fs.writeFile(file, text, function(err) {
      if (err) return callback(err);
      console.log('_writeCacheFile | file written');
      callback(null, text);
    });

  }


  /******************
   * PRIVATE METHODS
   ******************/

  /*
   *  Load rates file into memory
   *  - grab data from api
   *  - reformat it
   *  - save to cache
   *  - save to file
   *  - return formatted data
   */
  function _getNewRates(callback) {
    console.log('_getNewRates CALLED');
    var options = {
      hostname: hostname,
      path: path+id
    };
    var response = '';
    http.get(options, function(res) {
      res.setEncoding('utf8');
      res.on('error', callback);
      res.on('data', function httData(chunk) {
        console.log('_getNewRates | on.data | chunk received');
        response += chunk;
      });
      res.on('end', function httpEnd() {
        console.log('_getNewRates | on.end | response:', response);
        _formatResponse(JSON.parse(response), function formattedResponse(err, data) {
          if (err) return callback(err);
          //cache data in memory
          ratesCache = data;
          //write data to file in special format
          _writeCacheFile(cacheFile, data, function writeCacheFile(err) {
            if (err) return callback(err);
            callback(data);
          });
        });
      });
    });
  }

  /*
   *  Returns data formatted as { USD: {symbol:$, rate:1.0} }
   *  @param data {obj} data object from API request
   */
  function _formatResponse (data, callback) {
    var obj = {};
    obj.rates = {};
    obj.timestamp = data.timestamp;
    //read symbols JSON
    fs.readFile(symbolsFile, 'utf8', function(err, symbols) {
      if (err) return callback(err);
      symbols = JSON.parse(symbols);
      //reformat rates and merge with symbols
      for (var currency in data.rates) {
        obj.rates[currency] = {};
        obj.rates[currency].rate = data.rates[currency];
        obj.rates[currency].symbol = symbols[currency] || '$';
      }
      console.log('_formatResponse | returned object:', obj);
      callback(null, obj);
    });

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
