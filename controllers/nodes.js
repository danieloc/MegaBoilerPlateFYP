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
            UserSchema.User.findOne({  _id: req.user.id})
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
            owner: {
                email : req.body.email,
                name: req.body.userName,
                picture: req.body.userImage,
            },
            collaborators: [],
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

            UserSchema.User.findOne({   _id: req.user.id  })
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




/**
 * PUT /nodes/leave
 */

exports.leaveNode = function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {

            UserSchema.User.findOne({   _id: req.user.id })
                .exec(function(err, user) {
                    var nodeInformation = null;
                    var index = null;
                    var last = false;
                    var nodes = user.nodes;
                    UserSchema.Node.findOne({_id: req.body._id})
                        .exec(function (err, node) {
                            var newCollabs = [];
                            for(var n = 0; n < node.collaborators.length; n++) {
                                if(node.collaborators[n].email !== req.body.email) {
                                    newCollabs.push(node.collaborators[n]);
                                }
                            }
                            node.collaborators = newCollabs;
                            node.save(function (err) {
                                if(err) {
                                    done(err, node)
                                }
                            });
                        });
                    console.log(req.body.index);
                    nodes.splice(req.body.index, 1);
                    if(nodes.length === 0) {
                        console.log("Took the correct path");
                        return res.send({user: user.toJSON(), nodeInformation: null, indexList : [index], last: last});
                    }
                    if(req.body.last && nodes.length > 0) {
                        console.log("If it's the last Node in the list and there is more than one in the list");
                        nodeInformation = nodes[nodes.length - 1];
                        index = req.body.index;
                        if(index === nodes.length - 1) {
                            last = true
                        }
                    }
                    if(!req.body.last && nodes.length > 0) {
                        nodeInformation = nodes[req.body.index];
                        index = req.body.index;
                        if(index === nodes.length - 1) {
                            last = true
                        }
                    }
                    user.save(function (err) {
                        if(err) {
                            done(err, user)
                        }
                        return res.send({user: user.toJSON(), nodeInformation: nodeInformation, indexList : [index], last: last});
                    });

                });


        }]);
};


/**
 * PUT /nodes/share
 */

exports.shareNode = function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            if(req.body.email === req.body.emailToShare.toLowerCase()) {
                return res.status(404).send({ msg: "That's your own email address."})
            }
            if(req.body.isAlreadyCollab) {
                return res.status(404).send({ msg: "This email address has already been invited to the node or one of its parent nodes."})
            }
            UserSchema.User.findOne({  email: req.body.emailToShare })
                .then(function (user){
                    if (!user) {
                        return res.status(400).send({
                            msg: 'The email address ' + req.body.emailToShare + ' is not associated with any account. ' +
                            'Double-check the email address and try again.'
                        });
                    }
                    UserSchema.Node.findOne({ _id : req.body.nodeID})
                        .exec(function(err, node) {
                            for(var i =0; i < node.collaborators.length; i++) {
                                if(node.collaborators[i].email === req.body.emailToShare) {
                                    return res.status(400).send({
                                        msg: 'The email address ' + req.body.emailToShare + ' has already been invited. Double-check the email address and try again.'
                                    });
                                }
                            }
                            console.log(user);
                            if(user.invitations.length === 0)
                                user.invitations = [node];
                            else {
                                user.invitations.push(node);
                            }
                            ////////////////////////////////
                            console.log(user);
                            console.log(user.picture);
                            console.log(req.body.emailToShare);
                            var collab = {
                                name: user.name,
                                email: req.body.emailToShare,
                                picture: user.picture || user.gravatar,
                                accepted: false,
                            };
                            if(node.collaborators.length === 0) {
                                node.collaborators = [collab];
                            }
                            else
                                node.collaborators.push(collab);
                            node.save();
                            user.save(function(err) {
                                if (err) {
                                    done(err, user);
                                }
                            });
                            return res.send({msg : "A Request has been made for the email address " + req.body.emailToShare + " to join the node"});
                        })
                });
        }]);
};

exports.acceptNode = function(req, res) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            UserSchema.User.findOne({  _id: req.user.id })
                .then(function (user) {
                    console.log(user);
                    var found = false;
                    var newNode;
                    var i = 0;
                    var newInvitations = user.invitations;
                    while(i < user.invitations.length && !found) {
                        if(user.invitations[i]._id.equals(req.body.nodeID)) {
                            var newNode = user.invitations[i];
                            newInvitations.splice(i, 1);
                            if(req.body.accepted) {
                                if (user.nodes.length === 0) {
                                    user.nodes = [newNode];
                                }
                                else {
                                    user.nodes.push(newNode);
                                }
                            }
                            found = true;
                        }
                        i++;
                    }
                    console.log("acc");
                    user.invitations = newInvitations;
                    console.log(user);
                    console.log("____________________");
                    console.log(user.invitations);
                    user.save(function(err) {
                        if (err) {
                            done(err, user);
                        }
                    });
                    console.log("USSSSERRRRRRR");
                    console.log(user);
                    return user;
                }).then(function (user){
                UserSchema.Node.findOne({ _id : req.body.nodeID})
                    .exec(function(err, node) {
                        console.log("About to start node");
                        ////////////////////////////////
                        var found = false;
                        var i = 0;
                        var newCollaborators = node.collaborators;
                        while(i < node.collaborators.length && found === false) {
                            var collabName = node.collaborators[i].email;
                            console.log(req.body.email);
                            if(collabName === req.body.email) {
                                console.log("IT WORKED ANYWAY");
                                if(!req.body.accepted)
                                    newCollaborators.splice(i, 1);
                                else if(req.body.accepted){
                                    newCollaborators[i].accepted = true;
                                }
                                found = true;
                            }
                            i++;
                        }
                        if(!found) {
                            return res.status(401).send({
                                msg: 'You were not invited to this specific node.'
                            });
                        }
                        node.collaborators = newCollaborators;
                        node.save(function(err) {
                            if (err) {
                                done(err, user);
                            }
                        });
                        if(req.body.accepted)
                            return res.send({user: user.toJSON(), msg : "You have accepted the node"});
                        else
                            return res.send({ user: user.toJSON(), msg : "You have rejected the node"});
                    })
            });
        }]);
};