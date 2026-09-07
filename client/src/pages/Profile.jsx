import { useState, useEffect } from "react";
import { T } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import apiClient from "../api/client";

export default function Profile({ setPage }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        city: user.city || "",
      });
    } else {
      setPage("home");
    }
  }, [user, setPage]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create user.api wrapper directly in client for ease
      await apiClient.put("/users/profile", formData);
      addToast("Profile updated successfully", "success");
      
      // Update local storage slightly (hacky but it works to reflect name changes instantly without full relogin)
      const cached = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...cached, name: formData.name, city: formData.city }));
      
      // Force reload to sync contexts safely
      window.location.reload();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "80px auto", padding: "0 24px" }}>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "2.4rem", color: T.ink, marginBottom: 8, letterSpacing: "-1px", fontWeight: 900 }}>Your Profile</h1>
      <p style={{ color: T.muted, fontSize: "0.95rem", marginBottom: 32 }}>Update your personal details below.</p>

      <form onSubmit={handleSubmit} style={{ background: T.white, border: `1px solid ${T.border}`, padding: "32px 28px", borderRadius: 20 }}>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>FULL NAME</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 30 }}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: T.muted, marginBottom: 6 }}>CITY</label>
          <input required type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: "100%", background: T.leaf, color: "#fff", border: "none", padding: "14px", borderRadius: 12, fontSize: "0.95rem", fontWeight: 700, fontFamily: "'Cabinet Grotesk', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Saving..." : "Save Changes"}
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
