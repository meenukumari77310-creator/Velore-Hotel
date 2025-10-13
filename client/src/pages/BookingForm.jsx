import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getStripe } from "../utils/getStripe";
import { apis } from "../utils/apis";
import { useUser } from "../components/UserContext";

function BookingForm() {
  const { id } = useParams();
  const { userDetails } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    address: "",
    country: "",
    lat: null,
    lng: null,
  });

  const [loading, setLoading] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1);
  const [highlightedAddressIndex, setHighlightedAddressIndex] = useState(-1);

  const countrySuggestionsRef = useRef(null);
  const addressSuggestionsRef = useRef(null);

  // Prefill name/email
  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        name: userDetails.name || "",
        email: userDetails.email || "",
      }));
    }
  }, [userDetails]);

  // Debounced country autocomplete
  useEffect(() => {
    if (!formData.country) {
      setCountrySuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchCountrySuggestions(formData.country);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.country]);

  // Debounced address autocomplete
  useEffect(() => {
    if (!formData.address) {
      setAddressSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchAddressSuggestions(formData.address);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.address]);

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        countrySuggestionsRef.current &&
        !countrySuggestionsRef.current.contains(e.target)
      ) {
        setCountrySuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close address dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        addressSuggestionsRef.current &&
        !addressSuggestionsRef.current.contains(e.target)
      ) {
        setAddressSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCountrySuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          query
        )}&addressdetails=1`
      );
      const data = await res.json();
      const filtered = data.filter(
        (item) =>
          item.type === "country" ||
          item.class === "boundary" ||
          item.type === "administrative"
      );
      setCountrySuggestions(filtered);
    } catch {
      setCountrySuggestions([]);
    }
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setAddressSuggestions(data);
    } catch {
      setAddressSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "country") setSelectedCountry(null);
    if (name === "address") setSelectedAddress(null);
  };

  const onSelectCountrySuggestion = (sug) => {
    setFormData((prev) => ({ ...prev, country: sug.display_name }));
    setSelectedCountry(sug);
    setCountrySuggestions([]);
  };

  const onSelectAddressSuggestion = (sug) => {
    setFormData((prev) => ({
      ...prev,
      address: sug.display_name,
      lat: sug.lat,
      lng: sug.lon,
      country: sug.address?.country || prev.country,
    }));
    setSelectedAddress(sug);
    setAddressSuggestions([]);
  };

  const handleCountryKeyDown = (e) => {
    if (!countrySuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCountryIndex((prev) =>
        prev < countrySuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCountryIndex((prev) =>
        prev > 0 ? prev - 1 : countrySuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedCountryIndex >= 0) {
        onSelectCountrySuggestion(countrySuggestions[highlightedCountryIndex]);
        setHighlightedCountryIndex(-1);
      }
    } else if (e.key === "Escape") {
      setCountrySuggestions([]);
      setHighlightedCountryIndex(-1);
    }
  };

  const handleAddressKeyDown = (e) => {
    if (!addressSuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedAddressIndex((prev) =>
        prev < addressSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedAddressIndex((prev) =>
        prev > 0 ? prev - 1 : addressSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedAddressIndex >= 0) {
        onSelectAddressSuggestion(addressSuggestions[highlightedAddressIndex]);
        setHighlightedAddressIndex(-1);
      }
    } else if (e.key === "Escape") {
      setAddressSuggestions([]);
      setHighlightedAddressIndex(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validateCountry = async () => {
      if (selectedCountry) return true;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          formData.country
        )}&addressdetails=1`
      );
      const data = await res.json();
      return data.some(
        (c) =>
          c.display_name.trim().toLowerCase() ===
          formData.country.trim().toLowerCase()
      );
    };

    const validateAddress = async () => {
      if (selectedAddress) return true;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          formData.address
        )}`
      );
      const data = await res.json();
      return data.some(
        (a) =>
          a.display_name.trim().toLowerCase() ===
          formData.address.trim().toLowerCase()
      );
    };

    const isCountryValid = await validateCountry();
    const isAddressValid = await validateAddress();

    if (!isCountryValid || !isAddressValid) {
      setLoading(false);
      return alert(
        "Unknown address or country. Please select from the suggestions or type the exact name."
      );
    }

    try {
      const response = await fetch(`${apis().createStripeSession}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: id, ...formData }),
      });
      const data = await response.json();

      if (data?.sessionId) {
        const stripe = await getStripe();
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert("Failed to create Stripe session.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const suggestionListStyle = {
    position: "absolute",
    zIndex: 1000,
    background: "#fff",
    border: "1px solid #ccc",
    width: "100%",
    maxHeight: 150,
    overflowY: "auto",
    listStyle: "none",
    marginTop: 0,
    paddingLeft: 0,
    cursor: "pointer",
  };

  const suggestionItemStyle = {
    padding: "5px 10px",
  };

  return (
  <div className="container pt-5 my-5 d-flex justify-content-center">
    <div className="card shadow-lg p-4" style={{ maxWidth: 600, width: "100%", borderRadius: "1rem" }}>
      <h2 className="mb-4 text-center fw-bold" style={{ color: "#343a40" }}>
        Book Your Room
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name, Email, Phone */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            className="form-control shadow-sm"
            onChange={handleChange}
            readOnly
            required
            style={{ borderRadius: "0.5rem" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="form-control shadow-sm"
            readOnly
            onChange={handleChange}
            required
            style={{ borderRadius: "0.5rem" }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            className="form-control shadow-sm"
            placeholder="Enter number with valid country code ex. +916468468458"
            onChange={handleChange}
            required
            style={{ borderRadius: "0.5rem" }}
          />
        </div>

        {/* Country */}
        <div className="col-12 position-relative mb-3" ref={countrySuggestionsRef}>
          <label htmlFor="country" className="form-label fw-semibold">
            Country
          </label>
          <input
            name="country"
            id="country"
            placeholder="Start typing your country..."
            value={formData.country || ""}
            onChange={handleChange}
            onKeyDown={handleCountryKeyDown}
            required
            className="form-control shadow-sm"
            autoComplete="off"
            style={{ borderRadius: "0.5rem" }}
          />
          {countrySuggestions.length > 0 && (
            <ul style={{ ...suggestionListStyle, borderRadius: "0.5rem", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              {countrySuggestions.map((sug, idx) => (
                <li
                  key={sug.place_id}
                  onClick={() => onSelectCountrySuggestion(sug)}
                  style={{
                    ...suggestionItemStyle,
                    padding: "10px 15px",
                    backgroundColor: idx === highlightedCountryIndex ? "#f1f3f5" : "#fff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={() => setHighlightedCountryIndex(idx)}
                >
                  {sug.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Address */}
        <div className="col-12 position-relative mb-3" ref={addressSuggestionsRef}>
          <label htmlFor="address" className="form-label fw-semibold">
            Address <span style={{ color: "red" }}>*</span>
          </label>
          <input
            name="address"
            id="address"
            placeholder="Start typing your address..."
            value={formData.address || ""}
            onChange={handleChange}
            onKeyDown={handleAddressKeyDown}
            className="form-control shadow-sm"
            autoComplete="off"
            style={{ borderRadius: "0.5rem" }}
          />
          {addressSuggestions.length > 0 && (
            <ul style={{ ...suggestionListStyle, borderRadius: "0.5rem", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              {addressSuggestions.map((sug, idx) => (
                <li
                  key={sug.place_id}
                  onClick={() => onSelectAddressSuggestion(sug)}
                  style={{
                    ...suggestionItemStyle,
                    padding: "10px 15px",
                    backgroundColor: idx === highlightedAddressIndex ? "#f1f3f5" : "#fff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={() => setHighlightedAddressIndex(idx)}
                >
                  {sug.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Guests */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Number of Guests</label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            min="1"
            className="form-control shadow-sm"
            onChange={handleChange}
            required
            style={{ borderRadius: "0.5rem" }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-gradient w-100 fw-bold"
          disabled={loading}
          style={{
            background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
            border: "none",
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "0.75rem",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {loading ? "Redirecting..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  </div>
);

}

export default BookingForm;
