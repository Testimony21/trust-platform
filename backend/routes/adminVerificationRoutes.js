const express = require('express');
const router = express.Router();
const Verification = require('../models/verification');
const Protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminMiddleware');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');

/**
 * @route   GET /api/admin/verification/pending
 * @desc    Retrieve all user document applications awaiting audit
 * @access  Private (Admin Only)
 */
router.get('/pending', Protect, adminProtect, async (req, res) => {
  try {
    // 1. Fetching all records explicitly flagged as 'Pending Review'
    const pendingApplications = await Verification.find({ status: 'Pending Review' })
      .populate('userId', 'email fullName')
      .sort({ submittedAt: 1 });

    // 2. Return clean JSON structure matching dashboard UI expectations
    return res.status(200).json({
      success: true,
      count: pendingApplications.length,
      data: pendingApplications
    });
  } catch (error) {
    console.error('Admin Fetch Queue Error:', error.message);
    return res.status(500).json({ 
      success: false,
      message: 'Server error pulling pending verification metrics.' 
    });
  }
});

/**
 * @route   PATCH /api/admin/verification/review/:id
 * @desc    Approve or Reject a specific user's verification profile
 * @access  Private (Admin Only)
 */
router.patch('/review/:id', Protect, adminProtect, async (req, res) => {
  try {
    const { action, reason } = req.body;
    const applicationId = req.params.id;

    // 1. Validate Input
    if (!['Approved', 'Rejected'].includes(action)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid administrative action payload. Must be Approved or Rejected.' 
      });
    }

    if (action === 'Rejected' && (!reason || !reason.trim())) {
      return res.status(400).json({ 
        success: false,
        message: 'A specific reason string is required to reject an application.' 
      });
    }

    // 2. Find target verification application record
    const application = await Verification.findById(applicationId);
    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Verification profile application record not found.' 
      });
    }

    // Aligned check with your true verification process string 'Pending Review'
    if (application.status !== 'Pending Review') {
      return res.status(400).json({ 
        success: false,
        message: 'This application has already been processed.' 
      });
    }

    // 3. Sync changes atomically to User and Seller collections
    if (action === 'Approved') {
      application.status = 'Approved';
      application.rejectionReason = '';
      await application.save();

      // Update basic user role capabilities for login payloads and dashboard barriers
      await User.findByIdAndUpdate(application.userId, {
        role: 'seller',
        verificationStatus: 'Approved',
        verificationAdminNotes: ''
      });

      // Maintain application sync inside the dedicated profile cluster
      await SellerProfile.findOneAndUpdate(
        { userId: application.userId },
        { isVerified: true },
        { upsert: true, new: true }
      );
      
    } else {
      // Rejection execution branch
      application.status = 'Rejected';
      application.rejectionReason = reason.trim();
      await application.save();

      // Flag user layout accurately to show denial indicators on frontend refresh
      await User.findByIdAndUpdate(application.userId, {
        verificationStatus: 'Rejected',
        verificationAdminNotes: reason.trim()
      });
    }

    // 4. Send successful termination response
    return res.status(200).json({
      success: true,
      message: `User application status updated to ${action} successfully.`,
      data: application
    });

  } catch (error) {
    console.error('Admin Processing Engine Fault:', error.message);
    return res.status(500).json({ 
      success: false,
      message: 'Internal Server Error modifying verification state.' 
    });
  }
});

module.exports = router;