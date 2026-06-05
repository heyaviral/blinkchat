import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { useLocation, useNavigate } from "react-router-dom";

export default function useAndroidBackButton() {
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const setup = async () => {
      const listener = await CapacitorApp.addListener("backButton", () => {
        const path = location.pathname;

        if (path === "/") {
          CapacitorApp.exitApp();
          return;
        }

        if (path.startsWith("/room/")) {
          window.dispatchEvent(new CustomEvent("blinkchat-back-button"));

          return;
        }

        navigate("/");
      });

      return listener;
    };

    let listener;

    setup().then((l) => {
      listener = l;
    });

    return () => {
      listener?.remove();
    };
  }, [location.pathname, navigate]);
}
