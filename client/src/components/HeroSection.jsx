import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'animate.css';
import { apis } from '../utils/apis';

const HeroSection = () => {
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(apis().usergetHeroSection, { credentials: 'include' });
        const data = await res.json();
        setHero(data);
      } catch (err) {
        console.error('Failed to fetch hero section:', err);
      }
    };
    fetchHero();
  }, []);

  const getGreetingByTime = () => {
    if (!hero?.greetings) return "Welcome to our Hotel!";

    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return hero.greetings.morning || "Good Morning!";
    if (hour >= 12 && hour < 18) return hero.greetings.afternoon || "Good Afternoon!";
    if (hour >= 18 && hour < 22) return hero.greetings.evening || "Good Evening!";
    return hero.greetings.night || "Welcome!";
  };

  const handleExploreRooms = () => {
    navigate('/rooms');
  };

  return (
    <section
      className="hero-section position-relative text-white"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* Carousel */}
      {hero?.slides?.length > 0 ? (
        <Carousel
          autoPlay
          infiniteLoop
          interval={5000}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          showArrows={true}
          swipeable
          emulateTouch
          stopOnHover
          className="position-absolute top-0 start-0 w-100 h-100"
        >
          {hero.slides.map((slide, index) => (
            <div key={index}>
              <img
                src={slide.url}
                alt={`Slide ${index + 1}`}
                style={{ height: '100vh', objectFit: 'cover' }}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: '#000' }}></div>
      )}

      {/* Text Overlay */}
      <div
        className="container text-center position-absolute top-50 start-50 translate-middle"
        style={{ zIndex: 2 }}
      >
        <h1
          className="display-3 fw-bold animate__animated animate__fadeInDown"
          style={{
            color: hero?.textColor || '#fff',
            fontSize: hero?.fontSize || 36,
            textAlign: hero?.textAlign || 'center',
          }}
        >
          {getGreetingByTime()}
        </h1>
        <p className="lead mt-3 animate__animated animate__fadeInUp">
          {hero?.description || 'Luxurious rooms, serene ambiance, and world-class service. Book your perfect stay today.'}
        </p>
        <button
          onClick={handleExploreRooms}
          className="btn btn-lg btn-light mt-4 px-5 animate__animated animate__zoomIn text-primary fw-semibold"
        >
          Explore Rooms
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
