const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    requred: true,
    minlength: 3,
  },
  name: String,
  // we have to validate this on the controller, because the passwordHash
  // is always larger than 3
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
