'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};
exports.addCompetences = function(req, res){
  User.findById(req.body.id, function (err, user) {
    user.competences = req.body.competences;
    user.save(function(err){
    if (err) return validationError(res, err);
      res.send(200);
    });   
  });

}

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

exports.deactivateCoursier = function(req,res){
  var coursier = req.body.coursier
  User.findById(coursier._id, function (err, user) {
      user.departOn = coursier.departOn;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });

  });
}
/**
  Update users availbitilities
*/
exports.saveDispos = function(req, res){
  var disposnibilites = req.body.dispos
  var monthYear = req.body.monthYear
  //for every month, check if there is anything
  
    //and update each month of the user.dispos
    var set = { $set: {} };
    set.$set['dispos.' + monthYear] = disposnibilites;
    
    User.update({ _id:  req.body.id }, set , function(error){
         if (error) return res.send(500, err);
         return res.send(204)
     }); 

}

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
