var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var DescriptionSchema = require('./description').schema;

var PetSchema = new Schema({
  petId: { type: String, required: true, unique: true},
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  animalType: { type: String, required: true },
});

PetSchema.pre('save', function (next) {
  var shortenedDescription = this.description.substr(0,100);
  this.description = shortenedDescription;
  next();
});

var Pet = mongoose.model('Pet', PetSchema);

module.exports = Pet;
