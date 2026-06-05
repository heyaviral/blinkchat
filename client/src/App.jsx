import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import ChatRoom from "./pages/ChatRoom";
import About from "./pages/About";
import Changelog from "./pages/Changelog";
import { Capacitor } from "@capacitor/core";

import useAndroidBackButton from "./hooks/useAndroidBackButton";

import { trackPageView } from "./services/analytics";
import { checkForUpdates } from "./services/updateChecker";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

function AppContent() {
  useAndroidBackButton();

  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    async function runUpdateCheck() {
      const result = await checkForUpdates();

      const dismissedVersion = localStorage.getItem("dismissed-update-version");

      const dismissedAt = localStorage.getItem("update-reminder-time");

      const ONE_DAY = 24 * 60 * 60 * 1000;

      const recentlyDismissed =
        dismissedVersion === result.latestVersion &&
        dismissedAt &&
        Date.now() - Number(dismissedAt) < ONE_DAY;

      if (result.updateAvailable && !recentlyDismissed) {
        setUpdateInfo(result);
      }
    }

    runUpdateCheck();
  }, []);
  return (
    <>
      <AnalyticsTracker />

      {updateInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-2">Update Available</h2>

            <p className="text-zinc-400 mb-6">
              BlinkChat {updateInfo.latestVersion} is available.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => window.open(updateInfo.releaseUrl, "_blank")}
                className="flex-1 bg-white text-black py-3 rounded-md font-semibold"
              >
                Update Now
              </button>

              <button
                onClick={() => {
                  localStorage.setItem(
                    "dismissed-update-version",
                    updateInfo.latestVersion,
                  );

                  localStorage.setItem(
                    "update-reminder-time",
                    Date.now().toString(),
                  );

                  setUpdateInfo(null);
                }}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

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
