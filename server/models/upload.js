var mongoose = require('mongoose');
var PlantIDSchema = require('./plantid').schema;

var UploadSchema = mongoose.Schema({
  comment: String,
  created: Date,
  file: Object,
  plantID: [PlantIDSchema]
});

module.exports = mongoose.model('Upload', UploadSchema);
