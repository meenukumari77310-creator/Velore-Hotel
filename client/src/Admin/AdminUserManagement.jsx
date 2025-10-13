import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { apis } from "../utils/apis";

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().adminGetUsers, {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Could not load user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (id) => {
    if (!window.confirm("Are you sure you want to ban/unban this user?")) return;
    setActionId(id);
    try {
      const res = await fetch(apis().adminToggleUserBan(id), {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error("Ban/unban error:", err);
      alert("Failed to update user ban status.");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionId(id);
    try {
      const res = await fetch(apis().adminDeleteUser(id), {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      alert(data.message);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">👥 User Management</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.platform}</td>
                <td>
                  {u.isBanned ? (
                    <span className="text-danger">Banned</span>
                  ) : (
                    <span className="text-success">Active</span>
                  )}
                </td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant={u.isBanned ? "success" : "warning"}
                    size="sm"
                    className="me-2"
                    disabled={actionId === u._id}
                    onClick={() => handleToggleBan(u._id)}
                  >
                    {actionId === u._id
                      ? "Processing..."
                      : u.isBanned
                      ? "Unban"
                      : "Ban"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={actionId === u._id}
                    onClick={() => handleDelete(u._id)}
                  >
                    {actionId === u._id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
