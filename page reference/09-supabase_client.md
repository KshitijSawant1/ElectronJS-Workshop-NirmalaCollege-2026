## `lib/supabase/client.js` - Supabase Browser Client

### Purpose

This file creates and exports the **Supabase browser client** used by the Grovio application.

The client provides a connection between the frontend of the application and the Grovio Supabase project.

It is mainly used when client-side components need to perform operations such as:

```text
User Authentication
Database Queries
Reading Data
Inserting Data
Updating Data
Deleting Data
```

The Supabase client is created using the project's environment variables rather than directly writing the Supabase credentials inside the source code.

---

### 1. Importing `createBrowserClient`

```jsx
import { createBrowserClient } from "@supabase/ssr";
```

`createBrowserClient()` is provided by the `@supabase/ssr` package.

It creates a Supabase client specifically intended for use in the browser/client-side part of a Next.js application.

The function handles the connection between the application and the Supabase backend.

---

### 2. Creating the Supabase Client Function

```jsx
export function createClient() {
```

The `createClient()` function creates and returns a configured Supabase client.

Keeping this logic inside a separate file avoids repeatedly writing the Supabase configuration throughout the application.

Other files can simply import:

```jsx
import { createClient } from "@/lib/supabase/client";
```

and then create the client when required.

---

### 3. Supabase Project URL

```jsx
process.env.NEXT_PUBLIC_SUPABASE_URL
```

This retrieves the Supabase project URL from the environment variables.

The variable is stored in:

```text
.env.local
```

Example:

```text
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
```

The `NEXT_PUBLIC_` prefix means the variable can be exposed to client-side code.

---

### 4. Supabase Publishable Key

```jsx
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

This retrieves the Supabase **publishable key** from the environment configuration.

Example:

```text
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The key is passed to `createBrowserClient()` together with the Supabase project URL.

The publishable key is intended for frontend use. Sensitive server-side secrets should not be placed in client-side environment variables.

---

### 5. Creating the Browser Client

```jsx
return createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
```

The two environment variables are passed to Supabase:

```text
Supabase URL
      +
Publishable Key
      ↓
createBrowserClient()
      ↓
Configured Supabase Client
```

The returned client can then be used by other application components.

---

### 6. Why Use a Separate Client File?

Instead of creating the Supabase client separately in every component:

```jsx
createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
```

the application keeps the configuration in one reusable location:

```text
lib/
└── supabase/
    └── client.js
```

Other files can then import the function:

```jsx
import { createClient } from "@/lib/supabase/client";
```

This gives the project a cleaner structure and avoids duplicating the Supabase configuration.

---

# Supabase Connection Flow

```text
.env.local
    │
    ├── NEXT_PUBLIC_SUPABASE_URL
    │
    └── NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
              │
              ▼
      lib/supabase/client.js
              │
              ▼
      createBrowserClient()
              │
              ▼
      Supabase Browser Client
              │
              ▼
     Grovio Client Components
              │
       ┌──────┼───────┐
       ▼      ▼       ▼
     Auth   Database  Storage
```

---

# Example Usage

A client component can import the function:

```jsx
import { createClient } from "@/lib/supabase/client";
```

Then create a Supabase client:

```jsx
const supabase = createClient();
```

For example, authentication code can then use:

```jsx
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

Similarly, database operations can use the same client:

```jsx
const { data, error } = await supabase
  .from("products")
  .select("*");
```

The actual authentication and database operations are implemented in other application files.

---

# Environment Variable Flow

```text
.env.local
    │
    ├── Supabase URL
    │
    └── Supabase Publishable Key
              │
              ▼
      process.env.*
              │
              ▼
       createClient()
              │
              ▼
     createBrowserClient()
              │
              ▼
       Supabase Client
```

---

# Important Note

The `.env.local` file should **not be committed to Git** if it contains project credentials.

A safe project structure is:

```text
Project
│
├── .env.local
├── .env.example
│
├── app/
├── context/
├── lib/
│   └── supabase/
│       └── client.js
└── ...
```

The `.env.example` file can document which variables are required without containing the actual project values.

---

# Key Concepts Used

**Supabase → `@supabase/ssr` → Browser Client → Environment Variables → `process.env` → Reusable Utility Function → Client-Side Authentication → Supabase Database**

---

# Complete Code

```jsx
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
```
