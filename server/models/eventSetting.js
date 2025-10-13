import mongoose from "mongoose";

const TimeSlotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  multiplier: { type: Number, default: 1 },
});

const DayPricingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  multiplier: { type: Number, default: 1 },
  days: [{ type: Number }],
  specialDates: [{ type: String }],
});

const EventSettingsSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  pricePerGuest: { type: Number, required: true },
  timeSlots: [TimeSlotSchema],
  dayPricing: [DayPricingSchema],
});

export default mongoose.model("EventSettings", EventSettingsSchema);
