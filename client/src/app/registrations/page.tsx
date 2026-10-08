
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Event = {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  venue: string;
  capacity: number;
  category: string;
};

type Registration = {
  id: number;
  eventId: number;
  createdAt: string;
  event: Event;
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchRegistrations = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in to view your registrations.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch("/api/registrations/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Could not load registrations.");
      }

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.registrations)
          ? data.registrations
          : [];

      setRegistrations(list);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  async function handleUnregister(eventId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in again.");
      return;
    }

    setRemovingId(eventId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/registrations/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Could not unregister.");
      }

      setRegistrations((current) =>
        current.filter((registration) => registration.eventId !== eventId)
      );

      setMessage("Successfully unregistered from the event.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#11110F] text-[#F2F0E8]">
      <header className="border-b border-white/15">
        <nav className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black tracking-[-0.08em]">
            GATHER<span className="text-[#F04E23]">/</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold tracking-wider text-white/60 hover:text-[#F04E23]"
          >
            BACK TO LINEUP ↗
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
          YOUR ACTIVITY / 03
        </p>

        <h1 className="mt-6 text-5xl font-black uppercase leading-none tracking-[-0.07em] md:text-7xl">
          MY
          <br />
          REGISTRATIONS<span className="text-[#F04E23]">.</span>
        </h1>

        <p className="mt-6 text-sm text-white/50">
          The events you signed up for, all in one place.
        </p>

        {message && (
          <p role="status" className="mt-8 text-sm text-[#D5FF00]">
            {message}
          </p>
        )}

        {error && (
          <div className="mt-8 border border-[#F04E23]/50 p-5">
            <p role="alert" className="text-sm text-[#F04E23]">
              {error}
            </p>

            {!localStorage.getItem("token") && (
              <Link
                href="/login"
                className="mt-4 inline-block text-xs font-bold tracking-wider underline"
              >
                SIGN IN ↗
              </Link>
            )}

            <button
              onClick={fetchRegistrations}
              className="ml-4 mt-4 text-xs font-bold tracking-wider hover:text-[#F04E23]"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {loading ? (
          <p className="mt-12 border-t border-white/20 py-10 text-sm text-white/50">
            LOADING YOUR REGISTRATIONS...
          </p>
        ) : !error && registrations.length === 0 ? (
          <div className="mt-12 border-y border-white/20 py-12">
            <h2 className="text-2xl font-black uppercase">
              Nothing on your list yet.
            </h2>
            <p className="mt-3 text-sm text-white/50">
              Find an event that interests you and save your spot.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-[#F04E23] px-5 py-4 text-xs font-black text-black"
            >
              EXPLORE EVENTS ↗
            </Link>
          </div>
        ) : (
          <div className="mt-12 border-t border-white/20">
            {registrations.map((registration) => {
              const event = registration.event;

              if (!event) return null;

              const date = new Date(event.dateTime);

              return (
                <article
                  key={registration.id}
                  className="flex flex-col gap-6 border-b border-white/20 py-8 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-[#F04E23]">
                      {event.category.toUpperCase()}
                    </p>

                    <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                      {event.title}
                    </h2>

                    <p className="mt-3 text-sm text-white/55">
                      {date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" / "}
                      {date.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="mt-2 text-sm text-white/55">
                      {event.venue}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUnregister(event.id)}
                    disabled={removingId === event.id}
                    className="w-fit border border-white/30 px-5 py-3 text-xs font-bold tracking-wider hover:border-[#F04E23] hover:text-[#F04E23] disabled:opacity-50"
                  >
                    {removingId === event.id
                      ? "REMOVING..."
                      : "UNREGISTER ↗"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
