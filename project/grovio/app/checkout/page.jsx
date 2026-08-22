"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successOrder, setSuccessOrder] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const details = [
    ["Customer Name", user?.full_name, FiUser],
    ["Mobile Number", user?.phone, FiPhone],
    ["Delivery Address", user?.address, FiMapPin],
  ];

  async function placeOrder(e) {
    e.preventDefault();

    if (!user || !cart.length) {
      setMessage(!user ? "Please sign in first." : "Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await createClient()
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: user.full_name,
        phone: user.phone,
        address: user.address,
        items: cart,
        total,
        status: "Placed",
      })
      .select()
      .single();

    setLoading(false);

    if (error) return setMessage(error.message);

    setSuccessOrder(data);
  }

  function finishOrder() {
    clearCart();
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-10 py-12">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase text-green-600">
            Almost there
          </p>
          <h1 className="mt-2 text-4xl font-bold">Checkout</h1>
          <p className="mt-3 text-gray-500">
            Review your details and confirm your order.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={placeOrder}
            className="rounded-2xl bg-white p-7 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Delivery Details</h2>

            {details.map(([label, value, Icon]) => (
              <div key={label} className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  {label}
                </label>

                <div className="flex items-start rounded-xl bg-gray-50 px-4">
                  <Icon className="mt-4 text-gray-400" />

                  {label === "Delivery Address" ? (
                    <textarea
                      value={value || ""}
                      readOnly
                      rows={3}
                      className="w-full resize-none bg-transparent p-3 outline-none"
                    />
                  ) : (
                    <input
                      value={value || ""}
                      readOnly
                      className="w-full bg-transparent p-3 outline-none"
                    />
                  )}
                </div>
              </div>
            ))}

            {message && (
              <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {message}
              </p>
            )}

            <button
              disabled={loading || !user || !cart.length}
              className="mt-7 flex w-full justify-center gap-2 rounded-xl bg-green-600 p-3 font-semibold text-white disabled:bg-gray-300"
            >
              {loading ? "Placing Order..." : "Place Order"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <section className="h-fit rounded-2xl bg-white p-7 shadow-sm">
            <h2 className="flex items-center gap-3 text-xl font-semibold">
              <FiShoppingBag className="text-green-600" />
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <b>₹{item.price * item.quantity}</b>
                </div>
              ))}
            </div>

            <div className="my-6 border-t" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </section>
        </div>
      </div>

      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center">
            <FiCheck
              size={48}
              className="mx-auto rounded-full bg-green-100 p-2 text-green-600"
            />

            <h2 className="mt-4 text-2xl font-bold">Order Placed</h2>

            <p className="mt-3 text-gray-500">Order #{successOrder.id}</p>

            <p className="mt-2 text-xl font-bold">₹{successOrder.total}</p>

            <button
              onClick={finishOrder}
              className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
