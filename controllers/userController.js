const { Thought, User } = require('../models');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Get a single user by id
  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Cannot find user' });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // Update a user by id
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Cannot find user' });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  // Delete a user by id
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Cannot find user' });
          return;
        }
        // Remove user's id from their friends' friend list
        User.updateMany(
          { _id: { $in: user.friends } },
          { $pull: { friends: req.params.id } }
        )
          .then(() => {
            res.json({ message: 'User deleted successfully' });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Add a friend to a user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Cannot find user' });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Remove a friend from a user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Cannot find user' });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};

module.exports = userController;
