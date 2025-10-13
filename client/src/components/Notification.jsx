import React, { useEffect, useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { apis } from "../utils/apis";
import PayNowButton from "../ui/PayNowButton";

const NotificationDropdown = ({ email }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!email) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(apis().getNotifications(email), {
          credentials: "include",
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Notification fetch failed", err);
      }
    };

    fetchNotifications();
  }, [email]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const handleDeleteOne = async (id) => {
    try {
      await fetch(apis().deleteNotification(id), {
        method: "DELETE",
        credentials: "include",
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch(`${apis().deleteAllNotifications}?email=${email}`, {
        method: "DELETE",
        credentials: "include",
      });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  return (
    <div className="position-relative">
      {/* Bell Icon */}
      <div
        className="position-relative text-light"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ cursor: "pointer" }}
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="position-absolute end-0 mt-3 bg-white shadow-lg p-3 rounded-4 border border-light-subtle"
          style={{
            zIndex: 1000,
            width: 380,
            maxHeight: 420,
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">🔔 Notifications</h6>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              Clear All
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted">No notifications yet.</p>
          ) : (
            <ul className="list-unstyled mb-0">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`d-flex justify-content-between align-items-start p-2 mb-2 rounded-3 border-start
                    ${
                      n.status === "unread"
                        ? "bg-light fw-semibold"
                        : "text-muted"
                    }
                    ${
                      n.type === "success" ? "border-success" : "border-danger"
                    }`}
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="w-100">
                    <div className="small text-primary mb-1">
                      {n.source === "event" ? "📅 Event" : "🍽️ Table"}
                    </div>
                    <div>{n.message}</div>
                    {n.source === "event" &&
                      n.status === "confirmed" &&
                      n.bookingId &&
                      n.email &&
                      n.amount && (
                        <PayNowButton
                          bookingId={n.bookingId}
                          email={n.email}
                          amount={n.amount}
                        />
                      )}
                    <div className="text-muted small mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <FaTimes
                    size={14}
                    className="text-danger ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteOne(n._id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
