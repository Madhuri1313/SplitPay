const express = require("express");
const Payment = require("../models/Payment");

const router = express.Router();

// Get all payments for a group
router.get("/group/:groupId", async (req, res) => {
  try {
    const payments = await Payment.find({
      groupId: req.params.groupId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      payments: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch payments.",
      error: error.message,
    });
  }
});

// Record a completed payment
router.post("/", async (req, res) => {
  try {
    const {
      groupId,
      from,
      to,
      amount,
    } = req.body;

    if (!groupId || !from || !to || !amount) {
      return res.status(400).json({
        message: "Group, from, to and amount are required.",
      });
    }

    const payment = new Payment({
      groupId: groupId,
      from: from,
      to: to,
      amount: Number(amount),
      status: "paid",
      paidAt: new Date(),
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      message: "Payment recorded successfully!",
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Error recording payment:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to record payment.",
      error: error.message,
    });
  }
});

module.exports = router;