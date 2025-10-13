import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Dish', dishSchema);
