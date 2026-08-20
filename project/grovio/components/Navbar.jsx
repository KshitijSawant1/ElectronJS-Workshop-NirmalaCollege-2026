"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdFeedback } from "react-icons/md";
import {
  FiHome,
  FiShoppingBag,
  FiShoppingCart,
  FiLogIn,
  FiLogOut,
  FiUserPlus,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: "Home", href: "/", icon: FiHome },
    { name: "Products", href: "/products", icon: FiShoppingBag },
    { name: "Feedback", href: "/feedback", icon: MdFeedback },
  ];

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/grovio-logo.png"
            alt="Grovio Logo"
            width={46}
            height={46}
            priority
          />

          <div>
            <h1 className="text-xl font-bold text-gray-900">Grovio</h1>

            <p className="text-xs text-gray-400">Quick Grocery</p>
          </div>
        </Link>

        {/* Main Links */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                pathname === href
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={17} />
              {name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/signin"
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <FiLogIn size={17} />
                Sign In
              </Link>

              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FiUserPlus size={17} />
                Create Account
              </Link>
            </>
          ) : (
            <>
              <div className="hidden rounded-xl bg-green-50 px-4 py-2 md:block">
                <p className="text-xs text-gray-400">Signed in as</p>

                <p className="max-w-32 truncate text-sm font-semibold text-green-700">
                  {user.full_name || user.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <FiLogOut size={17} />
                Logout
              </button>
            </>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${
              pathname === "/cart"
                ? "bg-green-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <FiShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-green-600">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
