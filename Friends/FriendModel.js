const mongoose = require('mongoose');
const Post = require('../BlogPosts/PostModel');

const { ObjectId } = mongoose.Schema.Types;

const FriendSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  posts: [{ type: ObjectId, ref: 'Post', required: false }],
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const FriendModel = mongoose.model('Friend', FriendSchema);

module.exports = FriendModel;
