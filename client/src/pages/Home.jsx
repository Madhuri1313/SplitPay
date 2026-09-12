import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-12">
      <div className="mx-auto w-full max-w-6xl">

        {/* Hero Section */}
        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm md:px-12">

          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-600">
              Smart Group Payments
            </p>

            <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Split expenses.
              <br />
              <span className="text-blue-600">
                Minimize transactions.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              SplitPay makes group expenses simple by calculating everyone's
              share, optimizing settlements, and helping groups settle
              payments easily.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

              <button
                onClick={() => navigate("/create-group")}
                className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Create a Group
              </button>

              <button
                onClick={() => navigate("/groups")}
                className="rounded-lg border border-gray-300 bg-white px-7 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                View Groups
              </button>

            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-600">
              1
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Easy Splitting
            </h2>

            <p className="mt-3 leading-7 text-gray-500">
              Add shared expenses and automatically calculate how much
              everyone owes.
            </p>

          </div>

          <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl font-bold text-purple-600">
              2
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Smart Settlement
            </h2>

            <p className="mt-3 leading-7 text-gray-500">
              Our settlement algorithm reduces unnecessary transactions and
              finds a simpler way to settle expenses.
            </p>

          </div>

          <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl font-bold text-green-600">
              3
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Simple Payments
            </h2>

            <p className="mt-3 leading-7 text-gray-500">
              Track settlement payments and clearly see which group expenses
              have been completed.
            </p>

          </div>

        </div>

        {/* Bottom Message */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Split smarter. Settle faster.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Home;