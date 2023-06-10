const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => new Intl.DateTimeFormat('en-US').format(createdAt),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [
      {
        reactionId: {
          type: Schema.Types.ObjectId,
          default: () => new Types.ObjectId(),
        },
        reactionBody: {
          type: String,
          required: true,
          maxLength: 280,
        },
        username: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          get: (createdAt) => new Intl.DateTimeFormat('en-US').format(createdAt),
        },
      },
    ],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
