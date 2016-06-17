var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Upload = require('../models/upload');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in');
    res.send(req.user);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // res.sendFile(path.join(__dirname, '../public/views/index.html'));
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

router.get('/all', function (req, res) {

  Upload.find({}, function (err, data) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.send(data);
  });
});

router.get('/:id', function (req, res) {
  var id = req.params.id;
  Upload.find({'user._id' : id}, function (err, data) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.send(data);
  });
});

router.delete('/:id', function (req, res) {
  Upload.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(204);
  });
});

router.put('/ids/:id', function (req, res) {
  var id = req.params.id;
  var plantID = req.body.id;
console.log('req.body', req.body);
  Upload.findById(id, function (err, upload) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    upload.plantID.forEach(function(item, index) {
      if (item._id == plantID) {
        upload.plantID.splice(index,1);
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

router.put('/approveds/:id', function (req, res) {
  var id = req.params.id;
  var plantID = req.body.id;
console.log('req.body', req.body);
  Upload.findById(id, function (err, upload) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    upload.approved.forEach(function(item, index) {
      if (item._id == plantID) {
        upload.approved.splice(index,1);
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

module.exports = router;
