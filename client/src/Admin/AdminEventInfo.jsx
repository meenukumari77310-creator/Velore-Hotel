import React, { useEffect, useState, useRef } from "react";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AdminEventInfo = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [sectionFile, setSectionFile] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventFile, setEventFile] = useState(null);

  // Refs for Quill editors
  const newDescRef = useRef(null);
  const sectionDescRef = useRef(null);
  const eventDescRef = useRef(null);
  const quillInstances = useRef({});

  // ------------------- Load Sections -------------------
  useEffect(() => {
    fetch(apis().adminGetEventInfo, { credentials: "include" })
      .then((res) => res.json())
      .then(setSections)
      .catch(() => toast.error("Failed to load sections"));
  }, []);

  // ------------------- Load Events -------------------
  useEffect(() => {
    fetch(apis().adminGetEventSettings(), { credentials: "include" })
      .then((res) => res.json())
      .then(setEvents)
      .catch(() => toast.error("Failed to load events"));
  }, []);

  // ------------------- Initialize New Section Editor -------------------
  useEffect(() => {
    if (newDescRef.current && !quillInstances.current.newDesc) {
      quillInstances.current.newDesc = new Quill(newDescRef.current, {
        theme: "snow",
        placeholder: "Enter description...",
      });
    }
  }, []);

  // ------------------- Section Editor -------------------
  useEffect(() => {
    if (sectionDescRef.current && selectedSection) {
      const instance = new Quill(sectionDescRef.current, {
        theme: "snow",
        placeholder: "Edit description...",
      });

      const selected = sections.find((s) => s._id === selectedSection);
      if (selected) {
        instance.root.innerHTML = selected.description || "";
      }

      quillInstances.current.section = instance;

      return () => {
        instance.off();
      };
    }
  }, [selectedSection, sections]);

  // ------------------- Event Editor -------------------
  useEffect(() => {
    if (eventDescRef.current && selectedEvent) {
      const instance = new Quill(eventDescRef.current, {
        theme: "snow",
        placeholder: "Edit event description...",
      });

      const selected = events.find((e) => e._id === selectedEvent);
      if (selected) {
        instance.root.innerHTML = selected.description || "";
      }

      quillInstances.current.event = instance;

      return () => {
        instance.off();
      };
    }
  }, [selectedEvent, events]);

  // ------------------- Section Handlers -------------------
  const handleSaveSection = async () => {
    if (!selectedSection) return toast.error("Select a section first");
    const section = sections.find((s) => s._id === selectedSection);

    try {
      const formData = new FormData();
      formData.append("title", section.title);
      formData.append(
        "description",
        quillInstances.current.section?.root.innerHTML || section.description
      );
      if (sectionFile) formData.append("image", sectionFile);

      await fetch(apis().adminUpdateEventInfo(selectedSection), {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      toast.success("Section updated!");
      setSectionFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save section");
    }
  };

  const handleAddSection = async () => {
    if (!newTitle) return toast.error("Enter title");
    const description = quillInstances.current.newDesc?.root.innerHTML || "";

    if (!description) return toast.error("Enter description");

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("description", description);
    if (sectionFile) formData.append("image", sectionFile);

    try {
      const res = await fetch(apis().adminAddEventInfo, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      setSections([...sections, data]);
      setNewTitle("");
      setSectionFile(null);
      quillInstances.current.newDesc.setText(""); // clear editor
      toast.success("New section added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add section");
    }
  };

  const handleDeleteSection = async () => {
    if (!selectedSection) return toast.error("Select a section first");
    try {
      await fetch(apis().adminDeleteEventInfo(selectedSection), {
        method: "DELETE",
        credentials: "include",
      });
      setSections(sections.filter((s) => s._id !== selectedSection));
      setSelectedSection("");
      toast.success("Section deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete section");
    }
  };

  // ------------------- Event Handlers -------------------
  const handleSaveEvent = async () => {
    if (!selectedEvent) return toast.error("Select an event first");
    const event = events.find((e) => e._id === selectedEvent);

    try {
      const formData = new FormData();
      formData.append(
        "description",
        quillInstances.current.event?.root.innerHTML || event.description
      );
      if (eventFile) formData.append("image", eventFile);

      await fetch(apis().adminUpdateEventSetting(selectedEvent), {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      toast.success("Event info updated!");
      setEventFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save event info");
    }
  };

  // ------------------- Render -------------------
  return (
    <div className="container mt-4">
      <h3>📝 Admin: Manage Event Info & Sections</h3>

      {/* Add New Section */}
      <div className="p-3 border rounded mb-4">
        <h5>Add New Section</h5>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <div ref={newDescRef} style={{ minHeight: "150px" }} />
        <input
          type="file"
          className="form-control mt-2"
          accept="image/*"
          onChange={(e) => setSectionFile(e.target.files[0])}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddSection}>
          Add Section
        </button>
      </div>

      {/* Select Section */}
      <select
        className="form-select mb-3"
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
      >
        <option value="">Select Section</option>
        {sections.map((s) => (
          <option key={s._id} value={s._id}>
            {s.title}
          </option>
        ))}
      </select>

      {/* Edit Selected Section */}
      {selectedSection && (
        <div className="p-3 border rounded mb-4">
          <label>Title:</label>
          <input
            type="text"
            className="form-control mb-2"
            value={sections.find((s) => s._id === selectedSection)?.title || ""}
            onChange={(e) => {
              const updated = [...sections];
              const idx = updated.findIndex((s) => s._id === selectedSection);
              updated[idx].title = e.target.value;
              setSections(updated);
            }}
          />

          <label>Description:</label>
          <div ref={sectionDescRef} style={{ minHeight: "150px" }} />

          <label>Choose Image:</label>
          <input
            type="file"
            className="form-control mb-2"
            accept="image/*"
            onChange={(e) => setSectionFile(e.target.files[0])}
          />

          {sectionFile ? (
            <img
              src={URL.createObjectURL(sectionFile)}
              alt="Preview"
              className="img-fluid mt-2"
            />
          ) : (
            sections.find((s) => s._id === selectedSection)?.imageUrl && (
              <img
                src={sections.find((s) => s._id === selectedSection)?.imageUrl}
                alt="Section"
                className="img-fluid mt-2"
              />
            )
          )}

          {/* Preview saved description */}
          <div className="mt-3">
            <h6>Preview:</h6>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  sections.find((s) => s._id === selectedSection)
                    ?.description || "",
              }}
            />
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-success" onClick={handleSaveSection}>
              Save Changes
            </button>
            <button className="btn btn-danger" onClick={handleDeleteSection}>
              Delete Section
            </button>
          </div>
        </div>
      )}

      {/* Fixed Events */}
      <h4>Manage Fixed Events</h4>
      <select
        className="form-select mb-3"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">Select Event</option>
        {events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.eventType}
          </option>
        ))}
      </select>

      {selectedEvent && (
        <div className="p-3 border rounded">
          <label>Description:</label>
          <div ref={eventDescRef} style={{ minHeight: "150px" }} />

          <label>Choose Image:</label>
          <input
            type="file"
            className="form-control mb-2"
            accept="image/*"
            onChange={(e) => setEventFile(e.target.files[0])}
          />

          {eventFile ? (
            <img
              src={URL.createObjectURL(eventFile)}
              alt="Preview"
              className="img-fluid mt-2"
            />
          ) : (
            events.find((e) => e._id === selectedEvent)?.imageUrl && (
              <img
                src={events.find((e) => e._id === selectedEvent)?.imageUrl}
                alt="Event"
                className="img-fluid mt-2"
              />
            )
          )}

          {/* Preview saved description */}
          <div className="mt-3">
            <h6>Preview:</h6>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  events.find((e) => e._id === selectedEvent)?.description || "",
              }}
            />
          </div>

          <button className="btn btn-success mt-3" onClick={handleSaveEvent}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminEventInfo;
