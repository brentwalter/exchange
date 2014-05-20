

;(function($){

  'strict mode';

  module('conversion dropdown');

  //
  // Mocks
  //
  var mockDOM =  '<div id="container">'+
                '<div class="btn-group">'+
                  '<button type="button" data-toggle="dropdown" class="btn btn-primary dropdown-toggle">'+
                    '<span class="js-currency">$ USD</span> <span class="caret"></span>'+
                  '</button>'+
                  '<ul role="menu" class="dropdown-menu  js-currency-menu">'+
                    '<li><a href="#" class="js-currency-select">$ USD</a></li>'+
                    '<li><a href="#" class="js-currency-select">$ CAD</a></li>'+
                    '<li><a href="#" class="js-currency-select">€ EUR</a></li>'+
                    '<li><a href="#" class="js-currency-select">元 CNY</a></li>'+
                    '<li><a href="#" class="js-currency-select">₹ INR</a></li>'+
                  '</ul>'+
                '</div>'+
                '<table class="table table-striped table-hover">'+
                  '<tbody>'+
                    '<tr data-row="0"><td>01/15/2014</td><td>Purchase: Bass Pro Shop</td><td class="amount">$ 19.97</td></tr>'+
                    '<tr data-row="1"><td>01/10/2014</td><td>Purchase: Macys</td><td class="amount">$ 99.99</td></tr>'+
                    '<tr data-row="2"><td>01/02/2014</td><td>Purchase: Home Depot</td><td class="amount">$ 150.15</td></tr>'+
                    '<tr data-row="3"><td>12/31/2013</td><td>Transfer: Wells Fargo</td><td class="amount">$ 350.00</td></tr>'+
                    '<tr data-row="4"><td>12/15/2013</td><td>Purchase: Jamba Juice</td><td class="amount">$ 2.30</td></tr>'+
                    '<tr data-row="5"><td>11/01/2012</td><td>Refund: DSW Shoes</td><td class="amount">$ 75.45</td></tr>'+
                    '<tr data-row="6"><td>10/20/2013</td><td>Purchase: DSW Shoes</td><td class="amount">$ 75.45</td></tr>'+
                  '</tbody>'+
                '</table>'+
              '</div>';

  var mockConversionRate = 1.5;
  var mockCurrency = '$ USD';
  var mockAmount = '$ 123.45';
  var mockAmounts = ['1.00', '2.00', '3.00', '4.00', '5.00', '6.00', '7.00'];
  function mockGet(path, callback) {
    callback(mockConversionRate);
  }



  $(document).on('exportReady', function(){

    //
    // Mock globals
    //
    function mockPopulateElements() {
      e.$root = $('#container');
      e.$currencyDisplay = $('.js-currency', e.$root);
      e.$currencyMenu = $('.js-currency-menu', e.$root);
      e.$transactionRows = $('tr[data-row]', e.$root);
    }
    function mockPopulateGlobals() {
      g.currentCurrency = e.$currencyDisplay.text();
      g.currentCurrencyCode = m.getCurrencyCode(g.currentCurrency);
      g.currentCurrencySymbol = m.getCurrencySymbol(g.currentCurrency);
      g.previousCurrencyCode = 'n/a';
    }
    function mockElementsGlobals() {
      mockPopulateElements();
      mockPopulateGlobals();
    }
    // make convenient to use private props of module
    var m = window._exportConvertTransactions.methods;
    var g = window._exportConvertTransactions.globals;
    var e = window._exportConvertTransactions.elements;


    //
    // Run the tests
    //
    test( "getAmount should return just a number", function() {
      ok( m.getAmount(mockAmount) === 123.45, "returns just the number" );
    });

    test( "getCurrencySymbol should return just a symbol", function() {
      ok( m.getCurrencySymbol(mockCurrency) === '$', "returns just the symbol" );
    });

    test( "getCurrencyCode should return just a country code", function() {
      ok( m.getCurrencyCode(mockCurrency) === 'USD', "returns just the country code" );
    });

    test( "moneyFormat should ensure all numbers have .00", function() {
      ok( m.moneyFormat(123) === '123.00', "whole number gets .00" );
      ok( m.moneyFormat(123.0) === '123.00', "tenth number gets .00" );
      ok( m.moneyFormat(123.00) === '123.00', "corrct number is untouched" );
    });

    test( "updateTransactionAmounts should update the DOM with new amounts", function() {
      $(mockDOM).appendTo('#qunit-fixture');
      mockElementsGlobals();

      m.updateTransactionAmounts(mockAmounts, e.$transactionRows, g.currentCurrencySymbol);

      ok( e.$transactionRows.eq(0).children('.amount').text() === '$ 1.00', "updates first row amount." );
      ok( e.$transactionRows.eq(1).children('.amount').text() === '$ 2.00', "updates second row amount." );
      ok( e.$transactionRows.eq(2).children('.amount').text() === '$ 3.00', "updates third row amount." );
      ok( e.$transactionRows.eq(3).children('.amount').text() === '$ 4.00', "updates fourth row amount." );
      ok( e.$transactionRows.eq(4).children('.amount').text() === '$ 5.00', "updates fifth row amount." );
      ok( e.$transactionRows.eq(5).children('.amount').text() === '$ 6.00', "updates sixth row amount." );
      ok( e.$transactionRows.eq(6).children('.amount').text() === '$ 7.00', "updates seventh row amount." );
    });

    test( "convertAmounts should maps amounts based on conversion rate", function() {
      var matchArray = ["1.50", "3.00", "4.50", "6.00", "7.50", "9.00", "10.50"];
      deepEqual( m.convertAmounts(mockAmounts, mockConversionRate), matchArray, "returns correctly mapped array" );
    });

    test( "gatherAmounts should pull amounts from DOM and return an array", function() {
      $(mockDOM).appendTo('#qunit-fixture');
      mockElementsGlobals();
      var matchArray = [19.97, 99.99, 150.15, 350, 2.3, 75.45, 75.45];
      deepEqual( m.gatherAmounts(e.$transactionRows), matchArray, "returns correct amounts" );
    });

    test( "updateCurrentCurrency should update global state with current currency info", function() {
      var matchObj = {currentCurrency: "$ USD", previousCurrencyCode: "", currentCurrencyCode: "USD", currentCurrencySymbol: "$"};
      deepEqual( m.updateCurrentCurrency(mockCurrency), matchObj, "returns correctly mapped array" );
    });

  });
})(jQuery);
