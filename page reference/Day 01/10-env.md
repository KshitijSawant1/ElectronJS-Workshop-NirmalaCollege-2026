## `.env.local` - Local Environment Configuration

### Purpose

The `.env.local` file stores **environment-specific configuration values** used by the Grovio application.

In this project, it stores the credentials required to connect the frontend application to the **Supabase project**.

The actual values should be kept private and should not be committed to the Git repository.

---

### 1. Supabase Project URL

```env
NEXT_PUBLIC_SUPABASE_URL=
```

This variable stores the URL of the Grovio Supabase project.

It is used by the Supabase client to identify which Supabase project the application should connect to.

The value is obtained from the Supabase project settings.

Example format:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

---

### 2. Supabase Anonymous/Publishable Key

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

This variable stores the Supabase client-side key used by the application when communicating with Supabase.

Example:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

This key is intended for frontend use and works together with Supabase's configured security policies such as Row Level Security (RLS).

---

### 3. Connection with `lib/supabase/client.js`

These environment variables are consumed by the Supabase client configuration.

The overall flow is:

```text
.env.local
    │
    ├── NEXT_PUBLIC_SUPABASE_URL
    │
    └── NEXT_PUBLIC_SUPABASE_ANON_KEY
             │
             ▼
lib/supabase/client.js
             │
             ▼
createBrowserClient()
             │
             ▼
Supabase
```

---

### 4. `NEXT_PUBLIC_` Prefix

Both variables begin with:

```text
NEXT_PUBLIC_
```

This tells Next.js that the values are available to client-side code.

This is necessary because Grovio uses Supabase from browser/client components.

However, **never place Supabase service-role keys or other server-only secrets in `NEXT_PUBLIC_` variables**, because values with this prefix can be exposed to the browser.

---

### 5. Security

The `.env.local` file contains project-specific configuration and should normally remain local.

It should be included in `.gitignore`:

```text
.env.local
```

Do not upload or commit the file if it contains your actual project values.

For sharing the project with another developer, use `.env.example` instead.

---

# Environment Variable Flow

```text
              .env.local
                   │
          ┌────────┴────────┐
          ▼                 ▼
 Supabase Project URL    Supabase Key
          │                 │
          └────────┬────────┘
                   ▼
          Supabase Client
                   │
                   ▼
          Grovio Application
```

---

# Key Concepts Used

**Environment Variables → Next.js Configuration → Supabase Configuration → Client-Side Environment Variables → Project Security**

---

# Complete File

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
