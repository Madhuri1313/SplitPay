const express = require("express");
const Group = require("../models/Group");
const Expense = require("../models/ExpenseTemp");
const Payment = require("../models/Payment");

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({
    message: "Group routes are working!",
  });
});

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });

    res.status(200).json({
      groups: groups,
    });
  } catch (error) {
    console.error("Error fetching groups:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch groups.",
      error: error.message,
    });
  }
});

// Get one group by ID
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    res.status(200).json({
      group: group,
    });
  } catch (error) {
    console.error("Error fetching group:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch group.",
      error: error.message,
    });
  }
});

// Add member to a group
router.post("/:id/members", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Member name is required.",
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    group.members.push({
      name: name.trim(),
    });

    const updatedGroup = await group.save();

    res.status(200).json({
      message: "Member added successfully!",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Error adding member:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to add member.",
      error: error.message,
    });
  }
});

// Create a group
router.post("/", async (req, res) => {
  try {
    console.log("POST /api/groups received");
    console.log(req.body);

    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Group name is required.",
      });
    }

    const group = new Group({
      name: name,
      members: members || [],
    });

    const savedGroup = await group.save();

    res.status(201).json({
      message: "Group created successfully!",
      group: savedGroup,
    });
  } catch (error) {
    console.error("Error creating group:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to create group.",
      error: error.message,
    });
  }
});

// Delete a group
router.delete("/:id", async (req, res) => {
  try {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    // Delete the group
    await Group.findByIdAndDelete(groupId);

    // Delete all expenses belonging to the group
    await Expense.deleteMany({
      groupId: groupId,
    });

    // Delete all payments belonging to the group
    await Payment.deleteMany({
      groupId: groupId,
    });

    res.status(200).json({
      message: "Group and related data deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting group:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to delete group.",
      error: error.message,
    });
  }
});

module.exports = router;