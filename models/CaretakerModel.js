import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const caretakerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['refugio', 'particular'],
    required: true
  },
  acceptsVisits: {
    type: Boolean,
    required: true
  }
});

const Caretaker = mongoose.model('caretakers', caretakerSchema);

export default Caretaker;