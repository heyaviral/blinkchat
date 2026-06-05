import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-6xl font-black tracking-tight text-white">
          BlinkChat
        </h1>

        <p className="mt-6 text-zinc-500 text-lg leading-relaxed">
          Instant temporary communication.
        </p>

        <p className="mt-2 text-zinc-600">
          Create a room. Share room code or link. Talk. Forget.
        </p>

        <div className="w-20 h-px bg-zinc-800 mx-auto my-10" />

        <div className="flex flex-col gap-4">
          <Link
            to="/create"
            className="
                            bg-white
                            text-black
                            py-4
                            rounded-md
                            font-semibold
                            border
                            border-white
                            transition-all
                            duration-200
                            hover:scale-[1.02]
                        "
          >
            Create Room
          </Link>

          <Link
            to="/join"
            className="
                            border
                            border-zinc-700
                            py-4
                            rounded-md
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:scale-[1.02]
                        "
          >
            Join Room
          </Link>
        </div>

        <div className="mt-12">
          <Link
            to="/about"
            className="
                            text-sm
                            text-zinc-600
                            hover:text-zinc-400
                            transition-colors
                        "
          >
            Built by Aviral • Read the story
          </Link>
          <br />
          <br />
          <a
            href="https://github.com/heyaviral/blinkchat/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="
        md:hidden
        inline-block
        mt-4
        text-zinc-400
        hover:text-white
        transition-colors
        text-sm
    "
          >
            Android App
          </a>
          <div className="mt-8 text-xs text-zinc-600">v1.4</div>
        </div>
      </div>
    </div>
  );
}
