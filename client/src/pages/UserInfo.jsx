import React, { useState, useEffect, useRef } from "react";
import { getStripe } from "../utils/getStripe";
import { apis } from "../utils/apis";
import { Toaster } from "react-hot-toast";
import { useUser } from "../components/UserContext"; // adjust path as needed

const UserInfo = ({ dish, onClose }) => {
  const { userDetails } = useUser();

  const [formData, setFormData] = useState({
    name: userDetails.name || "",
    email: userDetails.email || "",
    phone: "",
    address: "",
    lat: null,
    lng: null,
    dob: "",
    quantity: 1,
    country: "",
  });

  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const countrySuggestionsRef = useRef(null);

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const addressSuggestionsRef = useRef(null);

  // Store selected suggestion objects for validation
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1);
  const [highlightedAddressIndex, setHighlightedAddressIndex] = useState(-1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detect country from IP on mount
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Detected country:", data.country_name);
        // Do nothing — no auto-fill
      })
      .catch(() => {});
  }, []);

  // Debounce for country autocomplete
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

  // Debounce for address autocomplete
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

  // Fetch countries matching query from Nominatim
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

  // Fetch address suggestions from Nominatim
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

  // Close dropdown on outside click - country
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

  // Close dropdown on outside click - address
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear selected suggestion if user edits input manually
    if (name === "country") setSelectedCountry(null);
    if (name === "address") setSelectedAddress(null);
  };

  // Select a country suggestion
  const onSelectCountrySuggestion = (sug) => {
    setFormData((prev) => ({ ...prev, country: sug.display_name }));
    setSelectedCountry(sug);
    setCountrySuggestions([]);
  };

  // Select an address suggestion
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

const handleCheckout = async () => {
  if (!formData.name.trim()) {
    return alert("Please enter your name.");
  }
  if (!formData.email.trim()) {
    return alert("Please enter your email.");
  }
  if (!formData.phone.trim()) {
    return alert("Please enter your phone number.");
  }
  if (!formData.address.trim()) {
    return alert("Please enter your address.");
  }
  if (!formData.country.trim()) {
    return alert("Please enter your country.");
  }

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

  if (formData.quantity < 1) {
    return alert("Quantity must be at least 1.");
  }

  setIsSubmitting(true);
  try {
    const res = await fetch(apis().checkoutSession, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        dish,
        userInfo: formData,
        quantity: Number(formData.quantity),
      }),
    });

    const data = await res.json();

    if (data.sessionId) {
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      alert(data.message || "Checkout failed");
    }
  } catch (err) {
    alert("Checkout failed");
  } finally {
    setIsSubmitting(false);
  }
};


  const totalPrice = (dish.price * formData.quantity).toFixed(2);

  // Simple inline styles for suggestion dropdowns
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
    borderRadius: "0 0 4px 4px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const suggestionItemStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee",
  };

  return (
    <>
      <Toaster position="top-center" />
      <div
        className="custom-modal-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          className="custom-modal p-4"
          style={{
            maxWidth: "600px",
            width: "90%",
            backgroundColor: "white",
            borderRadius: 8,
            position: "relative",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              border: "none",
              background: "transparent",
              fontSize: 24,
              cursor: "pointer",
              color: "#666",
            }}
            aria-label="Close"
          >
            &times;
          </button>

          <h3 className="mb-4 text-center" style={{ color: "green" }}>
            Order: {dish.title}
          </h3>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="row g-3"
            style={{ position: "relative" }}
          >
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={formData.name}
                required
                autoComplete="name"
                readOnly
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="email" className="form-label">
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                required
                autoComplete="email"
                readOnly
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                autoComplete="tel"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                className="form-control"
                value={formData.dob}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {/* Country input with suggestions */}
            <div
              className="col-12 position-relative"
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

            {/* Address input with suggestions */}
            <div
              className="col-12 position-relative"
              ref={addressSuggestionsRef}
              style={{ position: "relative" }}
            >
              <label htmlFor="address" className="form-label">
                Address <span style={{ color: "red" }}>*</span>
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

            <div className="col-md-6">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                className="form-control"
                value={formData.quantity}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div
              className="col-md-6 d-flex align-items-center justify-content-end"
              style={{ fontWeight: "bold", fontSize: 18 }}
            >
              Total Price: ${totalPrice}
            </div>

            <div className="col-12 d-flex justify-content-center mt-3">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="btn btn-success"
                style={{ minWidth: 150 }}
              >
                {isSubmitting ? "Processing..." : "Checkout"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
