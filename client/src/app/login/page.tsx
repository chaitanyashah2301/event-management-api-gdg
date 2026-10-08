
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Login failed."
        );
      }

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
            href="/register"
            className="text-xs font-bold tracking-wider text-white/60 hover:text-[#F04E23]"
          >
            CREATE ACCOUNT ↗
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-[1100px] gap-14 px-6 py-16 md:grid-cols-[1fr_1fr] md:py-24">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
            GOOD TO HAVE YOU BACK
          </p>

          <h1 className="mt-8 text-6xl font-black uppercase leading-[0.85] tracking-[-0.08em] md:text-8xl">
            PICK
            <br />
            UP
            <br />
            <span className="text-[#F04E23]">WHERE</span>
            <br />
            YOU LEFT.
          </h1>

          <p className="mt-8 max-w-sm text-base leading-7 text-white/55">
            Sign in to find your next event and reconnect with your community.
          </p>
        </div>

        <div className="self-center border border-white/20 p-6 md:p-10">
          <p className="text-xs font-bold tracking-[0.2em] text-[#F04E23]">
            WELCOME BACK / 02
          </p>

          <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.05em]">
            Sign in.
          </h2>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
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
              {loading ? "SIGNING IN..." : "SIGN IN ↗"}
            </button>
          </form>

          <p className="mt-6 text-sm text-white/50">
            New here?{" "}
            <Link
              href="/register"
              className="font-bold text-[#F04E23] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
