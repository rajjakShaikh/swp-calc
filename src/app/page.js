"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";

const SWPCalculator = () => {
  const [investment, setInvestment] = useState("");
  const [withdrawal, setWithdrawal] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [showAllMonths, setShowAllMonths] = useState(false);

  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [finalValue, setFinalValue] = useState(0);
  const [monthlyReturns, setMonthlyReturns] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const investmentref = useRef("");

  const calculateSWP = () => {
    if (
      investment <= 0 ||
      withdrawal <= 0 ||
      returnRate < 0 ||
      years <= 0 ||
      years > 25
    ) {
      alert("Please enter valid values. Years should be between 1 and 25.");
      return;
    }

    setLoading(true);
    const monthlyRate = Math.pow(1 + returnRate / 100, 1 / 12) - 1;
    const totalMonths = years * 12;
    let remainingInvestment = Number(investment);
    let totalWithdrawn = 0;
    let totalEarned = 0;
    const monthlyData = [];

    for (let month = 0; month < totalMonths; month++) {
      const monthlyInterest =
        Math.floor(remainingInvestment * monthlyRate * 100) / 100;
      totalEarned += monthlyInterest;

      remainingInvestment =
        Math.floor((remainingInvestment + monthlyInterest) * 100) / 100;
      remainingInvestment =
        Math.floor((remainingInvestment - withdrawal) * 100) / 100;
      totalWithdrawn += withdrawal;

      monthlyData.push({
        month: month + 1,
        withdrawal: withdrawal,
        interest: monthlyInterest,
        balance: remainingInvestment,
      });
    }

    setTotalInvestment(investment);
    setTotalWithdrawal(Math.floor(totalWithdrawn * 100) / 100);
    setTotalEarnings(Math.floor(totalEarned * 100) / 100);
    setFinalValue(Math.floor(remainingInvestment * 100) / 100);
    setMonthlyReturns(monthlyData);
    setLoading(false);
  };

  const resetCalculator = () => {
    setInvestment(0);
    setWithdrawal(0);
    setReturnRate(0);
    setYears(0);
    setResult(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const downloadReport = () => {
    // Create workbook and worksheets
    const workbook = XLSX.utils.book_new();

    // Prepare summary data
    const summaryData = [
      ["Investment Summary"],
      ["Initial Investment", totalInvestment],
      ["Total Withdrawals", totalWithdrawal],
      ["Total Earnings", totalEarnings],
      ["Final Balance", finalValue],
      [], // Empty row for spacing
    ];

    // Prepare monthly breakdown data
    const monthlyData = [
      ["Month", "Withdrawal", "Interest Earned", "Balance"], // Headers
      ...monthlyReturns.map((row) => [
        row.month,
        row.withdrawal,
        row.interest,
        row.balance,
      ]),
    ];

    // Create worksheets
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    const monthlyWS = XLSX.utils.aoa_to_sheet(monthlyData);

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Investment Summary");
    XLSX.utils.book_append_sheet(workbook, monthlyWS, "Monthly Breakdown");

    // Save the file
    XLSX.writeFile(workbook, "SWP_Calculator_Report.xlsx");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <div className="max-w-4xl w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-md md:text-4xl font-bold text-blue-700 text-center mb-6">
          Systematic Withdrawal Plan (SWP) Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Total Investment (₹)
              </label>
              <input
                type="number"
                placeholder="Enter total investment"
                value={investment}
                ref={investmentref}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Monthly Withdrawal (₹)
              </label>
              <input
                type="number"
                placeholder="Enter monthly withdrawal"
                value={withdrawal}
                onChange={(e) => setWithdrawal(Number(e.target.value))}
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Expected Return Rate (p.a.) (%)
              </label>
              <input
                type="number"
                placeholder="Enter expected return rate"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Time Period (Years)
              </label>
              <input
                type="number"
                placeholder="Enter time period in years"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min="1"
                max="25"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 text-gray-700 shadow-sm focus:ring focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          {totalInvestment > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Investment Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Initial Investment</span>
                  <span className="font-semibold">
                    {formatCurrency(totalInvestment)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Total Withdrawals</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(totalWithdrawal)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(totalEarnings)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Final Balance</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(finalValue)}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">
                  Monthly Breakdown
                </h4>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    !showAllMonths ? "max-h-[400px]" : ""
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Withdrawal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interest Earned
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monthlyReturns.map((data) => (
                          <tr key={data.month}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {data.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              {formatCurrency(data.withdrawal)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                              {formatCurrency(data.interest)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(data.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {monthlyReturns.length > 0 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setShowAllMonths(!showAllMonths)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {showAllMonths ? (
                        <>
                          Show Less
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          Show More
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={downloadReport}
                className="mt-4 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                disabled={!monthlyReturns.length}
              >
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button
            onClick={calculateSWP}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
          <button
            onClick={resetCalculator}
            className="flex-1 bg-gray-500 text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SWPCalculator;
