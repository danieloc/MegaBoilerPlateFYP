var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var todoSchema = new mongoose.Schema({
  name: String,
  priority: String,
  completed: Boolean
});

var nodeSchema = new mongoose.Schema({
  name: String,
  todos: [{type: mongoose.Schema.Types.ObjectId, ref: 'ToDo'}],
  nodes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Node'}],
});

var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true},
  password: String,
  primaryColor : String,
  isNewUser: Boolean,
  mindmapOption: String,
  nodes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Node'}],
  passwordResetToken: String,
  passwordResetExpires: Date,
  picture: String,
  facebook: String,
  twitter: String,
  google: String,
  vk: String
}, schemaOptions);


var autoPopulateNodeSchema = function(next) {
  this.populate('nodes');
  this.populate('todos');
  next();
};

var autoPopulateUserSchema = function(next) {
  this.populate('nodes');
  next();
};

nodeSchema
    .pre('findOne', autoPopulateNodeSchema)
    .pre('find', autoPopulateNodeSchema);

userSchema
    .pre('findOne', autoPopulateUserSchema)
    .pre('find', autoPopulateUserSchema)
    .pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.virtual('gravatar').get(function() {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

var ToDo = mongoose.model('ToDo', todoSchema);
var Node = mongoose.model('Node', nodeSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  User : User, Node : Node, ToDo : ToDo
};
