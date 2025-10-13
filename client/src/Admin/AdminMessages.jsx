import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [replyMap, setReplyMap] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(apis().adminMessages, {
          credentials: "include",
        });
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        toast.error("Failed to load messages");
      }
    };
    fetchMessages();
  }, []);

  const handleReply = async (id) => {
    const replyMessage = replyMap[id];
    if (!replyMessage.trim()) {
      return toast.error("Reply message cannot be empty");
    }

    try {
      const res = await fetch(`${apis().adminReplyMessage}/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ replyMessage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reply failed");

      toast.success("Reply sent successfully");
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, replied: true } : m))
      );
      setReplyMap((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      const res = await fetch(`${apis().deleteMessage}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success("Message deleted");
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>📬 User Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5>{msg.name}</h5>
              <p>
                <strong>Email:</strong> {msg.email}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <p>
                <small>📅 {new Date(msg.createdAt).toLocaleString()}</small>
              </p>
              {msg.replied ? (
                <p className="text-success">✅ Replied</p>
              ) : (
                <>
                  <textarea
                    className="form-control mb-2"
                    rows={3}
                    placeholder="Type your reply..."
                    value={replyMap[msg._id] || ""}
                    onChange={(e) =>
                      setReplyMap({ ...replyMap, [msg._id]: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleReply(msg._id)}
                  >
                    Send Reply
                  </button>
                </>
              )}

              {/* 🔥 Show Delete button always */}
              <button
                className="btn btn-sm btn-danger mt-2"
                onClick={() => handleDelete(msg._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMessages;
