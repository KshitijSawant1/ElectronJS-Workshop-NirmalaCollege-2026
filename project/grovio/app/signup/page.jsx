"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiUserPlus,
} from "react-icons/fi";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fields = [
    ["name", "text", "Full Name", FiUser],
    ["email", "email", "Email", FiMail],
    ["phone", "tel", "Phone Number", FiPhone],
    ["password", "password", "Create Password", FiLock],
  ];

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error || !data.user) {
      setMessage(error?.message || "User could not be created.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: form.name,
      phone: form.phone,
      address: form.address,
    });

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage("Account created. Please confirm your email.");
      setLoading(false);
      return;
    }

    login({
      id: data.user.id,
      email: data.user.email,
      full_name: form.name,
      phone: form.phone,
      address: form.address,
    });

    router.push("/");
    router.refresh();
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

        <h1 className="mt-4 text-center text-3xl font-bold">Create Account</h1>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          {fields.map(([name, type, placeholder, Icon]) => (
            <div key={name} className="flex items-center border px-3">
              <Icon />

              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={updateField}
                required
                minLength={name === "password" ? 6 : undefined}
                className="w-full p-3 outline-none"
              />
            </div>
          ))}

          <div className="flex items-start border px-3">
            <FiMapPin className="mt-4" />

            <textarea
              name="address"
              placeholder="Delivery Address"
              value={form.address}
              onChange={updateField}
              required
              rows={3}
              className="w-full resize-none p-3 outline-none"
            />
          </div>

          {message && (
            <p className="text-center text-sm text-red-600">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center gap-2 rounded bg-green-600 py-3 text-white disabled:bg-gray-400"
          >
            <FiUserPlus />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="text-green-600">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
