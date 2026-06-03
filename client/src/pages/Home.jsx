import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
            <div className="max-w-lg w-full text-center">
                <h1 className="text-5xl font-bold mb-4">
                    BlinkChat
                </h1>

                <p className="text-zinc-400 mb-10">
                    Temporary chat rooms.
                    No signup.
                    No history.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        to="/create"
                        className="bg-white text-black py-3 rounded-xl font-medium"
                    >
                        Create Room
                    </Link>

                    <Link
                        to="/join"
                        className="border border-zinc-700 py-3 rounded-xl"
                    >
                        Join Room
                    </Link>
                </div>
            </div>
        </div>
    );
}