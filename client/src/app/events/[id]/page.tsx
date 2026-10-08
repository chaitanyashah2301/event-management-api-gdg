
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
};

export default function EventDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${params.id}`);

        if (!response.ok) {
          throw new Error("Event not found.");
        }

        const data = await response.json();
        const currentEvent: Event = data.event ?? data;

        setEvent(currentEvent);

        // Check whether the user is signed in.
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(true);

        // Check whether this user already registered.
        const registrationsResponse = await fetch(
          "/api/registrations/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (registrationsResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          return;
        }

        if (registrationsResponse.ok) {
          const registrationsData = await registrationsResponse.json();

          const registrations: Registration[] = Array.isArray(
            registrationsData
          )
            ? registrationsData
            : Array.isArray(registrationsData.registrations)
              ? registrationsData.registrations
              : [];

          setIsRegistered(
            registrations.some(
              (registration) => registration.eventId === currentEvent.id
            )
          );
        }
      } catch {
        setError("Couldn't load this event. It may not exist.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [params.id]);

  async function handleRegistration() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setActionLoading(true);
    setActionMessage("");

    try {
      const response = await fetch(
        `/api/registrations/events/${params.id}`,
        {
          method: isRegistered ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
        }

        throw new Error(
          data.error ||
            data.message ||
            "Could not complete your registration."
        );
      }

      const newRegistrationState = !isRegistered;
      setIsRegistered(newRegistrationState);

      setActionMessage(
        newRegistrationState
          ? "You're registered! Your spot is saved."
          : "You've successfully unregistered from this event."
      );
    } catch (err) {
      setActionMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  }

  const date = event ? new Date(event.dateTime) : null;

  return (
    <main className="min-h-screen bg-[#11110F] text-[#F2F0E8]">
      <header className="border-b border-white/15">
        <nav className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black tracking-[-0.08em]">
            GATHER<span className="text-[#F04E23]">/</span>
          </Link>

          <Link
            href="/#events"
            className="text-xs font-bold tracking-wider text-white/60 hover:text-[#F04E23]"
          >
            ← BACK TO LINEUP
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1100px] px-6 py-16 md:py-24">
        {loading && (
          <p className="text-sm tracking-widest text-white/60">
            LOADING EVENT...
          </p>
        )}

        {!loading && error && (
          <div>
            <h1 className="text-4xl font-black uppercase">
              EVENT NOT FOUND.
            </h1>
            <p className="mt-4 text-white/60">{error}</p>
            <Link
              href="/#events"
              className="mt-8 inline-block text-sm font-bold text-[#F04E23]"
            >
              RETURN TO LINEUP ↗
            </Link>
          </div>
        )}

        {!loading && !error && event && date && (
          <>
            <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
              {event.category.toUpperCase()} / EVENT {event.id}
            </p>

            <h1 className="mt-8 max-w-4xl break-words text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] md:text-8xl">
              {event.title}
              <span className="text-[#F04E23]">.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">
              {event.description}
            </p>

            <div className="mt-14 grid gap-8 border-y border-white/20 py-8 sm:grid-cols-3">
              <div>
                <p className="text-xs tracking-widest text-white/40">
                  DATE
                </p>
                <p className="mt-3 text-xl font-black">
                  {date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest text-white/40">
                  TIME
                </p>
                <p className="mt-3 text-xl font-black">
                  {date.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs tracking-widest text-white/40">
                  VENUE
                </p>
                <p className="mt-3 text-xl font-black">{event.venue}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs tracking-widest text-white/40">
                  TOTAL CAPACITY
                </p>
                <p className="mt-2 text-2xl font-black">
                  {event.capacity}
                </p>
              </div>

              <button
                onClick={handleRegistration}
                disabled={actionLoading}
                className="bg-[#F04E23] px-6 py-4 text-sm font-black text-black disabled:cursor-wait disabled:opacity-50"
              >
                {actionLoading
                  ? "PLEASE WAIT..."
                  : !isLoggedIn
                    ? "SIGN IN TO REGISTER →"
                    : isRegistered
                      ? "UNREGISTER FROM EVENT ↗"
                      : "REGISTER FOR EVENT →"}
              </button>
            </div>

            {actionMessage && (
              <p
                role="status"
                className={`mt-6 text-sm ${
                  actionMessage.startsWith("You're registered") ||
                  actionMessage.startsWith("You've successfully")
                    ? "text-[#D5FF00]"
                    : "text-[#F04E23]"
                }`}
              >
                {actionMessage}
              </p>
            )}

            {!isLoggedIn && (
              <p className="mt-4 text-sm text-white/40">
                Sign in to reserve your place at this event.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
