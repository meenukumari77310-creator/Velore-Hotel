import Stripe from "stripe";
import dotenv from "dotenv";
import RoomBooking from "../models/RoomBooking.js";
import twilio from "twilio";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Functional component for Stripe webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Find the booking by Stripe session ID
      const booking = await RoomBooking.findOne({ stripeSessionId: session.id });
      if (!booking) return res.status(404).send("Booking not found");

      // Update booking as paid
      booking.paid = true;
      booking.status = "confirmed";
      await booking.save();

      // Send WhatsApp message to user
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${booking.phone}`,
        body: `Hi ${booking.name}, your room booking is confirmed! ✅`,
      });

      console.log(`WhatsApp message sent to ${booking.phone}`);
    } catch (err) {
      console.error("Error processing webhook:", err);
    }
  }

  res.status(200).send({ received: true });
};
