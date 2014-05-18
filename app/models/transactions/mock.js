module.exports = (function() {

  return {
    totalDonationDollars: function(callback) {
      process.nextTick(function() {
        callback(null, [ { totalDonationDollars: 1988537 } ]);
      });
    },
    totalDonationCount: function(callback) {
      process.nextTick(function() {
        callback(null, [ { totalDonationCount: 2034 } ]);
      });
    },
    donationCountBySource: function(callback) {
      process.nextTick(function() {
        callback(null, [
          { source: 'EML', donationCount: 243 },
          { source: 'SMS', donationCount: 97 },
          { source: 'WEB', donationCount: 1733 }
        ]);
      });
    },
    uniqueDonors: function(callback) {
      process.nextTick(function() {
        callback(null, [ { totalDonors: 1752 } ]);
      });
    },
    uniqueRegisteredDonors: function(callback) {
      process.nextTick(function() {
        callback(null, [ { totalRegisteredDonors: 263 } ]);
      });
    },
    impressionCountBySource: function(callback) {
      process.nextTick(function() {
        callback(null, [
          { source: 'EML', impressions: 1706670 },
          { source: 'WEB', impressions: 39442 }
        ]);
      });
    }

  };
})();
