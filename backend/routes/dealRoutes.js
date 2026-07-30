const express = require("express");
const Deal = require("../models/Deal");
const Message = require("../models/Message");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const getUserId = (req) => req.user?._id || req.user?.id;

const getIdString = (value) => {
  if (!value) return "";
  if (value._id) return value._id.toString();
  return value.toString();
};

const isDealMember = (deal, userId) => {
  if (!deal || !userId) return false;

  return (
    getIdString(deal.buyer) === userId.toString() ||
    getIdString(deal.seller) === userId.toString()
  );
};

/* ======================================================
   CREATE DEAL
====================================================== */

router.post("/", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      sellerId,
      title,
      description,
      amount,
      platform,
    } = req.body;

    if (!sellerId || !title) {
      return res.status(400).json({
        message: "Seller and title are required.",
      });
    }

    if (sellerId.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot start a transaction with yourself.",
      });
    }

    const existingDeal = await Deal.findOne({
      buyer: userId,
      seller: sellerId,
      status: {
        $nin: ["Completed", "Cancelled"],
      },
    });

    if (existingDeal) {
      return res.json(existingDeal);
    }

    const deal = await Deal.create({
      buyer: userId,
      seller: sellerId,
      title,
      description,
      amount,
      platform,
      status: "Pending",
    });

    res.status(201).json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create transaction.",
    });
  }
});

/* ======================================================
   GET USER DEALS
====================================================== */

router.get("/", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deals = await Deal.find({
      $or: [{ buyer: userId }, { seller: userId }],
      deletedBy: { $nin: [userId] },
    })
      .populate("buyer", "fullName email role")
      .populate("seller", "fullName email role")
      .sort({ updatedAt: -1 });

    res.json(deals);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch transactions.",
    });
  }
});

/* ======================================================
   GET SINGLE DEAL
====================================================== */

router.get("/:id", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id)
      .populate("buyer", "fullName email role")
      .populate("seller", "fullName email role");

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({
        message: "Not allowed.",
      });
    }

    res.json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch transaction.",
    });
  }
});

/* ======================================================
   SELLER ACCEPTS DEAL
====================================================== */

router.patch("/:id/accept", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (getIdString(deal.seller) !== userId.toString()) {
      return res.status(403).json({
        message: "Only the seller can accept this transaction.",
      });
    }

    if (deal.status !== "Pending") {
      return res.status(400).json({
        message: "Transaction has already been processed.",
      });
    }

    deal.status = "Active";
    deal.acceptedAt = new Date();

    await deal.save();

    res.json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to accept transaction.",
    });
  }
});

/* ======================================================
   CANCEL DEAL
====================================================== */

router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({
        message: "Not allowed.",
      });
    }

    deal.status = "Cancelled";
    deal.cancelledAt = new Date();

    await deal.save();

    res.json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to cancel transaction.",
    });
  }
});

/* ======================================================
   BUYER CONFIRMS COMPLETION
====================================================== */

router.patch("/:id/confirm-buyer", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (getIdString(deal.buyer) !== userId.toString()) {
      return res.status(403).json({
        message: "Only the buyer can confirm completion.",
      });
    }

    deal.buyerConfirmed = true;

    if (deal.sellerConfirmed) {
      deal.status = "Completed";
      deal.completedAt = new Date();
    }

    await deal.save();

    res.json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to confirm completion.",
    });
  }
});

/* ======================================================
   SELLER CONFIRMS COMPLETION
====================================================== */

router.patch("/:id/confirm-seller", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (getIdString(deal.seller) !== userId.toString()) {
      return res.status(403).json({
        message: "Only the seller can confirm completion.",
      });
    }

    deal.sellerConfirmed = true;

    if (deal.buyerConfirmed) {
      deal.status = "Completed";
      deal.completedAt = new Date();
    }

    await deal.save();

    res.json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to confirm completion.",
    });
  }
});

/* ======================================================
   GET MESSAGES
====================================================== */

router.get("/:id/messages", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({
        message: "Not allowed.",
      });
    }

    const messages = await Message.find({
      dealId: deal._id,
    })
      .populate("senderId", "fullName email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch messages.",
    });
  }
});

/* ======================================================
   SEND MESSAGE
====================================================== */

router.post("/:id/messages", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({
        message: "Not allowed.",
      });
    }

    const message = await Message.create({
      dealId: deal._id,
      senderId: userId,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "fullName email role");

    req.app.get("io")
      .to(deal._id.toString())
      .emit("newMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to send message.",
    });
  }
});

/* ======================================================
   DELETE DEAL
====================================================== */

router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({
        message: "Not allowed.",
      });
    }

    if (deal.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending transactions can be deleted.",
      });
    }

    await Deal.findByIdAndDelete(req.params.id);

    res.json({
      message: "Transaction deleted.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete transaction.",
    });
  }
});

module.exports = router;