const mongoose = require('mongoose');
const userSchema = require('../schemas/User.schema');

const User = mongoose.model('User', userSchema);

module.exports = User;
