import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  feesPaid: {
    type: Boolean,
    default: false
  },
  paymentHistory: [{
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    },
    paymentMethod: String,
    transactionId: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Student', studentSchema);