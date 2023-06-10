const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => {
        res.json(thoughts);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Get a single thought by id
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'Cannot find thought' });
          return;
        }
        res.json(thought);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Cannot find user' });
          return;
        }
        res.json({ message: 'Thought created successfully' });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Update a thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'Cannot find thought' });
          return;
        }
        res.json(thought);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Delete a thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'Cannot find thought' });
          return;
        }
        return User.findOneAndUpdate(
          { thoughts: req.params.id },
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Cannot find user' });
          return;
        }
        res.json({ message: 'Thought deleted successfully' });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;
