import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { apis } from "../utils/apis";
import toast from "react-hot-toast";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const AdminUserGeographyChart = () => {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]); // new state for room bookings
  const [byCountry, setByCountry] = useState({
    bookings: {},
    orders: {},
    events: {},
    roomBookings: {}, // new field
    totalBookings: {},
    totalOrders: {},
    totalEvents: {},
    totalRoomBookings: {}, // new field
    combinedUniqueUsers: {},
  });
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(apis().getBooking, { method: "GET", credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch bookings");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(apis().order, { method: "GET", credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch orders");
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch(apis().adminGetEvents, { method: "GET", credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch event bookings");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch event bookings");
      }
    };

    const fetchRoomBookings = async () => {
      try {
        const res = await fetch(apis().getAllRoomBookings, { method: "GET", credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch room bookings");
        const data = await res.json();
        setRoomBookings(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch room bookings");
      }
    };

    fetchBookings();
    fetchOrders();
    fetchEvents();
    fetchRoomBookings(); // fetch room bookings
  }, []);

  const processData = (data) => {
    const usersMap = new Map();
    data.forEach((entry) => {
      const email = entry.email || "unknown";
      const country = entry.country || "Unknown";
      if (!usersMap.has(country)) usersMap.set(country, new Set());
      usersMap.get(country).add(email);
    });
    const obj = {};
    for (let [k, set] of usersMap.entries()) obj[k] = set.size;
    return obj;
  };

  const countEntriesByCountry = (data) => {
    const counts = {};
    data.forEach((entry) => {
      const country = entry.country || "Unknown";
      counts[country] = (counts[country] || 0) + 1;
    });
    return counts;
  };

  const getCombinedUniqueUsers = (bookings, orders, events, roomBookings) => {
    const combinedMap = new Map();
    const addToMap = (data) => {
      data.forEach(({ email = "unknown", country = "Unknown" }) => {
        if (!combinedMap.has(country)) combinedMap.set(country, new Set());
        combinedMap.get(country).add(email);
      });
    };
    addToMap(bookings);
    addToMap(orders);
    addToMap(events);
    addToMap(roomBookings); // include room bookings
    const obj = {};
    for (let [country, usersSet] of combinedMap.entries()) obj[country] = usersSet.size;
    return obj;
  };

  useEffect(() => {
    if (bookings.length || orders.length || events.length || roomBookings.length) {
      const totalBookings = processData(bookings);
      const totalOrders = processData(orders);
      const totalEvents = processData(events);
      const totalRoomBookings = processData(roomBookings); // process room bookings

      const bookingsCount = countEntriesByCountry(bookings);
      const ordersCount = countEntriesByCountry(orders);
      const eventsCount = countEntriesByCountry(events);
      const roomBookingsCount = countEntriesByCountry(roomBookings); // count room bookings

      const combinedUniqueUsers = getCombinedUniqueUsers(bookings, orders, events, roomBookings);

      setByCountry({
        bookings: bookingsCount,
        orders: ordersCount,
        events: eventsCount,
        roomBookings: roomBookingsCount,
        totalBookings,
        totalOrders,
        totalEvents,
        totalRoomBookings,
        combinedUniqueUsers,
      });
    }
  }, [bookings, orders, events, roomBookings]);

  const maxCount = Math.max(...Object.values(byCountry.combinedUniqueUsers || {}), 0);
  const colorScale = scaleLinear().domain([0, maxCount || 1]).range(["#e0f3ff", "#08306b"]);

  return (
    <div className="container my-5" style={{ position: "relative" }}>
      <h3>🌍 Users by Geography</h3>
      <ComposableMap projectionConfig={{ scale: 160 }} width={900} height={500}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name;
              const bookingCount = byCountry.bookings?.[name] || 0;
              const orderCount = byCountry.orders?.[name] || 0;
              const eventCount = byCountry.events?.[name] || 0;
              const roomBookingCount = byCountry.roomBookings?.[name] || 0;
              const combinedUsers = byCountry.combinedUniqueUsers?.[name] || 0;

              const content = `${name}
All Users (unique): ${combinedUsers}
Table Booking Entries: ${bookingCount}
Order Entries: ${orderCount}
Event Booking Entries: ${eventCount}
Room Booking Entries: ${roomBookingCount}`;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={combinedUsers ? colorScale(combinedUsers) : "#F5F4F6"}
                  stroke="#D6D6DA"
                  onMouseEnter={() => {
                    setTooltipContent(content);
                    setShowTooltip(true);
                  }}
                  onMouseMove={(e) => {
                    setTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 });
                  }}
                  onMouseLeave={() => setShowTooltip(false)}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#FF6F61", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {showTooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltipPos.y,
            left: tooltipPos.x,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "pre-line",
            fontSize: "13px",
            zIndex: 1000,
            maxWidth: "220px",
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default AdminUserGeographyChart;
