import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";
import "../App.css";

const UserEventView = () => {
  const [generalInfo, setGeneralInfo] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(apis().userGetEventInfo, { credentials: "include" })
      .then((res) => res.json())
      .then((data) =>
        setGeneralInfo(data.filter((info) => info.description || info.imageUrl))
      )
      .catch(() => toast.error("Failed to load general info"));

    fetch(apis().userGetEventSetting, { credentials: "include" })
      .then((res) => res.json())
      .then((data) =>
        setEvents(data.filter((event) => event.description || event.imageUrl))
      )
      .catch(() => toast.error("Failed to load events"));
  }, []);

  // Event Card Row (used for Available Events only)
  // Event Card Row (used for Available Events only)
const EventRow = ({ title, image, description, reverse }) => (
  <div className={`event-row ${reverse ? "reverse" : ""}`}>
    {image && (
      <div className="event-image">
        <img src={image} alt={title || "Event Image"} />
      </div>
    )}
    <div className="event-text">
      {title && <h3>{title}</h3>}
      {description && (
        <div dangerouslySetInnerHTML={{ __html: description }} />
      )}

      {/* Book Event Button */}
      {title && (
        <button
          className="btn btn-primary mt-3"
          onClick={() => (window.location.href = `/event-catering?eventType=${encodeURIComponent(title)}`)}
        >
          Book {title}
        </button>
      )}
    </div>
  </div>
);


  return (
    <div className="event-container">
      {/* Event Info (shown normally) */}
      {generalInfo.length > 0 && (
        <section>
          <h2 className="section-title">🎉 Event Info</h2>
          {generalInfo.map((info, index) => (
            <div key={info._id || index} className="general-info">
              {info.title && <h3>{info.title}</h3>}
              {info.imageUrl && (
                <img
                  src={info.imageUrl}
                  alt={info.title || "General Info"}
                  className="general-image"
                />
              )}
              {info.description && (
                <div dangerouslySetInnerHTML={{ __html: info.description }} />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Available Events (cards) */}
      {events.length > 0 && (
        <section>
          <h2 className="section-title">🎊 Available Events</h2>
          {events.map((event, index) => (
            <EventRow
              key={event._id || index}
              title={event.eventType}
              image={event.imageUrl}
              description={event.description}
              reverse={index % 2 !== 0}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default UserEventView;
