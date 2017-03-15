var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var UserSchema = require('../models/User');

function generateToken(user) {
  var payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};
/**
 * POST /login
 * Sign in with email and password
 */
exports.loginPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  UserSchema.User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
      'Double-check your email address and try again.'
      });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ msg: 'Invalid email or password' });
      }
      res.send({ token: generateToken(user), user: user.toJSON() });
    });
  });
};

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  UserSchema.User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
    }
    user = new UserSchema.User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      primaryColor : '#2196f3',
      mindmapOption: "sprawl",
      isNewUser: true
    });
    user.save(function(err) {
      res.send({ token: generateToken(user), user: user });
    });
  });
};


/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = function(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  UserSchema.User.findById(req.user.id, function(err, user) {
    if ('password' in req.body) {
      user.password = req.body.password;
    } else {
      user.email = req.body.email;
      user.name = req.body.name;
      user.primaryColor = req.body.primaryColor;
      user.mindmapOption = req.body.mindmapOption;
    }
    user.save(function(err) {
      if ('password' in req.body) {
        res.send({ msg: 'Your password has been changed.' });
      } else if (err && err.code === 11000) {
        res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
      } else {
        res.send({ user: user.toJSON(), msg: 'Your profile information has been updated.' });
      }
    });
  });
};

exports.accountWalkThroughFinished = function (req, res, next) {
  UserSchema.User.findById(req.user.id, function(err, user) {
    user.isNewUser = false;
    user.save(function (err) {
      res.send({ user: user });
    });
  });
};

/**
 * DELETE /account
 */
exports.accountDelete = function(req, res, next) {
  UserSchema.User.remove({ _id: req.user.id }, function(err) {
    res.send({ msg: 'Your account has been permanently deleted.' });
  });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = function(req, res, next) {
  UserSchema.User.findById(req.user.id, function(err, user) {
    switch (req.params.provider) {
      case 'facebook':
        user.facebook = undefined;
        break;
      case 'google':
        user.google = undefined;
        break;
      case 'twitter':
        user.twitter = undefined;
        break;
      case 'vk':
        user.vk = undefined;
        break;
      default:
        return res.status(400).send({ msg: 'Invalid OAuth Provider' });
    }
    user.save(function(err) {
      res.send({ msg: 'Your account has been unlinked.' });
    });
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      UserSchema.User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'support@yourdomain.com',
        subject: '✔ Reset your password on Mega Boilerplate',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
        done(err);
      });
    }
  ]);
};

/**
 * POST /reset
 */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  async.waterfall([
    function(done) {
      UserSchema.User.findOne({ passwordResetToken: req.params.token })
          .where('passwordResetExpires').gt(Date.now())
          .exec(function(err, user) {
            if (!user) {
              return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
            }
            user.password = req.body.password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            user.save(function(err) {
              done(err, user);
            });
          });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        from: 'support@yourdomain.com',
        to: user.email,
        subject: 'Your Mega Boilerplate password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        res.send({ msg: 'Your password has been changed successfully.' });
      });
    }
  ]);
};

/**
 * POST /auth/facebook
 * Sign in with Facebook
 */
exports.authFacebook = function(req, res) {
  var profileFields = ['id', 'name', 'email'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + profileFields.join(',');

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (accessToken.error) {
      return res.status(500).send({ msg: accessToken.error.message });
    }

    // Step 2. Retrieve user's profile information.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({ msg: profile.error.message });
      }

      // Step 3a. Link accounts if user is authenticated.
      if (req.isAuthenticated()) {
        UserSchema.User.findOne({ facebook: profile.id }, function(err, user) {
          if (user) {
            return res.status(409).send({ msg: 'There is already an existing account linked with Facebook that belongs to you.' });
          }
          user = req.user;
          user.name = user.name || profile.name;
          user.picture = user.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.facebook = profile.id;
          user.save(function() {
            res.send({ token: generateToken(user), user: user });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        UserSchema.User.findOne({ facebook: profile.id }, function(err, user) {
          if (user) {
            return res.send({ token: generateToken(user), user: user });
          }
          UserSchema.User.findOne({ email: profile.email }, function(err, user) {
            if (user) {
              return res.status(400).send({ msg: user.email + ' is already associated with another account.' })
            }
            user = new UserSchema.User({
              name: profile.name,
              email: profile.email,
              picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
              facebook: profile.id,
              primaryColor : '#2196f3',
              mindmapOption: "sprawl",
              isNewUser : true
            });
            user.save(function(err) {
              return res.send({ token: generateToken(user), user: user });
            });
          });
        });
      }
    });
  });
};

exports.authFacebookCallback = function(req, res) {
  res.render('loading', { layout: false });
};
/**
 * POST /auth/google
 * Sign in with Google
 */
exports.authGoogle = function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve user's profile information.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({ message: profile.error.message });
      }
      // Step 3a. Link accounts if user is authenticated.
      if (req.isAuthenticated()) {
        UserSchema.User.findOne({ google: profile.sub }, function(err, user) {
          if (user) {
            return res.status(409).send({ msg: 'There is already an existing account linked with Google that belongs to you.' });
          }
          user = req.user;
          user.name = user.name || profile.name;
          user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
          user.google = profile.sub;
          user.save(function() {
            res.send({ token: generateToken(user), user: user });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        UserSchema.User.findOne({ google: profile.sub }, function(err, user) {
          if (user) {
            return res.send({ token: generateToken(user), user: user });
          }
          user = new UserSchema.User({
            name: profile.name,
            email: profile.email,
            picture: profile.picture.replace('sz=50', 'sz=200'),
            google: profile.sub,
            primaryColor : '#2196f3',
            mindmapOption: "sprawl",
            isNewUser: true
          });
          user.save(function(err) {
            res.send({ token: generateToken(user), user: user });
          });
        });
      }
    });
  });
};

exports.authGoogleCallback = function(req, res) {
  res.render('loading', { layout: false });
};

/**
 * POST /addGoals
 */

exports.addTodos = function(req, res) {
  req.assert('todoTitle', 'Goal name cannot be blank').notEmpty();
  req.assert('todoPriority', 'Priority cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      if(!(req.body.todoTitle.match("^[a-zA-Z0-9_ ]*$"))) {
        return res.status(400).send({ msg: 'You cannot save a goal with a unicode character' });
      }
      if(req.body.todoTitle.length < 1) {
        return res.status(400).send({ msg: 'You have not given your goal a title!' });
      }
      console.log("Entering User");
      UserSchema.User.findOne({  email: req.body.email  })
          .exec(function(err, user) {
            var i = 1;
            console.log("Entering Recursion");
            var responseArray = addToDo(i, user.nodes[req.body.indexList[0]], req, null);
            user.nodes[req.body.indexList[0]] = responseArray[0];
            var nodeInformation = responseArray[1];
            console.log("Exited Recursion");
            user.save(function (err) {
              done(err, user);
            });
            res.send({user: user.toJSON(), nodeInformation : nodeInformation});
          });
    }]);
};

function addToDo(i , node, req) {
  if(i < req.body.depth) {
    console.log("Doing Recursion");
    i++;
    console.log(node);
    console.log(req.body.indexList);
    var responseArray = addToDo(i, node.nodes[req.body.indexList[i - 1]], req);
    node.nodes[req.body.indexList[i - 1]] = responseArray[0];
    return [node, responseArray[1]];
  }
  else if(i === req.body.depth) {
    var singleToDo = new UserSchema.ToDo({
      name: req.body.todoTitle,
      priority: req.body.todoPriority,
      completed: false
    });
    console.log(singleToDo);
    singleToDo.save();
    console.log("Finishing the save");
    console.log("NODE");
    console.log(node);

    UserSchema.Node.findOne({ "_id" : node._id})
        .then(function (node) {
          node.todos.push(singleToDo);
          return node;
        }).then( function (node) {
          node.save();
        }
    );

    if(node.todos)
      node.todos.push(singleToDo);
    else
      node.todos = [singleToDo];
    return [node, node];
  }
}

/**
 * DELETE /todo
 */

exports.deleteToDo = function(req, res) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(16, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      UserSchema.User.findOne({email: req.body.email})
          .exec(function (err, user) {
            var i = 1;
            console.log("Entering Recursion");
            var responseArray = recursiveDeleteToDo(i, user.nodes[req.body.indexList[0]], req);
            user.nodes[req.body.indexList[0]] = responseArray[0];
            var nodeInformation = responseArray[1];
            console.log("Exited Recursion");
            user.save(function (err) {
              done(err, user);
            });
            res.send({user: user.toJSON(), nodeInformation: nodeInformation});
          });
    }]);
};

function recursiveDeleteToDo(i, node, req) {
  if(i < req.body.depth) {
    console.log("Doing Recursion");
    i++;
    console.log(node);
    console.log(req.body.indexList);
    var responseArray = recursiveUpdateToDo(i, node.nodes[req.body.indexList[i - 1]], req);
    node.nodes[req.body.indexList[i - 1]] = responseArray[0];
    return [node, responseArray[1]];
  }
  else if(i === req.body.depth) {
    console.log(node);
    UserSchema.ToDo.findOne({ "_id" : req.body.todoID})
        .remove()
        .exec(function (err, node) {
        });
    node.todos.forEach(function(todo, i){
      if(todo._id.equals(req.body.todoID)) {
        node.todos.splice(i, 1);
      }
    });
    console.log("New Nodes________________");
    console.log(node);
    return [node, node];
  }
}

exports.updateToDos = function(req, res) {
  console.log(req.body.todoTitle);
  console.log(req.body.todoPriority);
  req.assert('todoTitle', 'Goal name cannot be blank').notEmpty();
  req.assert('todoPriority', 'Priority cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      if (!(req.body.todoTitle.match("^[a-zA-Z0-9_ ]*$"))) {
        return res.status(400).send({msg: 'You cannot save a goal with a unicode character'});
      }
      if (req.body.todoTitle.length < 1) {
        return res.status(400).send({msg: 'You have not given your goal a title!'});
      }
      UserSchema.User.findOne({  email: req.body.email  })
          .exec(function(err, user) {
            var i = 1;
            console.log("Entering Recursion");
            var responseArray = recursiveUpdateToDo(i, user.nodes[req.body.indexList[0]], req);
            user.nodes[req.body.indexList[0]] = responseArray[0];
            var nodeInformation = responseArray[1];
            console.log("Exited Recursion");
            user.save(function (err) {
              done(err, user);
            });
            res.send({user: user.toJSON(), nodeInformation : nodeInformation});
          });
    }]);
};

function recursiveUpdateToDo(i, node, req) {
  if(i < req.body.depth) {
    console.log("Doing Recursion");
    i++;
    console.log(node);
    console.log(req.body.indexList);
    var responseArray = recursiveUpdateToDo(i, node.nodes[req.body.indexList[i - 1]], req);
    node.nodes[req.body.indexList[i - 1]] = responseArray[0];
    return [node, responseArray[1]];
  }
  else if(i === req.body.depth) {
    console.log(node);
    UserSchema.ToDo.findOne({ "_id" : req.body.todoID})
        .then(function (todo) {
          console.log(todo);
          todo.name = req.body.todoTitle;
          todo.priority = req.body.todoPriority;
          todo.save();
        });
    node.todos.forEach(function(todo){
      if(todo._id.equals(req.body.todoID)) {
        todo.name = req.body.todoTitle;
        todo.priority = req.body.todoPriority;
      }
    });
    return [node, node];
  }
}

exports.addToNode = function(req, res) {
  req.assert('nodeTitle', 'Node title cannot be blank').notEmpty();

  if(!(req.body.nodeTitle.match("^[a-zA-Z0-9_ ]*$"))) {
    return res.status(400).send({ msg: 'You cannot save a node with a unicode character' });
  }
  if(req.body.nodeTitle.length < 1) {
    return res.status(400).send({ msg: 'You have not given your node a title!' });
  }
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      UserSchema.User.findOne({ email: req.body.email})
          .exec(function (err, user) {
            var i = 1;
            var responseArray = addNode(i, user.nodes, req, null);
            user.nodes = responseArray[0];
            var nodeInformation = responseArray[1];
            var indexList = responseArray[2];
            var isLast = responseArray[3];
            var depth = responseArray[4];
            console.log(user.nodes);
            user.save(function(err) {
              if (err) {
                done(err, user);
              }
            });
            res.send({user: user.toJSON(), nodeInformation : nodeInformation, indexList:indexList, last : isLast, depth : depth});
          });
    }]);
};



function addNode(i, nodes, req, parentID) {
  console.log(req.body.depth);
  if (i < req.body.depth) {
    i++;
    parentID = nodes[req.body.indexList[i - 2]]._id.valueOf();
    var responseArray = addNode(i, nodes[req.body.indexList[i - 2]].nodes, req, parentID);
    nodes[req.body.indexList[i - 2]].nodes = responseArray[0];
    var nodeInformation = responseArray[1];
    var indexList = responseArray[2];
    var isLast = responseArray[3];
    var depth = responseArray[4];
    return [nodes, nodeInformation, indexList, isLast, depth];

    return nodes;
  }
  else if (i === req.body.depth) {
    var singleNode = new UserSchema.Node({
      name: req.body.nodeTitle,
      todos: [],
      nodes: [],
    });
    singleNode.save();
    if (!parentID) {
      console.log("Should not be in here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      if (nodes.length !== 0) {
        nodes.push(singleNode);
        var indexList = req.body.indexList;
        indexList[req.body.depth - 1] = nodes.length - 1;
        return [nodes, singleNode, indexList, true, req.body.depth];
      }
      else {
        nodes = [singleNode];
        var indexList = [0];
        return [nodes, singleNode, indexList, true, req.body.depth];
      }
    }
    else {
      console.log("Problem should be here!!");
      console.log(parentID);
      console.log("___________________________");
      UserSchema.Node.findOne({_id: parentID})
          .then(function (node) {
            console.log("OLD NODES");
            console.log(node);
            node.nodes.push(singleNode);
            console.log("NEW NODES");
            console.log(node);
            return node;
          }).then(function (node) {
        node.save();
      });
      var islast = true;
      var depth = req.body.depth;
      console.log("depth");
      console.log(depth);
      var indexList = req.body.indexList;
      if (i === depth) {
        if (depth < req.body.indexList.length) {
          indexList.splice[depth - 1, indexList.length - 1];
          indexList[req.body.depth - 1] = nodes.length - 1;
        }
        if (depth === req.body.indexList.length) {
          indexList[req.body.depth - 1] = nodes.length;
        }
        else {
          indexList.push(nodes.length)
        }
        nodes.push(singleNode);
        return [nodes, singleNode, indexList, islast, depth];
      }
    }
  }
}




/**
 * DELETE /nodes
 */

exports.deleteNode = function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {

      UserSchema.User.findOne({  email: req.body.email  })
          .exec(function(err, user) {
            ////////////////////////////////
            var i = 1;
            var nodeInformation = null;
            var indexList = null;
            var last = false;
            function deleteFromUser(i, nodes, req) {
              var nodeInformation = null;
              var indexList = null;
              var last = false;
              if (i === req.body.depth) {
                UserSchema.Node.findOne({_id: req.body._id})
                    .remove()
                    .exec(function (err, node) {
                    });
                console.log("NodeLength");
                console.log(nodes.length);
                nodes.splice(req.body.indexList[req.body.depth - 1], 1);
                console.log(nodes);
                if(req.body.depth === 1 && nodes.length === 0) {
                  return [nodes, null, [0], true];
                }
                if(req.body.last && nodes.length > 0) {
                  console.log("If it's the last Node in the list and there is more than one in the list");
                  nodeInformation = nodes[nodes.length - 1];
                  indexList = req.body.indexList;
                  indexList[req.body.depth -1] = req.body.indexList[req.body.depth -1] - 1;
                  if(indexList[req.body.depth - 1] === nodes.length - 1) {
                    last = true
                  }
                }
                if(!req.body.last && nodes.length > 0) {
                  console.log("If it's not the last Node in the list and there is more than one in the list");
                  nodeInformation = nodes[req.body.indexList[req.body.indexList.length - 1]];
                  indexList = req.body.indexList;
                  if(indexList[req.body.depth - 1] === nodes.length - 1) {
                    last = true
                  }
                }
                return [nodes, nodeInformation, indexList, last]

              }
              else {
                i++;
                var responseArray = deleteFromUser(i, nodes[req.body.indexList[i - 2]].nodes, req);
                if(responseArray[1] === null) {
                  console.log("If it was the last in the list and the lower bars length is now zero then fall in here.");
                  responseArray[1] = nodes[req.body.indexList[req.body.indexList.length - 2]];
                  indexList = req.body.indexList;
                  indexList.splice(req.body.depth -1, 1);
                  responseArray[2] = indexList;
                  if(indexList[req.body.depth - 2] === nodes.length - 1) {
                    last = true;
                    responseArray[3] = last;
                  }
                }
                nodes[req.body.indexList[i - 2]].nodes = responseArray[0];
                return [nodes, responseArray[1], responseArray[2], responseArray[3]];
              }
            }
            var responseArray = deleteFromUser(i, user.nodes, req);
            if(responseArray[0]) {
              user.nodes = responseArray[0];
              nodeInformation = responseArray[1];
              indexList = responseArray[2];
              last = responseArray[3];
            }
            else {
              user.nodes = null;
            }
            res.send({user: user.toJSON(), nodeInformation: nodeInformation, indexList : indexList, last: last});
            ///////////////////////////////
          });


    }]);
};
