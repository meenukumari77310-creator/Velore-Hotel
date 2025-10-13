import TeamMember from "../models/TeamMember.js";

// CREATE
export const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      role,
      bio,
      email,
      linkedin,
      twitter,
    } = req.body;

    const image = req.file?.path;

    if (!name || !role) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const newMember = await TeamMember.create({
      name,
      role,
      bio,
      email,
      linkedin,
      twitter,
      image,
    });

    res.status(201).json(newMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create team member" });
  }
};

// READ ALL
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
};

// UPDATE
export const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      bio,
      email,
      linkedin,
      twitter,
    } = req.body;

    const image = req.file?.path;

    const updateFields = {
      ...(name && { name }),
      ...(role && { role }),
      ...(bio && { bio }),
      ...(email && { email }),
      ...(linkedin && { linkedin }),
      ...(twitter && { twitter }),
      ...(image && { image }),
    };

    const updated = await TeamMember.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update team member" });
  }
};

// DELETE
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TeamMember.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json({ message: "Team member deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete team member" });
  }
};

// GET ONE
export const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch team member" });
  }
};
