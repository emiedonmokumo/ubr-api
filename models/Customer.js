import mongoose, { Schema } from 'mongoose';

const customerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customerId: {
        type: String,
        unique: true,
        required: true
    },
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;