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

const groupBy = (array, keyFn) => {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + item.totalAmount;
    return acc;
  }, {});
};

const AdminOrdersWithChart = () => {
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [period, setPeriod] = useState("daily");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(apis().order, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchOrders();
  }, []);

  // Fetch category sales
  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        const res = await fetch(apis().order + "/category-sales", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch category sales");
        const data = await res.json();
        setCategoryData(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchCategorySales();
  }, []);

  // Process chart data
  useEffect(() => {
    if (!orders.length) return;

    // Sales over time
    const groupedSales = groupBy(orders, (o) => {
      const date = new Date(o.createdAt);
      if (period === "daily") return date.toLocaleDateString();
      if (period === "monthly") return `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (period === "yearly") return date.getFullYear();
    });

    const formattedSales = Object.entries(groupedSales)
      .map(([name, value]) => ({ name, sales: value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));

    setSalesData(formattedSales);

    // Status chart
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + order.totalAmount;
      return acc;
    }, {});
    const formattedStatusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
    setStatusChartData(formattedStatusData);
  }, [orders, period]);

  return (
    <div className="container py-4">
      <Toaster />
      <div className="mb-4">
        <h2 className="fw-bold text-dark">📊 Sales Dashboard</h2>
        <p className="text-muted">Visual overview of sales, categories, and orders.</p>
      </div>

      {/* Period Selector */}
      <div className="d-flex gap-2 mb-4">
        {["daily", "monthly", "yearly"].map((p) => (
          <button
            key={p}
            className={`btn ${period === p ? "btn-primary" : "btn-outline-primary"} rounded-pill px-4`}
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Sales Over Time */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <h5 className="card-title text-secondary">📈 Sales Over Time ({period})</h5>
          {salesData.length === 0 ? (
            <p className="text-muted">No sales data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4E79A7"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Two-column charts */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-secondary">🥧 Sales by Category</h5>
              {categoryData.length === 0 ? (
                <p className="text-muted">No category data.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name} (${value.toFixed(0)})`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-secondary">📊 Orders by Status</h5>
              {statusChartData.length === 0 ? (
                <p className="text-muted">No status data.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name} (${value.toFixed(0)})`}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
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
    </div>
  );
};

export default AdminOrdersWithChart;
