
$(function () {
	'use strict';

	//
	// logging and testing on/off
	//
	var logging = false;
	var testing = true;

	//
	// Main elements
	//
	var $root = $('#container');
	var $currencyDisplay = $('.js-currency', $root);
	var $currencyMenu = $('.js-currency-menu', $root);
	var $transactionRows = $('tr[data-row]', $root);


	//
	// Global state
	//
	var currentCurrency = $currencyDisplay.text();
	var currentCurrencyCode = getCurrencyCode(currentCurrency);
	var currentCurrencySymbol = getCurrencySymbol(currentCurrency);
	var previousCurrencyCode = 'n/a';

	log('initialized | currentCurrency:', currentCurrency,
													 ',currenyCurrencyCode:', currentCurrencyCode,
													 ',currentCurrencySymbol', currentCurrencySymbol,
													 ',previousCurrencyCode', previousCurrencyCode
	);


	//
	// Events
	//
	$root.on('click', '.js-currency-select', selectCurrency);


	//
	// Event handlers
	//
	function selectCurrency(e) {
		// get new currency code
		var currency = $(e.currentTarget).text();

		// bail if nothing to update
		if (currency === currentCurrency) return;

		// display new currency code
		$currencyDisplay.text(currency);

		// save new currency info
		updateCurrentCurrency(currency);

		// 1) get current amounts from DOM
		// 2) get conversion rate
		// 3) convert amounts
		// 4) update DOM
		var amounts = gatherAmounts($transactionRows); // 1
		getConversionRate(previousCurrencyCode, currentCurrencyCode, function(data) { // 2

			if (data && data.conversionRate) {
				var newAmounts = convertAmounts(amounts, data.conversionRate); // 3
				updateTransactionAmounts(newAmounts, $transactionRows, currentCurrencySymbol); // 4
			}
			else {
				alert('Unable to get conversion rates at this time.');
			}

		});
	}


	//
	// Main functions called by event handler
	//

	// takes '$ USD', and update global variables
	function updateCurrentCurrency(currencyString) {
		currentCurrency = currencyString;
		previousCurrencyCode = currentCurrencyCode;
		currentCurrencyCode = getCurrencyCode(currencyString);
		currentCurrencySymbol = getCurrencySymbol(currencyString);
		log('updateCurrentCurrency | currentCurrancy:', currentCurrency,
																			 ',currentCurrencyCode:', currentCurrencyCode,
																			 ',currentCurrencySymbol:', currentCurrencySymbol,
																			 ',previousCurrencyCode', previousCurrencyCode
		);
		return {
			currentCurrency:currentCurrency,
			previousCurrencyCode:previousCurrencyCode,
			currentCurrencyCode:currentCurrencyCode,
			currentCurrencySymbol:currentCurrencySymbol
		};
	}

	// build array of transaction amounts from DOM
	function gatherAmounts($rows) {
		var amounts = [];
		var transaction = {};
		var index;
		var amount;
		var $this;

		$rows.each(function(i){
			$this = $(this);
			index = $this.data('row');
			amount = getAmount($('.amount', $this).text());
			amounts.push(transaction[index] = amount);
		});
		log('gatherAmounts | amounts:', amounts);
		return amounts;
	}

	// fetch conversion rate from API based on to/from country codes
	function getConversionRate(from, to, callback) {
		$.get('/paypal/conversionRate?from='+from+'&to='+to, callback)
			.fail(function(){ alert('getConversionRate request failed.'); });
	}

	// takes array of amounts, converts them based on rates, returns array of new amounts
	function convertAmounts(amountsAry, rate) {
		var newAmounts = amountsAry.map(function(amount) {
			return moneyFormat(parseInt(Math.round(amount * rate * 100)) / 100);
		});
		log('convertAmounts | newAmounts:', newAmounts);
		return newAmounts;
	}

	// takes array of amounts, updates DOM
	function updateTransactionAmounts(amounts, $rows, symbol) {
		var $this;
		var $amountCell;
		$rows.each(function(i) {
			$this = $(this);
			$amountCell = $('.amount', $this);
			$amountCell.text(symbol+' '+amounts[i]);
		});
	}


	//
	// utilites
	//

	// ensure a number ends in '.00'
	function moneyFormat(num) {
		var correct = /\.\d\d/;
		if (correct.test(num)) return String(num);

		var tenth = /\.\d$/;
		if (tenth.test(num)) return String(num)+'0';

		var whole = /\d$/;
		if (whole.test(num)) return String(num)+'.00';
	}

	// takes '$ USD', returns 'USD'
	function getCurrencyCode(currencyString) {
		return currencyString.slice(-3);
	}

	// takes '$ USD', returns '$'
	function getCurrencySymbol(currencyString) {
		return currencyString.slice(0, 1);
	}

	// takes '$ 134.00', returns 134.00
	function getAmount(amount) {
		return parseFloat(amount.slice(2));
	}

	// switchable logging
	function log() {
		if (!logging) return;
		var args = Array.prototype.slice.call(arguments, 0);
		console.log.apply(console, args);
	}


	//
	// shim for testing (only for demo)
	//
	if (testing) {
		window._exportConvertTransactions = {
			methods: {
				getAmount: getAmount,
				getCurrencySymbol: getCurrencySymbol,
				getCurrencyCode: getCurrencyCode,
				moneyFormat: moneyFormat,
				updateTransactionAmounts : updateTransactionAmounts,
				convertAmounts: convertAmounts,
				getConversionRate: getConversionRate,
				gatherAmounts: gatherAmounts,
				updateCurrentCurrency: updateCurrentCurrency,
				selectCurrency: selectCurrency
			},
			globals: {
				currentCurrency: currentCurrency,
				currentCurrencyCode: currentCurrencyCode,
				currentCurrencySymbol: currentCurrencySymbol,
				previousCurrencyCode: previousCurrencyCode
			},
			elements: {
				$root: $root,
				$currencyDisplay: $currencyDisplay,
				$currencyMenu: $currencyMenu,
				$transactionRows: $transactionRows
			}
		};
		$(document).trigger('exportReady');
	}

});
