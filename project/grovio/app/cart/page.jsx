"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-10 py-12">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Your Basket
          </p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="mt-3 text-gray-500">
            Review your products before proceeding to checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <FiShoppingBag size={28} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some groceries and come back here.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              <FiArrowLeft />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                      {item.category}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹{item.price} each
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100"
                      >
                        <FiMinus />
                      </button>

                      <span className="w-5 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 />
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 pt-3 text-sm font-semibold text-green-600"
              >
                <FiArrowLeft />
                Continue Shopping
              </Link>
            </div>

            <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-500">
                  <span>Items ({totalItems})</span>
                  <span>₹{total}</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>

              <div className="my-6 border-t border-gray-100" />

              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{total}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
              >
                Proceed to Checkout
                <FiArrowRight />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
