var mongoose = require('mongoose');

var UploadSchema = mongoose.Schema({
  comment: String,
  created: Date,
  file: Object
});

module.exports = mongoose.model('Upload', UploadSchema);
