
"use client";

import { useEffect, useState, type FormEvent } from "react";
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

const emptyForm = {
  title: "",
  description: "",
  dateTime: "",
  venue: "",
  capacity: "50",
  category: "Workshop",
};

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/events");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Could not load events.");
      }

      setEvents(Array.isArray(data.events) ? data.events : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        setIsAdmin(user.role === "ADMIN");
      } catch {
        setIsAdmin(false);
      }
    }

    loadEvents();
  }, []);

  function startEditing(event: Event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      dateTime: new Date(event.dateTime).toISOString().slice(0, 16),
      venue: event.venue,
      capacity: String(event.capacity),
      category: event.category,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in with an admin account.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        editingId ? `/api/events/${editingId}` : "/api/events",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            dateTime: new Date(form.dateTime).toISOString(),
            capacity: Number(form.capacity),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Could not save event.");
      }

      setMessage(editingId ? "Event updated successfully." : "Event created successfully.");
      setEditingId(null);
      setForm(emptyForm);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this event? Its registrations will also be deleted.")) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in with an admin account.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || "Could not delete event.");
      }

      if (editingId === id) {
        cancelEditing();
      }

      setMessage("Event deleted successfully.");
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
            BACK TO SITE ↗
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
          CONTROL ROOM / 04
        </p>

        <h1 className="mt-6 text-5xl font-black uppercase leading-none tracking-[-0.07em] md:text-7xl">
          ADMIN
          <br />
          DASHBOARD<span className="text-[#F04E23]">.</span>
        </h1>

        {!isAdmin ? (
          <div className="mt-10 border border-white/20 p-6">
            <p className="font-bold">ADMIN ACCESS REQUIRED</p>
            <p className="mt-2 text-sm text-white/60">
              Sign in with an account whose role is ADMIN to manage events.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block bg-[#F04E23] px-5 py-3 text-xs font-black text-black"
            >
              SIGN IN ↗
            </Link>
            <p className="mt-4 text-xs text-white/40">
              Your backend still enforces admin permissions. Changing the role
              stored in the browser does not grant actual admin access.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="mt-12 space-y-5 border-y border-white/20 py-8">
              <h2 className="text-2xl font-black uppercase">
                {editingId ? "EDIT EVENT" : "CREATE EVENT"}
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-xs font-bold tracking-wider">
                  EVENT TITLE
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-2 w-full border border-white/20 bg-transparent p-3 text-sm"
                    placeholder="e.g. React Workshop"
                  />
                </label>

                <label className="block text-xs font-bold tracking-wider">
                  CATEGORY
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-2 w-full border border-white/20 bg-transparent p-3 text-sm"
                    placeholder="Workshop"
                  />
                </label>

                <label className="block text-xs font-bold tracking-wider sm:col-span-2">
                  DESCRIPTION
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="mt-2 w-full border border-white/20 bg-transparent p-3 text-sm"
                    placeholder="What will attendees learn or experience?"
                  />
                </label>

                <label className="block text-xs font-bold tracking-wider">
                  DATE AND TIME
                  <input
                    required
                    type="datetime-local"
                    value={form.dateTime}
                    onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                    className="mt-2 w-full border border-white/20 bg-transparent p-3 text-sm"
                  />
                </label>

                <label className="block text-xs font-bold tracking-wider">
                  VENUE
                  <input
                    required
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="mt-2 w-full border border-white/20 bg-transparent p-3 text-sm"
                    placeholder="Building / auditorium"
                  />
                </label>

                <label className="block text-xs font-bold tracking-wider">
                  CAPACITY
                  <input
                    required
                    min="1"
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="mt-2 w-full border border-white/20 bg-transparent p-3 text-sm"
                  />
                </label>
              </div>

              {error && <p role="alert" className="text-sm text-[#F04E23]">{error}</p>}
              {message && <p role="status" className="text-sm text-[#D5FF00]">{message}</p>}

              <div className="flex flex-wrap gap-3">
                <button
                  disabled={saving}
                  className="bg-[#F04E23] px-6 py-4 text-xs font-black text-black disabled:opacity-50"
                >
                  {saving ? "SAVING..." : editingId ? "SAVE CHANGES →" : "CREATE EVENT →"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="border border-white/30 px-6 py-4 text-xs font-bold"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>

            <div className="mt-14">
              <h2 className="text-2xl font-black uppercase">EXISTING EVENTS</h2>

              {loading ? (
                <p className="mt-6 text-sm text-white/50">LOADING EVENTS...</p>
              ) : events.length === 0 ? (
                <p className="mt-6 text-sm text-white/50">No events found.</p>
              ) : (
                <div className="mt-6 border-t border-white/20">
                  {events.map((event) => (
                    <article
                      key={event.id}
                      className="flex flex-col gap-4 border-b border-white/20 py-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold tracking-widest text-[#F04E23]">
                          {event.category.toUpperCase()} / EVENT {event.id}
                        </p>
                        <h3 className="mt-2 text-xl font-black uppercase">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-sm text-white/50">
                          {event.venue} · Capacity {event.capacity}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => startEditing(event)}
                          className="border border-white/30 px-4 py-3 text-xs font-bold hover:border-[#D5FF00]"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="border border-white/30 px-4 py-3 text-xs font-bold hover:border-[#F04E23] hover:text-[#F04E23]"
                        >
                          DELETE
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
