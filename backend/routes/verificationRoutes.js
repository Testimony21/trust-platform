const express = require('express');
const router = express.Router();
const multer = require('multer');
const Verification = require('../models/verification');
const Protect = require('../middleware/authMiddleware');
const User = require('../models/User');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Please upload an image file or PDF.'));
    }
  }
});

/**
 * @route   POST /api/verification/submit
 * @desc    Submit user KYC documents and registration info
 * @access  Private (Requires User Session Auth)
 */
// 🎯 PASS THEM AS A CLEAN SEQUENTIAL ARRAY STACK WRAPPER:
router.post('/submit', Protect, (req, res, next) => {
  upload.single('idFile')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { fullName, idType, phoneNumber } = req.body;

    if (!fullName || !idType || !phoneNumber || !req.file) {
      return res.status(400).json({ message: 'All fields and document are required.' });
    }

    const userId = req.user.id;

    const existingSubmission = await Verification.findOne({ userId });

    if (existingSubmission && existingSubmission.status === 'Pending Review') {
      return res.status(400).json({ message: 'You already have a pending verification submission.' });
    }

    const idDocUrl = `https://res.cloudinary.com/trust-platform/image/upload/mock_id_${Date.now()}.png`;

    if (existingSubmission) {
      existingSubmission.status = 'Pending Review';
      existingSubmission.fullName = fullName;
      existingSubmission.idType = idType;
      existingSubmission.idDocUrl = idDocUrl;
      existingSubmission.phoneNumber = phoneNumber;
      existingSubmission.rejectionReason = '';
      await existingSubmission.save();
    } else {
      await Verification.create({
        userId,
        fullName,
        idType,
        idDocUrl,
        phoneNumber,
        phoneVerified: true,
        status: 'Pending Review'
      });
    }

    await User.findByIdAndUpdate(userId, {
      verificationStatus: 'Pending Review',
      verificationAdminNotes: ''
    });

    return res.status(201).json({
      success: true,
      message: 'Verification submitted successfully.'
    });

  } catch (error) {
    console.error('Verification error:', error.message);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;