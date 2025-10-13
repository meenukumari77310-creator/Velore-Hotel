import React from "react";

function RoomCard({ room, onEdit, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "300px",
        overflow: "hidden",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {room.coverImage && ( // ✅ changed from room.image
        <img
          src={room.coverImage}
          alt={room.name}
          style={{ width: "100%", height: "180px", objectFit: "cover" }}
        />
      )}
      <div style={{ padding: "15px", flex: "1" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>{room.name}</h3>
        <p style={{ margin: "5px 0" }}><strong>Type:</strong> {room.type}</p>
        {room.price && <p style={{ margin: "5px 0" }}><strong>Price:</strong> ${room.price}</p>}
        {room.maxGuests && <p style={{ margin: "5px 0" }}><strong>Max Guests:</strong> {room.maxGuests}</p>}
        {room.size && <p style={{ margin: "5px 0" }}><strong>Size:</strong> {room.size} sq.ft</p>}
        {room.bedType && <p style={{ margin: "5px 0" }}><strong>Bed Type:</strong> {room.bedType}</p>}
        {room.rating && <p style={{ margin: "5px 0" }}><strong>Rating:</strong> {room.rating}</p>}
        {room.amenities && room.amenities.length > 0 && (
          <p style={{ margin: "10px 0" }}>
            <strong>Amenities:</strong> {room.amenities.join(", ")}
          </p>
        )}
        {room.description && (
          <p style={{ margin: "10px 0", fontStyle: "italic" }}>{room.description}</p>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        {onEdit && (
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => onEdit(room)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => onDelete(room._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default RoomCard;
