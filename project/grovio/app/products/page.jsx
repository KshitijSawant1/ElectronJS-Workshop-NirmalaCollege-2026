import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

export default function Products() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        {/* Page Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Grovio Store
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Fresh groceries for you
          </h1>

          <p className="mt-3 text-gray-500">
            Browse everyday essentials and add them to your cart.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
