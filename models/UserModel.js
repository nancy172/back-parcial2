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
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['persona', 'refugio', 'admin'],
    required: true
  },
  // Referencias directas, solo una será usada
  /*personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  },
  refugeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Refuge'
  },*/
});

const User = mongoose.model('users', userSchema);

export default User;