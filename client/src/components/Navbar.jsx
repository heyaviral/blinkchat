import { Palette } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [showThemesModal, setShowThemesModal] = useState(false);
  return (
    <>
      <nav className="relative z-20 flex items-center justify-between px-6 py-5">
        <img src="/icon.png" alt="BlinkChat" className="h-8 w-auto" />

        <button
          onClick={() => setShowThemesModal(true)}
          className="
    flex
    items-center
    gap-2
    px-3
    py-2
    rounded-full
    border
    border-zinc-800
    bg-black/30
    hover:border-zinc-700
    transition-all
  "
        >
          <Palette size={18} />
          <span className="text-sm">Themes</span>
        </button>
      </nav>

      {showThemesModal && (
        <div
          className="
          fixed
          inset-0
          bg-black/70
          flex
          items-center
          justify-center
          z-50
        "
          onClick={() => setShowThemesModal(false)}
        >
          <div
            className="
            w-full
            max-w-sm
            mx-6
            bg-[#0b0b0b]
            border
            border-zinc-800
            rounded-xl
            p-6
          "
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-2">Themes</h2>

            <p className="text-zinc-500 text-sm mb-6">
              Personalize BlinkChat's appearance.
            </p>

            <div className="space-y-3 mb-6">
              <div className="border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400">
                Dark
              </div>

              <div className="border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400">
                Light (Coming soon!)
              </div>

              <div className="border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400">
                Funky (Coming soon!)
              </div>
            </div>

            <p className="text-zinc-500 text-sm mb-6">
              Coming in a future update.
            </p>

            <button
              onClick={() => setShowThemesModal(false)}
              className="
              w-full
              bg-white
              text-black
              py-3
              rounded-lg
              font-medium
            "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
  {
    showThemesModal && (
      <div
        className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    "
        onClick={() => setShowThemesModal(false)}
      >
        <div
          className="
        w-full
        max-w-sm
        mx-6
        bg-[#0b0b0b]
        border
        border-zinc-800
        rounded-xl
        p-6
      "
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-2">Themes</h2>

          <p className="text-zinc-500 text-sm mb-6">
            Personalize BlinkChat's appearance.
          </p>

          <div className="space-y-3 mb-6">
            <div className="border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400">
              Dark
            </div>

            <div className="border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400">
              Light
            </div>

            <div className="border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400">
              Funky
            </div>
          </div>

          <p className="text-zinc-500 text-sm mb-6">
            Coming in a future update.
          </p>

          <button
            onClick={() => setShowThemesModal(false)}
            className="
          w-full
          bg-white
          text-black
          py-3
          rounded-lg
          font-medium
        "
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}
