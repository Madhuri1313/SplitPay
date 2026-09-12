import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          SplitPay
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2">

          <Link
            to="/"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isActive("/")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            Home
          </Link>

          <Link
            to="/groups"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isActive("/groups")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            Groups
          </Link>

          <Link
            to="/create-group"
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              isActive("/create-group")
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            Create Group
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;