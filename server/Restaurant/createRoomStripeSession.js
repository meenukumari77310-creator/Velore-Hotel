import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import RoomDetail from "../models/RoomDetails.js";
import RoomBooking from "../models/RoomBooking.js";
import twilio from "twilio";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ===================== USER FUNCTION =====================
export const createRoomStripeSession = async (req, res) => {
  try {
    const { roomId, name, email, phone, guests, address, country } = req.body;

    const room = await RoomDetail.findById(roomId).populate("roomSummary", "name");
    if (!room) return res.status(404).json({ message: "Room not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: room.roomSummary.name },
            unit_amount: room.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking-cancel`,
    });

    const booking = new RoomBooking({
      room: room._id,
      name,
      email,
      phone,
      guests,
      address,
      country,
      stripeSessionId: session.id,
      paid: false,
      status: "pending",
    });

    await booking.save();
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ===================== ADMIN FUNCTIONS =====================
export const getAllRoomBookings = async (req, res) => {
  try {
    const bookings = await RoomBooking.find()
      .populate({
        path: "room",
        populate: { path: "roomSummary", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getRoomBookingById = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateRoomBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const previousStatus = booking.status; // capture it BEFORE update
    const { status, paid } = req.body;
    if (status) booking.status = status;
    if (typeof paid === "boolean") booking.paid = paid;

    await booking.save();

    if (status === "confirmed" && previousStatus !== "confirmed") {
      await confirmBookingAndSendMessage(booking.stripeSessionId);
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const deleteRoomBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ===================== WhatsApp Confirmation =====================
export const confirmBookingAndSendMessage = async (sessionId) => {
  try {
    const booking = await RoomBooking.findOne({ stripeSessionId: sessionId });
    if (!booking) throw new Error("Booking not found");

    booking.paid = true;
    booking.status = "confirmed";
    await booking.save();

    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${booking.phone}`,
      body: `Hi ${booking.name}, your room booking is confirmed! ✅`,
    });

    console.log(`WhatsApp message sent to ${booking.phone}`);
  } catch (err) {
    console.error("Error confirming booking:", err.message);
  }
};
