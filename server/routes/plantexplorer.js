var express = require('express');
var router = express.Router();
var request = require('request');
var GBIFBaseURL = 'http://api.gbif.org/v1';
var query = '/species/search?highertaxonKey=6&language=ENG';

router.get('/species', function (req, res) {
  query = GBIFBaseURL+query;
  query += '&q=' + req.query.q;
  query += '&rank=' + req.query.rank;
  query += '&limit=' + req.query.limit;


 request(query, function (error, response, body) {
  if (!error && response.statusCode == 200) {

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
