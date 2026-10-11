"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type EventStat = {
  id: number;
  title: string;
  category: string;
  capacity: number;
  registered: number;
  fillRate: number;
};

type Overview = {
  totals: {
    users: number;
    events: number;
    registrations: number;
    upcomingEvents: number;
    overallFillRate: number;
  };
  registrationsPerDay: { date: string; count: number }[];
  topEvents: EventStat[];
  nearlyFull: EventStat[];
  byCategory: { category: string; registrations: number }[];
};

const pct = (n: number) => `${Math.round(n * 100)}%`;

const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const categoryColor = (category: string) => {
  const colors: Record<string, string> = {
    HACKATHON: "#F04E23",
    WORKSHOP: "#D5FF00",
    COMMUNITY: "#E9E5DC",
  };
  return colors[category.toUpperCase()] ?? "#F04E23";
};

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden border border-white/15 bg-[#1B1B18] p-5">
      <span className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: accent }} />
      <p className="text-[11px] font-bold tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-xs text-white/40">{hint}</p>
    </div>
  );
}

function Panel({
  index,
  title,
  subtitle,
  children,
  className = "",
}: {
  index: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-white/15 bg-[#1B1B18] p-6 ${className}`}>
      <p className="text-[11px] font-bold tracking-[0.2em] text-[#F04E23]">{index}</p>
      <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-white/20 px-4 py-10 text-center text-sm text-white/45">
      {text}
    </div>
  );
}

function FillRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const v = Math.min(1, Math.max(0, value));
  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="14" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="#D5FF00"
          strokeWidth="14"
          strokeDasharray={`${c * v} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tracking-[-0.05em]">{pct(v)}</span>
        <span className="text-[10px] font-bold tracking-widest text-white/40">FILLED</span>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mt-12 animate-pulse space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white/5" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-72 bg-white/5" />
        <div className="h-72 bg-white/5 lg:col-span-2" />
      </div>
      <div className="h-64 bg-white/5" />
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please sign in with an admin account.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/analytics/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Could not load analytics.");
        setData(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  const insights = useMemo(() => {
    if (!data) return null;
    const days = data.registrationsPerDay;
    const total = days.reduce((sum, d) => sum + d.count, 0);
    const peak = days.reduce((best, d) => (d.count > best.count ? d : best), days[0]);
    const maxDay = Math.max(1, ...days.map((d) => d.count));
    return { days, total, avg: days.length ? total / days.length : 0, peak, maxDay };
  }, [data]);

  const maxCategory = Math.max(1, ...(data?.byCategory.map((c) => c.registrations) ?? [1]));

  return (
    <main className="min-h-screen bg-[#11110F] text-[#F2F0E8]">
      <header className="border-b border-white/15">
        <nav className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black tracking-[-0.08em]">
            GATHER<span className="text-[#F04E23]">/</span>
          </Link>
          <Link
            href="/admin"
            className="text-xs font-bold tracking-wider text-white/60 hover:text-[#F04E23]"
          >
            BACK TO ADMIN
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1100px] px-6 py-14">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">CONTROL ROOM / 05</p>
            <h1 className="mt-4 text-5xl font-black uppercase leading-none tracking-[-0.07em] md:text-7xl">
              ANALYTICS<span className="text-[#F04E23]">.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/50">
              How people are using GATHER: signups, demand and capacity. Daily buckets use UTC.
            </p>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            className="w-fit border border-white/30 px-5 py-3 text-xs font-black tracking-wider hover:border-[#F04E23] hover:text-[#F04E23] disabled:opacity-40"
          >
            {loading ? "LOADING..." : "REFRESH"}
          </button>
        </div>

        {error && (
          <div role="alert" className="mt-10 border border-[#F04E23]/50 p-5 text-sm text-[#F04E23]">
            {error}
          </div>
        )}

        {loading && !data && !error && <Skeleton />}

        {data && insights && (
          <div className="mt-12 space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <StatCard label="USERS" value={data.totals.users} hint="Registered accounts" accent="#F04E23" />
              <StatCard label="EVENTS" value={data.totals.events} hint="All events created" accent="#D5FF00" />
              <StatCard
                label="REGISTRATIONS"
                value={data.totals.registrations}
                hint="Across all events"
                accent="#E9E5DC"
              />
              <StatCard label="UPCOMING" value={data.totals.upcomingEvents} hint="Events still ahead" accent="#F04E23" />
              <StatCard
                label="FILL RATE"
                value={pct(data.totals.overallFillRate)}
                hint="Registrations / capacity"
                accent="#D5FF00"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Panel index="01" title="Capacity used" subtitle="Across every event">
                <FillRing value={data.totals.overallFillRate} />
                <p className="mt-5 text-center text-xs text-white/45">
                  {data.totals.registrations} spots taken across {data.totals.events} events
                </p>
              </Panel>

              <Panel
                index="02"
                title="Registrations, last 30 days"
                subtitle="Hover a bar for the exact count"
                className="lg:col-span-2"
              >
                <div className="mb-6 grid grid-cols-3 gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-white/40">TOTAL</p>
                    <p className="mt-1 text-2xl font-black">{insights.total}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-white/40">DAILY AVG</p>
                    <p className="mt-1 text-2xl font-black">{insights.avg.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-white/40">PEAK DAY</p>
                    <p className="mt-1 text-2xl font-black">
                      {insights.peak && insights.peak.count > 0
                        ? `${shortDate(insights.peak.date)} (${insights.peak.count})`
                        : "None"}
                    </p>
                  </div>
                </div>

                <div className="relative h-48">
                  {[0, 0.5, 1].map((t) => (
                    <div
                      key={t}
                      className="absolute inset-x-0 border-t border-white/10"
                      style={{ bottom: `${t * 100}%` }}
                    />
                  ))}
                  <span className="absolute -top-5 left-0 text-[10px] text-white/40">{insights.maxDay}</span>

                  <div className="absolute inset-0 flex items-end gap-[3px]">
                    {insights.days.map((d) => (
                      <div key={d.date} className="group relative flex h-full flex-1 items-end">
                        <div
                          className={`w-full transition-colors ${
                            d.count ? "bg-[#F04E23] group-hover:bg-[#D5FF00]" : "bg-white/10"
                          }`}
                          style={{
                            height: d.count ? `${(d.count / insights.maxDay) * 100}%` : "2px",
                            minHeight: d.count ? 3 : 2,
                          }}
                        />
                        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 text-[11px] font-bold text-black group-hover:block">
                          {shortDate(d.date)}: {d.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 flex justify-between text-[10px] tracking-wider text-white/40">
                  <span>{shortDate(insights.days[0].date)}</span>
                  <span>{shortDate(insights.days[Math.floor(insights.days.length / 2)].date)}</span>
                  <span>{shortDate(insights.days[insights.days.length - 1].date)}</span>
                </div>

                {insights.total === 0 && (
                  <p className="mt-5 text-xs text-white/45">
                    No registrations in the last 30 days yet. Register for an event to see this chart fill up.
                  </p>
                )}
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Panel index="03" title="Top events" subtitle="By number of registrations">
                {data.topEvents.length === 0 ? (
                  <EmptyState text="No events yet. Create one from the admin dashboard." />
                ) : (
                  <ol className="space-y-5">
                    {data.topEvents.map((e, i) => (
                      <li key={e.id}>
                        <div className="flex items-baseline justify-between gap-4 text-sm">
                          <span className="flex min-w-0 items-baseline gap-3">
                            <span className="text-xs font-black text-white/30">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate font-bold">{e.title}</span>
                          </span>
                          <span className="shrink-0 text-xs text-white/55">
                            {e.registered} / {e.capacity} ({pct(e.fillRate)})
                          </span>
                        </div>
                        <div className="mt-2 h-2 bg-white/10">
                          <div
                            className="h-2"
                            style={{
                              width: pct(Math.min(1, e.fillRate)),
                              backgroundColor: categoryColor(e.category),
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </Panel>

              <Panel index="04" title="By category" subtitle="Registrations per category">
                {data.byCategory.length === 0 ? (
                  <EmptyState text="Category totals appear once events exist." />
                ) : (
                  <div className="space-y-5">
                    {data.byCategory.map((c) => (
                      <div key={c.category}>
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center gap-2 font-bold tracking-wider text-white/70">
                            <span
                              className="h-2 w-2"
                              style={{ backgroundColor: categoryColor(c.category) }}
                            />
                            {c.category}
                          </span>
                          <span className="font-black">{c.registrations}</span>
                        </div>
                        <div className="mt-2 h-3 bg-white/10">
                          <div
                            className="h-3"
                            style={{
                              width: `${(c.registrations / maxCategory) * 100}%`,
                              backgroundColor: categoryColor(c.category),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            <Panel
              index="05"
              title="Nearly full"
              subtitle="Upcoming events at 80% capacity or more"
            >
              {data.nearlyFull.length === 0 ? (
                <EmptyState text="No upcoming event is close to capacity right now." />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.nearlyFull.map((e) => {
                    const left = Math.max(0, e.capacity - e.registered);
                    return (
                      <div key={e.id} className="border border-[#F04E23]/40 p-4">
                        <p className="text-[10px] font-bold tracking-widest text-[#F04E23]">
                          {e.category.toUpperCase()}
                        </p>
                        <p className="mt-2 font-black uppercase leading-tight">{e.title}</p>
                        <div className="mt-4 h-2 bg-white/10">
                          <div
                            className="h-2 bg-[#F04E23]"
                            style={{ width: pct(Math.min(1, e.fillRate)) }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-white/55">
                          {left === 0 ? "Full" : `${left} spot${left === 1 ? "" : "s"} left`} ({e.registered} /{" "}
                          {e.capacity})
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>
          </div>
        )}
      </section>
    </main>
  );
}