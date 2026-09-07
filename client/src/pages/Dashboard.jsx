import { useState, useEffect, Suspense, lazy } from "react";
import { T } from "../theme";
import { BtnGold } from "../components/Buttons";
import SkeletonCard from "../components/SkeletonCard";

import { getEventsApi, rsvpApi, leaveRsvpApi } from "../api/events.api";
import { useAuth } from "../context/AuthContext";

// Lazy-load the heavy map component so the main bundle stays small
const EventMap = lazy(() => import("../components/EventMap"));

const SKILL_COLORS = {
  Environment: { bg:"#E8F5E9", color:"#2E7D32" },
  Tech:        { bg:"#E3F2FD", color:"#1565C0" },
  Logistics:   { bg:"#FFF3E0", color:"#E65100" },
  Design:      { bg:"#F3E5F5", color:"#6A1B9A" },
  Teaching:    { bg:"#FFF8E1", color:"#F57F17" },
  Care:        { bg:"#FCE4EC", color:"#AD1457" },
  Healthcare:  { bg:"#E8F5E9", color:"#1B5E20" },
};

/* ── Toast ── */
function Toast({ msg }) {
  return msg ? (
    <div style={{
      position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
      background:T.ink, color:"#fff",
      padding:"12px 24px", borderRadius:12,
      fontWeight:600, fontSize:"0.88rem",
      zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)",
      whiteSpace:"nowrap", animation:"toastIn 0.3s ease",
    }}>
      {msg}
      <style>{`@keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }`}</style>
    </div>
  ) : null;
}

/* ── Event Row ── */
function EventRow({ ev, onJoin, onLeave, isLast }) {
  const [hover, setHover] = useState(false);
  const sc = SKILL_COLORS[ev.skill] || { bg:T.cream2, color:T.muted };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"15px 24px",
        borderBottom: isLast ? "none" : `1px solid ${T.border}`,
        background: hover ? T.cream : T.white,
        transition:"background 0.15s",
        flexWrap:"wrap", gap:10,
      }}
    >
      <div style={{ flex:1, minWidth:180 }}>
        <div style={{ fontWeight:700, fontSize:"0.9rem", color:T.ink, display:"flex", alignItems:"center", gap:6 }}>
          {ev.title}
          {ev.organizerVerified && (
            <span title="Verified Organization" style={{
              background:"#E8F5E9", color:"#2E7D32",
              borderRadius:99, padding:"2px 7px",
              fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.3px",
            }}>
              ✅ Verified Org
            </span>
          )}
        </div>
        <div style={{ fontSize:"0.74rem", color:T.muted, marginTop:2 }}>{ev.org} · {ev.date}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <span style={{ background:sc.bg, color:sc.color, borderRadius:99, padding:"3px 10px", fontSize:"0.68rem", fontWeight:700 }}>
          {ev.skill}
        </span>
        <span style={{ fontSize:"0.72rem", color: ev.spots < 5 ? "#DC2626" : T.leaf, fontWeight:600, minWidth:80 }}>
          {ev.spots} spot{ev.spots !== 1 ? "s" : ""} left
        </span>
        {ev.joined ? (
          <button
            onClick={() => onLeave(ev.id)}
            style={{ background:"#FEE2E2", color:"#B91C1C", border:"none", borderRadius:7, padding:"6px 14px", fontWeight:700, fontSize:"0.72rem", cursor:"pointer", fontFamily:"'Cabinet Grotesk',sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.background="#FECACA"}
            onMouseLeave={e => e.currentTarget.style.background="#FEE2E2"}
          >
            Leave
          </button>
        ) : (
          <button
            onClick={() => onJoin(ev.id)}
            disabled={ev.spots === 0}
            style={{ background: ev.spots === 0 ? T.cream3 : T.leaf, color: ev.spots === 0 ? T.muted : "#fff", border:"none", borderRadius:7, padding:"6px 14px", fontWeight:700, fontSize:"0.72rem", cursor: ev.spots === 0 ? "not-allowed" : "pointer", fontFamily:"'Cabinet Grotesk',sans-serif", transition:"background 0.2s" }}
            onMouseEnter={e => { if(ev.spots > 0) e.currentTarget.style.background = T.leaf2; }}
            onMouseLeave={e => { if(ev.spots > 0) e.currentTarget.style.background = T.leaf; }}
          >
            {ev.spots === 0 ? "Full" : "Join"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── DASHBOARD PAGE ── */
export default function Dashboard({ setPage }) {
  const [events, setEvents]       = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const { user } = useAuth();
  const [filter, setFilter]       = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [toast, setToast]         = useState(null);
  const [search, setSearch]       = useState("");

  /* Map backend event to UI format */
  const formatEvent = (e) => ({
    id: e.id,
    title: e.title,
    org: e.organizer?.name || 'Organizer',
    organizerVerified: e.organizer?.isVerified || false,
    date: new Date(e.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    spots: Math.max(0, (e.maxVolunteers || 0) - (e._count?.rsvps || 0)),
    skill: e.skills && e.skills.length > 0 ? e.skills[0].skill.name : 'Other',
    joined: e.rsvps?.some(r => r.userId === user?.id && r.status !== 'CANCELLED') || false,
    rsvpId: e.rsvps?.find(r => r.userId === user?.id && r.status !== 'CANCELLED')?.id,
    latitude: e.latitude,
    longitude: e.longitude,
  });

  const joined   = events.filter(e => e.joined);
  const upcoming = events.filter(e => !e.joined);

  /* apply skill filter + search */
  const filtered = upcoming
    .filter(e => filter === "all" || e.skill.toLowerCase() === filter.toLowerCase())
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.org.toLowerCase().includes(search.toLowerCase()));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchEventsWithLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            try {
              const res = await getEventsApi({ lat: latitude, lng: longitude });
              const rawEvents = res.data?.events || res.data || [];
              setEvents(rawEvents.map(formatEvent));
            } catch (err) {
              showToast("Error loading nearby events");
            } finally {
              setIsLoading(false);
            }
          },
          async () => {
            // Fallback — no location access
            try {
              const res = await getEventsApi();
              const rawEvents = res.data?.events || res.data || [];
              setEvents(rawEvents.map(formatEvent));
            } catch (err) {
              showToast("Error loading events");
            } finally {
              setIsLoading(false);
            }
          }
        );
      } else {
        getEventsApi()
          .then(res => {
            const rawEvents = res.data?.events || res.data || [];
            setEvents(rawEvents.map(formatEvent));
          })
          .catch(() => showToast("Error loading events"))
          .finally(() => setIsLoading(false));
      }
    };

    fetchEventsWithLocation();
  }, [user]);

  const handleJoin = async (id) => {
    try {
      await rsvpApi(id);
      const ev = events.find(e => e.id === id);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, joined:true, spots:e.spots - 1 } : e));
      showToast(`Joined "${ev.title}"! 🎉`);
    } catch (err) {
      showToast(err.message || 'Failed to join');
    }
  };

  const handleLeave = async (id) => {
    try {
      const ev = events.find(e => e.id === id);
      if (ev.rsvpId) await leaveRsvpApi(ev.rsvpId);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, joined:false, spots:e.spots + 1 } : e));
      showToast(`Left "${ev.title}".`);
    } catch(err) {
      showToast(err.message || 'Failed to leave');
    }
  };

  const skills = ["all", ...new Set(events.map(e => e.skill))];

  const stats = [
    { num: upcoming.length,  label:"Upcoming Events" },
    { num: `${42 + joined.length * 2}h`, label:"Hours Logged" },
    { num: joined.length + 3, label:"Badges Earned" },
    { num: joined.length,    label:"Events Joined"  },
  ];

  const TABS = [
    { key:"upcoming", label:`Upcoming (${upcoming.length})` },
    { key:"joined",   label:`Joined (${joined.length})` },
    { key:"map",      label:"🗺 Explore Map" },
  ];

  return (
    <div style={{ maxWidth:980, margin:"0 auto", padding:"64px 24px", position:"relative" }}>
      <Toast msg={toast} />

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:36 }}>
        <div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"2.3rem", color:T.ink, letterSpacing:"-1.5px", marginBottom:6 }}>
            Your Dashboard
          </h1>
          <p style={{ color:T.muted, fontSize:"0.95rem" }}>
            {userLocation
              ? "📍 Showing events near your current location."
              : "Welcome back! Here's what's happening near you."}
          </p>
        </div>
        {user?.role === 'VOLUNTEER' && (
          <BtnGold onClick={() => setPage("hours")} style={{ padding:"10px 20px", fontSize:"0.82rem" }}>
            🏅 My Hours
          </BtnGold>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:18, padding:"20px 22px" }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontWeight:900, fontSize:"2rem", color:T.leaf, letterSpacing:"-1px" }}>{s.num}</div>
            <div style={{ fontSize:"0.72rem", color:T.muted, marginTop:3, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? T.ink : T.white,
              color:      activeTab === tab.key ? "#fff" : T.muted,
              border:`1px solid ${activeTab === tab.key ? T.ink : T.border}`,
              borderRadius:9, padding:"8px 18px",
              fontFamily:"'Cabinet Grotesk',sans-serif",
              fontWeight:700, fontSize:"0.8rem",
              cursor:"pointer", transition:"all 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Map Tab ── */}
      {activeTab === "map" && (
        <Suspense fallback={
          <div style={{ background:T.cream, borderRadius:20, height:480, display:"flex", alignItems:"center", justifyContent:"center", color:T.muted, fontSize:"0.9rem" }}>
            Loading map...
          </div>
        }>
          <EventMap events={events} userLocation={userLocation} onJoin={handleJoin} />
        </Suspense>
      )}

      {/* ── Upcoming tab ── */}
      {activeTab === "upcoming" && (
        <>
          {/* Search + filter row */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16, alignItems:"center" }}>
            <input
              type="text"
              placeholder="Search events or orgs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background:T.white, border:`1px solid ${T.border}`,
                borderRadius:9, padding:"8px 14px",
                fontSize:"0.82rem", color:T.ink,
                fontFamily:"'Cabinet Grotesk',sans-serif",
                outline:"none", minWidth:200, flex:1,
              }}
              onFocus={e => e.target.style.borderColor = T.leaf2}
              onBlur={e  => e.target.style.borderColor = T.border}
            />
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {skills.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    background: filter === s ? T.leaf : T.white,
                    color:      filter === s ? "#fff" : T.muted,
                    border:`1px solid ${filter === s ? T.leaf : T.border}`,
                    borderRadius:99, padding:"5px 14px",
                    fontFamily:"'Cabinet Grotesk',sans-serif",
                    fontWeight:600, fontSize:"0.74rem",
                    cursor:"pointer", transition:"all 0.15s",
                    textTransform:"capitalize",
                  }}
                >
                  {s === "all" ? "All Skills" : s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:20, overflow:"hidden" }}>
            <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, fontWeight:800, fontSize:"0.95rem", color:T.ink, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span>Nearby Events</span>
              {!isLoading && <span style={{ fontSize:"0.78rem", color:T.muted, fontWeight:500 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>}
            </div>

            {/* Skeleton loaders while fetching */}
            {isLoading ? (
              [1,2,3,4].map(i => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <div style={{ padding:"48px 24px", textAlign:"center", color:T.muted }}>
                <div style={{ fontSize:"1.8rem", marginBottom:12 }}>🔍</div>
                <div style={{ fontWeight:700, marginBottom:6 }}>No events found</div>
                <div style={{ fontSize:"0.85rem" }}>Try a different skill filter or search term.</div>
                <button onClick={() => { setFilter("all"); setSearch(""); }} style={{ marginTop:14, background:T.leaf, color:"#fff", border:"none", borderRadius:9, padding:"8px 18px", fontWeight:700, fontSize:"0.8rem", cursor:"pointer", fontFamily:"'Cabinet Grotesk',sans-serif" }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              filtered.map((ev, i) => (
                <EventRow key={ev.id} ev={ev} onJoin={handleJoin} onLeave={handleLeave} isLast={i === filtered.length - 1} />
              ))
            )}
          </div>
        </>
      )}

      {/* ── Joined tab ── */}
      {activeTab === "joined" && (
        <div style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:20, overflow:"hidden" }}>
          <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, fontWeight:800, fontSize:"0.95rem", color:T.ink }}>
            Events You've Joined ({joined.length})
          </div>
          {joined.length === 0 ? (
            <div style={{ padding:"48px 24px", textAlign:"center", color:T.muted }}>
              <div style={{ fontSize:"1.8rem", marginBottom:12 }}>🧭</div>
              <div style={{ fontWeight:700, marginBottom:6 }}>No events joined yet</div>
              <div style={{ fontSize:"0.85rem", marginBottom:16 }}>Browse upcoming events and hit Join to get started.</div>
              <button onClick={() => setActiveTab("upcoming")} style={{ background:T.leaf, color:"#fff", border:"none", borderRadius:9, padding:"9px 22px", fontWeight:700, fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Cabinet Grotesk',sans-serif" }}>
                Browse Events
              </button>
            </div>
          ) : (
            joined.map((ev, i) => (
              <EventRow key={ev.id} ev={ev} onJoin={handleJoin} onLeave={handleLeave} isLast={i === joined.length - 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
