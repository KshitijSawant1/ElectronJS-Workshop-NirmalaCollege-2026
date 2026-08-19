## `app/page.jsx` - Home Page

### Purpose

This page creates the **Grovio home screen**. It introduces the app, displays grocery categories, and provides navigation to the Products page.

### 1. Importing Navigation and Icons

```jsx
import Link from "next/link";
import { FiArrowRight, FiTruck, FiClock, FiShield } from "react-icons/fi";
```

`Link` is used for navigation between Next.js pages. React Icons are used to improve the visual interface without using image files.

---

### 2. Creating Category Data

```jsx
const categories = [
  {
    name: "Fruits",
    icon: GiFruitBowl,
    description: "Fresh & seasonal",
  },
];
```

The categories are stored as an **array of objects**.

Each object contains:

```text
name
icon
description
```

This avoids writing separate JSX manually for every category.

---

### 3. Hero Section

```jsx
<section className="px-10 py-24 text-center">
  <h1 className="text-5xl font-bold">Everything you need</h1>

  <Link href="/products">Start Shopping</Link>
</section>
```

The hero section introduces the application and provides the main action.

The route:

```jsx
href = "/products";
```

moves the user to:

```text
app/products/page.jsx
```

---

### 4. Rendering Categories with `map()`

```jsx
{
  categories.map((category) => {
    const Icon = category.icon;

    return (
      <Link href="/products" key={category.name}>
        <Icon />
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </Link>
    );
  });
}
```

`map()` loops through the category array and generates one card for every category.

Flow:

```text
categories array
      ↓
     map()
      ↓
Category Object
      ↓
Category Card
```

---

### 5. Dynamic React Icon

```jsx
const Icon = category.icon;
```

The icon stored inside the category object is assigned to `Icon`.

It can then be rendered like a normal React component:

```jsx
<Icon />
```

---

### 6. Tailwind CSS Styling

Example:

```jsx
className = "rounded-2xl bg-green-600 px-7 py-3 text-white";
```

Tailwind CSS utility classes control:

```text
Layout
Spacing
Colors
Typography
Borders
Hover effects
```

For example:

```jsx
hover: bg - green - 700;
```

changes the button color when the mouse moves over it.

---

### 7. Delivery Features Section

```jsx
<FiTruck />
<FiClock />
<FiShield />
```

The bottom section highlights three app benefits:

```text
Quick Delivery
Save Time
Quality Products
```

These are static UI elements and do not contain application logic.

---

## Page Flow

```text
Home Page
   │
   ├── Hero Section
   │      ↓
   │   Start Shopping
   │      ↓
   │   /products
   │
   ├── Categories
   │      ↓
   │   map()
   │      ↓
   │   Category Cards
   │
   └── Delivery Features
```

### Key Concepts Used

**Next.js Routing → React Components → Arrays & Objects → `map()` → Dynamic Components → Tailwind CSS**

---

# Complete Code

```jsx
import Link from "next/link";
import { FiArrowRight, FiTruck, FiClock, FiShield } from "react-icons/fi";

import {
  GiFruitBowl,
  GiBroccoli,
  GiMilkCarton,
  GiChipsBag,
} from "react-icons/gi";

export default function Home() {
  const categories = [
    {
      name: "Fruits",
      icon: GiFruitBowl,
      description: "Fresh & seasonal",
    },
    {
      name: "Vegetables",
      icon: GiBroccoli,
      description: "Farm fresh",
    },
    {
      name: "Dairy",
      icon: GiMilkCarton,
      description: "Daily essentials",
    },
    {
      name: "Snacks",
      icon: GiChipsBag,
      description: "Quick bites",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="px-10 py-24 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          <FiClock />
          Groceries delivered quickly
        </div>

        <h1 className="text-5xl font-bold leading-tight text-gray-900">
          Everything you need,
          <br />
          <span className="text-green-600">right at your doorstep.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-gray-500">
          Fresh groceries, everyday essentials and your favourite snacks — all
          in one place.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Start Shopping
          <FiArrowRight />
        </Link>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-10 pb-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Categories
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href="/products"
                key={category.name}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-2xl text-green-600">
                  <Icon />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600">
                  Shop now
                  <FiArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Delivery Banner */}
      <section className="mx-auto mb-12 max-w-6xl px-10">
        <div className="grid grid-cols-3 gap-6 rounded-2xl bg-green-600 p-8 text-white">
          <div className="flex items-center gap-4">
            <FiTruck size={28} />

            <div>
              <h3 className="font-semibold">Quick Delivery</h3>
              <p className="text-sm text-green-100">
                Delivered to your doorstep
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiClock size={28} />

            <div>
              <h3 className="font-semibold">Save Time</h3>
              <p className="text-sm text-green-100">
                Shop essentials in minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiShield size={28} />

            <div>
              <h3 className="font-semibold">Quality Products</h3>
              <p className="text-sm text-green-100">
                Fresh products you can trust
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```
