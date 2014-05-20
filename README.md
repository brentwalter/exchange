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
- Run app with `npm start` from within the root of the project 
- Run tests with `npm test` from within the root of the project
- View dashboard: `http://localhost:3000/paypal/activity`
    - The dashboard has a dropdown to convert all transction amounts to a selected currency using the APIs
- View currencyConversion API: http://localhost:3000/paypal/currencyConversion?{query}
    - {query}: from=USD&to=CAD&amount=1000
- View conversionRate API: http://localhost:3000/paypal/conversionRate?{query}
    - {query}: from=USD&to=CAD


### Client App
- View the dashboard once the Server App is running: `http://localhost:3000/paypal/activity`
- View qUnit tests by visiting: `http://localhost:3000/script/test/index.html`
- Client app is located: `public/script/app.js`
- Client tests are located: `public/script/test/app-spec.js`
