// controllers/loyaltyConfigController.js
import LoyaltyConfig from "../models/loyaltyConfig.js";

export const getLoyaltyConfig = async (req, res) => {
  try {
    const config = await LoyaltyConfig.findOne() || new LoyaltyConfig();
    res.json(config);
  } catch {
    res.status(500).json({ message: "Failed to get config" });
  }
};

export const updateLoyaltyConfig = async (req, res) => {
  try {
    const { pointsPerCurrencyUnit } = req.body;

    let config = await LoyaltyConfig.findOne();
    if (!config) {
      config = new LoyaltyConfig({ pointsPerCurrencyUnit });
    } else {
      config.pointsPerCurrencyUnit = pointsPerCurrencyUnit;
    }
    await config.save();
    res.json(config);
  } catch {
    res.status(500).json({ message: "Failed to update config" });
  }
};
