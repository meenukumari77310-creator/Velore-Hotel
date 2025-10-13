import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apis } from "../utils/apis";

function RoomDetails() {
  const { id } = useParams();
  const [roomSummary, setRoomSummary] = useState(null);
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apis().usergetRoomById}/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then(setRoomSummary)
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`${apis().usergetRoomDetail(id)}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDetails(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [id]);

  if (!roomSummary) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div className="container mt-5">
      {/* Hero Banner */}
      {roomSummary.coverImage && (
        <div className="mb-5 position-relative">
          <img
            src={roomSummary.coverImage}
            className="img-fluid w-100 rounded"
            alt={roomSummary.name}
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
            <h1 className="display-4 fw-bold">{roomSummary.name}</h1>
            <p className="lead">{roomSummary.type}</p>
          </div>
        </div>
      )}

      {details.map((room, idx) => (
        <div key={idx} className="row mb-5 align-items-start">
          {/* Left Info */}
          <div className="col-lg-6 mb-4">
            <div className="mb-3">
              <span className="badge bg-success me-2">${room.price}/night</span>
              <span className="badge bg-warning text-dark">
                {room.rating || "N/A"} ★
              </span>
            </div>
            <p>
              <strong>Guests:</strong> {room.maxGuests}
            </p>
            <p>
              <strong>Bed:</strong> {room.bedType}
            </p>
            <p>
              <strong>Size:</strong> {room.size}
            </p>
            <p className="mt-3">{room.description}</p>

            <div className="mb-3">
              {room.amenities?.map((a, i) => (
                <span key={i} className="badge bg-primary me-2 mb-2">
                  {a}
                </span>
              ))}
            </div>

            <div className="mb-3">
              <span
                className={`badge ${
                  room.isAvailable && room.availableRooms > 0
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                {room.isAvailable && room.availableRooms > 0
                  ? `Available (${room.availableRooms} rooms left)`
                  : "Not Available"}
              </span>
            </div>

            <button
              className="btn btn-success btn-lg"
              onClick={() => navigate(`/book/${room._id}`)}
              disabled={!room.isAvailable || room.availableRooms <= 0} // 🔹 disable if not available
            >
              Book Now
            </button>
          </div>

          {/* Right Gallery */}
          <div className="col-lg-6">
            {room.images && room.images.length > 0 && (
<div
  id={`carousel${idx}`}
  className="carousel slide rounded overflow-hidden w-100"
  data-bs-ride="carousel"
  style={{ maxHeight: "400px" }} // max height instead of fixed height
>
  <div className="carousel-inner" style={{ height: "100%" }}>
    {room.images.map((img, i) => (
      <div
        key={i}
        className={`carousel-item ${i === 0 ? "active" : ""}`}
        style={{ height: "100%" }} // container keeps height consistent
      >
        <div
          style={{
            height: "100%",
            overflow: "hidden", // hides overflow if image is taller
            borderRadius: "8px", // optional rounding
          }}
        >
          <img
            src={img}
            className="d-block w-100 h-100"
            alt={`${roomSummary.name}-${i}`}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    ))}
  </div>

  {room.images.length > 1 && (
    <>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#carousel${idx}`}
        data-bs-slide="prev"
      >
        <span
          className="carousel-control-prev-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#carousel${idx}`}
        data-bs-slide="next"
      >
        <span
          className="carousel-control-next-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Next</span>
      </button>
    </>
  )}
</div>

            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomDetails;
