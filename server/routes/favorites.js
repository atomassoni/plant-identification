var express = require('express');
var router = express.Router();
var Pet = require('../models/pet');
//posts a new favorite pet
router.post('/', function (req, res) {
  var pet = new Pet(req.body);
  pet.save(function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.sendStatus(201);
  });
});
//gets all the favorited pets
router.get('/', function (req, res) {
  Pet.find({}, function (err, pets) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.send(pets);
  });
});

router.delete('/:id', function (req, res) {
  Pet.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.sendStatus(204);
  });
});

module.exports = router;
