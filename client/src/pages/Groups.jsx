import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/groups?t=${Date.now()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch groups");
      }

      const fetchedGroups = data.groups || [];

      setGroups(fetchedGroups);

      const expensesData = {};

      await Promise.all(
        fetchedGroups.map(async (group) => {
          try {
            const expenseResponse = await fetch(
              `http://localhost:5000/api/expenses/group/${group._id}?t=${Date.now()}`
            );

            const expenseResult = await expenseResponse.json();

            if (expenseResponse.ok) {
              expensesData[group._id] = expenseResult.expenses || [];
            } else {
              expensesData[group._id] = [];
            }
          } catch (error) {
            console.error(
              `Error loading expenses for ${group.name}:`,
              error
            );

            expensesData[group._id] = [];
          }
        })
      );

      setGroupExpenses(expensesData);
    } catch (error) {
      console.error("Error loading groups:", error);
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDeleteGroup = async (groupId, groupName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${groupName}"?\n\nThis will also delete all expenses and payment records for this group.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingGroupId(groupId);

      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete group");
      }

      setGroups((previousGroups) =>
        previousGroups.filter((group) => group._id !== groupId)
      );

      setGroupExpenses((previousExpenses) => {
        const updatedExpenses = { ...previousExpenses };

        delete updatedExpenses[groupId];

        return updatedExpenses;
      });

      alert("Group deleted successfully!");
    } catch (error) {
      console.error("Error deleting group:", error);
      alert(`Failed to delete group: ${error.message}`);
    } finally {
      setDeletingGroupId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              SplitPay
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              My Groups
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your shared expenses and settlements.
            </p>
          </div>

          <Link
            to="/create-group"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            + Create Group
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-600">
              Loading groups...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-md">
            <p className="font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && groups.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
              +
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No groups yet
            </h2>

            <p className="mt-2 text-gray-600">
              Create your first group to start splitting expenses.
            </p>

            <Link
              to="/create-group"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Group
            </Link>
          </div>
        )}

        {/* Groups */}
        {!loading && !error && groups.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const expenses = groupExpenses[group._id] || [];

              const totalExpenses = expenses.reduce(
                (total, expense) =>
                  total + Number(expense.amount || 0),
                0
              );

              return (
                <div
                  key={group._id}
                  className="rounded-2xl bg-white p-6 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Group Header */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {group.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Manage this group
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      Active
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="mb-5 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Members
                      </p>

                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {group.members?.length || 0}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Expenses
                      </p>

                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {expenses.length}
                      </p>
                    </div>
                  </div>

                  {/* Total Expenses */}
                  <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Total Expenses
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      ₹{totalExpenses.toFixed(2)}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/group-details/${group._id}`}
                      className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Group
                    </Link>

                    <button
                      onClick={() =>
                        handleDeleteGroup(group._id, group.name)
                      }
                      disabled={deletingGroupId === group._id}
                      className="w-full rounded-lg border border-red-300 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingGroupId === group._id
                        ? "Deleting..."
                        : "Delete Group"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default Groups;