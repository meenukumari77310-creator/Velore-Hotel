import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { apis } from "../utils/apis";
import { getStripe } from "../utils/getStripe";

const EventPaymentInfo = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");

  console.log("Booking ID from URL:", bookingId);


  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`${apis().getEventById}/${bookingId}`, {
  credentials: "include",
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(`Failed with status ${res.status}: ${text}`);
}

const data = await res.json();
setBooking(data);


        setBooking(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error fetching booking:", err.message);
        toast.error("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePay = async () => {
    try {
      const res = await fetch(apis().createEventCheckoutSession, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookingId,
          email: form.email,
          amount: booking.amount,
        }),
      });

      const data = await res.json();
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error("Stripe session error:", err.message);
      toast.error("Stripe session failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!booking) return <p>Booking not found</p>;

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">💳 Confirm Your Payment</h2>
      <p>
        Booking: <strong>{booking.eventType}</strong> on{" "}
        <strong>{booking.date}</strong> for {booking.guests} guests.
      </p>
      <p>Total Amount: ₹{booking.amount}</p>

      <div className="mb-3">
        <label>Name</label>
        <input
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Phone</label>
        <input
          className="form-control"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          className="form-control"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <button className="btn btn-primary w-100" onClick={handlePay}>
        Pay Now with Stripe
      </button>
    </div>
  );
};

export default EventPaymentInfo;
