const express = require('express');
const router = express.Router();

const BlogPost = require('../../BlogPosts/PostModel');

router.get('/', (req, res) => {
  BlogPost.find()
    .populate('authors')
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ err }));
});

router.get('/:id', (req, res) => {
  BlogPost.findById(req.params.id)
    .populate('authors')
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ err }));
});

router.post('/', (req, res) => {
  const { title, content, authors } = req.body;

  new BlogPost(req.body)
    .save()
    .then(savedPost => res.status(201).json(savedPost))
    .catch(err =>
      res.status(500).json({
        err,
      }),
    );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  BlogPost.findByIdAndRemove(id)
    .then(deletedPost => {
      if (deletedPost === null) {
        res.status(404).json({
          error: 'The post with the specified ID does not exist.',
        });
        return;
      }

      res.status(200).send(deletedPost);
      return;
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        res.status(500).json({
          error: 'The post could not be removed',
        });
        return;
      }
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;

  const { title, content, authors } = req.body;

  BlogPost.findByIdAndUpdate(id, { title, content, authors }, { new: true })
    .then(updatedPost => {
      if (updatedPost === null) {
        res.status(404).json({
          error: 'The post with the specified ID does not exist.',
        });
        return;
      }

      res.status(200).send(updatedPost);
      return;
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        res.status(500).json({
          error: 'The post information could not be modified.',
          err,
        });
        return;
      }
    });
});

module.exports = router;
