import React, { useEffect, useState } from "react";
import { Button, Table, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { apis } from "../utils/apis";

const AdminTeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    email: "",
    linkedin: "",
    twitter: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!showModal) return;

    if (editId && teams.length > 0) {
      const member = teams.find((m) => m._id === editId);
      if (member) {
        setFormData({
          name: member.name || "",
          role: member.role || "",
          bio: member.bio || "",
          email: member.email || "",
          linkedin: member.linkedin || "",
          twitter: member.twitter || "",
          image: null,
        });
      }
    } else {
      // Reset form when adding
      setFormData({
        name: "",
        role: "",
        bio: "",
        email: "",
        linkedin: "",
        twitter: "",
        image: null,
      });
    }
  }, [editId, showModal, teams]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch(apis().adminTeam, {
        credentials: "include",
      });
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch team members");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    const url = editId ? apis().adminUpdateTeam(editId) : apis().adminCreateTeam;
    const method = editId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        body: data,
        credentials: "include",
      });

      toast.success(editId ? "Team member updated" : "Team member added");
      fetchTeams();
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
      await fetch(apis().adminDeleteTeam(id), {
        method: "DELETE",
        credentials: "include",
      });
      toast.success("Team member deleted");
      fetchTeams();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (member) => {
    setEditId(member._id);
    setShowModal(true);
  };

  const handleClose = () => {
    setEditId(null);
    setShowModal(false);
    setFormData({
      name: "",
      role: "",
      bio: "",
      email: "",
      linkedin: "",
      twitter: "",
      image: null,
    });
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">🧑‍🤝‍🧑 Team Management</h3>
      <Button onClick={() => setShowModal(true)} className="mb-3">
        Add Team Member
      </Button>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>LinkedIn</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td>{member.email}</td>
              <td>
                {member.linkedin ? (
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    View
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                )}
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(member._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Team Member" : "Add Team Member"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["name", "role", "email", "linkedin", "twitter"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTeamManagement;
