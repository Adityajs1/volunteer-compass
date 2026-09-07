import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { T } from '../theme';

// Fix default marker icon broken by Vite's asset pipeline
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Green custom icon for events
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Gold icon for user's current location
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Subcomponent: re-center the map when userLocation changes
function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.setView([lat, lon], 12);
  }, [lat, lon, map]);
  return null;
}

export default function EventMap({ events, userLocation, onJoin }) {
  // Default center: India
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [20.5937, 78.9629];

  const eventsWithCoords = events.filter(
    (e) => e.latitude != null && e.longitude != null
  );

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${T.border}`, height: 480 }}>
      <MapContainer
        center={center}
        zoom={userLocation ? 12 : 5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recenter whenever user's location changes */}
        {userLocation && (
          <RecenterMap lat={userLocation.lat} lon={userLocation.lng} />
        )}

        {/* User location pin */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={goldIcon}>
            <Popup>
              <strong>📍 You are here</strong>
            </Popup>
          </Marker>
        )}

        {/* Event pins */}
        {eventsWithCoords.map((ev) => (
          <Marker
            key={ev.id}
            position={[ev.latitude, ev.longitude]}
            icon={greenIcon}
          >
            <Popup minWidth={200}>
              <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 4, color: '#0A1A12' }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#527060', marginBottom: 2 }}>
                  {ev.org} · {ev.date}
                </div>
                <div style={{ fontSize: '0.78rem', marginBottom: 10 }}>
                  <span style={{ color: ev.spots < 5 ? '#DC2626' : '#1A7A52', fontWeight: 700 }}>
                    {ev.spots} spot{ev.spots !== 1 ? 's' : ''} left
                  </span>
                </div>
                {!ev.joined && ev.spots > 0 && (
                  <button
                    onClick={() => onJoin(ev.id)}
                    style={{
                      background: '#1A7A52', color: '#fff', border: 'none',
                      borderRadius: 7, padding: '6px 14px', fontWeight: 700,
                      fontSize: '0.78rem', cursor: 'pointer', width: '100%',
                    }}
                  >
                    Join →
                  </button>
                )}
                {ev.joined && (
                  <div style={{ color: '#1A7A52', fontWeight: 700, fontSize: '0.78rem', textAlign: 'center' }}>
                    ✅ You're joined!
                  </div>
                )}
                {ev.spots === 0 && !ev.joined && (
                  <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.78rem', textAlign: 'center' }}>
                    Event Full
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {eventsWithCoords.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.95)', padding: '16px 24px',
            borderRadius: 12, zIndex: 1000, textAlign: 'center',
            fontSize: '0.9rem', color: '#527060',
          }}>
            No events with location data found nearby.
          </div>
        )}
      </MapContainer>
    </div>
  );
}
