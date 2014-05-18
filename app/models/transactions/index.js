
//get reference to database connection
var db = require('../../../config/database');

module.exports = (function() {

  return {
    totalDonationDollars: function(callback) {
      db.query('SELECT SUM(amount)/100 AS totalDonationDollars FROM donations', function(err, rows, fields) {
        if (err) return callback(err);
        callback(null, rows);
      });
    },
    totalDonationCount: function(callback) {
      db.query('SELECT COUNT(*) AS totalDonationCount FROM donations', function(err, rows, fields) {
        if (err) return callback(err);
        callback(null, rows);
      });
    },
    donationCountBySource: function(callback) {
        db.query('SELECT source, COUNT(*) AS donationCount FROM donations GROUP BY source', function(err, rows, fields) {
          if (err) return callback(err);
          callback(null, rows);
        });
    },
    uniqueDonors: function(callback) {
      db.query('SELECT COUNT(DISTINCT donor_email) AS totalDonors FROM donations', function(err, rows, fields) {
        if (err) return callback(err);
        callback(null, rows);
      });
    },
    uniqueRegisteredDonors: function(callback) {
      db.query('SELECT COUNT(DISTINCT donor_email) AS totalRegisteredDonors FROM donations JOIN ion_users ON ion_users.username = donations.donor_email WHERE ion_users.active = 1;', function(err, rows, fields) {
        if (err) return callback(err);
        callback(null, rows);
      });
    },
    impressionCountBySource: function(callback) {
      db.query('SELECT source AS source, COUNT(*) AS impressions FROM gl_counter GROUP BY source', function(err, rows, fields) {
        if (err) return callback(err);
        callback(null, rows);
      });
    }
  };
})();
