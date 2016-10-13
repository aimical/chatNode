var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
    email:String,
    name:String,
    avatarUrl:String
});
module.exports = Users;