const express = require('express');
const router = express.Router();
const Verification = require('../models/verification');
const Protect = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminMiddleware');
const User = require('../models/User'); // Un-commented to update the user's role on approval

/**
 * @route   GET /api/admin/verification/pending
 * @desc    Retrieve all user document applications awaiting audit
 * @access  Private (Admin Only)
 */
router.get('/pending', Protect, adminProtect, async (req, res) => {
  try {
    const pendingApplications = await Verification.find({ status: 'Pending' })
      .populate('userId', 'email fullName')
      .sort({ submittedAt: 1 });

    res.status(200).json({
      success: true,
      count: pendingApplications.length,
      data: pendingApplications
    });
  } catch (error) {
    console.error('Admin Fetch Queue Error:', error.message);
    res.status(500).json({ message: 'Server error pulling pending verification metrics.' });
  }
});

/**
 * @route   PATCH /api/admin/verification/review/:id
 * @desc    Approve or Reject a specific user's verification profile
 * @access  Private (Admin Only) <-- FIXED: Added protection middleware below
 */
router.patch('/review/:id', Protect, adminProtect, async (req, res) => {
  try {
    // FIXED: Destructured 'action' and 'reason' to match your endpoint design
    const { action, reason } = req.body; 
    const applicationIds = req.params.id;

    // 1. Validate Admin Input Action parameters
    if (!['Approved', 'Rejected'].includes(action)) {
      return res.status(400).json({ message: 'Invalid administrative action payload. Must be Approved or Rejected.' });
    }

    if (action === 'Rejected' && (!reason || !reason.trim())) {
      return res.status(400).json({ message: 'A specific reason string is required to reject an application.' });
    }

    // 2. Find the target verification record
    const application = await Verification.findById(applicationIds);
    if (!application) {
      return res.status(404).json({ message: 'Verification profile application record not found.' });
    }

    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'This application has already been processed.' });
    }

    // 3. Update execution state based on action parameters
    if (action === 'Approved') {
      application.status = 'Approved';
      application.rejectionReason = ''; // Clear out historical notes

      // Dynamically upgrade their role profile to a seller on approval
      await User.findByIdAndUpdate(application.userId, { role: 'seller' });
    } else {
      application.status = 'Rejected';
      application.rejectionReason = reason.trim();
    }

    // Save changes to trigger updates
    await application.save();

    res.status(200).json({
      success: true,
      message: `User application status updated to ${action} successfully.`,
      data: application
    });

  } catch (error) {
    console.error('Admin Processing Engine Fault:', error.message);
    res.status(500).json({ message: 'Internal Server Error modifying verification state.' });
  }
});

module.exports = router;