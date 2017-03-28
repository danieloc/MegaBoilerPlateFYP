/**
 * Created by Daniel on 3/28/2017.
 */
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var UserSchema = require('../models/User');

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
            UserSchema.User.findOne({  _id: req.user.id })
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
            UserSchema.User.findOne({ _id: req.user.id})
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
        var responseArray = recursiveDeleteToDo(i, node.nodes[req.body.indexList[i - 1]], req);
        node.nodes[req.body.indexList[i - 1]] = responseArray[0];
        return [node, responseArray[1]];
    }
    else if(i === req.body.depth) {
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
            UserSchema.User.findOne({   _id: req.user.id  })
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
                todo.completed = req.body.archived;
                todo.save();
            });
        node.todos.forEach(function(todo){
            if(todo._id.equals(req.body.todoID)) {
                todo.name = req.body.todoTitle;
                todo.priority = req.body.todoPriority;
                todo.completed = req.body.archived;
            }
        });
        return [node, node];
    }
}

exports.unarchiveToDo = function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            var myTodo;
            UserSchema.ToDo.findOne({ _id: req.body.todoID})
                .exec(function (err, todo) {
                    todo.completed = false;
                    myTodo = todo;
                    todo.save(function (err) {
                        done(err, todo);
                    });
                });
            UserSchema.User.findOne({   _id: req.user.id  })
                .exec(function(err, user) {
                    res.send({user: user.toJSON(), todo : myTodo});
                });
        }]);
};
