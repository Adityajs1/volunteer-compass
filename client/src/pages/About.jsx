import { T } from "../theme";
import { BtnGold } from "../components/Buttons";

const CARDS = [
  { icon: "📍", title: "Hyper-Local",      desc: "Discover opportunities exactly where you are using GPS mapping. Your community, your impact." },
  { icon: "🎯", title: "Skill-Based",       desc: "Contribute your unique skills — coding, design, teaching, logistics. We match you where you shine." },
  { icon: "🏅", title: "Verified Impact",   desc: "Official tracking for your volunteer hours and achievements. Your effort, permanently on record." },
  { icon: "🤝", title: "Community First",   desc: "Built by volunteers for volunteers. We put people and purpose above everything else." },
  { icon: "🌍", title: "Pan-India Reach",   desc: "From metros to tier-2 cities — VolunteerCompass connects every corner of the country to opportunity." },
  { icon: "🔒", title: "Safe & Trusted",    desc: "All organizations are verified before listing. Your safety and trust are our highest priority." },
];

const TEAM = [
  { initials: "YT", name: "Yash Tyagi",    color: "#E8F5E9", text: "#2E7D32" },
  { initials: "AS", name: "Aditya Sharma", color: "#E3F2FD", text: "#1565C0" },
  { initials: "VG", name: "Vasu Goel",     color: "#FDE9A8", text: "#92400E" },
  { initials: "CS", name: "Chandan Singh", color: "#FCE4EC", text: "#AD1457" },
];

export default function About({ setPage }) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 24px" }}>

      {/* Header */}
      <p style={{ fontSize:"0.7rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1.8px", color:T.leaf2, marginBottom:12, textAlign:"center" }}>
        Our Story
      </p>
      <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"clamp(2rem,4vw,3rem)", color:T.ink, letterSpacing:"-1.5px", textAlign:"center", marginBottom:16 }}>
        Why VolunteerCompass?
      </h1>
      <p style={{ fontSize:"1.05rem", color:T.muted, textAlign:"center", maxWidth:520, margin:"0 auto 52px", lineHeight:1.75 }}>
        We believe every skilled person has something valuable to give. We exist to make sure no one goes unmatched and no event goes understaffed.
      </p>

      {/* Value cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:22, marginBottom:64 }}>
        {CARDS.map((c, i) => (
          <div key={i} style={{ background:T.white, padding:30, borderRadius:22, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:"1.8rem", marginBottom:14 }}>{c.icon}</div>
            <h3 style={{ fontWeight:800, fontSize:"1.05rem", color:T.ink, marginBottom:9 }}>{c.title}</h3>
            <p style={{ fontSize:"0.88rem", color:T.muted, lineHeight:1.65 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission banner */}
      <div style={{ background:`linear-gradient(135deg,${T.ink} 0%,${T.ink2} 100%)`, borderRadius:28, padding:"48px 44px", marginBottom:64, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(232,160,32,0.1)", pointerEvents:"none" }} />
        <p style={{ fontSize:"0.7rem", fontWeight:800, textTransform:"uppercase", letterSpacing:"1.8px", color:T.gold2, marginBottom:12, position:"relative", zIndex:2 }}>Our Mission</p>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"clamp(1.6rem,3vw,2.2rem)", color:"#fff", letterSpacing:"-1px", lineHeight:1.15, marginBottom:16, maxWidth:540, position:"relative", zIndex:2 }}>
          Making social good scalable through technology.
        </h2>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.95rem", lineHeight:1.75, maxWidth:540, position:"relative", zIndex:2 }}>
          India has over 3 million NGOs and 450 million potential volunteers. Yet the gap between them remains enormous.
          VolunteerCompass exists to close that gap — one match at a time.
        </p>
      </div>

      {/* Team */}
      <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"1.8rem", color:T.ink, letterSpacing:"-1px", marginBottom:28, textAlign:"center" }}>
        Meet the team
      </h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:18, marginBottom:64 }}>
        {TEAM.map((m, i) => (
          <div key={i} style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 20px", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:m.color, color:m.text, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"1.1rem", margin:"0 auto 14px" }}>
              {m.initials}
            </div>
            <div style={{ fontWeight:800, fontSize:"0.95rem", color:T.ink }}>{m.name}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background:T.ink, borderRadius:28, padding:"48px 40px", textAlign:"center" }}>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"1.8rem", color:"#fff", letterSpacing:"-1px", marginBottom:12 }}>
          Built in India, for India.
        </h2>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.95rem", lineHeight:1.7, maxWidth:500, margin:"0 auto 32px" }}>
          Our small but mighty team is based in New Delhi, driven by the belief that technology can meaningfully scale social good.
        </p>
        <BtnGold onClick={() => setPage("contact")}>Get in Touch →</BtnGold>
      </div>

    </div>
  );
}
