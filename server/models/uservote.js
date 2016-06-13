var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserVoteSchema = new Schema({
  user: { type: String,  unique: true},
  level: { type: String }
});

var UserVote = mongoose.model('UserVote', UserVoteSchema);

module.exports = UserVote;
