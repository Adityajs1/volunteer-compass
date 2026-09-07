import { useState } from "react";
import { T } from "../theme";
import { BtnGold, BtnGhost, BtnInk, BtnOutlineInk } from "../components/Buttons";
import MapPreview from "../components/MapPreview";

/* ── Feature Card ── */
function FeatureCard({ icon, title, desc, bg }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: T.white,
        border: `1px solid ${T.border}`,
        borderRadius: 22, padding: "28px 26px",
        position: "relative", overflow: "hidden",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "0 16px 40px rgba(10,26,18,0.10)" : "none",
        transition: "all 0.25s",
      }}
    >
      {/* top gradient bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2.5,
        background: `linear-gradient(90deg,${T.leaf},${T.gold})`,
        transform: hover ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left", transition: "transform 0.3s",
      }} />
      <div style={{
        width: 46, height: 46, borderRadius: 12, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.25rem", marginBottom: 18,
      }}>
        {icon}
      </div>
      <h3 style={{ fontWeight: 800, fontSize: "1rem", color: T.ink, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: "0.85rem", color: T.muted, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

/* ── Step Card ── */
function StepCard({ num, icon, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 22, padding: "32px 28px",
        position: "relative", overflow: "hidden",
        transition: "background 0.2s",
      }}
    >
      <div style={{
        position: "absolute", top: 18, right: 20,
        fontFamily: "'Fraunces', serif", fontWeight: 900,
        fontSize: "3.8rem", color: "rgba(255,255,255,0.06)",
        lineHeight: 1, letterSpacing: "-2px",
      }}>
        {num}
      </div>
      <div style={{ fontSize: "1.6rem", marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", marginBottom: 9 }}>{title}</h3>
      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

/* ── FEATURES DATA ── */
const FEATURES = [
  { icon: "📍", title: "Hyper-Local Discovery",    desc: "GPS-enabled map filtering makes finding local volunteer events completely effortless — see what's happening right now.",             bg: T.cream2 },
  { icon: "🎯", title: "Skills-Based Matching",     desc: "Contribute what you're actually great at — coding, design, teaching. Smart matching surfaces opportunities that fit.",          bg: T.gold3  },
  { icon: "🏅", title: "Verified Impact Tracking",  desc: "Every hour you give is officially logged and verified. Build a portfolio of impact you can share and be proud of.",             bg: T.cream2 },
  { icon: "🔔", title: "Smart Notifications",       desc: "Get alerted when new events matching your skills and location go live. Never miss an opportunity to give back.",                bg: T.gold3  },
  { icon: "🤝", title: "Organization Tools",        desc: "NGOs get a full dashboard to post events, manage volunteers, and track team impact in real time with zero friction.",           bg: T.cream2 },
  { icon: "📊", title: "Impact Analytics",          desc: "See your cumulative effect — hours contributed, people helped, and communities touched — all visualized beautifully.",         bg: T.gold3  },
];

const STEPS = [
  { num: "01", icon: "🧭", title: "Set Your Compass", desc: "Create your profile, add your skills, and set your location preferences. Takes under 2 minutes." },
  { num: "02", icon: "🗺️", title: "Explore the Map",  desc: "Browse a live map of opportunities near you. Filter by date, cause, or skill required to find your fit." },
  { num: "03", icon: "✨", title: "Show Up & Shine",   desc: "Join the event, make your impact, and earn verified hours added straight to your profile." },
];

/* ── HOME PAGE ── */
export default function Home({ setPage }) {
  return (
    <>
      {/* HERO */}
      <section style={{
        background: `linear-gradient(155deg,${T.ink} 0%,${T.ink2} 55%,${T.ink3} 100%)`,
        padding: "90px 24px 72px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
        minHeight: "92vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* decorative orbs */}
        <div style={{ position:"absolute", top:-100, right:-80, width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,160,32,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(61,214,140,0.08) 0%,transparent 70%)", pointerEvents:"none" }} />
        {/* dot grid */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize:"48px 48px",
          maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%)",
        }} />

        <div style={{ position:"relative", zIndex:2, maxWidth:800 }}>
          {/* pill */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:7,
            background:"rgba(232,160,32,0.15)", border:"1px solid rgba(232,160,32,0.35)",
            color:T.gold2, padding:"6px 16px", borderRadius:99,
            fontWeight:700, fontSize:"0.7rem", letterSpacing:"1px",
            textTransform:"uppercase", marginBottom:28,
            animation:"fadeUp 0.6s ease both",
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:T.gold, display:"inline-block", animation:"blink 1.8s ease-in-out infinite" }} />
            Intelligence-Driven Matching
          </div>

          <h1 style={{
            fontFamily:"'Fraunces', serif", fontWeight:900,
            fontSize:"clamp(3rem,6.5vw,5.4rem)",
            letterSpacing:"-3px", lineHeight:1.0,
            color:"#fff", marginBottom:22,
            animation:"fadeUp 0.7s 0.1s ease both",
          }}>
            Organize Good.<br />
            <em style={{ fontStyle:"italic", color:T.gold }}>Find Your Impact.</em>
          </h1>

          <p style={{
            fontSize:"1.08rem", color:"rgba(255,255,255,0.6)",
            maxWidth:520, margin:"0 auto 40px",
            lineHeight:1.75, fontWeight:400,
            animation:"fadeUp 0.7s 0.2s ease both",
          }}>
            Skilled volunteers go unmatched while events go understaffed.
            VolunteerCompass bridges the gap with a map-based, skills-first platform.
          </p>

          <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap", animation:"fadeUp 0.7s 0.3s ease both" }}>
            <BtnGold onClick={() => setPage("signup")}>Get Started →</BtnGold>
            <BtnGhost onClick={() => setPage("signup-org")}>For Organizations</BtnGhost>
          </div>

          {/* Stats strip */}
          <div style={{
            maxWidth:620, margin:"52px auto 0",
            background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:18, display:"flex", overflow:"hidden",
            animation:"fadeUp 0.7s 0.45s ease both",
          }}>
            {[
              { num:"12K+", label:"Active Volunteers" },
              { num:"840",  label:"Live Events"       },
              { num:"98%",  label:"Match Satisfaction"},
            ].map((s, i) => (
              <div key={i} style={{
                flex:1, padding:"20px 24px", textAlign:"center",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"1.7rem", color:T.gold, letterSpacing:"-1px", lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.45)", marginTop:4, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP PREVIEW */}
      <div style={{ padding:"64px 24px 72px", background:T.cream }}>
        <MapPreview onOpenMap={() => setPage("dashboard")} />
      </div>

      {/* FEATURES */}
      <section style={{ padding:"80px 24px", background:T.white }}>
        <div style={{ maxWidth:1020, margin:"0 auto" }}>
          <p style={{ fontSize:"0.7rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1.8px", color:T.leaf2, marginBottom:12 }}>
            Why VolunteerCompass
          </p>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"clamp(1.9rem,3.5vw,2.9rem)", color:T.ink, letterSpacing:"-1.5px", lineHeight:1.08, marginBottom:14 }}>
            Built for humans.<br />Powered by purpose.
          </h2>
          <p style={{ fontSize:"1rem", color:T.muted, maxWidth:480, lineHeight:1.7, marginBottom:52 }}>
            Everything you need to find the right opportunity and make your skills count where it matters most.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:18 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background:T.ink, padding:"80px 24px" }}>
        <div style={{ maxWidth:1020, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"clamp(2rem,3vw,2.7rem)", color:"#fff", letterSpacing:"-1.5px", textAlign:"center", marginBottom:52 }}>
            How it works
          </h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:22 }}>
            {STEPS.map((s, i) => <StepCard key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding:"80px 24px" }}>
        <div style={{
          maxWidth:760, margin:"0 auto", textAlign:"center",
          background:T.gold, borderRadius:32, padding:"72px 48px",
          position:"relative", overflow:"hidden",
          boxShadow:"0 20px 64px rgba(232,160,32,0.28)",
        }}>
          <div style={{ position:"absolute", top:-80, right:-80, width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.18)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:"rgba(10,26,18,0.08)", pointerEvents:"none" }} />
          <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"clamp(1.9rem,3.5vw,2.7rem)", color:T.ink, letterSpacing:"-1.2px", marginBottom:12, position:"relative", zIndex:2 }}>
            Ready to find your impact?
          </h2>
          <p style={{ fontSize:"1rem", color:"rgba(10,26,18,0.6)", marginBottom:38, position:"relative", zIndex:2 }}>
            Join 12,000+ volunteers already making a difference in their communities.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap", position:"relative", zIndex:2 }}>
            <BtnInk onClick={() => setPage("signup")}>Get Started Free</BtnInk>
            <BtnOutlineInk onClick={() => setPage("signup-org")}>For Organizations</BtnOutlineInk>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </>
  );
}
