import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import { Link } from "react-router-dom";

function BookRoom() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch(apis().usergetRoom, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "50px 20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "60px",
          fontSize: "3rem",
          color: "#333",
          fontWeight: "700",
        }}
      >
        Available Rooms
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
        }}
      >
        {rooms.map((room) => (
          <Link
            to={`/rooms/${room._id}`} // use ID for routing
            key={room._id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              {room.coverImage && (
                <img
                  src={room.coverImage}
                  alt={room.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              )}
              <div style={{ padding: "20px" }}>
                <h2>{room.name}</h2>
                <p>{room.type}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BookRoom;
