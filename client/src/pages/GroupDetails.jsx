import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlementData, setSettlementData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [memberName, setMemberName] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}?t=${Date.now()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load group");
      }

      setGroup(data.group);
    } catch (error) {
      console.error("Error loading group:", error);
      setError("Failed to load group.");
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/group/${groupId}?t=${Date.now()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load expenses");
      }

      setExpenses(data.expenses || []);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const fetchSettlement = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/expenses/settlement/${groupId}?t=${Date.now()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load settlement");
      }

      setSettlementData(data);
    } catch (error) {
      console.error("Error loading settlement:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/group/${groupId}?t=${Date.now()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load payments");
      }

      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error loading payments:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchGroup(),
        fetchExpenses(),
        fetchSettlement(),
        fetchPayments(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [groupId]);

  const handleAddMember = async () => {
    const name = memberName.trim();

    if (!name) {
      alert("Please enter a member name.");
      return;
    }

    try {
      setAddingMember(true);

      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add member");
      }

      setGroup(data.group);
      setMemberName("");

      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member.");
    } finally {
      setAddingMember(false);
    }
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const transactions = settlementData?.settlements || [];

  const paidPaymentIds = payments.map((payment) => {
    return `${payment.from}-${payment.to}-${Number(payment.amount).toFixed(2)}`;
  });

  const getPaymentId = (transaction) => {
    return `${transaction.from}-${transaction.to}-${Number(
      transaction.amount
    ).toFixed(2)}`;
  };

  const paidTransactionCount = transactions.filter((transaction) =>
    paidPaymentIds.includes(getPaymentId(transaction))
  ).length;

  const pendingTransactions = transactions.filter(
    (transaction) => !paidPaymentIds.includes(getPaymentId(transaction))
  );

  const pendingTransactionCount = pendingTransactions.length;

  const pendingSettlement = pendingTransactions.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  );

  const allSettled =
    transactions.length > 0 &&
    paidTransactionCount === transactions.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 text-center shadow-md">
          <p className="text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/groups"
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Back to Groups
          </Link>

          <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="text-red-600">
              {error || "Group not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <Link
          to="/groups"
          className="mb-6 inline-block font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to Groups
        </Link>

        {/* Group Header */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {group.name}
              </h1>

              <p className="mt-2 text-gray-600">
                Manage members, expenses and settlements.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                allSettled
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {allSettled ? "Settled" : "Active"}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Members
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {group.members?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₹{totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Pending Settlement
            </p>

            <p
              className={`mt-2 text-3xl font-bold ${
                pendingSettlement > 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              ₹{pendingSettlement.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Members */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Members
            </h2>

            <p className="mt-1 text-gray-600">
              People included in this group.
            </p>
          </div>

          {/* Add Member Form */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={memberName}
              onChange={(event) => setMemberName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddMember();
                }
              }}
              placeholder="Enter member name"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />

            <button
              onClick={handleAddMember}
              disabled={addingMember}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addingMember ? "Adding..." : "+ Add Member"}
            </button>
          </div>

          {group.members?.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {group.members.map((member, index) => (
                <div
                  key={member._id || index}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>

                  <h3 className="font-bold text-gray-900">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {index === 0 ? "Group Admin" : "Member"}
                  </p>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-500">
              No members added yet.
            </p>
          )}
        </div>

        {/* Expenses */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Expenses
              </h2>

              <p className="mt-1 text-gray-600">
                Shared expenses added to this group.
              </p>
            </div>

            <Link
              to={`/add-expense/${groupId}`}
              className="rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              + Add Expense
            </Link>
          </div>

          {expenses.length > 0 ? (
            <div className="space-y-4">

              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {expense.description}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Paid by {expense.paidBy}
                      </p>
                    </div>

                    <p className="text-2xl font-bold text-gray-900">
                      ₹{Number(expense.amount).toFixed(2)}
                    </p>

                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">

                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      Split between
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {expense.splitBetween?.map((person, index) => (
                        <span
                          key={person._id || index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                        >
                          {person.name}: ₹
                          {Number(person.share).toFixed(2)}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-gray-500">
                No expenses added yet.
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Add an expense to start calculating settlements.
              </p>
            </div>
          )}

        </div>

        {/* Settlement */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Smart Settlement
            </h2>

            <p className="mt-1 text-gray-600">
              SplitPay calculates the simplest way to settle the group.
            </p>
          </div>

          <div
            className={`mb-6 rounded-xl p-5 ${
              allSettled
                ? "bg-green-50"
                : "bg-blue-50"
            }`}
          >
            <p
              className={`font-semibold ${
                allSettled
                  ? "text-green-800"
                  : "text-blue-800"
              }`}
            >
              {allSettled
                ? "All payments completed"
                : "Optimized Settlement Plan"}
            </p>

            <p
              className={`mt-1 text-sm ${
                allSettled
                  ? "text-green-700"
                  : "text-blue-700"
              }`}
            >
              {allSettled
                ? "All group expenses have been settled successfully."
                : "SplitPay has calculated the minimum payments needed to settle the group."}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pending transactions
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {pendingTransactionCount}{" "}
                {pendingTransactionCount === 1
                  ? "payment"
                  : "payments"}
              </p>
            </div>

            <Link
              to={`/settlement/${groupId}`}
              className="rounded-lg bg-green-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-green-700"
            >
              View Settlement
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default GroupDetails;