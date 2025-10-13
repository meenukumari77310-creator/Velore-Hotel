import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apis } from "../utils/apis";
import { useUser } from "../components/UserContext";

const Booking = () => {
  const { userDetails } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [isAvailable, setIsAvailable] = useState(null);
  const hasSubmitted = useRef(false);
  const { date, time } = formData;
  const [isLoading, setIsLoading] = useState(false);

  // For address autocomplete suggestions
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const addressSuggestionsRef = useRef(null);

  // For country autocomplete suggestions
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const countrySuggestionsRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1);
  const [highlightedAddressIndex, setHighlightedAddressIndex] = useState(-1);

  // Autofill name/email when userDetails load
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: userDetails.name || "",
      email: userDetails.email || "",
    }));
  }, [userDetails]);

  // Fetch suggestions from Nominatim API for address
  const fetchAddressSuggestions = async (query) => {
    if (!query) {
      setAddressSuggestions([]);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
      query
    )}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setAddressSuggestions(data);
    } catch (error) {
      console.error("Address autocomplete fetch error:", error);
      setAddressSuggestions([]);
    }
  };

  // Fetch country suggestions from Nominatim, filtered for country type only
  // Fetch country suggestions from Nominatim, filtered for country type only
  const fetchCountrySuggestions = async (query) => {
    if (!query) {
      setCountrySuggestions([]);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
      query
    )}&addressdetails=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      // Filter only results where type is 'country'
      const countries = data.filter(
        (item) =>
          item.address &&
          item.address.country &&
          (item.type === "country" ||
            item.class === "boundary" ||
            item.type === "administrative")
      );

      setCountrySuggestions(countries);
    } catch (error) {
      console.error("Country autocomplete fetch error:", error);
      setCountrySuggestions([]);
    }
  };

  const handleCountryKeyDown = (e) => {
    if (countrySuggestions.length === 0) return;

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
    if (addressSuggestions.length === 0) return;

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

  // Debounce address input changes for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAddressSuggestions(formData.address);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.address]);

  // Debounce country input changes for autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCountrySuggestions(formData.country);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.country]);

  // Handle selecting an autocomplete suggestion for address
  const onSelectCountrySuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      country: suggestion.display_name,
    }));
    setSelectedCountry(suggestion);
    setCountrySuggestions([]);
  };

  const onSelectAddressSuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: suggestion.display_name,
      country: suggestion.address?.country || prev.country,
    }));
    setSelectedAddress(suggestion);
    setAddressSuggestions([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const checkAvailability = async () => {
      if (!date || !time) return;

      try {
        const res = await fetch(apis().checkAvailability(date, time), {
          credentials: "include",
        });
        const data = await res.json();
        setIsAvailable(data.available);
      } catch {
        setIsAvailable(null);
        toast.error("⚠️ Failed to check availability");
      }
    };

    checkAvailability();
  }, [date, time]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Helper: validate against API suggestions if not selected
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
      return alert(
        "Unknown address or country. Please select from the suggestions or type the exact name."
      );
    }

    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    setIsLoading(true);

    try {
      if (isAvailable === false) {
        toast.error("❌ No tables available at this time");
        return;
      }

      const res = await fetch(apis().bookTable, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          userId: userDetails._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("✅ Booking successful! Check your email.");

      setFormData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        phone: "",
        country: "",
        address: "",
        date: "",
        time: "",
        guests: 1,
      });
      setIsAvailable(null);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      hasSubmitted.current = false;
      setIsLoading(false);
    }
  };

  // Close suggestions when clicking outside for both address and country
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addressSuggestionsRef.current &&
        !addressSuggestionsRef.current.contains(event.target)
      ) {
        setAddressSuggestions([]);
      }
      if (
        countrySuggestionsRef.current &&
        !countrySuggestionsRef.current.contains(event.target)
      ) {
        setCountrySuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Shared style for suggestion lists
  const suggestionListStyle = {
    position: "absolute",
    zIndex: 1000,
    background: "white",
    border: "1px solid #ccc",
    width: "100%",
    maxHeight: 150,
    overflowY: "auto",
    listStyle: "none",
    marginTop: 0,
    paddingLeft: 0,
    cursor: "pointer",
    borderRadius: "0 0 4px 4px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const suggestionItemStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
  };

  return (
    <div className="container mt-5 py-5" style={{ maxWidth: 700 }}>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Intro Section */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-danger">🍽️ Reserve Your Spot</h2>
        <p className="text-muted fs-5">
          Experience fine dining like never before. Book your table in advance
          and let us craft a memorable evening for you and your guests.
        </p>
      </div>

      {/* Booking Form Card */}
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{
          background: "linear-gradient(135deg, #fff, #f8f9fa)",
        }}
      >
        <h4 className="mb-4 text-center fw-semibold">Book a Table</h4>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              name="name"
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              readOnly
              className="form-control bg-light"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              readOnly
              className="form-control bg-light"
            />
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              name="phone"
              id="phone"
              placeholder="e.g. +123456789"
              value={formData.phone}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          {/* Country with autocomplete */}
          <div
            className="mb-3"
            ref={countrySuggestionsRef}
            style={{ position: "relative" }}
          >
            <label htmlFor="country" className="form-label">
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
              className="form-control"
              autoComplete="off"
            />
            {countrySuggestions.length > 0 && (
              <ul style={suggestionListStyle}>
                {countrySuggestions.map((sug, idx) => (
                  <li
                    key={sug.place_id}
                    onClick={() => onSelectCountrySuggestion(sug)}
                    style={{
                      ...suggestionItemStyle,
                      backgroundColor:
                        idx === highlightedCountryIndex ? "#e9ecef" : "white",
                    }}
                    onMouseEnter={() => setHighlightedCountryIndex(idx)}
                  >
                    {sug.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Address with autocomplete */}
          <div
            className="mb-3"
            ref={addressSuggestionsRef}
            style={{ position: "relative" }}
          >
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              name="address"
              id="address"
              placeholder="Start typing your address..."
              value={formData.address || ""}
              onChange={handleChange}
              onKeyDown={handleAddressKeyDown}
              className="form-control"
              autoComplete="off"
            />

            {addressSuggestions.length > 0 && (
              <ul style={suggestionListStyle}>
                {addressSuggestions.map((sug, idx) => (
                  <li
                    key={sug.place_id}
                    onClick={() => onSelectAddressSuggestion(sug)}
                    style={{
                      ...suggestionItemStyle,
                      backgroundColor:
                        idx === highlightedAddressIndex ? "#e9ecef" : "white",
                    }}
                    onMouseEnter={() => setHighlightedAddressIndex(idx)}
                  >
                    {sug.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date & Time */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                name="date"
                type="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="time" className="form-label">
                Time
              </label>
              <input
                name="time"
                type="time"
                id="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>

          {/* Availability Status */}
          {date && time && (
            <div className="mb-3">
              {isAvailable === true && (
                <div className="alert alert-success">
                  ✅ Table is available!
                </div>
              )}
              {isAvailable === false && (
                <div className="alert alert-warning">
                  ❌ Sorry, this time slot is already booked.
                </div>
              )}
            </div>
          )}

          {/* Number of Guests */}
          <div className="mb-4">
            <label htmlFor="guests" className="form-label">
              Number of Guests
            </label>
            <input
              name="guests"
              type="number"
              id="guests"
              min="1"
              value={formData.guests}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-danger w-100 fw-semibold"
            type="submit"
            disabled={isAvailable === false || isLoading}
          >
            {isLoading ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Reserving...
              </span>
            ) : (
              "Reserve Table"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
