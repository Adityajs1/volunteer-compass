import { useState } from "react";
import { T } from "../theme";

const CONTACT_ITEMS = [
  { icon: "✉️", label: "Email",     value: "hello@volunteercompass.org" },
  { icon: "💬", label: "Live Chat", value: "Mon–Fri, 9 AM–6 PM IST" },
  { icon: "📍", label: "Location",  value: "New Delhi, India" },
  { icon: "🐦", label: "Twitter",   value: "@volunteercompass" },
  { icon: "💼", label: "LinkedIn",  value: "linkedin.com/company/volunteercompass" },
];

function ContactItem({ icon, label, value }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"flex", alignItems:"center", gap:14,
        background:T.white, padding:"14px 18px", borderRadius:12,
        border:`1px solid ${hover ? T.leaf2 : T.border}`,
        transition:"border-color 0.2s", cursor:"default",
      }}
    >
      <span style={{ fontSize:"1.1rem" }}>{icon}</span>
      <div>
        <div style={{ fontSize:"0.68rem", color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</div>
        <div style={{ fontSize:"0.9rem", color:T.ink, fontWeight:600, marginTop:1 }}>{value}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:"0.75rem", fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</label>
      {children}
    </div>
  );
}

const INPUT_BASE = {
  background: T.cream,
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: "0.88rem",
  color: T.ink,
  fontFamily: "'Cabinet Grotesk', sans-serif",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
};

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
  };

  const reset = () => {
    setForm({ name:"", email:"", subject:"", message:"" });
    setErrors({});
    setSent(false);
  };

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div style={{
      maxWidth: 900, margin: "0 auto", padding: "72px 24px",
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 48, alignItems: "start",
    }}>

      {/* ── LEFT: Info ── */}
      <div>
        <p style={{ fontSize:"0.7rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1.8px", color:T.leaf2, marginBottom:12 }}>
          Reach Out
        </p>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"2.4rem", color:T.ink, letterSpacing:"-1.5px", marginBottom:12 }}>
          Get in Touch
        </h1>
        <p style={{ color:T.muted, marginBottom:32, lineHeight:1.75 }}>
          Have questions, want to partner, or need help getting started? We respond within 24 hours.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {CONTACT_ITEMS.map((item, i) => <ContactItem key={i} {...item} />)}
        </div>

        {/* Map hint */}
        <div style={{ marginTop:28, background:T.cream2, borderRadius:14, padding:"16px 18px", border:`1px solid ${T.border}` }}>
          <div style={{ fontWeight:800, fontSize:"0.82rem", color:T.ink, marginBottom:4 }}>📌 Visit us</div>
          <div style={{ fontSize:"0.8rem", color:T.muted, lineHeight:1.6 }}>
            Connaught Place, New Delhi — 110001<br/>
            Open Mon–Fri, 10 AM – 5 PM IST
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:24, padding:"32px 28px" }}>
        {sent ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ fontSize:"2.8rem", marginBottom:16 }}>🎉</div>
            <h3 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"1.4rem", color:T.ink, marginBottom:10 }}>
              Message Sent!
            </h3>
            <p style={{ color:T.muted, fontSize:"0.9rem", lineHeight:1.65 }}>
              Thank you for reaching out.<br/>We'll reply within 24 hours.
            </p>
            <button
              onClick={reset}
              style={{ marginTop:24, background:T.leaf, color:"#fff", border:"none", borderRadius:9, padding:"10px 22px", fontWeight:700, fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Cabinet Grotesk',sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.background = T.leaf2}
              onMouseLeave={e => e.currentTarget.style.background = T.leaf}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <h3 style={{ fontWeight:800, fontSize:"1rem", color:T.ink, marginBottom:4 }}>Send a Message</h3>

            {/* Name */}
            <Field label="Your Name">
              <input
                type="text" value={form.name} onChange={set("name")}
                placeholder="e.g. Priya Sharma"
                style={{ ...INPUT_BASE, borderColor: errors.name ? "#E53E3E" : T.border }}
                onFocus={e => e.target.style.borderColor = T.leaf2}
                onBlur={e  => e.target.style.borderColor = errors.name ? "#E53E3E" : T.border}
              />
              {errors.name && <span style={{ fontSize:"0.72rem", color:"#E53E3E" }}>{errors.name}</span>}
            </Field>

            {/* Email */}
            <Field label="Email Address">
              <input
                type="email" value={form.email} onChange={set("email")}
                placeholder="you@example.com"
                style={{ ...INPUT_BASE, borderColor: errors.email ? "#E53E3E" : T.border }}
                onFocus={e => e.target.style.borderColor = T.leaf2}
                onBlur={e  => e.target.style.borderColor = errors.email ? "#E53E3E" : T.border}
              />
              {errors.email && <span style={{ fontSize:"0.72rem", color:"#E53E3E" }}>{errors.email}</span>}
            </Field>

            {/* Subject */}
            <Field label="Subject (optional)">
              <select
                value={form.subject}
                onChange={set("subject")}
                style={{ ...INPUT_BASE, cursor:"pointer" }}
              >
                <option value="">Select a topic…</option>
                <option value="volunteer">I want to volunteer</option>
                <option value="ngo">I represent an NGO</option>
                <option value="partner">Partnership inquiry</option>
                <option value="press">Press & media</option>
                <option value="other">Other</option>
              </select>
            </Field>

            {/* Message */}
            <Field label="Your Message">
              <textarea
                value={form.message} onChange={set("message")}
                placeholder="Tell us how we can help…"
                rows={4}
                style={{ ...INPUT_BASE, resize:"vertical", borderColor: errors.message ? "#E53E3E" : T.border }}
                onFocus={e => e.target.style.borderColor = T.leaf2}
                onBlur={e  => e.target.style.borderColor = errors.message ? "#E53E3E" : T.border}
              />
              {errors.message && <span style={{ fontSize:"0.72rem", color:"#E53E3E" }}>{errors.message}</span>}
            </Field>

            <button
              type="submit"
              style={{ background:T.leaf, color:"#fff", border:"none", borderRadius:10, padding:"13px", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", fontFamily:"'Cabinet Grotesk',sans-serif", marginTop:4, transition:"background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = T.leaf2}
              onMouseLeave={e => e.currentTarget.style.background = T.leaf}
            >
              Send Message →
            </button>
          </form>
        )}
      </div>

      {/* Responsive fix for small screens */}
      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
