const express = require('express');
const router = express.Router();
const multer = require('multer');
const Verification = require('../models/verification');
const Protect = require('../middleware/authMiddleware');
const User = require('../models/User');

const MIN_FILE_SIZE = 1024; // 1KB - rejects empty/near-empty files
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Please upload an image file or PDF.'));
    }
  }
});

/**
 * Verifies the file's actual content matches its declared mimetype by
 * checking magic bytes (file signature). A browser-supplied mimetype
 * header can be spoofed - this can't, since it reads the real bytes.
 */
function contentMatchesDeclaredType(buffer, mimetype) {
  if (buffer.length < 4) return false;

  const signature = buffer.subarray(0, 4);

  if (mimetype === 'application/pdf') {
    return signature.toString('ascii', 0, 4) === '%PDF';
  }
  if (mimetype === 'image/png') {
    return signature[0] === 0x89 && signature[1] === 0x50 && signature[2] === 0x4e && signature[3] === 0x47;
  }
  if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
    return signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff;
  }
  if (mimetype === 'image/webp') {
    return signature.toString('ascii', 0, 4) === 'RIFF';
  }
  // Any other image/* mimetype that passed fileFilter but has no signature
  // check defined here - allow it through rather than false-reject a
  // legitimate but less common image format.
  return true;
}

/**
 * @route   POST /api/verification/submit
 * @desc    Submit user KYC documents and registration info
 * @access  Private (Requires User Session Auth)
 */
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
    const fullName = req.body.fullName?.trim();
    const idType = req.body.idType?.trim();
    const phoneNumber = req.body.phoneNumber?.trim();

    // File is always required - resubmission after rejection still needs
    // a fresh document, matching what the backend has always enforced.
    if (!fullName || !idType || !phoneNumber || !req.file) {
      return res.status(400).json({ message: 'All fields and a document file are required.' });
    }

    if (fullName.length < 2) {
      return res.status(400).json({ message: 'Please enter your full legal name.' });
    }

    // Basic phone sanity check - digits, spaces, +, - only, reasonable length
    const phoneDigitsOnly = phoneNumber.replace(/[\s\-+]/g, '');
    if (!/^\d{7,15}$/.test(phoneDigitsOnly)) {
      return res.status(400).json({ message: 'Please enter a valid phone number.' });
    }

    if (req.file.size < MIN_FILE_SIZE) {
      return res.status(400).json({ message: 'The uploaded file appears to be empty or corrupted.' });
    }

    if (!contentMatchesDeclaredType(req.file.buffer, req.file.mimetype)) {
      return res.status(400).json({
        message: 'The file content does not match its format. Please upload a genuine image or PDF.',
      });
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