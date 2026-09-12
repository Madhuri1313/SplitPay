import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AddExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingExpense, setAddingExpense] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  useEffect(() => {
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

        if (data.group.members?.length > 0) {
          setPaidBy(data.group.members[0].name);
        }
      } catch (error) {
        console.error("Error loading group:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const members = group?.members || [];

  const share =
    amount && Number(amount) > 0 && members.length > 0
      ? (Number(amount) / members.length).toFixed(2)
      : "0.00";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim() || !amount || !paidBy) {
      alert("Please fill in all fields.");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    if (members.length === 0) {
      alert("This group has no members.");
      return;
    }

    try {
      setAddingExpense(true);

      const response = await fetch(
        "http://localhost:5000/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupId: groupId,
            description: description.trim(),
            amount: Number(amount),
            paidBy: paidBy,
            splitBetween: members.map((member) => ({
              name: member.name,
              share: Number(share),
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add expense");
      }

      alert(
        `Expense "${description}" of ₹${amount} added successfully!\n\nEach member owes ₹${share}.`
      );

      navigate(`/group-details/${groupId}`);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert(`Failed to add expense: ${error.message}`);
    } finally {
      setAddingExpense(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-md">
          <p className="text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-md">
          <p className="text-red-600">Group not found.</p>

          <Link
            to="/groups"
            className="mt-4 inline-block font-semibold text-blue-600"
          >
            ← Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-2xl">

        <Link
          to={`/group-details/${groupId}`}
          className="mb-6 inline-block font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to {group.name}
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-md">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Add Expense
            </h1>

            <p className="mt-2 text-gray-600">
              Add a shared expense to the{" "}
              <span className="font-semibold">{group.name}</span> group.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block font-semibold text-gray-700"
              >
                Expense Description
              </label>

              <input
                id="description"
                type="text"
                placeholder="Example: Dinner"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block font-semibold text-gray-700"
              >
                Amount
              </label>

              <input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="Example: 2500"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setAmount(value);
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Paid By */}
            <div>
              <label
                htmlFor="paidBy"
                className="mb-2 block font-semibold text-gray-700"
              >
                Paid By
              </label>

              <select
                id="paidBy"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {members.map((member) => (
                  <option key={member._id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Equal Split */}
            <div className="rounded-xl bg-blue-50 p-5">
              <p className="font-semibold text-blue-800">
                Equal Split
              </p>

              <p className="mt-1 text-sm text-blue-700">
                This expense will be divided equally among all{" "}
                {members.length} members.
              </p>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-4">
                <span className="font-semibold text-gray-700">
                  Each member owes
                </span>

                <span className="text-xl font-bold text-blue-700">
                  ₹{share}
                </span>
              </div>
            </div>

            {/* Split Between */}
            <div>
              <h2 className="mb-3 font-bold text-gray-900">
                Split Between
              </h2>

              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <span className="text-gray-700">
                      {member.name}
                    </span>

                    <span className="font-semibold text-gray-900">
                      ₹{share}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                disabled={addingExpense}
                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addingExpense ? "Adding Expense..." : "Add Expense"}
              </button>

              <Link
                to={`/group-details/${groupId}`}
                className="flex-1 rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;