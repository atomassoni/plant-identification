var express = require('express');
var router = express.Router();
var fs = require('fs');
var Upload = require('../models/upload');
var multer = require('multer');
var upload = multer({dest: 'server/public/uploads'});
/**
 * Create's the file in the database
 */
router.post('/', upload.single('file'), function (req, res, next) {
  console.log('req.body', req.body.comment);
  console.log(req.file);
  var newUpload = {
    comment: req.body.comment,
    created: Date.now(),
    file: req.file
  };
  Upload.create(newUpload, function (err, next) {
    if (err) {
      next(err);
    } else {
      res.send(newUpload);
    }
  });
});

router.get('/', function (req, res) {
  Upload.find({}, function (err, data) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.send(data);
  });
});

module.exports = router;
