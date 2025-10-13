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

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const formatDateKey = (dateStr, period) => {
  const d = new Date(dateStr);
  if (period === "daily") return d.toISOString().slice(0, 10);
  if (period === "monthly")
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (period === "yearly") return `${d.getFullYear()}`;
  return d.toISOString().slice(0, 10);
};

const groupByDateAndCategory = (array, dateKeyFn, categoryKey) => {
  const grouped = {};
  array.forEach((item) => {
    const dateKey = dateKeyFn(item.date);
    const category = item[categoryKey] || "Unknown";
    if (!grouped[dateKey]) grouped[dateKey] = {};
    grouped[dateKey][category] = (grouped[dateKey][category] || 0) + 1;
  });
  return grouped;
};

const AdminEventWithChart = () => {
  const [events, setEvents] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [lineData, setLineData] = useState([]);
  const [statusPieData, setStatusPieData] = useState([]);
  const [typePieData, setTypePieData] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(apis().adminGetEvents, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
        const uniqueTypes = [...new Set(data.map((e) => e.eventType || "Unknown"))];
        setEventTypes(uniqueTypes);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;

    const groupedByDateType = groupByDateAndCategory(
      events,
      (date) => formatDateKey(date, period),
      "eventType"
    );

    const sortedDates = Object.keys(groupedByDateType).sort();

    const lineChartData = sortedDates.map((date) => {
      const dataPoint = { name: date };
      eventTypes.forEach((type) => {
        dataPoint[type] = groupedByDateType[date][type] || 0;
      });
      return dataPoint;
    });
    setLineData(lineChartData);

    const statusCount = events.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {});
    setStatusPieData(
      Object.entries(statusCount).map(([name, value]) => ({ name, value }))
    );

    const typeCount = events.reduce((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] || 0) + 1;
      return acc;
    }, {});
    setTypePieData(
      Object.entries(typeCount).map(([name, value]) => ({ name, value }))
    );
  }, [events, period, eventTypes]);

  return (
    <div style={{ backgroundColor: "#F3F4F6", padding: "2rem", borderRadius: "12px" }}>
      <Toaster />
      <h2 style={{
        fontSize: "1.75rem",
        fontWeight: "700",
        marginBottom: "1.5rem",
        color: "#111827"
      }}>
        📋 Event Dashboard
      </h2>

      {/* Period selector */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {["daily", "monthly", "yearly"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: "999px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              background: period === p ? "linear-gradient(90deg, #4F46E5, #6366F1)" : "#fff",
              color: period === p ? "#fff" : "#374151",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease"
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gap: "2rem" }}>
        {/* Line Chart */}
        <div style={{
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>
          <h4 style={{ marginBottom: "1rem", fontWeight: "600", color: "#4B5563" }}>
            📈 Events Over Time ({period})
          </h4>
          {lineData.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9CA3AF" }}>
              No event data available for {period}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                {eventTypes.map((type, idx) => (
                  <Line
                    key={type}
                    type="monotone"
                    dataKey={type}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
          {/* Status Pie */}
          <div style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h4 style={{ marginBottom: "1rem", fontWeight: "600", color: "#4B5563" }}>
              🥧 Events by Status
            </h4>
            {statusPieData.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9CA3AF" }}>
                No event status data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={false}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Type Pie */}
          <div style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h4 style={{ marginBottom: "1rem", fontWeight: "600", color: "#4B5563" }}>
              🎂 Events by Type
            </h4>
            {typePieData.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9CA3AF" }}>
                No event type data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={false}
                  >
                    {typePieData.map((entry, index) => (
                      <Cell key={`cell-type-${index}`} fill={COLORS[index % COLORS.length]} />
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
    </div>
  );
};

export default AdminEventWithChart;
