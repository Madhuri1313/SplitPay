import { useState } from "react";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setLoading(true);
    setMessage("");

    const memberNames = members
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    const memberData = memberNames.map((name) => ({
      name: name,
    }));

    try {
      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName.trim(),
          members: memberData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create group");
      }

      setMessage("Group created successfully!");
      setGroupName("");
      setMembers("");
    } catch (error) {
      console.error("Error creating group:", error);
      setMessage("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Create a Group
        </h1>

        <label className="block text-gray-700 mb-2">
          Group Name
        </label>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g. Goa Trip"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-gray-700 mb-2">
          Members
        </label>

        <input
          type="text"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          placeholder="e.g. Madhuri, Anjali, Rahul"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleCreateGroup}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>

        {message && (
          <p className="text-center text-green-600 font-medium mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateGroup;