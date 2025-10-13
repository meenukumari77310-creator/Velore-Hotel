import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { apis } from "../utils/apis";

const TeamMemberDetailModal = ({ id, onClose }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(apis().TeamMember(id), {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!data || data.error) {
          setNotFound(true);
        } else {
          setMember(data);
        }
      } catch (err) {
        console.error("Failed to fetch team member details", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMember();
  }, [id]);

  return (
    <Modal show={!!id} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Team Member Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : notFound || !member ? (
          <div className="text-center py-5">
            <h5>Team member not found.</h5>
            <Button variant="primary" onClick={onClose} className="mt-3">
              Close
            </Button>
          </div>
        ) : (
          <div className="row align-items-top">
            <div className="col-md-4 text-center mb-3 mb-md-0">
              <img
                src={member.image || "/fallback-user.png"}
                alt={member.name}
                className="rounded-circle img-fluid shadow"
                style={{ width: 180, height: 180, objectFit: "cover" }}
              />
            </div>
            <div className="col-md-8">
              <h4 className="fw-bold">{member.name}</h4>
              <p className="text-muted">{member.role}</p>
              {member.email && (
                <p><strong>Email:</strong> {member.email}</p>
              )}
              {member.bio && (
                <p><strong>Bio:</strong> {member.bio}</p>
              )}
              {member.linkedin && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    {member.linkedin}
                  </a>
                </p>
              )}
              {member.twitter && (
                <p>
                  <strong>Twitter:</strong>{" "}
                  <a href={member.twitter} target="_blank" rel="noreferrer">
                    {member.twitter}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TeamMemberDetailModal;
