import React, { useEffect, useState } from "react";
import RoomCard from "../pages/RoomCard";
import { apis } from "../utils/apis";

function AdminBookRoom() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "",
    slug: "",
    coverImageFile: null, // ✅ renamed from imageFile
  });
  const [editingRoom, setEditingRoom] = useState(null);

  // Fetch all summaries
  const fetchRooms = () => {
    fetch(apis().getRoom, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "coverImageFile") {
      setNewRoom({ ...newRoom, coverImageFile: files[0] || null });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };

  const handleAddOrEdit = async () => {
    if (!newRoom.name.trim() || !newRoom.type.trim()) {
      alert("Please fill all required fields (Name, Type)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newRoom.name);
      formData.append("type", newRoom.type);

      // auto-generate slug from name if not provided
      const slug =
        newRoom.slug ||
        newRoom.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      formData.append("slug", slug);

      if (newRoom.coverImageFile) {
        formData.append("coverImage", newRoom.coverImageFile); // ✅ consistent with backend
      }

      const method = editingRoom ? "PUT" : "POST";
      const url = editingRoom
        ? `${apis().putRoom}/${editingRoom._id}`
        : apis().addRoom;

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      console.log("Response:", result);

      // Reset form
      setNewRoom({ name: "", type: "", slug: "", coverImageFile: null });
      setEditingRoom(null);
      fetchRooms();
    } catch (err) {
      console.error("Error adding/updating room:", err);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setNewRoom({
      name: room.name,
      type: room.type,
      slug: room.slug,
      coverImageFile: null, // user can upload new image if needed
    });
  };

  const handleDelete = (id) => {
    fetch(`${apis().deleteRoom}/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => fetchRooms())
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin - Manage Room Summaries</h1>

      {/* RoomSummary Form */}
      <div style={{ marginBottom: "20px", display: "grid", gap: "10px" }}>
        <input
          name="name"
          placeholder="Name"
          value={newRoom.name}
          onChange={handleChange}
        />
        <input
          name="type"
          placeholder="Type"
          value={newRoom.type}
          onChange={handleChange}
        />
        <input
          name="slug"
          placeholder="Slug (optional, auto-generated)"
          value={newRoom.slug}
          onChange={handleChange}
        />
        <input type="file" name="coverImageFile" onChange={handleChange} />
        <button onClick={handleAddOrEdit}>
          {editingRoom ? "Update Room" : "Add Room"}
        </button>
      </div>

      {/* Rooms Display */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminBookRoom;
