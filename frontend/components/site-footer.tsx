export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,#06110f_0%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Gomcaddy</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A modern ordering experience for restaurants and fast-moving delivery teams.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Browse menus, place orders, and manage your account inside a polished food-ordering platform built for clarity, speed, and reliability.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-emerald-950/10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Design Partner</p>
            <p className="mt-4 text-xl font-semibold text-white">
              Designed &amp; Developed by Mcaddy Tech Solutions
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Digital product design, development, and delivery support for businesses building web experiences that need to feel dependable and intentional.
            </p>
            <a
              href="http://www.mcaddytechsolutions.com"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:border-emerald-300/60 hover:bg-emerald-500/15 hover:text-white"
            >
              Visit Mcaddy Tech Solutions
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © 2026 Gomcaddy. All rights reserved.</p>
          <p>
            Designed &amp; Developed by{' '}
            <a
              href="http://www.mcaddytechsolutions.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Mcaddy Tech Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
