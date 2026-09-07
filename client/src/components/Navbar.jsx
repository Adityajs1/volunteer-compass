import { useState } from "react";
import { T } from "../theme";
import { useAuth } from "../context/AuthContext";

const PAGES = ["home", "dashboard", "about", "contact"];

export default function Navbar({ page, setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 60,
      background: "rgba(10,26,18,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      {/* Logo */}
      <div
        onClick={() => setPage("home")}
        style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", userSelect: "none" }}
      >
        <span style={{
          background: T.gold, color: T.ink,
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: "0.9rem", padding: "4px 9px",
          borderRadius: 7, letterSpacing: "-0.3px",
        }}>
          vc.
        </span>
        <span style={{
          fontWeight: 800, fontSize: "0.95rem",
          color: "#fff", letterSpacing: "-0.3px",
        }}>
          volunteer compass.
        </span>
      </div>

      {/* Desktop Links */}
      <div style={{ display: "flex", gap: 2 }}>
        {PAGES.map((p) => (
          <NavBtn key={p} label={p} active={page === p} onClick={() => setPage(p)} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user ? (
          <>
            {user.role === 'VOLUNTEER' && (
              <button
                onClick={() => setPage('hours')}
                style={{
                  background: 'none', color: 'rgba(255,255,255,0.55)', border: 'none',
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '0.72rem',
                  textTransform: 'uppercase', letterSpacing: '0.8px',
                  cursor: 'pointer', padding: '6px 10px',
                }}
              >
                My Hours
              </button>
            )}
            {user.role === 'ORGANIZER' && (
              <button
                onClick={() => setPage('create-event')}
                style={{
                  background: T.gold, color: T.ink, border: 'none',
                  padding: '8px 14px', borderRadius: 9,
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer',
                }}
              >
                + Create Event
              </button>
            )}
            <button
              onClick={() => setPage("profile")}
              style={{
                background: "none", color: "#fff", border: "none",
                fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", textDecoration: "underline"
              }}
            >
              {user.name}
            </button>
            <button
              onClick={logout}
              style={{
                background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
                padding: "8px 16px", borderRadius: 9,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setPage("login")}
              style={{
                background: "none", color: "rgba(255,255,255,0.7)", border: "none",
                fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
                padding: "8px 12px"
              }}
            >
              Log In
            </button>
            <button
              onClick={() => setPage("signup")}
              onMouseEnter={e => { e.currentTarget.style.background = T.gold2; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.transform = "none"; }}
              style={{
                background: T.gold, color: T.ink, border: "none",
                padding: "8px 18px", borderRadius: 9,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontWeight: 800, fontSize: "0.78rem",
                letterSpacing: "-0.2px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Sign Up →
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function NavBtn({ label, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active || hover ? "rgba(255,255,255,0.07)" : "none",
        border: "none", cursor: "pointer",
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 700, fontSize: "0.72rem",
        textTransform: "uppercase", letterSpacing: "0.8px",
        color: active ? T.gold2 : hover ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)",
        padding: "6px 12px", borderRadius: 8,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
