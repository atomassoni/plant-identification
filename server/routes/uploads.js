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

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var plantID = req.body; // {object}
console.log('req.body', req.body);
  Upload.findById(id, function (err, upload) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    upload.plantID.push(plantID);

    upload.save(function (err) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(204);
    });
  });
});

module.exports = router;
