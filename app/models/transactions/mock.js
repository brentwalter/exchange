module.exports = (function() {

  var mockData = [
    {id: 10, date: '01/15/2014', type: 'purchase', description: 'Bass Pro Shop', amount: '19.97', currency: 'USD'},
    {id: 9, date: '01/10/2014', type: 'purchase', description: 'Macys', amount: '99.99', currency: 'USD'},
    {id: 8, date: '01/02/2014', type: 'purchase', description: 'Home Depot', amount: '150.15', currency: 'USD'},
    {id: 7, date: '12/31/2013', type: 'transfer', description: 'Wells Fargo', amount: '350.00', currency: 'USD'},
    {id: 6, date: '12/15/2013', type: 'purchase', description: 'Jamba Juice', amount: '2.30', currency: 'USD'},
    {id: 5, date: '11/01/2012', type: 'refund', description: 'DSW Shoes', amount: '75.45', currency: 'USD'},
    {id: 4, date: '10/20/2013', type: 'purchase', description: 'DSW Shoes', amount: '75.45', currency: 'USD'},
    {id: 3, date: '10/05/2013', type: 'purchase', description: 'Jamba Juice', amount: '3.00', currency: 'USD'},
    {id: 2, date: '10/02/2013', type: 'transfer', description: 'Wells Fargo', amount: '275.00', currency: 'USD'},
    {id: 1, date: '09/20/2013', type: 'purchase', description: 'Best Buy', amount: '119.99', currency: 'USD'}
  ];

  return {
    getTransactions: function(callback) {
      process.nextTick(function() {
        callback(null, mockData);
      });
    },
    getTransactionByID: function(id, callback) {
      process.nextTick(function() {
        callback(null, mockData.filter(function(transaction) {
          return transaction.id === id;
        }));
      });
    }
  };
})();
