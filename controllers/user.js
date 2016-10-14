var db = require('../modules');
var async = require('async');
var gravatar = require('gravatar');

exports.findById = function (userId, callback) {
    db.Users.findOne({
        _id: userId
    }, callback)
};
exports.findByEmailOrCreate = function (email, callback) {
    db.Users.findOne({
        email:email
    },function (err,user) {
        if(user){
            return callback(null,user)
        }
        if(err){
            return callback(err)
        }
        var user = new db.Users;
        user.email = email;
        user.name = email.split('@')[0];
        user.avatarUrl = gravatar.url(email);
        user.save(callback)
    })
};