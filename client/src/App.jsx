import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import ChatRoom from "./pages/ChatRoom";
import About from "./pages/About";
import Changelog from "./pages/Changelog";

import useAndroidBackButton from "./hooks/useAndroidBackButton";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "./services/analytics";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

function AppContent() {
  useAndroidBackButton();

  return (
    <>
      <AnalyticsTracker />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/create" element={<CreateRoom />} />

        <Route path="/join" element={<JoinRoom />} />

        <Route path="/room/:roomId" element={<ChatRoom />} />

        <Route path="/about" element={<About />} />

        <Route path="/changelog" element={<Changelog />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
