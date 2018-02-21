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

router.get('/api/friends/:id', (req, res) => {
  const { id } = req.params;

  Friend.findById(id)
    .then(friend => {
      if (friend === null) {
        res.status(404).json({
          error: 'The friend with the specified ID does not exist.',
        });
        return;
      }

      res.status(200).send(friend);
      return;
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        res.status(500).json({
          error: 'The information could not be retrieved.',
        });
        return;
      }
    });
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

router.delete('/api/friends/:id', (req, res) => {
  const { id } = req.params;

  Friend.findByIdAndRemove(id)
    .then(deletedFriend => {
      if (deletedFriend === null) {
        res.status(404).json({
          error: 'The friend with the specified ID does not exist.',
        });
        return;
      }

      res.status(200).send(deletedFriend);
      return;
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        res.status(500).json({
          error: 'The information could not be retrieved.',
        });
        return;
      }
    });
});

router.put('/api/friends/:id', (req, res) => {
  const { id } = req.params;

  const { firstName, lastName } = req.body;
  const age = +req.body.age;
  const friendInformation = { firstName, lastName, age };

  if (!validate({ ...friendInformation, age: req.body.age }, res)) {
    return;
  }

  Friend.findByIdAndUpdate(id, friendInformation, { new: true })
    .then(updatedFriend => {
      if (updatedFriend === null) {
        res.status(404).json({
          error: 'The friend with the specified ID does not exist.',
        });
        return;
      }

      res.status(200).send(updatedFriend);
      return;
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        res.status(500).json({
          error: 'The information could not be retrieved.',
        });
        return;
      }
    });
});

module.exports = router;
