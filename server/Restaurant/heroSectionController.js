import HeroSection from "../models/HeroSection.js";
import { cloudinary } from "../config/Cloudinary.js"

// GET current hero content
export const getHeroSection = async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    if (!hero) return res.status(404).json({ message: "Hero section not found" });
    res.json(hero);
  } catch (err) {
    console.error("GET HeroSection Error:", err);
    res.status(500).json({ error: "Failed to fetch hero section" });
  }
};

// POST (create new hero or add slides)
export const postHeroSection = async (req, res) => {
  try {
    const { greetings, description, textColor, fontSize, textAlign } = req.body;

    // Parse greetings safely
    let parsedGreetings = {};
    if (greetings) {
      parsedGreetings = typeof greetings === "string" ? JSON.parse(greetings) : greetings;
    }

    const slides = req.files
      ? req.files.map(file => ({
          url: file.path,
          public_id: file.filename || file.path.split("/").pop().split(".")[0],
        }))
      : [];

    let hero = await HeroSection.findOne();

    if (hero) {
      hero.greetings = { ...hero.greetings, ...parsedGreetings };
      if (description) hero.description = description;
      if (textColor) hero.textColor = textColor;
      if (fontSize) hero.fontSize = fontSize;
      if (textAlign) hero.textAlign = textAlign;
      hero.slides.push(...slides);
    } else {
      hero = new HeroSection({
        greetings: parsedGreetings,
        description,
        textColor,
        fontSize,
        textAlign,
        slides,
      });
    }

    await hero.save();
    res.json(hero);
  } catch (err) {
    console.error("POST HeroSection Error:", err);
    res.status(500).json({ error: "Failed to save hero section" });
  }
};

// PUT (update hero section)
export const updateHeroSection = async (req, res) => {
  try {
    const { greetings, description, textColor, fontSize, textAlign, slidesToRemove } = req.body;

    let parsedGreetings = {};
    if (greetings) parsedGreetings = typeof greetings === "string" ? JSON.parse(greetings) : greetings;

    const hero = await HeroSection.findOne();
    if (!hero) return res.status(404).json({ message: "Hero section not found" });

    // Remove slides if requested
    if (slidesToRemove && slidesToRemove.length > 0) {
      hero.slides = hero.slides.filter(slide => {
        if (slidesToRemove.includes(slide.url)) {
          cloudinary.uploader.destroy(slide.public_id).catch(console.error);
          return false;
        }
        return true;
      });
    }

    // Add new slides
    if (req.files && req.files.length > 0) {
      const newSlides = req.files.map(file => ({
        url: file.path,
        public_id: file.filename || file.path.split("/").pop().split(".")[0],
      }));
      hero.slides.push(...newSlides);
    }

    hero.greetings = { ...hero.greetings, ...parsedGreetings };
    if (description) hero.description = description;
    if (textColor) hero.textColor = textColor;
    if (fontSize) hero.fontSize = fontSize;
    if (textAlign) hero.textAlign = textAlign;

    await hero.save();
    res.json(hero);
  } catch (err) {
    console.error("PUT HeroSection Error:", err);
    res.status(500).json({ error: "Failed to update hero section" });
  }
};

// DELETE hero section or specific slides
export const deleteHeroSection = async (req, res) => {
  try {
    const { slidesToDelete } = req.body;
    const hero = await HeroSection.findOne();
    if (!hero) return res.status(404).json({ message: "Hero section not found" });

    if (slidesToDelete && slidesToDelete.length > 0) {
      hero.slides = hero.slides.filter(slide => {
        if (slidesToDelete.includes(slide.url)) {
          cloudinary.uploader.destroy(slide.public_id).catch(console.error);
          return false;
        }
        return true;
      });
      await hero.save();
      return res.json(hero);
    } else {
      // delete all slides from Cloudinary
      for (const slide of hero.slides) {
        cloudinary.uploader.destroy(slide.public_id).catch(console.error);
      }
      await HeroSection.deleteOne({ _id: hero._id });
      return res.json({ message: "Hero section deleted" });
    }
  } catch (err) {
    console.error("DELETE HeroSection Error:", err);
    res.status(500).json({ error: "Failed to delete hero section" });
  }
};
