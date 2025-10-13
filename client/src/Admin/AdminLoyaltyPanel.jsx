import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const AdminLoyaltyPanel = () => {
  const [config, setConfig] = useState({ pointsPerCurrencyUnit: 10 });
  const [editValue, setEditValue] = useState(config.pointsPerCurrencyUnit);
  const [users, setUsers] = useState([]);

  const fetchConfig = async () => {
    try {
      const res = await fetch(apis().getloyaltyConfig, { credentials: "include" });
      const data = await res.json();
      setConfig(data);
      setEditValue(data.pointsPerCurrencyUnit);
    } catch {
      toast.error("Failed to fetch loyalty config");
    }
  };

  const updateConfig = async () => {
    try {
      const res = await fetch(apis().updateLoyaltyConfig, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pointsPerCurrencyUnit: Number(editValue) }),
      });

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setConfig(data);
      toast.success("Loyalty config updated");
    } catch {
      toast.error("Failed to update config");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(apis().adminUsersWithPoints(), {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Failed to load user points");
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="card p-3 mb-4">
        <h5>🎛️ Loyalty Discount Settings</h5>
        <div className="d-flex align-items-center">
          <span>🎯 Points required for ₹1 discount:</span>
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="form-control mx-2"
            style={{ width: 100 }}
          />
          <button onClick={updateConfig} className="btn btn-sm btn-success">Save</button>
        </div>
      </div>

      <div className="card p-3">
        <h5>👥 Users & Loyalty Points</h5>
        <table className="table table-bordered table-sm mt-2">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.loyaltyPoints}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLoyaltyPanel;
