var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserVoteSchema = require('./uservote').schema;

var PlantIDSchema = new Schema({
  name: { type: String},
  apiKey: { type: String},
  userVotes: [UserVoteSchema]
});

var PlantID = mongoose.model('PlantID', PlantIDSchema);

module.exports = PlantID;
