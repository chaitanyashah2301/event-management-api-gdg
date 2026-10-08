
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Registration failed."
        );
      }

      // Store the JWT and user details for authenticated requests.
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
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
            href="/login"
            className="text-xs font-bold tracking-wider text-white/60 hover:text-[#F04E23]"
          >
            SIGN IN ↗
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1100px] gap-14 px-6 py-16 md:grid-cols-[1fr_1fr] md:py-24">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
            YOUR PEOPLE ARE OUT THERE
          </p>

          <h1 className="mt-8 text-6xl font-black uppercase leading-[0.85] tracking-[-0.08em] md:text-8xl">
            GET
            <br />
            IN THE
            <br />
            <span className="text-[#F04E23]">ROOM.</span>
          </h1>

          <p className="mt-8 max-w-sm text-base leading-7 text-white/55">
            Create an account to discover events, meet people, and get involved.
          </p>
        </div>

        <div className="self-center border border-white/20 p-6 md:p-10">
          <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
            START HERE / 01
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em]">
            Create account.
          </h2>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-bold tracking-wider text-white/60"
              >
                FULL NAME
              </label>
              <input
                id="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-white/25 bg-transparent px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#F04E23]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold tracking-wider text-white/60"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-white/25 bg-transparent px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#F04E23]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold tracking-wider text-white/60"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full border border-white/25 bg-transparent px-4 py-3 outline-none placeholder:text-white/30 focus:border-[#F04E23]"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-[#F04E23]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F04E23] px-5 py-4 text-sm font-black text-black disabled:opacity-50"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT ↗"}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/50">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-bold text-[#F04E23] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
