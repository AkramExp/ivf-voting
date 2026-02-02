require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User, Poll, Vote } = require('./models');
const { authenticateToken, requireAdmin, requireServerMember } = require('./middleware');

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100
// });
// app.use('/api/', limiter);

app.get("/health-check", (req, res) => {
  console.log("api is running");
  res.status(200).json({ message: "api is running" });
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Discord OAuth2 endpoints
const DISCORD_API = 'https://discord.com/api/v10';

// Auth Routes
app.get('/api/auth/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds'
  });

  res.json({
    url: `https://discord.com/api/oauth2/authorize?${params.toString()}`
  });
});

app.post('/api/auth/callback', async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      `${DISCORD_API}/oauth2/token`,
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    // Get user's guilds
    const guildsResponse = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const discordUser = userResponse.data;
    const guilds = guildsResponse.data;

    // Check if user is in required server
    const inRequiredServer = guilds.some(guild => guild.id === process.env.REQUIRED_SERVER_ID);

    // Check if user is admin
    const isAdmin = discordUser.id === process.env.ADMIN_DISCORD_ID;

    // Create or update user
    let user = await User.findOne({ discordId: discordUser.id });

    if (user) {
      user.username = discordUser.username;
      user.discriminator = discordUser.discriminator;
      user.avatar = discordUser.avatar;
      user.isAdmin = isAdmin;
      user.inRequiredServer = inRequiredServer;
      await user.save();
    } else {
      user = await User.create({
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        isAdmin: isAdmin,
        inRequiredServer: inRequiredServer
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        inRequiredServer: user.inRequiredServer
      }
    });
  } catch (error) {
    console.error('Auth error:', error.response?.data || error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar,
      isAdmin: req.user.isAdmin,
      inRequiredServer: req.user.inRequiredServer
    }
  });
});

// Poll Routes
app.get('/api/polls', authenticateToken, async (req, res) => {
  try {
    const polls = await Poll.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
});

app.get('/api/polls/active', authenticateToken, requireServerMember, async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active polls' });
  }
});

app.get('/api/polls/:id', authenticateToken, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if user has voted
    const userVote = await Vote.findOne({
      pollId: poll._id,
      userId: req.user._id
    });

    res.json({
      poll,
      userVote: userVote ? userVote.optionId : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
});

app.post('/api/polls', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, options } = req.body;

    if (!title || !options || options.length < 2) {
      return res.status(400).json({ error: 'Title and at least 2 options required' });
    }

    const formattedOptions = options.map((opt, index) => ({
      id: `opt_${Date.now()}_${index}`,
      text: opt,
      votes: 0
    }));

    const poll = await Poll.create({
      title,
      description,
      options: formattedOptions,
      createdBy: req.user._id
    });

    const populatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'username');

    res.status(201).json(populatedPoll);
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

app.put('/api/polls/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, options } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    if (title) poll.title = title;
    if (description !== undefined) poll.description = description;

    if (options) {
      // Get existing votes
      const votes = await Vote.find({ pollId: poll._id });

      // Map old option IDs to new ones where text matches
      const optionMap = {};
      poll.options.forEach(oldOpt => {
        const newOpt = options.find(newOptText =>
          newOptText.toLowerCase() === oldOpt.text.toLowerCase()
        );
        if (newOpt) {
          optionMap[oldOpt.id] = oldOpt.id; // Keep same ID if text matches
        }
      });

      // Create new options array
      const formattedOptions = options.map((opt, index) => {
        const existingOpt = poll.options.find(o => o.text.toLowerCase() === opt.toLowerCase());
        return {
          id: existingOpt ? existingOpt.id : `opt_${Date.now()}_${index}`,
          text: opt,
          votes: 0
        };
      });

      // Recalculate votes
      votes.forEach(vote => {
        const option = formattedOptions.find(o => o.id === vote.optionId);
        if (option) {
          option.votes++;
        }
      });

      // Delete votes for removed options
      const validOptionIds = formattedOptions.map(o => o.id);
      await Vote.deleteMany({
        pollId: poll._id,
        optionId: { $nin: validOptionIds }
      });

      poll.options = formattedOptions;
    }

    await poll.save();
    const updatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'username');

    res.json(updatedPoll);
  } catch (error) {
    console.error('Update poll error:', error);
    res.status(500).json({ error: 'Failed to update poll' });
  }
});

app.delete('/api/polls/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Delete all votes for this poll
    await Vote.deleteMany({ pollId: poll._id });

    // Delete the poll
    await Poll.findByIdAndDelete(req.params.id);

    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete poll' });
  }
});

app.post('/api/polls/:id/close', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    poll.isActive = false;
    poll.closedAt = new Date();
    await poll.save();

    const updatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'username');

    res.json(updatedPoll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to close poll' });
  }
});

app.post('/api/polls/:id/reopen', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    poll.isActive = true;
    poll.closedAt = null;
    await poll.save();

    const updatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'username');

    res.json(updatedPoll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reopen poll' });
  }
});

// Vote Routes
app.post('/api/votes/:pollId', authenticateToken, requireServerMember, async (req, res) => {
  try {
    const { optionId } = req.body;
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    if (!poll.isActive) {
      return res.status(400).json({ error: 'Poll is closed' });
    }

    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(400).json({ error: 'Invalid option' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      pollId: poll._id,
      userId: req.user._id
    });

    if (existingVote) {
      // Update vote
      const oldOption = poll.options.find(opt => opt.id === existingVote.optionId);
      if (oldOption) {
        oldOption.votes = Math.max(0, oldOption.votes - 1);
      }

      option.votes++;
      existingVote.optionId = optionId;
      await existingVote.save();
    } else {
      // Create new vote
      await Vote.create({
        pollId: poll._id,
        userId: req.user._id,
        optionId
      });
      option.votes++;
    }

    await poll.save();

    res.json({
      poll,
      userVote: optionId
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get voters for a specific option
app.get('/api/polls/:pollId/options/:optionId/voters', authenticateToken, async (req, res) => {
  console.log('helllooo')
  try {
    const { pollId, optionId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Verify that the option exists in this poll
    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(404).json({ error: 'Option not found' });
    }

    // Get all votes for this option with user details
    const votes = await Vote.find({
      pollId: poll._id,
      optionId: optionId
    }).populate('userId', 'username avatar discordId');

    const voters = votes.map(vote => ({
      username: vote.userId.username,
      avatar: vote.userId.avatar,
      discordId: vote.userId.discordId,
      votedAt: vote.createdAt
    }));

    res.json({
      option: option.text,
      voterCount: voters.length,
      voters
    });
  } catch (error) {
    console.error('Fetch voters error:', error);
    res.status(500).json({ error: 'Failed to fetch voters' });
  }
});

// Results Routes
app.get('/api/results', authenticateToken, async (req, res) => {
  try {
    const closedPolls = await Poll.find({ isActive: false })
      .populate('createdBy', 'username')
      .sort({ closedAt: -1 });

    res.json(closedPolls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});