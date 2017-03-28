/**
 * Created by Daniel on 3/28/2017.
 */
var UserSchema = require('../models/User');

exports.accountWalkThroughFinished = function (req, res, next) {
    UserSchema.User.findById(req.user.id, function(err, user) {
        user.isNewUser = false;
        user.save(function (err) {
            res.send({ user: user });
        });
    });
};