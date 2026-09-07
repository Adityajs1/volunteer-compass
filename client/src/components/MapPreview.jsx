import { useState, useEffect } from "react";
import { T } from "../theme";
import RealMap from "./RealMap";
import { getEventsApi } from "../api/events.api";

// New Delhi as last-resort fallback only
const INDIA_FALLBACK = { lat: 28.6139, lng: 77.2090 };

export default function MapPreview({ onOpenMap }) {
  const [events, setEvents] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch the user's real GPS position
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Permission denied or unavailable — fall back to Delhi
          setUserLocation(INDIA_FALLBACK);
        },
        { timeout: 6000 }
      );
    } else {
      setUserLocation(INDIA_FALLBACK);
    }
  }, []);

  useEffect(() => {
    getEventsApi().then(res => {
      setEvents(res.data.events || res.data || []);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <div style={{
      maxWidth: 760, margin: "0 auto",
      background: T.white, border: `1px solid ${T.border}`,
      borderRadius: 32, overflow: "hidden",
      boxShadow: "0 24px 72px rgba(10,26,18,0.12)",
    }}>
      {/* Canvas */}
      <div style={{ height: 320, position: "relative" }}>
        <RealMap events={events} userLocation={userLocation} />
      </div>

      {/* Bar */}
      <div style={{
        padding: "14px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: `1px solid ${T.border}`,
        background: T.white,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: T.leaf2,
            animation: "mapPulse 2s ease-in-out infinite",
          }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.8rem", color: T.ink }}>
              24 events near you
            </div>
            <div style={{ fontSize: "0.7rem", color: T.muted, marginTop: 1 }}>
              Showing opportunities within 10 km
            </div>
          </div>
        </div>
        <button
          onClick={onOpenMap}
          onMouseEnter={e => e.currentTarget.style.background = T.ink2}
          onMouseLeave={e => e.currentTarget.style.background = T.ink}
          style={{
            background: T.ink, color: "#fff", border: "none",
            borderRadius: 8, padding: "7px 14px",
            fontSize: "0.73rem", fontWeight: 700,
            cursor: "pointer", transition: "background 0.2s",
            fontFamily: "'Cabinet Grotesk', sans-serif",
          }}
        >
          Open Full Map →
        </button>
      </div>

      <style>{`@keyframes mapPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
