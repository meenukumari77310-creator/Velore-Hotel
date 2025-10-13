import React, { useState, useEffect } from "react";

const AddressPicker = ({ address, onAddressChange }) => {
  const [inputValue, setInputValue] = useState(address || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(address || "");
  }, [address]);

  // 🔍 Search by address
  const searchLocation = () => {
    if (!inputValue.trim()) return;
    setLoading(true);

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        inputValue
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const place = data[0];
          const newLocation = {
            address: place.display_name,
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon),
          };
          setInputValue(place.display_name);
          onAddressChange(newLocation);
        } else {
          alert("Location not found.");
        }
      })
      .catch(() => alert("Search failed"))
      .finally(() => setLoading(false));
  };

  // 📍 Use GPS
  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const lat = coords.latitude;
        const lng = coords.longitude;

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
          .then((res) => res.json())
          .then((data) => {
            const newLocation = {
              address: data.display_name || "Unknown location",
              lat,
              lng,
            };
            setInputValue(newLocation.address);
            onAddressChange(newLocation);
          })
          .finally(() => setLoading(false));
      },
      () => {
        alert("Unable to get your location");
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <label className="form-label">Address</label>
      <div className="d-flex mb-2" style={{ gap: "8px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()}
          disabled={loading}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={searchLocation}
          disabled={loading}
        >
          Search
        </button>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={useMyLocation}
          disabled={loading}
          title="Use your current location"
        >
          Use My Location
        </button>
      </div>
      {loading && <p className="text-muted">Loading...</p>}
    </div>
  );
};

export default AddressPicker;
