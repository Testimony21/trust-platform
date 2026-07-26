const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  idType: {
    type: String,
    enum: ['Passport', 'Drivers License', 'National ID'],
    required: true
  },
  idDocUrl: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["Not Submitted", "Pending Review", "Approved", "Rejected"],
    default: "Pending Review"
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, { timestamps: true }); // ← handles createdAt and updatedAt automatically

module.exports = mongoose.model('Verification', VerificationSchema);