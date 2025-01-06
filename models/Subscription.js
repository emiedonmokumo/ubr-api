import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  features: { type: [String], required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  billingCycle: { type: String, default: "month" },
  recommended: { type: Boolean, default: false },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
