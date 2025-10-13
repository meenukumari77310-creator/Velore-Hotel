import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import "../App.css";

const Images = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(apis().galleryUser, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid image list");
        setImages(data);
      } catch (err) {
        console.error("Failed to fetch images", err);
        setError("Could not load images.");
      }
    };

    fetchImages();
  }, []);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 text-danger">Our Restaurant Images</h2>
        {error && <p className="text-center text-danger">{error}</p>}

        <div className="row g-4">
          {images.map((img, index) => (
            <div className="col-sm-6 col-md-4" key={index}>
              <div className="card shadow-sm">
                <img
                  src={img.url} // ✅ use img.url instead of just img
                  alt={`restaurant-${index}`}
                  className="card-img-top"
                  style={{ height: "250px", objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Images;
