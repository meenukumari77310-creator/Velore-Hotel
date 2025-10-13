import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { apis } from "../utils/apis";

const COLORS = ["#0d6efd", "#198754", "#ffc107", "#fd7e14", "#6f42c1", "#d63384", "#20c997"];

const groupBy = (array, keyFn) =>
  array.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

const AdminTableBookingsWithChart = () => {
  const [bookings, setBookings] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(apis().getBooking, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!bookings.length) return;

    let groupedBookings = {};
    if (period === "daily") {
      groupedBookings = groupBy(bookings, (b) =>
        new Date(b.date).toLocaleDateString()
      );
    } else if (period === "monthly") {
      groupedBookings = groupBy(bookings, (b) => {
        const d = new Date(b.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      });
    } else if (period === "yearly") {
      groupedBookings = groupBy(bookings, (b) => new Date(b.date).getFullYear());
    }

    const formattedLineData = Object.entries(groupedBookings)
      .map(([name, count]) => ({ name, bookings: count }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));

    setLineData(formattedLineData);

    const statusCount = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    const formattedPieData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
    }));

    setPieData(formattedPieData);
  }, [bookings, period]);

  return (
    <div style={{ padding: "1rem" }}>
      <Toaster />
      <h2 style={{ fontWeight: 700, color: "#212529", marginBottom: "1.5rem" }}>
        📋 Booking Dashboard
      </h2>

      {/* Period Selector */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["daily", "monthly", "yearly"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: period === p ? "none" : "1px solid #dee2e6",
              background: period === p ? "#0d6efd" : "#fff",
              color: period === p ? "#fff" : "#495057",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
              boxShadow:
                period === p ? "0 2px 6px rgba(0,0,0,0.15)" : "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "2rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        <h4 style={{ marginBottom: "1rem", color: "#495057", fontWeight: 600 }}>
          📈 Bookings Over Time ({period.charAt(0).toUpperCase() + period.slice(1)})
        </h4>
        {lineData.length === 0 ? (
          <p style={{ textAlign: "center", color: "#adb5bd" }}>
            No booking data available for {period}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#0d6efd"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        <h4 style={{ marginBottom: "1rem", color: "#495057", fontWeight: 600 }}>
          🥧 Bookings by Status
        </h4>
        {pieData.length === 0 ? (
          <p style={{ textAlign: "center", color: "#adb5bd" }}>
            No booking status data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name} (${value})`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminTableBookingsWithChart;
