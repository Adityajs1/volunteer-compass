import { useState } from "react";
import { T } from "../theme";

export function BtnGold({ children, onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: hover ? T.gold2 : T.gold,
        color: T.ink, border: "none",
        padding: "13px 26px", borderRadius: 12,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 800, fontSize: "0.9rem",
        boxShadow: hover
          ? "0 12px 32px rgba(232,160,32,0.42)"
          : "0 8px 24px rgba(232,160,32,0.32)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "all 0.2s",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnGhost({ children, onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: hover ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)",
        color: "#fff",
        border: `1.5px solid ${hover ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.18)"}`,
        padding: "13px 26px", borderRadius: 12,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 700, fontSize: "0.9rem",
        transition: "all 0.2s", cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnInk({ children, onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? T.ink2 : T.ink,
        color: "#fff", border: "none",
        padding: "13px 28px", borderRadius: 12,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 800, fontSize: "0.9rem",
        boxShadow: "0 8px 24px rgba(10,26,18,0.28)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "all 0.2s", cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnOutlineInk({ children, onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(10,26,18,0.15)" : "rgba(10,26,18,0.08)",
        color: T.ink,
        border: `1.5px solid ${hover ? "rgba(10,26,18,0.28)" : "rgba(10,26,18,0.18)"}`,
        padding: "13px 28px", borderRadius: 12,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 700, fontSize: "0.9rem",
        transition: "all 0.2s", cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnLeaf({ children, onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? T.leaf2 : T.leaf,
        color: "#fff", border: "none",
        padding: "10px 22px", borderRadius: 10,
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 700, fontSize: "0.85rem",
        transition: "all 0.2s", cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
