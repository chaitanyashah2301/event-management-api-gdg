
"use client";

import { useEffect, useState } from "react";


type LoggedInUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};


type Event = {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  venue: string;
  capacity: number;
  category: string;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    HACKATHON: "#F04E23",
    WORKSHOP: "#D5FF00",
    COMMUNITY: "#E9E5DC",
  };

  return colors[category.toUpperCase()] || "#F04E23";
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<LoggedInUser | null>(null);



  useEffect(() => {
    function loadUser() {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as LoggedInUser);
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }

    loadUser();

    window.addEventListener("focus", loadUser);

    return () => {
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error("Could not load events.");
        }

        const data = await response.json();
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch {
        setError("Couldn't load the lineup. Check whether the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
  const categories = [
    "ALL",
    ...Array.from(
      new Set(events.map((event) => event.category.toUpperCase()))
    ),
  ];

  const filteredEvents = events.filter((event) => {
    const category = event.category.toUpperCase();

    const matchesSearch = [
      event.title,
      category,
      event.venue,
      event.description,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    return (
      matchesSearch &&
      (activeCategory === "ALL" || category === activeCategory)
    );
  });

  return (
    <main className="min-h-screen bg-[#11110F] text-[#F2F0E8]">
      {/* Navigation */}
      <header className="border-b border-white/15">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
          <a href="#" className="text-2xl font-black tracking-[-0.08em]">
            GATHER<span className="text-[#F04E23]">/</span>
          </a>

          <div className="hidden items-center gap-8 text-xs font-bold tracking-[0.12em] text-white/65 sm:flex">
            <a href="#events" className="hover:text-white">
              THE LINEUP
            </a>
            <a href="#about" className="hover:text-white">
              ABOUT
            </a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden text-xs font-bold tracking-wider text-white/60 sm:inline">
                  HI, {user.name.toUpperCase()}
                </span>

                <a
                  href="/registrations"
                  className="text-xs font-bold tracking-wider hover:text-[#F04E23]"
                >
                  MY REGISTRATIONS
                </a>
                {user.role === "ADMIN" && (
                  <a
                    href="/admin"
                    className="text-xs font-bold tracking-wider hover:text-[#F04E23]"
                  >
                    ADMIN ↗
                  </a>
                )}

                <button
                  onClick={handleLogout}
                  className="border border-white/35 px-4 py-2.5 text-xs font-bold tracking-wider hover:border-[#F04E23] hover:text-[#F04E23]"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-xs font-bold tracking-wider text-white/60 hover:text-[#F04E23]"
                >
                  SIGN IN
                </a>

                <a
                  href="/register"
                  className="border border-white/35 px-4 py-2.5 text-xs font-bold tracking-wider hover:border-[#F04E23] hover:text-[#F04E23]"
                >
                  JOIN GATHER ↗
                </a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:grid-cols-[1.4fr_0.6fr] md:px-12 md:py-24">
        <div>
          <div className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-[#F04E23]">
            <span className="h-2 w-2 bg-[#F04E23]" />
            THE CAMPUS EVENT INDEX / 2026
          </div>

          <h1 className="mt-8 text-[clamp(4rem,11vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.085em]">
            FIND
            <br />
            YOUR
            <br />
            <span className="text-[#F04E23]">PEOPLE.</span>
          </h1>

          <div className="mt-10 flex flex-col justify-between gap-8 border-t border-white/20 pt-5 sm:flex-row sm:items-end">
            <p className="max-w-md text-base leading-7 text-white/60 md:text-lg">
              A running index of things worth showing up for. Ideas,
              experiments, late nights, new people. Find your next reason to
              leave the room.
            </p>

            <a
              href="#events"
              className="flex w-fit items-center gap-4 bg-[#F04E23] px-5 py-4 text-sm font-black text-black"
            >
              EXPLORE THE LINEUP <span className="text-xl">↘</span>
            </a>
          </div>
        </div>

        {/* Graphic panel */}
        <div className="relative hidden min-h-[480px] overflow-hidden border border-white/15 bg-[#1B1B18] md:block">
          <div className="absolute left-7 top-7 text-xs font-bold tracking-[0.2em] text-white/50">
            FIG. 001 — COMMUNITY
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-white/20">
              <div className="absolute h-56 w-56 rounded-full border border-white/30" />
              <div className="absolute h-40 w-40 rounded-full bg-[#F04E23]" />
              <span className="relative z-10 text-7xl font-black tracking-[-0.1em] text-black">
                G/
              </span>
              <span className="absolute -right-8 top-8 bg-[#D5FF00] px-3 py-2 text-xs font-black text-black">
                OPEN TO ALL
              </span>
            </div>
          </div>

          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between border-t border-white/20 pt-4">
            <p className="max-w-[180px] text-sm leading-5 text-white/60">
              Different minds.
              <br />
              Shared spaces.
            </p>
            <span className="text-4xl text-[#F04E23]">↗</span>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="border-t border-white/20">
        <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-12 md:py-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
                01 / WHAT&apos;S ON
              </p>
              <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.06em] md:text-6xl">
                The lineup<span className="text-[#F04E23]">.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH THE INDEX"
                aria-label="Search events"
                className="w-full border border-white/25 bg-transparent px-4 py-3 text-xs font-bold tracking-wider outline-none placeholder:text-white/40 focus:border-[#F04E23] sm:w-64"
              />

              <span className="text-xs tracking-wider text-white/50">
                {String(filteredEvents.length).padStart(2, "0")} RESULTS
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-9 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`border px-4 py-2.5 text-[11px] font-black tracking-wider ${activeCategory === category
                  ? "border-[#F04E23] bg-[#F04E23] text-black"
                  : "border-white/20 text-white/60 hover:border-white/60 hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Event rows */}
          <div className="mt-10 border-t border-white/20">
            {loading && (
              <p className="border-b border-white/20 py-12 text-sm text-white/60">
                LOADING THE LINEUP...
              </p>
            )}

            {!loading && error && (
              <div className="border-b border-white/20 py-12">
                <p className="text-sm text-[#F04E23]">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-xs font-bold tracking-wider hover:text-[#F04E23]"
                >
                  TRY AGAIN ↗
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              filteredEvents.map((event) => {
                const date = new Date(event.dateTime);
                const day = date.toLocaleDateString("en-US", {
                  day: "2-digit",
                });
                const month = date
                  .toLocaleDateString("en-US", { month: "short" })
                  .toUpperCase();
                const time = date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const color = getCategoryColor(event.category);

                return (
                  <article
                    key={event.id}
                    className="grid gap-6 border-b border-white/20 py-7 md:grid-cols-[100px_1fr_220px] md:items-center md:gap-10 md:py-10"
                  >
                    <div className="flex items-baseline gap-2 md:block">
                      <span className="text-5xl font-black tracking-[-0.08em] md:text-6xl">
                        {day}
                      </span>
                      <span className="text-sm font-bold tracking-widest text-[#F04E23]">
                        {month}
                      </span>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className="h-2 w-2"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[11px] font-bold tracking-[0.17em] text-white/50">
                          {event.category.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-3xl font-black uppercase leading-none tracking-[-0.05em] md:text-4xl">
                        {event.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
                        {event.description}
                      </p>

                      <p className="mt-3 text-xs tracking-wide text-white/50">
                        {time} <span className="mx-2">/</span> {event.venue}
                      </p>
                    </div>

                    <a
                      href={`/events/${event.id}`}
                      className="flex w-fit items-center gap-4 border-b border-white/35 pb-2 text-xs font-black tracking-wider hover:border-[#F04E23] hover:text-[#F04E23] md:ml-auto"
                    >
                      EVENT DETAILS <span className="text-lg">↗</span>
                    </a>
                  </article>
                );
              })}

            {!loading && !error && filteredEvents.length === 0 && (
              <div className="border-b border-white/20 py-16">
                <h3 className="text-2xl font-black uppercase">
                  Nothing on the index.
                </h3>
                <p className="mt-3 text-sm text-white/50">
                  {events.length === 0
                    ? "No events have been added yet."
                    : "Try a different search or category."}
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("ALL");
                  }}
                  className="mt-5 text-xs font-bold tracking-wider text-[#F04E23]"
                >
                  RESET FILTERS ↗
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-white/20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between md:px-12">
          <p className="text-lg font-black tracking-[-0.06em]">
            GATHER<span className="text-[#F04E23]">/</span>
          </p>
          <p className="text-xs tracking-wide text-white/45">
            MADE FOR PEOPLE WHO MAKE THINGS.
          </p>
          <a
            href="#"
            className="text-xs font-bold tracking-wider text-white/60 hover:text-white"
          >
            BACK TO TOP ↑
          </a>
        </div>
      </footer>
    </main>
  );
}
