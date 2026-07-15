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
  if (!deal || !userId || !deal.buyer || !deal.seller) return false;

  return (
    getIdString(deal.buyer) === userId.toString() ||
    getIdString(deal.seller) === userId.toString()
  );
};

router.post("/", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { sellerId, title, amount, platform } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    if (!sellerId || !title) {
      return res.status(400).json({ message: "Seller and title are required" });
    }

    if (sellerId.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot start a transaction with yourself",
      });
    }

    // Check if a deal already exists between this buyer and seller
    const existingDeal = await Deal.findOne({
      buyer: userId,
      seller: sellerId,
      status: { $nin: ["completed", "cancelled"] }, // allow new deal if old one is done
    });

    if (existingDeal) {
      return res.status(200).json(existingDeal); // return the existing one instead
    }

    const deal = await Deal.create({
      buyer: userId,
      seller: sellerId,
      title,
      amount,
      platform,
    });

    res.status(201).json(deal);
  } catch (err) {
    console.log("CREATE DEAL ERROR:", err);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const deals = await Deal.find({
      $or: [{ buyer: userId }, { seller: userId }],
      deletedBy: { $nin: [userId] },
    })
      .populate("buyer", "fullName email role")
      .populate("seller", "fullName email role")
      .sort({ updatedAt: -1 });

    res.json(deals);
  } catch (err) {
    console.log("FETCH DEALS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const deal = await Deal.findById(req.params.id)
      .populate("buyer", "fullName email role")
      .populate("seller", "fullName email role");

    if (!deal) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(deal);
  } catch (err) {
    console.log("FETCH DEAL ERROR:", err);
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
});

router.patch("/:id/status", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const allowedStatuses = [
      "pending",
      "accepted",
      "payment_sent",
      "delivered",
      "completed",
      "cancelled",
      "disputed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid transaction status" });
    }

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const buyerId = getIdString(deal.buyer);
    const sellerId = getIdString(deal.seller);
    const currentUserId = userId.toString();

    if (status === "delivered" && sellerId !== currentUserId) {
      return res.status(403).json({ message: "Only seller can mark delivered" });
    }

    if (status === "completed" && buyerId !== currentUserId) {
      return res.status(403).json({
        message: "Only buyer can complete transaction",
      });
    }

    deal.status = status;

    if (status === "delivered") {
      deal.sellerConfirmed = true;
    }

    if (status === "completed") {
      deal.completedAt = new Date();
      deal.buyerConfirmed = true;
    }

    await deal.save();

    const updatedDeal = await Deal.findById(deal._id)
      .populate("buyer", "name email role")
      .populate("seller", "name email role");

    res.json(updatedDeal);
  } catch (err) {
    console.log("UPDATE DEAL ERROR:", err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

router.get("/:id/messages", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await Message.find({ dealId: deal._id })
      .populate("senderId", "fullName email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log("FETCH MESSAGES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

router.post("/:id/messages", protect, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { text } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const message = await Message.create({
      dealId: deal._id,
      senderId: userId,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id).populate("senderId", "fullName email role");

    req.app.get("io").to(deal._id.toString()).emit("newMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.log("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Add this DELETE route
router.delete("/:id", protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!isDealMember(deal, userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Only allow deletion if deal is still pending
    if (deal.status !== "pending") {
      return res.status(400).json({
        message: "Only pending transactions can be deleted"
      });
    }

    await Deal.findByIdAndDelete(req.params.id);

    if (!deal.deletedBy.map(id => id.toString()).includes(userId.toString())) {
      deal.deletedBy.push(userId);
      await deal.save();
    }

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.log("DELETE DEAL ERROR:", err);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

module.exports = router;