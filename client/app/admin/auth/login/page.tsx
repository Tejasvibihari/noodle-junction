"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            console.log(data); // replace with your API call
            // const res = await fetch("/api/login", { method: "POST", body: JSON.stringify(data) });
            // if (!res.ok) throw new Error("Invalid email or password");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const inputClass =
        "w-full border border-bronze/50 bg-transparent px-4 py-3 text-foreground placeholder:text-champagne/40 outline-none transition-colors focus:border-gold";
    const labelClass =
        "mb-2 block text-xs uppercase tracking-[0.2em] text-champagne/70";

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Left: brand panel */}
            <section className="relative hidden items-center justify-center overflow-hidden lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--maroon)_0%,var(--ink)_75%)]" />
                <div className="relative max-w-md px-12 text-center">
                    <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
                        金龍
                    </p>
                    <h1 className="text-5xl leading-tight">Noodle Junction</h1>
                    <div className="gold-divider mx-auto my-8 w-32" />
                    <p className="text-lg leading-8 text-champagne/75">
                        Welcome back. Your table, your favourites and your rewards are
                        waiting.
                    </p>
                </div>
            </section>

            {/* Right: form */}
            <section className="flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <Link
                        href="/"
                        className="mb-10 block font-serif text-2xl tracking-wide text-gold lg:hidden"
                    >
                        Noodle Junction
                    </Link>

                    <p className="mb-3 text-sm uppercase tracking-[0.3em] text-vermilion">
                        Sign In
                    </p>
                    <h2 className="text-4xl">Welcome Back</h2>
                    <div className="gold-divider my-6 w-24" />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <p
                                role="alert"
                                className="border border-vermilion/60 bg-vermilion/10 px-4 py-3 text-sm text-champagne"
                            >
                                {error}
                            </p>
                        )}

                        <div>
                            <label htmlFor="email" className={labelClass}>
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-xs uppercase tracking-[0.2em] text-champagne/70"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-gold hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    className={`${inputClass} pr-16`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-widest text-gold hover:text-champagne"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 text-sm text-champagne/70">
                            <input
                                type="checkbox"
                                name="remember"
                                className="h-4 w-4 accent-[var(--gold)]"
                            />
                            Keep me signed in
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-widest text-champagne/40">
                        <span className="h-px flex-1 bg-bronze/40" />
                        or
                        <span className="h-px flex-1 bg-bronze/40" />
                    </div>


                    <p className="mt-8 text-center text-sm text-champagne/70">
                        New to Noodle Junction?{" "}
                        <Link href="/admin/auth/signup" className="text-gold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}