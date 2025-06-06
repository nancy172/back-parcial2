import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: Number,
    required: false
  },
  role: {
    type: String,
    enum: ['cuidador', 'adoptante'],
    required: true
  }
});

const User = mongoose.model('users', userSchema);

export default User;