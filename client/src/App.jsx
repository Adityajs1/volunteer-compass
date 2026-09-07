import { useState, useEffect } from "react";
import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";
import Home      from "./pages/Home";
import About     from "./pages/About";
import Contact   from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import Profile   from "./pages/Profile";
import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VolunteerHours from "./pages/VolunteerHours";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { SocketProvider } from "./context/SocketContext";

// Public-only pages — logged-in users get sent to dashboard
const AUTH_PAGES  = new Set(["login", "signup", "signup-org", "forgot-password"]);
// Pages that require login — unauthenticated users get sent to login
const PRIVATE_PAGES = new Set(["dashboard", "create-event", "profile", "hours"]);

function AppInner() {
  const { user, loading } = useAuth();

  const getInitialPage = () => {
    const saved = localStorage.getItem('vc_page');
    if (!saved) return "home";
    return saved;
  };

  const [page, setPage] = useState(getInitialPage);

  // Persist page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vc_page', page);
  }, [page]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Listen for vc:navigate events dispatched by API client (e.g. on 401)
  useEffect(() => {
    const handler = (e) => {
      const target = e.detail?.page;
      if (target) setPage(target);
    };
    window.addEventListener('vc:navigate', handler);
    return () => window.removeEventListener('vc:navigate', handler);
  }, []);

  // Redirect logic after auth state is known
  useEffect(() => {
    if (loading) return;
    if (user && AUTH_PAGES.has(page)) {
      // Logged-in user tried to go to login/signup — send to dashboard
      setPage("dashboard");
    } else if (!user && PRIVATE_PAGES.has(page)) {
      // Unauthenticated user tried to access a private page — send to login
      setPage("login");
    } else if (user && page === "home") {
      // Logged-in user on home page — send to dashboard
      setPage("dashboard");
    }
  }, [user, loading]);

  const renderPage = () => {
    switch (page) {
      case "home":          return <Home           setPage={setPage} />;
      case "about":         return <About          setPage={setPage} />;
      case "contact":       return <Contact        setPage={setPage} />;
      case "dashboard":     return <Dashboard      setPage={setPage} />;
      case "create-event":  return <CreateEvent    setPage={setPage} />;
      case "profile":       return <Profile        setPage={setPage} />;
      case "login":         return <Login          setPage={setPage} />;
      case "signup":        return <Signup         setPage={setPage} defaultRole="VOLUNTEER" />;
      case "signup-org":    return <Signup         setPage={setPage} defaultRole="ORGANIZER" />;
      case "forgot-password": return <ForgotPassword setPage={setPage} />;
      case "hours":         return <VolunteerHours setPage={setPage} />;
      default:              return <Home           setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar page={page} setPage={setPage} />

      <main style={{ flex: 1, animation: "pageIn 0.3s ease" }}>
        {!loading && renderPage()}
      </main>

      <Footer setPage={setPage} />

      <style>{`
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SocketProvider>
          <AppInner />
        </SocketProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
