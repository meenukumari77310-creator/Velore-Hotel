// RoomBookingCharts.js
import React, { useEffect, useState, useMemo } from "react";
import { apis } from "../utils/apis";
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
import "bootstrap/dist/css/bootstrap.min.css";

const COLORS = [
  "#4E79A7",
  "#F28E2B",
  "#E15759",
  "#76B7B2",
  "#59A14F",
  "#EDC948",
  "#B07AA1",
];

// Utility: group values
const groupBy = (array, keyFn, valueFn) => {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    const value = valueFn(item);
    acc[key] = (acc[key] || 0) + value;
    return acc;
  }, {});
};

const RoomBookingCharts = () => {
  const [bookings, setBookings] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);

  // Fetch bookings directly here
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().getAllRoomBookings, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Bookings over time
  const bookingsOverTime = useMemo(() => {
    if (!bookings.length) return [];
    const grouped = groupBy(
      bookings,
      (b) => {
        const date = new Date(b.createdAt);
        if (period === "daily") return date.toLocaleDateString();
        if (period === "monthly")
          return `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (period === "yearly") return date.getFullYear();
      },
      () => 1
    );

    return Object.entries(grouped)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));
  }, [bookings, period]);

  // Bookings by status
  const statusData = useMemo(() => {
    const grouped = groupBy(bookings, (b) => b.status, () => 1);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  // Earnings by room
  const earningsData = useMemo(() => {
    const grouped = groupBy(
      bookings,
      (b) => b.room?.roomSummary?.name || "Unassigned",
      (b) => b.room?.price || 0
    );
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  if (loading) return <p>Loading charts...</p>;

  return (
    <div className="container py-4">
      <Toaster />
      <div className="mb-4">
        <h2 className="fw-bold text-dark">🏨 Room Bookings Dashboard</h2>
        <p className="text-muted">Visual overview of room bookings and earnings.</p>
      </div>

      {/* Period Selector */}
      <div className="d-flex gap-2 mb-4">
        {["daily", "monthly", "yearly"].map((p) => (
          <button
            key={p}
            className={`btn ${
              period === p ? "btn-primary" : "btn-outline-primary"
            } rounded-pill px-4`}
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Over Time (first row) */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <h5 className="card-title text-secondary">
            📈 Bookings Over Time ({period})
          </h5>
          {bookingsOverTime.length === 0 ? (
            <p className="text-muted">No bookings data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4E79A7"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pie Charts (second row) */}
      <div className="row g-4">
        {/* Bookings by Status */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-secondary">📊 Bookings by Status</h5>
              {statusData.length === 0 ? (
                <p className="text-muted">No status data.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name} (${value})`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-status-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Earnings by Room */}
        <div className="col-lg-6 col-md-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-secondary">💰 Earnings by Room</h5>
              {earningsData.length === 0 ? (
                <p className="text-muted">No earnings data.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={earningsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name} ($${value})`}
                    >
                      {earningsData.map((entry, index) => (
                        <Cell
                          key={`cell-earnings-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingCharts;
