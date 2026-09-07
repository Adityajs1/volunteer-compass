import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { T } from "../theme";

// Fix basic leaflet icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function RealMap({ events, userLocation }) {
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default to Delhi
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    if (userLocation?.lat && userLocation?.lng) {
      setCenter([userLocation.lat, userLocation.lng]);
    } else if (events.length > 0) {
      // Default center to first event if no user location
      const firstEvent = events.find(e => e.latitude && e.longitude);
      if (firstEvent) {
        setCenter([firstEvent.latitude, firstEvent.longitude]);
      }
    }
  }, [userLocation, events]);

  const customMarker = L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${T.leaf}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: 20, overflow: "hidden", zIndex: 10 }}>
      {typeof window !== "undefined" && (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <ChangeView center={center} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {events.map((ev) => {
            if (!ev.latitude || !ev.longitude) return null;
            return (
              <Marker key={ev.id} position={[ev.latitude, ev.longitude]} icon={customMarker}>
                <Popup>
                  <strong style={{ display: "block", fontSize: "14px", color: T.ink, marginBottom: 4 }}>{ev.title}</strong>
                  <span style={{ fontSize: "12px", color: T.muted }}>{new Date(ev.startDate).toLocaleDateString()}</span>
                  {ev.skills?.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: "12px", background: T.cream, padding: "2px 6px", borderRadius: 4, display: "inline-block" }}>
                      {ev.skills[0].skill.name}
                    </div>
                  )}
                </Popup>
              </Marker>
            );
          })}
          {userLocation?.lat && userLocation?.lng && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={L.divIcon({
                className: "user-marker",
                html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 4px rgba(59,130,246,0.3);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
              })} 
            >
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
  );
}
