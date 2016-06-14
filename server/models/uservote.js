var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserVoteSchema = new Schema({
  user: { type: Object,  unique: true},
});

var UserVote = mongoose.model('UserVote', UserVoteSchema);

module.exports = UserVote;
