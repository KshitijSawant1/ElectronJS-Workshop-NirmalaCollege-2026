"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Fetch profile using Supabase user
  async function loadProfile(authUser) {
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error) {
      console.error("Profile Error:", error);

      setUser({
        id: authUser.id,
        email: authUser.email,
      });

      setLoading(false);
      return;
    }

    setUser({
      id: authUser.id,
      email: authUser.email,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
    });

    setLoading(false);
  }

  // Restore session when app starts
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      await loadProfile(authUser);
    }

    checkUser();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Used after Sign In
  function login(userData) {
    setUser(userData);
  }

  // Real Supabase logout
  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
