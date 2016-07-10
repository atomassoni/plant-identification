var express = require('express');
var router = express.Router();
var fs = require('fs');
var Upload = require('../models/upload');
var multer = require('multer');
var folder = 'plants/' //aws public folder name , need trailing '/'

// //local file saving for uploads
//
// var upload = multer({dest: 'server/public/uploads'});
//
// router.post('/', upload.single('file'), function (req, res, next) {
//
//   console.log(req.file);
//   var newUpload = {
//     comment: req.body.comment,
//     created: Date.now(),
//     user: req.body.user,
//     file: req.file
//   };
//   Upload.create(newUpload, function (err, next) {
//     if (err) {
//       //next(err);
//       console.log("Errors");
//     } else {
//       res.send(newUpload);
//     }
//   });
// });

//s3 uploads
var multerS3 = require('multer-s3');

var aws = require('aws-sdk');

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'primedigitalplantid',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, folder + Date.now().toString())
    }
  })

});


router.post('/', upload.single('file'), function(req, res) {


  var newUpload = {
    comment: req.body.comment,
    created: Date.now(),
    user: req.body.user,
    file: req.file
  };
  Upload.create(newUpload, function (err) {
    if (err) {
      //next(err);
      console.log("Errors");
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

router.put('/select/:id', function (req, res) {
  var id = req.params.id;
  var userVote = req.body; // {object}
console.log('req.body', req.body);
  Upload.findById(id, function (err, upload) {
    if (err) {
      res.sendStatus(500);
      return;
    }


    upload.plantID.forEach(function(item, index) {
        var removed = false;
        item.userVotes.forEach(function (pItem, pIndex) {
          //removes the previous votes so the user has only one guess per upload item
          if(pItem.user._id==userVote.user._id){
            removed = item._id;
            upload.plantID[index].userVotes.splice(pIndex,1);
          }
        })
  console.log('removed', removed);
  console.log('userVotes.index', userVote.idIndex);
      if(item._id == userVote.idIndex && removed != userVote.idIndex) {
        upload.plantID[index].userVotes.push(userVote);
      }
    });

    upload.save(function (err) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(204);
    });
  });
});

router.put('/approved/:id', function (req, res) {
  var id = req.params.id;
  var approvedID = req.body; // {object}
console.log('req.body', req.body);
  Upload.findById(id, function (err, upload) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    upload.approved.push(approvedID);

    upload.save(function (err) {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(204);
    });
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
