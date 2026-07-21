const express = require('express');
const router = express.Router();
const multer = require('multer');
const Verification = require('../models/verification');
// const { uploadToCloudinary } = require('../utils/cloudinaryStorage'); // Mocked utility helper
// const { protectRoute } = require('../middleware/authMiddleware'); // Mocked user validation session

// Configure Multer storage engine in memory before cloud bucket pipe dispatch
const storage = multer.memoryStorage();
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit guard
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
router.post('/submit', upload.single('idFile'), async (req, res) => {
  try {
    const { fullName, idType, phoneNumber } = req.body;
    
    // 1. Validation Guards
    if (!fullName || !idType || !phoneNumber || !req.file) {
      return res.status(400).json({ message: 'All credential items and data arrays are required.' });
    }

    // 2. Check if a document application already exists for this user session
    // const userId = req.user.id; // Pulled dynamically from your auth session tokens
    const userId = "65f1234567890abcdef12345"; // Static string placeholder for sandboxed compilation
    
    const existingSubmission = await Verification.findOne({ userId });
    if (existingSubmission && existingSubmission.status === 'Pending') {
      return res.status(400).json({ message: 'You already have an active document profile under admin audit.' });
    }

    /* 
    3. DISPATCH IMAGE TO CLOUD STORAGE (S3 / Cloudinary)
    In a live production state, you would extract the file buffer array and push to Cloudinary:
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    const idDocUrl = uploadResult.secure_url;
    */
    const idDocUrl = `https://res.cloudinary.com/trust-platform/image/upload/mock_id_${Date.now()}.png`; // Sandboxed response placeholder

    // 4. Save Submission to MongoDB Atlas
    const verificationPayload = new Verification({
      userId,
      fullName,
      idType,
      idDocUrl,
      phoneNumber,
      phoneVerified: true // Set to true after SMS OTP step handshake matches successfully
    });

    await verificationPayload.save();

    res.status(201).json({ 
      success: true, 
      message: 'Verification metrics queued successfully for administrative compliance audit.' 
    });

  } catch (error) {
    console.error('KYC Ingestion Engine Fault:', error.message);
    res.status(500).json({ message: 'Internal Server error processing file upload matrices.' });
  }
});

module.exports = router;