import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Settlement() {
  const { groupId } = useParams();

  const [settlementData, setSettlementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [paidPayments, setPaidPayments] = useState([]);

  useEffect(() => {
    const fetchSettlement = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/expenses/settlement/${groupId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch settlement data");
        }

        const data = await response.json();

        setSettlementData(data);

        const paymentsResponse = await fetch(
          `http://localhost:5000/api/payments/group/${groupId}`
        );

        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();

          const completedPayments = paymentsData.payments || [];

          const completedIds = completedPayments.map((payment) => {
            return `${payment.from}-${payment.to}-${Number(
              payment.amount
            ).toFixed(2)}`;
          });

          setPaidPayments(completedIds);
        }
      } catch (error) {
        console.error(error);
        setError("Unable to load settlement details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettlement();
  }, [groupId]);

  const getPaymentId = (transaction) => {
    return `${transaction.from}-${transaction.to}-${Number(
      transaction.amount
    ).toFixed(2)}`;
  };

  const handleContinuePayment = async () => {
    if (!selectedPayment) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupId: groupId,
            from: selectedPayment.from,
            to: selectedPayment.to,
            amount: Number(selectedPayment.amount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to record payment."
        );
      }

      const paymentId = getPaymentId(selectedPayment);

      setPaidPayments((previousPayments) => {
        if (previousPayments.includes(paymentId)) {
          return previousPayments;
        }

        return [...previousPayments, paymentId];
      });

      setPaymentMessage(
        `Payment successful! ${selectedPayment.from} paid ₹${Number(
          selectedPayment.amount
        ).toFixed(2)} to ${selectedPayment.to}.`
      );

      setSelectedPayment(null);
    } catch (error) {
      console.error(error);

      setPaymentMessage(
        "Payment could not be recorded. Please try again."
      );

      setSelectedPayment(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            to={`/group-details/${groupId}`}
            className="mb-6 inline-block font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Back to Group
          </Link>

          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-lg text-gray-600">
              Loading settlement details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            to={`/group-details/${groupId}`}
            className="mb-6 inline-block font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Back to Group
          </Link>

          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-lg font-semibold text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const balances = settlementData?.balances || {};
  const transactions = settlementData?.settlements || [];
  const transactionCount = settlementData?.transactionCount || 0;

  const totalExpense = Number(
    settlementData?.totalExpense || 0
  );

  const balanceEntries = Object.entries(balances);

  const totalMembers = balanceEntries.length;

  const equalShare =
    totalMembers > 0 ? totalExpense / totalMembers : 0;

  const paidCount = transactions.filter((transaction) =>
    paidPayments.includes(getPaymentId(transaction))
  ).length;

  const allSettled =
    transactions.length > 0 &&
    paidCount === transactions.length;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <Link
          to={`/group-details/${groupId}`}
          className="mb-6 inline-block font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to Group
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">
            Smart Settlement
          </h1>

          <p className="mt-2 text-gray-600">
            SplitPay has calculated the minimum payments required to settle
            the group expenses.
          </p>
        </div>

        {/* All Settled Message */}
        {allSettled && (
          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="text-2xl font-bold text-green-700">
              🎉 All Settled!
            </p>

            <p className="mt-2 text-green-600">
              All group expenses have been settled successfully.
            </p>
          </div>
        )}

        {/* Payment Message */}
        {paymentMessage && (
          <div className="mb-8 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
            <div>
              <p
                className={`font-bold ${
                  paymentMessage.startsWith("Payment successful")
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {paymentMessage.startsWith("Payment successful")
                  ? "Payment Successful"
                  : "Payment Error"}
              </p>

              <p
                className={`mt-1 text-sm ${
                  paymentMessage.startsWith("Payment successful")
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {paymentMessage}
              </p>
            </div>

            <button
              onClick={() => setPaymentMessage("")}
              className="font-bold text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Group Members */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Group Members
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalMembers}
            </p>
          </div>

          {/* Total Expenses */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              ₹{totalExpense.toFixed(2)}
            </p>
          </div>

          {/* Average Share */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Average Share
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₹{equalShare.toFixed(2)}
            </p>
          </div>

          {/* Transactions */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-sm text-gray-500">
              Transactions Required
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {allSettled ? 0 : transactionCount}
            </p>
          </div>

        </div>

        {/* How It Works */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="text-2xl font-bold text-gray-900">
            How SplitPay Calculates Settlement
          </h2>

          <p className="mt-2 text-gray-600">
            SplitPay uses the backend Smart Settlement Algorithm to calculate
            who owes money, who should receive money, and the minimum number
            of transactions required.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-blue-50 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                1
              </div>

              <h3 className="font-bold text-gray-900">
                Calculate Balances
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                SplitPay calculates each member's net balance from the
                expenses stored in MongoDB.
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                2
              </div>

              <h3 className="font-bold text-gray-900">
                Find Debtors & Creditors
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Members who owe money are matched with members who should
                receive money.
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                3
              </div>

              <h3 className="font-bold text-gray-900">
                Minimize Payments
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                The algorithm creates the minimum number of settlement
                transactions.
              </p>
            </div>

          </div>
        </div>

        {/* Member Balances */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Member Balances
          </h2>

          <div className="space-y-3">

            {balanceEntries.map(([name, balance]) => {
              const displayBalance = allSettled ? 0 : balance;

              return (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Net balance
                    </p>
                  </div>

                  <div className="text-right">

                    <p
                      className={`font-bold ${
                        displayBalance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {displayBalance >= 0 ? "+" : "-"}₹
                      {Math.abs(displayBalance).toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-500">
                      {allSettled
                        ? "Settled"
                        : displayBalance >= 0
                        ? "Should receive"
                        : "Needs to pay"}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Settlement Plan */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Settlement Plan
            </h2>

            <p className="mt-1 text-gray-600">
              These transactions settle all outstanding balances.
            </p>

            {paidCount > 0 && !allSettled && (
              <p className="mt-2 text-sm font-semibold text-green-600">
                {paidCount} payment
                {paidCount > 1 ? "s" : ""} completed
              </p>
            )}
          </div>

          {allSettled ? (
            <div className="rounded-xl bg-green-50 p-8 text-center">
              <p className="text-xl font-bold text-green-700">
                All balances are settled!
              </p>

              <p className="mt-2 text-sm text-green-600">
                All required payments have been completed.
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="rounded-xl bg-green-50 p-6 text-center">
              <p className="text-lg font-bold text-green-700">
                All balances are settled!
              </p>

              <p className="mt-1 text-sm text-green-600">
                No payments are currently required.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {transactions.map((transaction, index) => {
                const isPaid = paidPayments.includes(
                  getPaymentId(transaction)
                );

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment {index + 1}
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {transaction.from} → {transaction.to}
                      </p>

                      {isPaid && (
                        <p className="mt-1 text-sm font-semibold text-green-600">
                          ✓ Payment completed
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4">

                      <span className="text-xl font-bold text-gray-900">
                        ₹{Number(transaction.amount).toFixed(2)}
                      </span>

                      {isPaid ? (
                        <button
                          disabled
                          className="rounded-lg bg-gray-300 px-5 py-2 font-semibold text-gray-600"
                        >
                          Paid ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedPayment(transaction);
                            setPaymentMessage("");
                          }}
                          className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
                        >
                          Pay
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>

      {/* Payment Confirmation Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-6">

          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

            <h2 className="text-2xl font-bold text-gray-900">
              Confirm Payment
            </h2>

            <p className="mt-4 text-gray-600">
              You are about to pay:
            </p>

            <div className="my-5 rounded-xl bg-gray-100 p-5 text-center">

              <p className="text-lg font-semibold text-gray-700">
                {selectedPayment.from}
              </p>

              <p className="my-2 text-2xl text-gray-400">
                ↓
              </p>

              <p className="text-lg font-semibold text-gray-700">
                {selectedPayment.to}
              </p>

              <p className="mt-4 text-3xl font-bold text-green-600">
                ₹{Number(selectedPayment.amount).toFixed(2)}
              </p>

            </div>

            <p className="text-sm text-gray-500">
              This is a simulated payment for the SplitPay project.
              No real money will be transferred.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleContinuePayment}
                className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
              >
                Confirm Payment
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Settlement;