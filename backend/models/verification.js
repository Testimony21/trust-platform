const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Prevents spamming multiple pending applications
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  idType: {
    type: String,
    enum: ['passport', 'drivers_license', 'national_id'],
    required: true
  },
  idDocUrl: {
    type: String,
    required: true // The absolute security link from Cloudinary or AWS S3
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
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update the timestamp on state shifts
VerificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Verification', VerificationSchema);