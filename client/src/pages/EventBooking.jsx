import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apis } from "../utils/apis";
import { useUser } from "../components/UserContext";
import dayjs from "dayjs";
import "../App.css";
import { useLocation } from "react-router-dom";

const EventBooking = () => {
  const { userDetails } = useUser();
  const hasSubmitted = useRef(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedEvent = queryParams.get("eventType");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: preselectedEvent || "", // 👈 auto-selected
    country: "",
    address: "",
    date: "",
    time: "",
    guests: "",
    notes: "",
  });

  const [priceMap, setPriceMap] = useState({});
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [pointsAvailable, setPointsAvailable] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [pointsPerCurrencyUnit, setPointsPerCurrencyUnit] = useState(10);

  // For autocomplete suggestions and refs
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const addressSuggestionsRef = useRef(null);

  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const countrySuggestionsRef = useRef(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1);
  const [highlightedAddressIndex, setHighlightedAddressIndex] = useState(-1);

  // Derived values
  // Derived values
  let amount = 0;

  if (formData.eventType && priceMap[formData.eventType]) {
    const setting = priceMap[formData.eventType];
    const baseAmount = setting.pricePerGuest * formData.guests; // base amount
    amount = baseAmount;

    // Day multiplier
    let dayMultiplier = 1;
    if (setting.dayPricing?.length) {
      const dateStr = dayjs(formData.date).format("YYYY-MM-DD");
      const dayOfWeek = dayjs(formData.date).day();

      const daySetting = setting.dayPricing.find(
        (d) => d.specialDates?.includes(dateStr) || d.days?.includes(dayOfWeek)
      );

      if (daySetting) dayMultiplier = daySetting.multiplier;
    }

    let timeMultiplier = 1;
    const selectedSlot = setting.timeSlots?.find(
      (slot) => slot.start === formData.time
    );
    if (selectedSlot) timeMultiplier = selectedSlot.multiplier;

    // Final amount
    amount = baseAmount * dayMultiplier * timeMultiplier;

    console.log({
      baseAmount,
      dayMultiplier,
      timeMultiplier,
      finalAmount: amount,
    });
  }

  // Now this works because `amount` is defined
  const discount = Math.floor(pointsUsed / pointsPerCurrencyUnit);
  const finalAmount = Math.max(amount - discount, 0);

  const pointsEarned = Math.floor(finalAmount / 100) * 10;

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

  // Prefill name/email when userDetails available
  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        name: userDetails.name || "",
        email: userDetails.email || "",
      }));
    }
  }, [userDetails]);

  // Fetch event prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(apis().userGetEventSetting, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched event settings:", data);
        const map = {};
        data.forEach((s) => {
          map[s.eventType] = s; // save entire setting
        });

        setPriceMap(map);
      } catch {
        toast.error("Failed to fetch pricing");
      }
    };
    fetchPrices();
  }, []);

  // Fetch user points + loyalty config
  useEffect(() => {
    if (!userDetails?._id) return;

    const fetchData = async () => {
      try {
        const [pointsRes, configRes] = await Promise.all([
          fetch(apis().loyaltyPoints(userDetails._id), {
            credentials: "include",
          }),
          fetch(apis().loyaltyConfig, { credentials: "include" }),
        ]);
        const pointsData = await pointsRes.json();
        const configData = await configRes.json();

        setPointsAvailable(pointsData.points || 0);
        setPointsPerCurrencyUnit(configData.pointsPerCurrencyUnit || 10);
      } catch {
        toast.error("Failed to fetch loyalty info");
      }
    };

    fetchData();
  }, [userDetails]);

  // Fetch past bookings
  useEffect(() => {
    if (!userDetails?._id) return;

    const fetchMyBookings = async () => {
      try {
        setLoadingBookings(true);
        const res = await fetch(
          `${apis().getUserEvents}?userId=${userDetails._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setMyBookings(Array.isArray(data.events) ? data.events : []);
      } catch {
        toast.error("Failed to load your bookings");
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchMyBookings();
  }, [userDetails]);

  // Autocomplete fetch functions
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

  // Debounced autocomplete effects
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAddressSuggestions(formData.address);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.address]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCountrySuggestions(formData.country);
    }, 300);
    return () => clearTimeout(timer);
  }, [formData.country]);

  // Select suggestion handlers
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

  // Close suggestions on outside click
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

  // Handle form changes
  const handleChange = (e) => {
    const value =
      e.target.name === "guests" ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
      ...(e.target.name === "eventType" && { time: "" }), // reset time
    }));
  };

  // Form submit handler (your existing one)
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

    const userId = userDetails?._id;
    if (!userId) {
      toast.error("❌ You must be logged in to book an event.");
      hasSubmitted.current = false;
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      userId,
      amount: finalAmount,
      usedPoints: pointsUsed,
    };

    try {
      const res = await fetch(apis().eventBooking, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success(
        `✅ Booking successful for ₹${finalAmount}. You earned ${
          data.earnedPoints || pointsEarned
        } points.`
      );

      setFormData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        phone: "",
        eventType: "",
        country: "",
        address: "",
        date: "",
        time: "",
        guests: 50,
        notes: "",
      });
      setPointsUsed(0);

      setMyBookings((prev) => [data.booking, ...prev]);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      hasSubmitted.current = false;
      setIsLoading(false);
    }
  };

  // Styles for autocomplete dropdown
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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5 mt-5">
      <div
        className="card shadow-lg p-4 rounded-4 w-100"
        style={{ maxWidth: 700, position: "relative" }}
      >
        <Toaster position="top-center" />
        <h2 className="mb-4 text-center">🎉 Event Catering Request</h2>

        {/* Event Booking Form */}
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            disabled
            className="form-control mb-2"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            disabled
            className="form-control mb-2"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="form-control mb-2"
          />

          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
            className="form-control mb-2"
          >
            <option value="">Select Event Type</option>
            {Object.entries(priceMap).map(([type, setting]) => (
              <option key={type} value={type}>
                {type} (₹{setting.pricePerGuest} per guest)
              </option>
            ))}
          </select>

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

          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-control mb-2"
          />

          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="form-control mb-2"
          >
            <option value="">Select Time Slot</option>
            {formData.eventType &&
            priceMap[formData.eventType]?.timeSlots?.length ? (
              priceMap[formData.eventType].timeSlots.map((slot, idx) => (
                <option key={idx} value={slot.start}>
                  {slot.name} ({slot.start} - {slot.end})
                </option>
              ))
            ) : (
              <option disabled>
                {formData.eventType
                  ? "No time slots available"
                  : "Select an event type first"}
              </option>
            )}
          </select>

          <input
            name="guests"
            type="number"
            min="1"
            placeholder="No. of Guests"
            value={formData.guests}
            onChange={handleChange}
            required
            className="form-control mb-2"
          />

          {pointsAvailable > 0 && (
            <div className="mb-2">
              <label>Use Loyalty Points (You have {pointsAvailable})</label>
              <input
                type="number"
                className="form-control my-1"
                min={0}
                max={pointsAvailable}
                value={pointsUsed}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPointsUsed(val <= pointsAvailable ? val : pointsAvailable);
                }}
              />
              <small className="text-muted">
                💸 Discount: ₹{discount} (based on {pointsPerCurrencyUnit}{" "}
                points per ₹1)
              </small>
            </div>
          )}

          <input
            name="amount"
            value={`₹${finalAmount}`}
            readOnly
            className="form-control mb-2"
          />

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes..."
            className="form-control mb-3"
            rows={4}
          />

          <p className="text-muted mb-2">
            🧮 You'll earn <strong>{pointsEarned}</strong> new points.
          </p>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              "Submit Event Request"
            )}
          </button>
        </form>

        {/* Bookings List */}
        <div className="mt-5">
          <h4>📜 Your Event Bookings</h4>
          {loadingBookings ? (
            <p className="text-muted">Loading bookings...</p>
          ) : myBookings.length === 0 ? (
            <p className="text-muted">You have no event bookings yet.</p>
          ) : (
            <ul className="list-group">
              {myBookings.map((booking) => (
                <li
                  key={booking._id}
                  className="list-group-item d-flex flex-column"
                >
                  <div>
                    <strong>{booking.eventType}</strong> on{" "}
                    <strong>{booking.date}</strong> at {booking.time} —{" "}
                    {booking.guests} guests ({booking.status})
                  </div>

                  {booking.status === "confirmed" &&
                    booking.paymentStatus !== "paid" && (
                      <a
                        href={`/event-payment-info?bookingId=${booking._id}`}
                        className="btn btn-success btn-sm mt-2 align-self-start"
                      >
                        Pay Now
                      </a>
                    )}

                  {booking.paymentStatus === "paid" && (
                    <span className="badge bg-success mt-2 align-self-start">
                      Paid
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBooking;
