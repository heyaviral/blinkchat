import { Link } from "react-router-dom";

export default function Changelog() {
    return (
        <div className="min-h-screen bg-[#070707] text-white px-6 py-16">

            <div className="max-w-3xl mx-auto">

                <h1 className="text-5xl font-black tracking-tight mb-12">
                    CHANGELOG
                </h1>

                <div className="space-y-10">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Version 1.2
                        </h2>

                        <p className="text-zinc-500 mt-1">
                            June 2026
                        </p>

                        <ul className="mt-4 space-y-2 text-zinc-300">
                            <li>• Complete ChatRoom redesign</li>
                            <li>• Custom Leave Room modal</li>
                            <li>• Custom End Room modal</li>
                            <li>• Animated Members drawer</li>
                            <li>• Improved mobile experience</li>
                            <li>• Improved room information display</li>
                            <li>• Improved message composer</li>
                        </ul>

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">
                            Version 1.1
                        </h2>

                        <ul className="mt-4 space-y-2 text-zinc-300">
                            <li>• Shareable invite links</li>
                            <li>• One-click room joining</li>
                        </ul>

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">
                            Version 1.0
                        </h2>

                        <ul className="mt-4 space-y-2 text-zinc-300">
                            <li>• Initial public release</li>
                            <li>• Real-time messaging</li>
                            <li>• Temporary rooms</li>
                            <li>• Automatic room cleanup</li>
                        </ul>

                    </div>

                </div>

                <Link
                    to="/about"
                    className="inline-block mt-12 text-zinc-400 hover:text-white transition-colors"
                >
                    ← Back to About
                </Link>

            </div>

        </div>
    );
}