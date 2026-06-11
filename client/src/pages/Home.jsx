import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white flex flex-col">
      <Navbar />
      <div className="grid-bg" />

      <div className="absolute inset-0 pointer-events-none">
        <span className="floating-word" style={{ top: "14%", left: "8%" }}>
          TEMPORARY
        </span>

        <span className="floating-word" style={{ top: "12%", left: "48%" }}>
          ANONYMOUS
        </span>

        <span className="floating-word" style={{ top: "26%", right: "8%" }}>
          PRIVATE
        </span>

        <span className="floating-word" style={{ bottom: "22%", left: "14%" }}>
          SECURE
        </span>

        <span className="floating-word" style={{ bottom: "16%", right: "12%" }}>
          INSTANT
        </span>
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div className="text-center max-w-xl w-full">
          <h1 className="text-5xl md:text-9xl font-bold tracking-tight">
            BlinkChat
          </h1>

          <p className="mt-2 text-[11px] tracking-[0.5em] uppercase text-zinc-600">
            Temporary Communication
          </p>

          <p className="mt-6 text-zinc-400">
            Create a room. Share a code. Talk. Forget.
          </p>

          <div className="mt-8 md:mt-12 flex flex-col gap-4">
            <Link
              to="/create"
              className="
                h-14 md:h-16
                flex
                items-center
                justify-center
                rounded-lg
                bg-white
                text-black
                font-semibold
                text-lg
                transition-all
                duration-200
                hover:-translate-y-1
              "
            >
              Create Room
            </Link>

            <Link
              to="/join"
              className="
                h-14 md:h-16
                flex
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-800
                text-white
                font-semibold
                text-lg
                transition-all
                duration-200
                hover:-translate-y-1
              "
            >
              Join Room
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 md:bottom-8 text-center">
          <Link
            to="/about"
            className="text-sm text-zinc-600 hover:text-zinc-400"
          >
            Built by Aviral • Read the story
          </Link>

          <div className="mt-6 text-xs text-zinc-700">v1.5</div>
        </div>
      </main>
    </div>
  );
}
