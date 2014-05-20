node-exchange
=============

Currency converter API and transaction dashboard for Node.js

### Setup & Install
- `git clone https://github.com/brentwalter/exchange.git` or download zip
- `npm install`
- To run tests you'll need `npm install -g nodeunit`
    - Run test from project root with `npm test`

### Exchange Module
- Located `/exchange-module/index.js`
- nodeunit tests: `/exchange-module/test/exchange-spec-fileCacheOnly.js`
- Run tests from project root with: `npm test`
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


### Things Left To Do:
- Exchange Module
    - Better caching of data than static file store. Redis would be a good candidate. It would also enable sharing accross multiple instances.
    - I'd use JSON, not the current data format for the static file store, because it currently incurs a lot of read/write churn
    - Create http and fs mocks to enable more complete unit testing
    - Implement or more robust logger like Winston
    - Enable support for https
    - Remove my openexchangerates.org API key
    - Make the path parameter for accessing openexchangerate.org more flexible to support their entire API
    - Make all file system paths use path utilites rather than being UNIX, hard coded
    - Publish to NPM
- Server App
    - Improve input validation and error responses
    - Use better logger, like Winston
    - Replace my mock model with a DB-backed model
    - Write Tests for the transactions model
- Client App
    - Not use Bootstrap with hacky, brittle overrides for CSS. Implement SCSS.
    - Inject the transactions model into the client so I don't have to parse the DOM to get the amounts before doing currency conversion
    - Share template partial to make rendering client/serverside identical
    - Source options for the dropdown dynamically from server data
    - If filtering, sorting, interacting, adding, deleting, etc. is required, convert into Require.js/Backbone app
    - Mock $.get() to have more complete unit tests
    - Add Grunt for better asset optimization and developer conveniece (SCSS, uglify, watch, etc.)
    

