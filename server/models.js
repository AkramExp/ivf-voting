const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  discriminator: String,
  avatar: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  inRequiredServer: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  options: [{
    id: String,
    text: String,
    votes: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  closedAt: Date
}, {
  timestamps: true
});

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  optionId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only vote once per poll
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Poll = mongoose.model('Poll', pollSchema);
const Vote = mongoose.model('Vote', voteSchema);

module.exports = { User, Poll, Vote };