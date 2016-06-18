var express = require('express');
var router = express.Router();
var request = require('request');
var GBIFBaseURL = 'http://api.gbif.org/v1';
var query = '/species/search?';

router.get('/species', function (req, res) {
  var query1 = GBIFBaseURL+query;
  query1 += 'highertaxonKey=' + req.query.taxonkey;
  query1 += '&q=' + req.query.q;
  query1 += '&rank=' + req.query.rank;
  query1 += '&limit=' + req.query.limit;
  query1 += '&language=' + req.query.language;
console.log(query1);

 request(query1, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  res.send(body);

  }
})

});

router.get('/image', function (req, res) {
  var iQuery = GBIFBaseURL;
  iQuery += '/species/' + req.query.key;
  iQuery += '/media';
console.log(iQuery);
 request(iQuery, function (error, response, body) {
  if (!error && response.statusCode == 200) {
//console.log(body);
  res.send(body);
  }
})

});



module.exports = router;
