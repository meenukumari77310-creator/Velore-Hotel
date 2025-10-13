import React, { useEffect, useState } from "react";
import ReviewSection from "../pages/ReviewSection";
import { Modal, Button } from "react-bootstrap";
import { apis } from "../utils/apis";
import { useInView } from "react-intersection-observer";
import { FaHeart, FaUserEdit, FaComments } from "react-icons/fa";
import * as Icons from "react-icons/fa";
import "animate.css";
import "../App.css";
import TeamMemberDetails from "./TeamMemberDetails"; // make sure path is correct

const About = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showFeedbackList, setShowFeedbackList] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [team, setTeam] = useState([]);
  const [missions, setMissions] = useState([]);
  const [intro, setIntro] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [imageTextRef, imageTextInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    fetchIntro();
    fetchReviews();
    fetchTeam();
    fetchMissions();
  }, []);

  const fetchIntro = async () => {
    try {
      const res = await fetch(apis().userIntro, {
        credentials: "include",
      });
      const data = await res.json();
      setIntro(data);
    } catch (err) {
      console.error("Failed to load intro", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(apis().getReview, { credentials: "include" });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch(apis().Team, { credentials: "include" });
      const data = await res.json();
      setTeam(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load team members", err);
    }
  };

  const fetchMissions = async () => {
    try {
      const res = await fetch(apis().userMission, { credentials: "include" });
      const data = await res.json();
      setMissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch missions", err);
    }
  };

  const handleReviewAdded = () => {
    fetchReviews();
    setShowReviewForm(false);
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center fw-bold mb-4">About Us</h2>
        <p className="text-center text-muted mb-5">
          Learn more about our mission, values, and the people behind the
          experience.
        </p>

        {/* ABOUT INTRO SECTION */}
        {intro && (
          <div
            ref={imageTextRef}
            className={`row align-items-center mb-5 ${
              imageTextInView ? "animate__animated animate__fadeInLeft" : ""
            }`}
          >
            <div className="col-md-6">
              <img
                src={intro.imageUrl || "https://via.placeholder.com/600x400"}
                alt="Intro"
                className="img-fluid rounded shadow"
                style={{
                  maxWidth: "45vw",
                  height: "45vh",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="col-md-6">
              <h4 className="fw-bold">{intro.header}</h4>
              <div dangerouslySetInnerHTML={{ __html: intro.subHeader }} />
            </div>
          </div>
        )}

        {/* MISSION SECTION */}
        <div className="row text-center mb-5">
          {missions.map(({ _id, icon, title, description }) => {
            const IconComponent = Icons[icon] || FaHeart;
            return (
              <div key={_id} className="col-md-4 mb-4">
                <div className="p-4 bg-white shadow rounded h-100">
                  <div className="mb-3">
                    <IconComponent size={40} />
                  </div>
                  <h5 className="fw-bold">{title}</h5>
                  <p className="text-muted">{description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* TEAM SECTION */}
        <div className="text-center mb-5">
          <h3 className="mb-3 fw-bold">Meet Our Team</h3>
          <div className="row justify-content-center">
            {team.map(({ name, role, image, _id }) => (
              <div key={_id} className="col-6 col-md-4 mb-4">
                <div className="card team-card border-0 shadow text-center h-100">
                  <img
                    src={image || "https://via.placeholder.com/120"}
                    className="rounded-circle mx-auto mt-4"
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                    alt={name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="text-muted">{role}</p>
                    <button
                      onClick={() => setSelectedTeamId(_id)}
                      className="btn btn-link text-decoration-none p-0 fw-bold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="text-center mb-4">
          <Button
            variant="outline-success"
            onClick={() => setShowReviewForm(true)}
            className="me-3"
          >
            <FaUserEdit className="me-2" /> Write a Review
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => setShowFeedbackList(true)}
          >
            <FaComments className="me-2" /> Show Feedback
          </Button>
        </div>
      </div>

      {/* REVIEW MODAL */}
      <Modal
        show={showReviewForm}
        onHide={() => setShowReviewForm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReviewSection
            onlyDisplay={false}
            onReviewAdded={handleReviewAdded}
          />
        </Modal.Body>
      </Modal>

      {/* FEEDBACK MODAL */}
      <Modal
        show={showFeedbackList}
        onHide={() => setShowFeedbackList(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReviewSection reviews={reviews} onlyDisplay={true} />
        </Modal.Body>
      </Modal>

      {selectedTeamId && (
        <TeamMemberDetails
          id={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
    </section>
  );
};

export default About;
