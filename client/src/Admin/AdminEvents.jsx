import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apis } from "../utils/apis";
import EventCalendar from "../pages/EventCalendar";
import AdminEventSettings from "./AdminEventSetting";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventSettings, setEventSettings] = useState({});

  const fetchEventsAndSettings = async () => {
    try {
      // Fetch events
      const eventRes = await fetch(apis().adminGetEvents, {
        credentials: "include",
      });
      const eventData = await eventRes.json();
      setEvents(eventData);

      // Fetch settings
      const settingsRes = await fetch(apis().adminGetEventSettings(), {
        credentials: "include",
      });
      const settingsData = await settingsRes.json();

      // Map settings by eventType
      const settingsMap = {};
      settingsData.forEach((s) => {
        settingsMap[s.eventType] = s;
      });
      setEventSettings(settingsMap);
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(apis().adminUpdateEvent(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setEvents((prev) =>
        prev.map((e) => (e._id === updated._id ? updated : e))
      );
      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetch(apis().adminDeleteEvent(id), {
        method: "DELETE",
        credentials: "include",
      });
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filterEvents = () => {
    return events.filter((e) => {
      const statusMatch = filterStatus === "all" || e.status === filterStatus;

      const eventDate = new Date(e.date).setHours(0, 0, 0, 0);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

      const dateMatch =
        (!start || eventDate >= start) && (!end || eventDate <= end);

      return statusMatch && dateMatch;
    });
  };

  const downloadCSV = () => {
    const filtered = filterEvents();

    if (filtered.length === 0) {
      toast.error("No events match the filters.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Event Type",
      "Date",
      "Time",
      "Amount",
      "Guests",
      "Country",
      "Address",
      "Status",
    ];
    const rows = filtered.map((e) => [
      e.name,
      e.email,
      e.eventType,
      e.date,
      getTimeSlotLabel(e),
      e.amount,
      e.guests,
      e.country || "N/A",
      e.address || "N/A",
      e.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "filtered_events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to match booking time to slot name
  const getTimeSlotLabel = (booking) => {
    const settings = eventSettings[booking.eventType];
    if (!settings?.timeSlots) return booking.time;
    const slot = settings.timeSlots.find((s) => s.start === booking.time);
    return slot
      ? `${slot.name} (${slot.start} - ${slot.end})`
      : booking.time;
  };

  useEffect(() => {
    fetchEventsAndSettings();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📋 Admin Event Dashboard</h2>

      {/* Filters Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            {/* Status Filter */}
            <div className="col-md-3">
              <label className="form-label">Filter by Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            {/* From Date */}
            <div className="col-md-3">
              <label className="form-label">From Date (Start)</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="col-md-3">
              <label className="form-label">To Date (End)</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Download Button */}
            <div className="col-md-3 text-end">
              <button className="btn btn-primary w-100" onClick={downloadCSV}>
                ⬇ Download CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 d-flex gap-2">
        <button
          className={`btn ${
            activeTab === "requests" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          📝 View Event Requests
        </button>
        <button
          className={`btn ${
            activeTab === "calendar" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setActiveTab("calendar")}
        >
          📅 View Event Calendar
        </button>
        <button
          className={`btn ${
            activeTab === "settings" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Event Settings
        </button>
      </div>

      {/* Conditional Content */}
      {activeTab === "calendar" && <EventCalendar events={events} />}
      {activeTab === "settings" && <AdminEventSettings />}
      {activeTab === "requests" && (
        <>
          {events.length === 0 ? (
            <p>No event requests yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Amount</th>
                    <th>Guests</th>
                    <th>Country</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Change</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filterEvents().map((e) => (
                    <tr key={e._id}>
                      <td>{e.name}</td>
                      <td>{e.email}</td>
                      <td>{e.eventType}</td>
                      <td>{e.date}</td>
                      <td>{getTimeSlotLabel(e)}</td>
                      <td>₹{e.amount}</td>
                      <td>{e.guests}</td>
                      <td>{e.country || "N/A"}</td>
                      <td>{e.address || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            e.status === "confirmed"
                              ? "bg-success"
                              : e.status === "declined"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={e.status}
                          onChange={(ev) =>
                            updateStatus(e._id, ev.target.value)
                          }
                          className="form-select form-select-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteEvent(e._id)}
                          className="btn btn-sm btn-danger"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEvents;
