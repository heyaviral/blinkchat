import { Link } from "react-router-dom";

export default function Changelog() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="grid-bg" />

      <main className="relative z-10 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/about"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back
          </Link>

          <div className="mt-16">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              BlinkChat
            </h1>

            <p className="mt-6 text-2xl font-semibold">Changelog</p>

            <p className="mt-3 text-zinc-500">
              A complete history of BlinkChat updates.
            </p>

            <div className="flex justify-center md:justify-start mt-8 mb-12">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent md:from-zinc-700 md:to-transparent"></div>
            </div>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="text-3xl font-bold">v1.5</h2>

              <p className="mt-2 text-zinc-500">June 2026</p>

              <ul className="mt-6 space-y-3 text-zinc-400 leading-relaxed">
                <li>• Complete grid-based UI redesign</li>
                <li>• Animated floating background elements</li>
                <li>• UI overhaul for all pages</li>
                <li>• Improved RoomInfo Panel</li>
                <li>• Added members avatar</li>
                <li>• Message layout overhaul</li>
                <li>• Icon based room controls</li>
                <li>• Improved mobile responsiveness and viewport handling</li>
                <li>• General UI polish and consistency improvements</li>
                <li>• Added navbar and brand logo</li>
                <li>• Announced themes</li>
                <li>• Changed RoomIDs to be numeric only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">v1.4</h2>

              <p className="mt-2 text-zinc-500">June 2026</p>

              <ul className="mt-6 space-y-3 text-zinc-400 leading-relaxed">
                <li>• Invite links now use blinkchatroom.in</li>
                <li>• Added one-click message copying</li>
                <li>• Hover-to-copy support on desktop</li>
                <li>• Tap-to-copy support on mobile</li>
                <li>• Added in-app update checker</li>
                <li>• Automatic update notifications</li>
                <li>• Update reminders after dismissal</li>
                <li>• Android app update prompts</li>
                <li>• Various UI improvements and bug fixes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">v1.3</h2>

              <p className="mt-2 text-zinc-500">June 2026</p>

              <ul className="mt-6 space-y-3 text-zinc-400 leading-relaxed">
                <li>• Room-ended alerts with closure reasons</li>
                <li>• Automatic inactive room deletion</li>
                <li>• Android back button support</li>
                <li>• Google Analytics integration</li>
                <li>• Message animations</li>
                <li>• Home navigation added to About page</li>
                <li>• Username validation improvements</li>
                <li>• Username length limits</li>
                <li>• Improved room lifecycle management</li>
                <li>• Mobile experience improvements</li>
                <li>• Inline validation errors</li>
                <li>• Fixed stale room screens</li>
                <li>• Fixed room-end edge cases</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">v1.2</h2>

              <p className="mt-2 text-zinc-500">June 2026</p>

              <ul className="mt-6 space-y-3 text-zinc-400 leading-relaxed">
                <li>• Complete ChatRoom redesign</li>
                <li>• Custom Leave Room modal</li>
                <li>• Custom End Room modal</li>
                <li>• Animated Members drawer</li>
                <li>• Improved mobile experience</li>
                <li>• Improved room information display</li>
                <li>• Improved message composer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">v1.1</h2>

              <ul className="mt-6 space-y-3 text-zinc-400 leading-relaxed">
                <li>• Shareable invite links</li>
                <li>• One-click room joining</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold">v1.0</h2>

              <ul className="mt-6 space-y-3 text-zinc-400 leading-relaxed">
                <li>• Initial public release</li>
                <li>• Real-time messaging</li>
                <li>• Temporary rooms</li>
                <li>• Automatic room cleanup</li>
              </ul>
            </section>
          </div>

          <div className="mt-20">
            <div className="w-24 h-px bg-zinc-800 mb-10"></div>

            <div className="text-zinc-500">BlinkChat v1.5</div>
          </div>
        </div>
      </main>
    </div>
  );
}
