import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="grid-bg" />

      <main className="relative z-10 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back
          </Link>

          <div className="mt-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              BlinkChat
            </h1>

            <p className="mt-6 text-2xl font-semibold">The Story</p>

            <p className="mt-3 text-zinc-500">Why BlinkChat exists.</p>

            <div className="flex justify-center md:justify-start mt-8 mb-12">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent md:from-zinc-700 md:to-transparent"></div>
            </div>
          </div>

          <p className="text-zinc-400 leading-8">
            BlinkChat was created to solve a surprisingly common problem: the
            lack of a fast, temporary way to connect and communicate with
            someone instantly.
          </p>

          <p className="mt-6 text-zinc-400 leading-8">
            The idea originated during a casual game session of Skribbl.io with
            my cousins. My sister was playing on a tablet and didn't have access
            to WhatsApp or any other convenient messaging platform. To join the
            game, she had to manually type a long URL character by character,
            which was slow, frustrating, and completely unnecessary.
          </p>

          <p className="mt-6 text-zinc-400 leading-8">
            That small inconvenience sparked a larger question:
          </p>

          <p className="mt-8 text-2xl md:text-3xl font-semibold text-white leading-relaxed">
            Why does something as simple as sending a message often require
            accounts, friend requests, installations, profiles, or permanent
            conversations?
          </p>

          <p className="mt-8 text-zinc-400 leading-8">
            Many communication platforms are designed for long-term
            relationships, communities, and persistent networks. While those
            platforms are incredibly useful, they are often excessive for
            situations where people simply need a temporary communication
            channel for a one-off task.
          </p>

          <p className="mt-6 text-zinc-400 leading-8">
            BlinkChat was built around a different philosophy.
          </p>

          <div className="mt-12 space-y-4 text-3xl font-bold tracking-tight">
            <div>Create a room.</div>
            <div>Share a code.</div>
            <div>Join instantly.</div>
            <div>Communicate.</div>
            <div>Leave.</div>
          </div>

          <p className="mt-12 text-zinc-400 leading-8">
            When everyone leaves, the room and its messages disappear
            automatically.
          </p>

          <div className="mt-16 space-y-3 text-4xl md:text-5xl font-bold tracking-tight">
            <div>No accounts.</div>
            <div>No setup.</div>
            <div>No history.</div>
            <div>No friction.</div>
          </div>

          <p className="mt-16 text-zinc-400 leading-8">
            The goal of BlinkChat is not to replace traditional messaging
            applications. Instead, it aims to serve as a lightweight utility for
            moments when speed, simplicity, and temporary communication matter
            more than permanence.
          </p>

          <p className="mt-6 text-zinc-400 leading-8">
            Whether it's coordinating a game, sharing information during an
            event, helping someone access a link, collaborating briefly on a
            task, or creating an instant communication channel between people
            who may never need to talk again, BlinkChat is designed to make that
            process effortless.
          </p>

          <p className="mt-6 text-zinc-400 leading-8">
            Built independently by Aviral, BlinkChat began as a learning project
            in full-stack web development and gradually evolved into a fully
            functional product deployed for real-world use.
          </p>

          <p className="mt-6 text-zinc-400 leading-8">
            The vision remains simple: build a tool that does one thing
            exceptionally well — create instant, disposable communication
            channels without unnecessary complexity.
          </p>

          <div className="mt-20">
            <div className="w-24 h-px bg-zinc-800 mb-10"></div>

            <div className="text-zinc-400">Built independently by Aviral</div>

            <div className="mt-2 text-sm text-zinc-600">BlinkChat v1.5</div>

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
      </main>
    </div>
  );
}
