import { T } from "../theme";

const LINKS = [
  { label: "Privacy",  page: "about" },
  { label: "Terms",    page: "about" },
  { label: "Blog",     page: "about" },
  { label: "Contact",  page: "contact" },
];

export default function Footer({ setPage }) {
  return (
    <footer style={{
      background: T.white,
      borderTop: `1px solid ${T.border}`,
      padding: "28px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 14,
    }}>
      {/* Logo */}
      <div
        onClick={() => setPage("home")}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
      >
        <span style={{
          background: T.gold, color: T.ink,
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: "0.8rem", padding: "3px 8px", borderRadius: 7,
        }}>
          vc.
        </span>
        <span style={{ fontWeight: 800, fontSize: "0.9rem", color: T.ink }}>
          volunteer compass.
        </span>
      </div>

      <p style={{ fontSize: "0.78rem", color: T.muted }}>
        © 2026 VolunteerCompass · Mapping the path to social good.
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        {LINKS.map(({ label, page }) => (
          <span
            key={label}
            onClick={() => setPage(page)}
            style={{
              fontSize: "0.78rem", color: T.muted,
              cursor: "pointer", fontWeight: 600,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.ink}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >
            {label}
          </span>
        ))}
      </div>
    </footer>
  );
}
