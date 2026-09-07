import { useState } from "react";
import { T } from "../theme";
import { createEventApi } from "../api/events.api";
import { useToast } from "../context/ToastContext";

export default function CreateEvent({ setPage }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    locationQuery: "",
    latitude: 28.6139,
    longitude: 77.2090,
    maxVolunteers: 10,
    skills: "" // comma separated list
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleLocationSearch = (e) => {
    const q = e.target.value;
    setFormData(prev => ({ ...prev, locationQuery: q }));
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (q.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        // Restricted to India using countrycodes=in
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=in&addressdetails=1`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handleSelectLocation = (loc) => {
    setFormData(prev => ({
      ...prev,
      locationQuery: loc.display_name,
      latitude: parseFloat(loc.lat),
      longitude: parseFloat(loc.lon),
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        address: formData.locationQuery,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        maxVolunteers: parseInt(formData.maxVolunteers, 10),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      await createEventApi(payload);
      addToast("Event created successfully! 🎉", "success");
      setPage("dashboard");
    } catch (err) {
      addToast(err.response?.data?.message || err.message || "Failed to create event", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "80px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2.4rem", color: T.ink, marginBottom: 8, letterSpacing: "-1px", fontWeight: 900 }}>Launch Event</h1>
      <p style={{ color: T.muted, fontSize: "0.95rem", marginBottom: 32 }}>Create a custom opportunity for volunteers near you.</p>

      <form onSubmit={handleSubmit} style={{ background: T.white, border: `1px solid ${T.border}`, padding: "32px 28px", borderRadius: 20 }}>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>EVENT TITLE</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Park Cleanup Drive" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>DESCRIPTION</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} placeholder="Describe the volunteer opportunity..." style={{...inputStyle, minHeight: 100, resize: "vertical"}} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>START TIME</label>
            <input required type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>END TIME</label>
            <input required type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 20, position: "relative" }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>LOCATION / ADDRESS</label>
          <input 
            required 
            type="text" 
            value={formData.locationQuery} 
            onChange={handleLocationSearch} 
            placeholder="Search for an address or place (e.g. Central Park, NY)..." 
            style={{...inputStyle, background: (formData.latitude && formData.locationQuery) ? "#f0fdf4" : inputStyle.background}} 
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10, background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, marginTop: 4, maxHeight: 200, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              {suggestions.map((loc, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelectLocation(loc)}
                  style={{ padding: "10px 14px", borderBottom: idx === suggestions.length - 1 ? "none" : `1px solid ${T.border}`, cursor: "pointer", fontSize: "0.85rem", color: T.ink }}
                  onMouseEnter={(e) => e.currentTarget.style.background = T.cream}
                  onMouseLeave={(e) => e.currentTarget.style.background = T.white}
                >
                  {loc.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>MAX VOLUNTEERS</label>
            <input required type="number" min="1" name="maxVolunteers" value={formData.maxVolunteers} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>REQUIRED SKILLS (COMMAS)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., Environment, Logistics" style={inputStyle} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: "100%", background: T.ink, color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: "0.95rem", fontWeight: 700, fontFamily: "'Cabinet Grotesk', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating..." : "Launch Event"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", border: `1px solid ${T.border}`, borderRadius: 10,
  fontSize: "0.9rem", color: T.ink, fontFamily: "'Cabinet Grotesk', sans-serif", outline: "none",
  background: "#fdfaf4"
};
