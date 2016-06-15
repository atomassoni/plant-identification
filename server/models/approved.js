var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApprovedSchema = new Schema({

    name: { type: String },
    apiKey: { type: String}

});

var Approved = mongoose.model('Approved', ApprovedSchema);

module.exports = Approved;
