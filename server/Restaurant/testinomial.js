import Testimonial from "../models/testinomial.js"

// GET all testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

// POST add new testimonial
export const addTestimonial = async (req, res) => {
  try {
    const { name, review, location } = req.body;
    const newTestimonial = await Testimonial.create({ name, review, location });
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: "Failed to add testimonial" });
  }
};

// PUT update testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Testimonial.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Testimonial not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update testimonial" });
  }
};

// DELETE testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
};
