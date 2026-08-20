"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    login({
      id: data.user.id,
      email: data.user.email,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
    });

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
        <Image
          src="/logo/grovio-logo.png"
          alt="Grovio"
          width={55}
          height={55}
          className="mx-auto"
        />

        <h1 className="mt-4 text-center text-3xl font-bold">Sign In</h1>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div className="flex items-center border px-3">
            <FiMail />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 outline-none"
            />
          </div>

          <div className="flex items-center border px-3">
            <FiLock />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 outline-none"
            />
          </div>

          {message && (
            <p className="text-center text-sm text-red-600">{message}</p>
          )}

          <button
            disabled={loading}
            className="flex w-full justify-center gap-2 rounded bg-green-600 py-3 text-white"
          >
            <FiLogIn />
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-600">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
