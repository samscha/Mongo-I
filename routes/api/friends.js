const express = require('express');
const router = express.Router();

const Friend = require('../../Friends/FriendModel');

const validate = (friendInfo, res) => {
  if (!isValid(friendInfo)) {
    res.status(400).json({
      errorMessage:
        'Please provide firstName, lastName and age for the friend.',
    });
    return false;
  }

  if (!isOf(+friendInfo.age)) {
    res.status(400).json({
      errorMessage: 'Age must be a whole number between 1 and 120',
    });
    return false;
  }

  return true;
};

const isValid = friendInfo => {
  return friendInfo.firstName && friendInfo.lastName && friendInfo.age;
};

const isOf = age => {
  return Number.isInteger(age) && age >= 1 && age <= 120;
};

router.get('/', (req, res) => {
  Friend.find()
    .then(friends => res.status(200).json(friends))
    .catch(err =>
      res.status(500).json({
        error: 'The information could not be retrieved.',
      }),
    );
});

router.post('/', (req, res) => {
  const { firstName, lastName } = req.body;
  const age = +req.body.age;
  const friendInformation = { firstName, lastName, age };

  if (!validate({ ...friendInformation, age: req.body.age }, res)) {
    return;
  }

  const friend = new Friend(friendInformation);

  friend
    .save()
    .then(savedFriend => res.status(201).json(savedFriend))
    .catch(err =>
      res.status(500).json({
        error: 'There was an error while saving the friend to the database',
      }),
    );
});

module.exports = router;
