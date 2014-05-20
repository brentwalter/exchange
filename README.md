node-exchange
=============

Streaming currency converter for Node.js

### Setup & Install
- `git clone https://github.com/brentwalter/exchange.git` or download zip
- `npm install`
- To run tests you'll need `npm install -g nodeunit`
    - Run test from project root with `npm test`

### Exchange Module
- Located `/exchange-module/index.js`
- nodeunit test: `/exchange-module/test/exchange-spec-fileCacheOnly.js`
- Static file store in `/exchange-module/data/ratesCache.txt`
- Requests fresh rates from https://openexchangerates.org/


### Server App
- Main file is `app.js` and supplementary modules are in `/app/` directory
- Run app with `node app` from within the root of the project 
