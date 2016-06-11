var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlantIDSchema = new Schema({
  name: { type: String},
  apiKey: { type: String},
});

var PlantID = mongoose.model('PlantID', PlantIDSchema);

module.exports = PlantID;
