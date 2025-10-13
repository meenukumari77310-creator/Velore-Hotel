import WhyChoose from "../models/whyChoose.js";

// GET all
export const getWhyChoose = async (req, res) => {
  const items = await WhyChoose.find().sort({ createdAt: 1 });
  res.json(items);
};

// POST new
export const addWhyChoose = async (req, res) => {
  const item = new WhyChoose(req.body);
  await item.save();
  res.status(201).json(item);
};

// PUT update
export const updateWhyChoose = async (req, res) => {
  const item = await WhyChoose.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
};

// DELETE
export const deleteWhyChoose = async (req, res) => {
  await WhyChoose.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
