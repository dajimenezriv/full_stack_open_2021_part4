const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

// check that the user exists
// compare password hash is correct
// create token for that user
router.post('/', async (request, response) => {
  const { username, password } = request.body;
  // this is the same as doing { username: username }
  const user = await User.findOne({ username });
  const correctPassword = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!user || !correctPassword) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  return response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
