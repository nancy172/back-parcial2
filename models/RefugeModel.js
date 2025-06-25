import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const refugeSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'users' 
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const Refuge = mongoose.model('refuges', refugeSchema);

export default Refuge;