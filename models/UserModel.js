import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['persona', 'refugio', 'admin'],
    required: true
  },
  avatar: {
    type: String
  }
});

const User = mongoose.model('users', userSchema);

export default User;