const mongoose = require('mongoose');
const Friend = require('../Friends/FriendModel');

const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authors: [
    { type: ObjectId, ref: 'Friend', required: true, default: 'anonymouse' },
  ],
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
