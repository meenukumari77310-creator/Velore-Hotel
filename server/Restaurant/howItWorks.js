import HowItWorks from '../models/HowItWorks.js'
// GET all
export const getHowItWorks = async (req, res) => {
  const steps = await HowItWorks.find().sort({ createdAt: 1 });
  res.json(steps);
};

// POST new
export const addHowItWorks = async (req, res) => {
  const step = new HowItWorks(req.body);
  await step.save();
  res.status(201).json(step);
};

// PUT update
export const updateHowItWorks = async (req, res) => {
  const step = await HowItWorks.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(step);
};

// DELETE
export const deleteHowItWorks = async (req, res) => {
  await HowItWorks.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

