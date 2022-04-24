const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

router.get('/', async (request, response) => {
  // before this we were returning the ids of the notes with the user
  // now we are populating the actual content of each note inside the user
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

router.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3) {
    return response.status(400).json({ error: 'password min length is 3' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

module.exports = router;
