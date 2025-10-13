import Mission from "../models/Mission.js";

// GET all
export const getMission = async (req, res) => {
  const missions = await Mission.find();
  res.json(missions);
};

// POST new
export const addMission =  async (req, res) => {
  const mission = await Mission.create(req.body);
  res.json(mission);
};

// PUT update
export const updateMission = async (req, res) => {
  const updated = await Mission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// DELETE
export const deleteMission = async (req, res) => {
  await Mission.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

