"use client";

import Link from "next/link";
import { useState } from "react";
import axiosClient from '@/service/axiosClient'
import { useRouter } from "next/navigation";
import axios from "axios";

interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark: string;
}

interface SignupFormData {
    username: string;
    restaurentName: string;
    name: string;
    email: string;
    mobile: string;
    address: Address;
    password: string;
}

const initialForm: SignupFormData = {
    username: "",
    restaurentName: "",
    name: "",
    email: "",
    mobile: "",
    address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    },
    password: "",
};

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<SignupFormData>(initialForm);
    const router = useRouter();
    const [error, setError] = useState<string>("");

    // Handles top-level fields (username, email, ...)
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Handles nested address fields (street, city, ...)
    function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axiosClient.post("/admin/auth/sign-up", formData);
            console.log(response); // Handle the response as needed
            router.push("/admin/auth/login");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    (err.request
                        ? "Cannot reach the server. Please try again."
                        : "Something went wrong.")
                );
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    }
    const inputClass =
        "w-full border border-bronze/50 bg-transparent px-4 py-3 text-foreground placeholder:text-champagne/40 outline-none transition-colors focus:border-gold";
    const labelClass =
        "mb-2 block text-xs uppercase tracking-[0.2em] text-champagne/70";
    const sectionClass =
        "pt-2 text-xs uppercase tracking-[0.3em] text-gold";

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Left: brand panel (stays fixed while the form scrolls) */}
            <section className="relative hidden items-center justify-center overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-screen">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--maroon)_0%,var(--ink)_75%)]" />
                <div className="relative max-w-md px-12 text-center">
                    <p className="mb-4 text-sm uppercase tracking-[0.4em] text-gold">
                        金龍
                    </p>
                    <h1 className="text-5xl leading-tight">Noodle Junction</h1>
                    <div className="gold-divider mx-auto my-8 w-32" />
                    <p className="text-lg leading-8 text-champagne/75">
                        Set up your restaurant account to manage your menu, orders and
                        reservations in one place.
                    </p>
                </div>
            </section>

            {/* Right: form */}
            <section className="flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-lg">
                    <Link
                        href="/"
                        className="mb-10 block font-serif text-2xl tracking-wide text-gold lg:hidden"
                    >
                        Noodle Junction
                    </Link>

                    <p className="mb-3 text-sm uppercase tracking-[0.3em] text-vermilion">
                        Create Account
                    </p>
                    <h2 className="text-4xl">Welcome</h2>
                    <div className="gold-divider my-6 w-24" />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Restaurant details */}
                        <p className={sectionClass}>Restaurant</p>

                        <div>
                            <label htmlFor="restaurentName" className={labelClass}>
                                Restaurant Name
                            </label>
                            <input
                                id="restaurentName"
                                name="restaurentName"
                                type="text"
                                required
                                value={formData.restaurentName}
                                onChange={handleChange}
                                placeholder="Noodle Junction"
                                className={inputClass}
                            />
                        </div>

                        {/* Owner details */}
                        <p className={sectionClass}>Owner</p>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className={labelClass}>
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className={labelClass}>
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="noodlejunction"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
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
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="mobile" className={labelClass}>
                                    Mobile
                                </label>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    required
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    title="Enter a 10 digit mobile number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="10 digit number"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <p className={sectionClass}>Address</p>

                        <div>
                            <label htmlFor="street" className={labelClass}>
                                Street
                            </label>
                            <input
                                id="street"
                                name="street"
                                type="text"
                                required
                                autoComplete="street-address"
                                value={formData.address.street}
                                onChange={handleAddressChange}
                                placeholder="Shop no., street, area"
                                className={inputClass}
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="city" className={labelClass}>
                                    City
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    autoComplete="address-level2"
                                    value={formData.address.city}
                                    onChange={handleAddressChange}
                                    placeholder="City"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="state" className={labelClass}>
                                    State
                                </label>
                                <input
                                    id="state"
                                    name="state"
                                    type="text"
                                    required
                                    autoComplete="address-level1"
                                    value={formData.address.state}
                                    onChange={handleAddressChange}
                                    placeholder="State"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="pincode" className={labelClass}>
                                    Pincode
                                </label>
                                <input
                                    id="pincode"
                                    name="pincode"
                                    type="text"
                                    required
                                    inputMode="numeric"
                                    autoComplete="postal-code"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    title="Enter a 6 digit pincode"
                                    value={formData.address.pincode}
                                    onChange={handleAddressChange}
                                    placeholder="6 digit pincode"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="landmark" className={labelClass}>
                                    Landmark
                                </label>
                                <input
                                    id="landmark"
                                    name="landmark"
                                    type="text"
                                    value={formData.address.landmark}
                                    onChange={handleAddressChange}
                                    placeholder="Near... (optional)"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Security */}
                        <p className={sectionClass}>Security</p>

                        <div>
                            <label htmlFor="password" className={labelClass}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 8 characters"
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

                        <label className="flex items-start gap-3 text-sm text-champagne/70">
                            <input
                                type="checkbox"
                                name="terms"
                                required
                                className="mt-1 h-4 w-4 accent-[var(--gold)]"
                            />
                            <span>
                                I agree to the{" "}
                                <Link href="/terms" className="text-gold hover:underline">
                                    Terms
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-gold hover:underline">
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>
                        {error && (
                            <p
                                role="alert"
                                className="border border-vermilion/60 bg-vermilion/10 px-4 py-3 text-sm text-champagne"
                            >
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-champagne/70">
                        Already have an account?{" "}
                        <Link
                            href="/admin/auth/login"
                            className="text-gold hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}