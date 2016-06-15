var mongoose = require('mongoose');
var PlantIDSchema = require('./plantid').schema;
var UserVoteSchema = require('./uservote').schema;
var ApprovedSchema = require('./approved').schema;

var UploadSchema = mongoose.Schema({
  comment: String,
  created: Date,
  file: Object,
  user: Object,
  plantID: [PlantIDSchema],
  approved: [ApprovedSchema]
});

module.exports = mongoose.model('Upload', UploadSchema);
