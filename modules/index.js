var mongoose = require('mongoose');
var Users = require('./user');
mongoose.connect('mongodb://localhost/chatNode');
exports.Users = mongoose.model('Users',Users);