// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Dish image storage
const dishStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Foodie-Menu",
    allowed_formats: ["jpg", "png", "jpeg", "jfif"],
  },
});

// Gallery image storage (separate folder)
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Gallery",
    allowed_formats: ["jpg", "png", "jpeg", "jfif"],
  },
});

// Gallery image storage (separate folder)
const teamStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Team",
    allowed_formats: ["jpg", "png", "jpeg", "jfif"],
  },
});

const aboutStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "About",
    allowed_formats: ["jpg", "png", "jpeg", "jfif", "avif"],
  },
});

const BlogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Blog",
    allowed_formats: ["jpg", "png", "jpeg", "jfif"],
  },
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ProfileImages",
    allowed_formats: ["jpg", "jpeg", "png", "jfif"],
  },
});
const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EventImages",
    allowed_formats: ["jpg", "png", "jpeg", "jfif"],
  },
});
const roomStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Rooms",
    allowed_formats: ["jpg", "png", "jpeg", "jfif"],
  },
});

const uploadProfileImage = multer({ storage: profileStorage });
const uploadBlogImage = multer({ storage: BlogStorage });
const uploadAboutImage = multer({ storage: aboutStorage });
const uploadDishImage = multer({ storage: dishStorage });
const uploadGalleryImage = multer({ storage: galleryStorage });
const uploadTeamImage = multer({ storage: teamStorage });
const uploadEventImage = multer({ storage: eventStorage });
const uploadRoomImage = multer({ storage: roomStorage });

export {
  cloudinary,
  uploadDishImage,
  uploadGalleryImage,
  uploadTeamImage,
  uploadAboutImage,
  uploadBlogImage,
  uploadProfileImage,
  uploadEventImage,
  uploadRoomImage,
};
