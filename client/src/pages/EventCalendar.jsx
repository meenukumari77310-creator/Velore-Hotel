import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";
import timeGridPlugin from "@fullcalendar/timegrid"; // ⬅️ Add this plugin

const EventCalendar = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(apis().adminGetEvents, {
        credentials: "include",
      });
      const data = await res.json();

      // Transform data to match FullCalendar format
      const formatted = data
        .filter((event) => event.status !== "declined")
        .map((event) => ({
          title: `${event.name} (${event.eventType})`,
          start: `${event.date}T${event.time}`,
          backgroundColor: event.status === "confirmed" ? "#28a745" : "#ffc107",
          textColor: "#ffffff",
        }));

      setEvents(formatted);
    } catch {
      toast.error("Failed to load calendar events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="my-5">
      <h4 className="mb-3">📅 Event Calendar Overview</h4>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek" // or "dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  );
};

export default EventCalendar;
