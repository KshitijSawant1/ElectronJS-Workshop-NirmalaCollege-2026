## `context/AuthContext.jsx` - Authentication Context

### Purpose

This file manages the **global authentication state** of the Grovio application.

Instead of every page independently checking whether a user is logged in, `AuthContext` provides authentication information to the entire application through React Context.

It manages:

```text
Current User
Authentication Loading State
Login State
Logout
Supabase Session Restoration
Authentication Changes
User Profile Data
```

The context works together with:

```text
Supabase Authentication
        +
profiles table
        +
React Context
```

---

# 1. Client Component

```jsx
"use client";
```

`AuthContext.jsx` is a Client Component because it uses React client-side functionality:

```text
useState()
useEffect()
useContext()
Supabase browser client
Authentication listeners
```

---

# 2. Importing React Context Functions

```jsx
import { createContext, useContext, useEffect, useState } from "react";
```

The React functions are used for different purposes:

| Function          | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| `createContext()` | Creates the global authentication context          |
| `useContext()`    | Allows components to access authentication state   |
| `useEffect()`     | Checks/restores authentication when the app starts |
| `useState()`      | Stores user and loading information                |

---

# 3. Importing Supabase Client

```jsx
import { createClient } from "@/lib/supabase/client";
```

The reusable Supabase browser client is imported from:

```text
lib/supabase/client.js
```

This client is used for:

```text
Checking the current user
Listening for authentication changes
Signing the user out
Fetching the user profile
```

---

# 4. Creating Authentication Context

```jsx
const AuthContext = createContext();
```

This creates the React Context that will contain Grovio's authentication information.

The context eventually provides:

```text
user
loading
login()
logout()
```

Any component inside the `AuthProvider` can access these values using:

```jsx
const { user, loading, login, logout } = useAuth();
```

---

# 5. `AuthProvider`

```jsx
export function AuthProvider({ children }) {
```

`AuthProvider` is the component that makes the authentication state available to its child components.

The application structure is conceptually:

```text
AuthProvider
    │
    ├── Navbar
    ├── Home
    ├── Products
    ├── Cart
    ├── Checkout
    ├── Sign In
    └── Sign Up
```

All children inside the provider can access the authentication context.

---

# 6. User State

```jsx
const [user, setUser] = useState(null);
```

This stores the currently logged-in Grovio user.

Initially:

```text
user = null
```

which means no authenticated user has been loaded yet.

After successful authentication, it can contain:

```jsx
{
  id: "...",
  email: "...",
  full_name: "...",
  phone: "...",
  address: "..."
}
```

The `setUser()` function updates this information.

---

# 7. Loading State

```jsx
const [loading, setLoading] = useState(true);
```

The loading state indicates whether the application is still checking the user's authentication status.

Initially:

```text
loading = true
```

This is important because the application needs to determine whether a previous Supabase session already exists.

After authentication checking is complete:

```text
loading = false
```

---

# 8. Creating Supabase Client

```jsx
const supabase = createClient();
```

A Supabase browser client is created using the reusable client configuration.

The configuration ultimately uses the environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

from `.env.local`.

---

# 9. `loadProfile()` Function

```jsx
async function loadProfile(authUser) {
```

This function retrieves the Grovio profile associated with the authenticated Supabase user.

Supabase Authentication contains authentication-related information such as:

```text
User ID
Email
```

Additional Grovio information is stored in:

```text
profiles
```

Therefore, `loadProfile()` combines the two sources.

---

# 10. Handling No Authenticated User

```jsx
if (!authUser) {
  setUser(null);
  setLoading(false);
  return;
}
```

If there is no authenticated Supabase user:

```text
No User
   ↓
user = null
   ↓
loading = false
```

The function then stops.

---

# 11. Fetching Profile

```jsx
const { data: profile, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", authUser.id)
  .single();
```

The function searches the `profiles` table for the profile belonging to the authenticated user.

### Query breakdown

```jsx
.from("profiles")
```

Selects the `profiles` table.

```jsx
.select("*")
```

Requests all columns.

```jsx
.eq("id", authUser.id)
```

Finds the profile whose ID matches the authenticated user's ID.

```jsx
.single()
```

Expects a single profile record.

---

# 12. Profile Relationship

The authentication user and profile are connected through the user ID.

```text
Supabase Auth
     │
     │ authUser.id
     ▼
profiles.id
```

This allows Grovio to retrieve additional information about the authenticated user.

---

# 13. Profile Error Handling

```jsx
if (error) {
  console.error("Profile Error:", error);

  setUser({
    id: authUser.id,
    email: authUser.email,
  });

  setLoading(false);
  return;
}
```

If the profile cannot be retrieved, the application does not completely lose the authentication information.

It stores the basic Supabase user information:

```jsx
{
  id: authUser.id,
  email: authUser.email,
}
```

The error is also printed to the browser console:

```text
Profile Error: ...
```

The loading state is then stopped.

---

# 14. Saving Complete User Profile

If the profile query succeeds:

```jsx
setUser({
  id: authUser.id,
  email: authUser.email,
  full_name: profile.full_name,
  phone: profile.phone,
  address: profile.address,
});
```

The application combines:

```text
Supabase Auth
      │
      ├── id
      └── email
             +
       profiles table
      │
      ├── full_name
      ├── phone
      └── address
             │
             ▼
          user state
```

This gives the rest of the application access to the complete Grovio user.

---

# 15. Completing Profile Loading

```jsx
setLoading(false);
```

After the profile has been successfully loaded, the application is no longer waiting for authentication information.

```text
Profile Loaded
      ↓
loading = false
```

---

# 16. Restoring Existing Session

The `useEffect()` block automatically checks authentication when the application starts.

```jsx
useEffect(() => {
```

This is important because a user may already be logged in from a previous session.

---

# 17. `checkUser()` Function

```jsx
async function checkUser() {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  await loadProfile(authUser);
}
```

The application asks Supabase:

```text
"Is there currently an authenticated user?"
```

Supabase returns the current user.

The user is then passed to:

```jsx
loadProfile(authUser);
```

which retrieves the corresponding Grovio profile.

---

# 18. Initial Authentication Flow

When Grovio starts:

```text
Application Starts
       ↓
checkUser()
       ↓
supabase.auth.getUser()
       ↓
Is User Logged In?
       │
   ┌───┴────┐
   │        │
  No       Yes
   │        │
   ▼        ▼
user=null  loadProfile()
   │        │
   └────┬───┘
        ▼
 loading=false
```

This allows the application to restore the user's authentication state after reopening or refreshing the application.

---

# 19. Listening for Authentication Changes

The application also listens for Supabase authentication events:

```jsx
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(async (event, session) => {
```

This allows the context to react when authentication changes.

Examples include:

```text
Login
Logout
Session Changes
Authentication Updates
```

---

# 20. Handling an Active Session

```jsx
if (session?.user) {
  await loadProfile(session.user);
}
```

If Supabase provides an active session:

```text
Session exists
     ↓
session.user
     ↓
loadProfile()
     ↓
User State Updated
```

This keeps the React authentication state synchronized with Supabase.

---

# 21. Handling Logout

If there is no active session:

```jsx
else {
  setUser(null);
  setLoading(false);
}
```

The application clears the current user.

```text
No Session
    ↓
user = null
    ↓
loading = false
```

---

# 22. Cleaning Up Authentication Listener

```jsx
return () => {
  subscription.unsubscribe();
};
```

When the component is removed, the Supabase authentication listener is unsubscribed.

This prevents unnecessary listeners from remaining active.

The cleanup flow is:

```text
AuthProvider Removed
       ↓
unsubscribe()
       ↓
Auth Listener Removed
```

---

# 23. Dependency Array

```jsx
}, []);
```

The empty dependency array means the authentication initialization effect is intended to run when the provider is mounted.

It establishes:

```text
Initial Session Check
+
Authentication Listener
```

---

# 24. `login()` Function

```jsx
function login(userData) {
  setUser(userData);
}
```

The `login()` function updates the React authentication state.

It is used by pages such as:

```text
app/signin/page.jsx
```

After successful Supabase authentication:

```jsx
login({
  id: user.id,
  email: user.email,
  full_name: profile.full_name,
  phone: profile.phone,
  address: profile.address,
});
```

The user information is then available globally through `AuthContext`.

---

# 25. `logout()` Function

```jsx
async function logout() {
  await supabase.auth.signOut();
  setUser(null);
}
```

This performs a real Supabase logout.

The process is:

```text
User clicks Logout
       ↓
supabase.auth.signOut()
       ↓
Supabase Session Removed
       ↓
setUser(null)
       ↓
Grovio considers user logged out
```

---

# 26. Providing Authentication Data

```jsx
<AuthContext.Provider
  value={{
    user,
    loading,
    login,
    logout,
  }}
>
```

The provider exposes four values:

```text
user
loading
login()
logout()
```

Any child component can access them through `useAuth()`.

---

# 27. Rendering Children

```jsx
{children}
```

The children represent the rest of the Grovio application wrapped inside the provider.

For example:

```text
AuthProvider
    │
    ▼
Application
    │
    ├── Home
    ├── Products
    ├── Cart
    ├── Checkout
    ├── Sign In
    └── Sign Up
```

All these components can access the authentication context if they are rendered within the provider.

---

# 28. `useAuth()` Custom Hook

```jsx
export function useAuth() {
  return useContext(AuthContext);
}
```

`useAuth()` provides a convenient way for components to access the authentication context.

Instead of writing:

```jsx
useContext(AuthContext)
```

everywhere, components can simply use:

```jsx
const { user, loading, login, logout } = useAuth();
```

---

# Example Usage

A component can check whether a user is logged in:

```jsx
const { user } = useAuth();

if (user) {
  console.log(user.full_name);
}
```

A component can display the user's name:

```jsx
const { user } = useAuth();

<p>Welcome, {user?.full_name}</p>
```

A logout button can use:

```jsx
const { logout } = useAuth();

<button onClick={logout}>
  Logout
</button>
```

A page can check authentication loading:

```jsx
const { user, loading } = useAuth();

if (loading) {
  return <p>Loading...</p>;
}
```

---

# Authentication Architecture

```text
                    Supabase
                       │
             ┌─────────┴─────────┐
             │                   │
       Supabase Auth         profiles table
             │                   │
             │ user.id           │ profile.id
             └─────────┬─────────┘
                       ▼
                 AuthContext
                       │
          ┌────────────┼────────────┐
          │            │            │
         user        loading      login()
          │                         │
          │                       logout()
          │
          ▼
                  Grovio App
          │
    ┌─────┼──────┬─────────┐
    ▼     ▼      ▼         ▼
  Navbar Home  Products   Checkout
```

---

# Session Restoration Flow

```text
Grovio Starts
      │
      ▼
AuthProvider Mounts
      │
      ▼
supabase.auth.getUser()
      │
      ▼
Current Session?
      │
 ┌────┴─────┐
 │          │
 No        Yes
 │          │
 ▼          ▼
user=null  loadProfile()
 │          │
 │          ▼
 │      profiles table
 │          │
 └────┬─────┘
      ▼
loading = false
```

---

# Login Flow

```text
Sign In Page
      │
      ▼
Supabase signInWithPassword()
      │
      ▼
Authenticated User
      │
      ▼
Fetch Profile
      │
      ▼
login(userData)
      │
      ▼
AuthContext.user
      │
      ▼
Grovio Application
```

---

# Logout Flow

```text
Logout Button
      │
      ▼
logout()
      │
      ▼
supabase.auth.signOut()
      │
      ▼
Supabase Session Removed
      │
      ▼
setUser(null)
      │
      ▼
Grovio User Logged Out
```

---

# Key Concepts Used

**React Context API → Global State Management → `createContext()` → `useContext()` → Custom Hooks → `useState()` → `useEffect()` → Supabase Authentication → Session Restoration → Authentication Event Listener → Profile Retrieval → Login State → Logout → Conditional Authentication State → Provider Pattern**

---

# Complete Code

```jsx
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
```
