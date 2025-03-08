import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./styling-sheet/ReportsPage.css"; // Import new styles

const ReportsPage = () => {
  const [reportType, setReportType] = useState("yearly");
  const [reportData, setReportData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [reportType, year, month]);

  const fetchReport = async () => {
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    let url = `https://finance-web-zdgx.onrender.com/reports/${reportType}?year=${year}`;
    if (reportType === "monthly") {
      url += `&month=${month}`;
    }

    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error("❌ Error fetching report:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Chart Data Preparation
  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [reportData.totalIncome || 0, reportData.totalExpense || 0],
        backgroundColor: ["#114B7F", "#002B45"], // Green for income, Red for expense
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom width & height
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  
  return (
    <div className="report-container">
      <h2 className="report-title">📊 Financial Reports</h2>
  
      {/* Report Filters */}
      <div className="filters">
        <div className="filter-group">
          <label> Report Type:</label>
          <select onChange={(e) => setReportType(e.target.value)} value={reportType}>
            <option value="yearly">Yearly Report</option>
            <option value="monthly">Monthly Report</option>
          </select>
        </div>
  
        <div className="filter-group">
          <label> Chart Type:</label>
          <select onChange={(e) => setChartType(e.target.value)} value={chartType}>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
  
        <div className="filter-group">
          <label> Year:</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
  
        {reportType === "monthly" && (
          <div className="filter-group">
            <label> Month:</label>
            <input type="number" value={month} min="1" max="12" onChange={(e) => setMonth(e.target.value)} />
          </div>
        )}
      </div>
  
      {/* Display Chart */}
      <div className="chart-container">
        {loading ? (
          <p className="loading-text">🔄 Loading report data...</p>
        ) : error ? (
          <p className="error-text">⚠️ {error}</p>
        ) : chartType === "bar" ? (
          <Bar data={chartData} />
        ) : (
          <div className="pie-chart-container">
            <Pie data={chartData} options={pieOptions} />
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ReportsPage;
