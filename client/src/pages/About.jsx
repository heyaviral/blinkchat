import { Link } from "react-router-dom";

export default function About() {
    return (
        <div className="min-h-screen bg-[#070707] text-white px-6 py-16">

            <div className="max-w-3xl mx-auto">

                <h1 className="text-6xl font-black tracking-tight">
                    BLINKCHAT
                </h1>

                <p className="mt-12 text-zinc-300 leading-relaxed">
                    BlinkChat was created to solve a surprisingly common problem:
                    the lack of a fast, temporary way to connect and communicate
                    with someone instantly.
                </p>

                <p className="mt-6 text-zinc-300 leading-relaxed">
                    The idea originated during a casual game session of Skribbl.io
                    with my cousins. My sister was playing on a tablet and didn't
                    have access to WhatsApp or any other convenient messaging
                    platform. To join the game, she had to manually type a long URL
                    character by character, which was slow, frustrating, and
                    completely unnecessary.
                </p>

                <p className="mt-6 text-zinc-300 leading-relaxed">
                    That small inconvenience sparked a larger question:
                </p>

                <p className="mt-6 text-zinc-100 text-xl leading-relaxed">
                    Why does something as simple as sending a message often require
                    accounts, friend requests, installations, profiles, or
                    permanent conversations?
                </p>

                <p className="mt-6 text-zinc-300 leading-relaxed">
                    Many communication platforms are designed for long-term
                    relationships, communities, and persistent networks. While
                    those platforms are incredibly useful, they are often excessive
                    for situations where people simply need a temporary
                    communication channel for a one-off task.
                </p>

                <p className="mt-6 text-zinc-300 leading-relaxed">
                    BlinkChat was built around a different philosophy.
                </p>

                <div className="mt-10 space-y-3 text-2xl font-semibold">

                    <div>Create a room.</div>

                    <div>Share a code or link.</div>

                    <div>Join instantly.</div>

                    <div>Communicate.</div>

                    <div>Leave.</div>

                </div>

                <p className="mt-10 text-zinc-300 leading-relaxed">
                    When everyone leaves, the room and its messages disappear
                    automatically.
                </p>

                <div className="mt-12 space-y-2 text-3xl font-bold">

                    <div>No accounts.</div>

                    <div>No setup.</div>

                    <div>No history.</div>

                    <div>No friction.</div>

                </div>

                <p className="mt-12 text-zinc-300 leading-relaxed">
                    The goal of BlinkChat is not to replace traditional messaging
                    applications. Instead, it aims to serve as a lightweight
                    utility for moments when speed, simplicity, and temporary
                    communication matter more than permanence.
                </p>

                <p className="mt-6 text-zinc-300 leading-relaxed">
                    Whether it's coordinating a game, sharing information during
                    an event, helping someone access a link, collaborating briefly
                    on a task, or creating an instant communication channel between
                    people who may never need to talk again, BlinkChat is designed
                    to make that process effortless.
                </p>

                <p className="mt-6 text-zinc-300 leading-relaxed">
                    Built independently by Aviral, BlinkChat began as a learning
                    project in full-stack web development and gradually evolved
                    into a fully functional product deployed for real-world use.
                </p>

                <p className="mt-6 text-zinc-300 leading-relaxed">
                    The vision remains simple: build a tool that does one thing
                    exceptionally well: create instant, disposable communication
                    channels without unnecessary complexity.
                </p>

                <div className="w-20 h-px bg-zinc-800 my-14"></div>

                <div className="space-y-2">

                    <div className="font-semibold">
                        Built by Aviral
                    </div>

                    <div className="text-zinc-500">
                        Version 1.2
                    </div>

                    <div className="text-zinc-500">
                        Last updated June 2026
                    </div>

                </div>

                <Link
                    to="/changelog"
                    className="
                        inline-block
                        mt-8
                        text-zinc-400
                        hover:text-white
                        transition-colors
                    "
                >
                    View Changelog →
                </Link>

            </div>

        </div>
    );
}

