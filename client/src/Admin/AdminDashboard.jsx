import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

import AdminOrdersWithChart from "./AdminOrdersWithChart";
import AdminTableBookingsWithChart from "./AdminBookingByChart";
import AdminEventWithChart from "./AdminEventBookingWithChart";
import AdminUserGeographyChart from "./AdminUserGeographyChart";
import RoomBookingCharts from "./AdminRoomBookingChart"; // <-- import the new chart

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("orders");

  // Dummy bookings data for RoomBookingCharts (replace with actual data)
  const bookings = [
    { id: 1, status: "Confirmed", createdAt: "2025-08-15T10:00:00Z" },
    { id: 2, status: "Pending", createdAt: "2025-08-15T12:30:00Z" },
    { id: 3, status: "Cancelled", createdAt: "2025-08-16T09:20:00Z" },
  ];

  const tabs = [
    { key: "orders", label: "Orders" },
    { key: "bookings", label: "Table Bookings" },
    { key: "roomBookings", label: "Room Bookings" },
    { key: "events", label: "Event Bookings" },
    { key: "geography", label: "User Geography" },
  ];

  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#212529" }}>
          Admin Dashboard
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <label
            htmlFor="date-picker"
            style={{ fontWeight: 500, fontSize: "0.9rem" }}
          >
            Date:
          </label>
          <DatePicker
            id="date-picker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </div>
      </header>

      {/* Tabs */}
      <nav
        style={{
          display: "flex",
          gap: "2rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: "none",
              border: "none",
              padding: "0.75rem 0",
              fontWeight: activeTab === tab.key ? 600 : 500,
              fontSize: "1rem",
              color: activeTab === tab.key ? "#0d6efd" : "#495057",
              borderBottom:
                activeTab === tab.key
                  ? "3px solid #0d6efd"
                  : "3px solid transparent",
              cursor: "pointer",
              transition: "color 0.2s ease, border-color 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <section
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          minHeight: "500px",
        }}
      >
        {activeTab === "orders" && <AdminOrdersWithChart />}
        {activeTab === "bookings" && <AdminTableBookingsWithChart />}
        {activeTab === "roomBookings" && (
          <RoomBookingCharts bookings={bookings} />
        )}{" "}
        {/* <-- new tab */}
        {activeTab === "events" && <AdminEventWithChart />}
        {activeTab === "geography" && <AdminUserGeographyChart />}
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "2rem",
          textAlign: "center",
          fontSize: "0.85rem",
          color: "#868e96",
        }}
      >
        &copy; {new Date().getFullYear()} Foodie Admin. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;
