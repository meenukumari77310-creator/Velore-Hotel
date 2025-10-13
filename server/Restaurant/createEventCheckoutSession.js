// controllers/eventPayment.js
import Stripe from "stripe";
import dotenv from "dotenv";
import EventBooking from "../models/eventBooking.js";
import EventPayment from "../models/eventPayment.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createEventCheckoutSession = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await EventBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${booking.eventType} Catering`,
              description: `${booking.guests} Guests on ${booking.date}`,
            },
            unit_amount: booking.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/payment-success?bookingId=${booking._id}`,
      cancel_url: `http://localhost:3000/payment-cancel`,
      metadata: {
        bookingId: booking._id.toString(),
        userId: booking.userId.toString(),
      },
    });

    // Save in EventPayment collection
    await EventPayment.create({
      bookingId: booking._id,
      userId: booking.userId,
      email: booking.email,
      eventType: booking.eventType,
      totalAmount: booking.amount,
      sessionId: session.id,
      status: "pending",
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ message: "Stripe error", error: err.message });
  }
};

// controllers/eventPayment.js
export const confirmEventPayment = async (req, res) => {
  const { bookingId } = req.body;
  try {
    await EventBooking.findByIdAndUpdate(bookingId, { status: "paid" });
    await EventPayment.findOneAndUpdate({ bookingId }, { status: "paid" });
    res.json({ success: true });
  } catch (err) {
    console.error("Payment confirm error:", err.message);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};

