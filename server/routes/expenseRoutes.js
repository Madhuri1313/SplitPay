const express = require("express");
const Expense = require("../models/ExpenseTemp");
const Group = require("../models/Group");

const router = express.Router();

console.log("UPDATED EXPENSE ROUTES LOADED");

// Get expenses for a group
router.get("/group/:groupId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      groupId: req.params.groupId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      expenses: expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch expenses.",
      error: error.message,
    });
  }
});

// Calculate smart settlement for a group
router.get("/settlement/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    const expenses = await Expense.find({
      groupId: groupId,
    });

    // Calculate total expenses
    const totalExpense = expenses.reduce((total, expense) => {
      return total + Number(expense.amount);
    }, 0);

    const balances = {};

    // Start every member with balance 0
    group.members.forEach((member) => {
      balances[member.name] = 0;
    });

    // Calculate net balances
    expenses.forEach((expense) => {
      const payer = expense.paidBy;

      // Payer should receive money
      balances[payer] =
        (balances[payer] || 0) + Number(expense.amount);

      // Each member owes their share
      expense.splitBetween.forEach((person) => {
        balances[person.name] =
          (balances[person.name] || 0) - Number(person.share);
      });
    });

    // Round balances to 2 decimal places
    Object.keys(balances).forEach((name) => {
      balances[name] = Number(balances[name].toFixed(2));
    });

    // Separate people who should receive money
    // and people who need to pay money
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([name, balance]) => {
      if (balance > 0) {
        creditors.push({
          name: name,
          amount: balance,
        });
      } else if (balance < 0) {
        debtors.push({
          name: name,
          amount: Math.abs(balance),
        });
      }
    });

    const settlements = [];

    let debtorIndex = 0;
    let creditorIndex = 0;

    // Match debtors with creditors
    while (
      debtorIndex < debtors.length &&
      creditorIndex < creditors.length
    ) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];

      const payment = Math.min(
        debtor.amount,
        creditor.amount
      );

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Number(payment.toFixed(2)),
      });

      debtor.amount = Number(
        (debtor.amount - payment).toFixed(2)
      );

      creditor.amount = Number(
        (creditor.amount - payment).toFixed(2)
      );

      if (debtor.amount === 0) {
        debtorIndex++;
      }

      if (creditor.amount === 0) {
        creditorIndex++;
      }
    }

    res.status(200).json({
      groupId: groupId,
      totalExpense: Number(totalExpense.toFixed(2)),
      balances: balances,
      settlements: settlements,
      transactionCount: settlements.length,
    });
  } catch (error) {
    console.error("Error calculating settlement:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to calculate settlement.",
      error: error.message,
    });
  }
});

// Add an expense
router.post("/", async (req, res) => {
  try {
    const {
      groupId,
      description,
      amount,
      paidBy,
      splitBetween,
    } = req.body;

    if (!groupId || !description || !amount || !paidBy) {
      return res.status(400).json({
        message: "Group, description, amount and paidBy are required.",
      });
    }

    const expense = new Expense({
      groupId: groupId,
      description: description,
      amount: Number(amount),
      paidBy: paidBy,
      splitBetween: splitBetween || [],
    });

    const savedExpense = await expense.save();

    res.status(201).json({
      message: "Expense added successfully!",
      expense: savedExpense,
    });
  } catch (error) {
    console.error("Error creating expense:");
    console.error(error.message);

    res.status(500).json({
      message: "Failed to add expense.",
      error: error.message,
    });
  }
});

module.exports = router;