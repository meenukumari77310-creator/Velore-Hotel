import React, { useEffect, useState } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

// Helper to convert "hh:mm AM/PM" to 24-hour "HH:mm"
const formatTo24Hour = (timeStr) => {
  if (!timeStr.includes("AM") && !timeStr.includes("PM")) return timeStr; // already 24-hour
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const AdminEventSettings = () => {
  const [settings, setSettings] = useState([]);

  // Fetch existing event settings
  useEffect(() => {
    fetch(apis().adminGetEventSettings(), { credentials: "include" })
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => toast.error("Failed to load settings"));
  }, []);

  // CREATE new event
  const handleCreateEvent = async () => {
  try {
    const uniqueName = `New Event ${Date.now()}`; // e.g., "New Event 1691984000000"
    const newEvent = {
      eventType: uniqueName,
      pricePerGuest: 0,
      timeSlots: [],
      dayPricing: [],
    };

    const res = await fetch(apis().adminAddEventSetting(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newEvent),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to create event");
    }

    const savedEvent = await res.json();
    setSettings((prev) => [savedEvent, ...prev]);
    toast.success("Event created!");
  } catch (err) {
    console.error(err);
    toast.error(err.message);
  }
};


  // Save updated data
  const handleSave = async (id, updatedData) => {
    try {
      // Convert all time slots to 24-hour format before saving
      const dataToSave = { ...updatedData };
      dataToSave.timeSlots = dataToSave.timeSlots.map((slot) => ({
        ...slot,
        start: formatTo24Hour(slot.start),
        end: formatTo24Hour(slot.end),
      }));

      await fetch(apis().adminUpdateEventSetting(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dataToSave),
      });
      toast.success("Updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // Add new Time Slot
  const addTimeSlot = (index) => {
    const updated = [...settings];
    updated[index].timeSlots.push({
      name: "New Slot",
      start: "00:00",
      end: "00:00",
      multiplier: 1,
    });
    setSettings(updated);
  };

  // Add new Day Pricing
  const addDayPricing = (index) => {
    const updated = [...settings];
    updated[index].dayPricing.push({
      name: "New Day",
      multiplier: 1,
      days: [],
      specialDates: [],
    });
    setSettings(updated);
  };

  // Delete entire event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetch(apis().adminDeleteEventSetting(id), {
        method: "DELETE",
        credentials: "include",
      });
      setSettings((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // Delete time slot
  const deleteTimeSlot = (eventIndex, slotIndex) => {
    if (!window.confirm("Delete this time slot?")) return;
    const updated = [...settings];
    updated[eventIndex].timeSlots.splice(slotIndex, 1);
    setSettings(updated);
  };

  // Delete day pricing slot
  const deleteDayPricing = (eventIndex, dayIndex) => {
    if (!window.confirm("Delete this day pricing slot?")) return;
    const updated = [...settings];
    updated[eventIndex].dayPricing.splice(dayIndex, 1);
    setSettings(updated);
  };

  return (
    <div className="container mt-4">
      <h3>⚙️ Event Price Settings</h3>

      {/* CREATE BUTTON */}
      <button
        className="btn btn-primary mb-3"
        onClick={handleCreateEvent}
      >
        ➕ Create New Event
      </button>

      {settings.map((event, i) => (
        <div key={event._id} className="mb-4 p-3 border rounded">
          <label>Event Name:</label>
          <input
            value={event.eventType}
            onChange={(e) => {
              const updated = [...settings];
              updated[i].eventType = e.target.value;
              setSettings(updated);
            }}
            className="form-control mb-2"
          />

          <label>Base Price per Guest (₹):</label>
          <input
            type="number"
            value={event.pricePerGuest}
            onChange={(e) => {
              const updated = [...settings];
              updated[i].pricePerGuest = Number(e.target.value);
              setSettings(updated);
            }}
            className="form-control mb-2"
          />

          <h6>Time Slots</h6>
          {event.timeSlots.map((slot, si) => (
            <div key={si} className="d-flex gap-2 mb-1 align-items-center">
              <input
                value={slot.name}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].timeSlots[si].name = e.target.value;
                  setSettings(updated);
                }}
                className="form-control"
                placeholder="Slot Name"
              />
              <input
                type="text"
                value={slot.start}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].timeSlots[si].start = e.target.value;
                  setSettings(updated);
                }}
                placeholder="Start Time (HH:mm or hh:mm AM/PM)"
                className="form-control"
              />
              <input
                type="text"
                value={slot.end}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].timeSlots[si].end = e.target.value;
                  setSettings(updated);
                }}
                placeholder="End Time (HH:mm or hh:mm AM/PM)"
                className="form-control"
              />
              <input
                type="number"
                value={slot.multiplier}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].timeSlots[si].multiplier = Number(e.target.value);
                  setSettings(updated);
                }}
                step="0.1"
                className="form-control"
              />
              <button
                onClick={() => deleteTimeSlot(i, si)}
                className="btn btn-sm btn-outline-danger"
              >
                🗑
              </button>
            </div>
          ))}
          <button
            onClick={() => addTimeSlot(i)}
            className="btn btn-sm btn-outline-primary mt-1"
          >
            + Add Time Slot
          </button>

          <h6 className="mt-3">Day Pricing</h6>
          {event.dayPricing.map((day, di) => (
            <div key={di} className="mb-2 p-2 border rounded">
              <input
                value={day.name || ""}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].dayPricing[di].name = e.target.value;
                  setSettings(updated);
                }}
                className="form-control mb-1"
                placeholder="Day Name"
              />

              <input
                type="text"
                value={day.daysInput ?? day.days?.join(",") ?? ""}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].dayPricing[di].daysInput = e.target.value;
                  setSettings(updated);
                }}
                onBlur={(e) => {
                  const updated = [...settings];
                  updated[i].dayPricing[di].days = e.target.value
                    .split(",")
                    .map((d) => d.trim())
                    .filter(Boolean)
                    .map(Number);
                  delete updated[i].dayPricing[di].daysInput;
                  setSettings(updated);
                }}
                className="form-control mb-1"
                placeholder="Days of Week (0=Sun,...6=Sat)"
              />

              <input
                type="text"
                value={day.specialDates?.join(",") || ""}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].dayPricing[di].specialDates = e.target.value
                    .split(",")
                    .map((d) => d.trim());
                  setSettings(updated);
                }}
                className="form-control mb-1"
                placeholder="Special Dates (YYYY-MM-DD)"
              />

              <input
                type="number"
                value={day.multiplier}
                onChange={(e) => {
                  const updated = [...settings];
                  updated[i].dayPricing[di].multiplier = Number(e.target.value);
                  setSettings(updated);
                }}
                step="0.1"
                className="form-control mb-1"
                placeholder="Multiplier"
              />

              <button
                onClick={() => deleteDayPricing(i, di)}
                className="btn btn-sm btn-outline-danger mt-1"
              >
                🗑 Remove Day Pricing
              </button>
            </div>
          ))}
          <button
            onClick={() => addDayPricing(i)}
            className="btn btn-sm btn-outline-primary mt-1"
          >
            + Add Day Pricing
          </button>

          <div className="mt-3 d-flex gap-2">
            <button
              onClick={() => handleSave(event._id, event)}
              className="btn btn-success"
            >
              Save Changes
            </button>
            <button
              onClick={() => handleDeleteEvent(event._id)}
              className="btn btn-danger"
            >
              🗑 Delete Event
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminEventSettings;
