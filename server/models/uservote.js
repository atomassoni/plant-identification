var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserVoteSchema = new Schema({
  user:  Object
});

var UserVote = mongoose.model('UserVote', UserVoteSchema);

module.exports = UserVote;
