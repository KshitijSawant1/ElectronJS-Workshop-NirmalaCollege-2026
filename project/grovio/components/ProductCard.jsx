"use client";

import Image from "next/image";
import { FiPlus, FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative h-60 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Information */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
          {product.category}
        </p>

        <h2 className="mt-2 text-lg font-semibold text-gray-900">
          {product.name}
        </h2>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400">Price</p>

            <p className="text-xl font-bold text-gray-900">₹{product.price}</p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-95"
          >
            <FiShoppingCart size={17} />
            Add
            <FiPlus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
