## `proxy.js` - Supabase Authentication Middleware / Proxy

### Purpose

This file protects specific Grovio routes from unauthenticated access.

It uses **Next.js Proxy** together with **Supabase Server Client** to check whether a user is currently authenticated before allowing access to protected pages.

Currently protected routes are:

```text
/cart
/checkout
```

If a user who is not logged in tries to access either route, they are automatically redirected to:

```text
/signin
```

---

# 1. Importing Required Packages

```jsx
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
```

### `NextResponse`

`NextResponse` is used to:

```text
Continue the request
Create a new response
Redirect the user
Manage cookies
```

### `createServerClient`

```jsx
createServerClient
```

comes from:

```text
@supabase/ssr
```

It allows Supabase authentication to be checked in the server-side request/Proxy environment.

---

# 2. Proxy Function

```jsx
export async function proxy(request) {
```

The `proxy()` function runs when a request matches the configured routes.

The incoming request is available through:

```jsx
request
```

This allows the application to inspect information such as:

```text
URL
Pathname
Cookies
Request data
```

---

# 3. Creating the Initial Response

```jsx
let response = NextResponse.next({
  request,
});
```

`NextResponse.next()` tells Next.js:

```text
"Continue processing this request."
```

The response is stored in a variable because Supabase may need to update authentication cookies.

---

# 4. Creating Supabase Server Client

```jsx
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
```

The server-side Supabase client uses the environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

These values identify the Supabase project and allow the application to communicate with Supabase.

---

# 5. Cookie Configuration

Supabase authentication relies on cookies to maintain the user's session.

The Proxy therefore provides Supabase with functions for reading and writing cookies.

```jsx
cookies: {
```

---

# 6. Reading Cookies

```jsx
getAll() {
  return request.cookies.getAll();
},
```

This retrieves all cookies from the incoming request.

Conceptually:

```text
Browser
   ↓
Request
   ↓
Cookies
   ↓
Supabase Server Client
```

Supabase can use these cookies to determine whether the user has an active session.

---

# 7. Updating Cookies

```jsx
setAll(cookiesToSet) {
```

Supabase may need to update authentication cookies.

For example, when refreshing or updating a session.

---

## Updating Request Cookies

```jsx
cookiesToSet.forEach(({ name, value }) =>
  request.cookies.set(name, value)
);
```

Each cookie returned by Supabase is applied to the request.

---

## Creating Updated Response

```jsx
response = NextResponse.next({
  request,
});
```

A new response is created after updating the request cookies.

---

## Applying Cookies to Response

```jsx
cookiesToSet.forEach(({ name, value, options }) =>
  response.cookies.set(name, value, options)
);
```

The updated cookies are attached to the response.

This allows authentication session information to remain synchronized between:

```text
Browser
      ↕
Next.js Proxy
      ↕
Supabase
```

---

# 8. Checking the Current Supabase User

```jsx
const {
  data: { user },
} = await supabase.auth.getUser();
```

This is the most important authentication check in the Proxy.

Supabase examines the current authentication session and returns:

```text
user
```

If the user is authenticated:

```text
user = authenticated user object
```

If the user is not authenticated:

```text
user = null
```

---

# Authentication Check

```text
Incoming Request
       │
       ▼
Supabase getUser()
       │
   ┌───┴────┐
   │        │
 User     No User
   │        │
   ▼        ▼
Allow    Check Protected Route
```

---

# 9. Getting Current Path

```jsx
const pathname = request.nextUrl.pathname;
```

This extracts the requested URL path.

Examples:

```text
/cart
/cart/item
/checkout
/checkout/payment
/products
/signin
```

The Proxy uses this value to determine whether the requested page requires authentication.

---

# 10. Defining Protected Routes

```jsx
const protectedRoutes = ["/cart", "/checkout"];
```

These are the routes that require a logged-in user.

Currently:

```text
/cart
/checkout
```

are protected.

This means users should authenticate before accessing these pages.

---

# 11. Detecting Protected Route

```jsx
const isProtectedRoute = protectedRoutes.some(
  (route) =>
    pathname === route ||
    pathname.startsWith(`${route}/`)
);
```

This checks whether the current pathname belongs to one of the protected routes.

### Exact Match

For:

```text
/cart
```

this condition is true:

```jsx
pathname === route
```

### Nested Route

For:

```text
/cart/item
```

this condition is true:

```jsx
pathname.startsWith("/cart/")
```

Similarly:

```text
/checkout
/checkout/payment
/checkout/success
```

are all treated as protected routes.

---

# 12. Why `startsWith()` Is Used

Without the second condition:

```jsx
pathname.startsWith(`${route}/`)
```

only these exact routes would be protected:

```text
/cart
/checkout
```

Nested routes could potentially bypass the check.

The current implementation protects:

```text
/cart
/cart/*
```

and:

```text
/checkout
/checkout/*
```

---

# 13. Redirecting Unauthenticated Users

```jsx
if (isProtectedRoute && !user) {
```

This condition requires **both**:

```text
Protected Route
       +
No Authenticated User
```

For example:

```text
User → /checkout
        │
        ▼
Is /checkout protected?
        │
       Yes
        │
        ▼
Is user logged in?
        │
       No
        │
        ▼
Redirect to /signin
```

---

# 14. Creating Redirect URL

```jsx
const url = request.nextUrl.clone();

url.pathname = "/signin";
```

The current request URL is cloned.

Then the pathname is changed to:

```text
/signin
```

---

# 15. Performing Redirect

```jsx
return NextResponse.redirect(url);
```

The user is redirected to the Sign In page.

Therefore:

```text
/cart
   ↓
Not authenticated
   ↓
/signin
```

and:

```text
/checkout
   ↓
Not authenticated
   ↓
/signin
```

---

# 16. Allowing Valid Requests

```jsx
return response;
```

If the route is not protected, or the user is authenticated, the original request continues normally.

Examples:

```text
/products → Allowed
/about → Allowed
/contact → Allowed
/signin → Allowed
/signup → Allowed
/cart → Allowed if logged in
/checkout → Allowed if logged in
```

---

# 17. Proxy Configuration

```jsx
export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
  ],
};
```

The `matcher` tells Next.js which routes should execute this Proxy.

The current configuration covers:

```text
/cart
/cart/*
/checkout
/checkout/*
```

---

# 18. Meaning of `:path*`

```text
/cart/:path*
```

means:

```text
/cart
/cart/anything
/cart/anything/more
```

Similarly:

```text
/checkout/:path*
```

matches:

```text
/checkout
/checkout/payment
/checkout/success
/checkout/anything
```

---

# Complete Authentication Protection Flow

```text
                    User Request
                         │
                         ▼
                  Next.js Proxy
                         │
                         ▼
                Read Auth Cookies
                         │
                         ▼
               Supabase getUser()
                         │
                  ┌──────┴──────┐
                  │             │
              User Found     No User
                  │             │
                  ▼             ▼
             Is Route       Is Route
             Protected?     Protected?
                  │             │
             ┌────┴────┐   ┌────┴────┐
             │         │   │         │
            Yes       No  Yes       No
             │         │   │         │
             ▼         ▼   ▼         ▼
           Allow     Allow Redirect  Allow
                           │
                           ▼
                       /signin
```

---

# Protected Routes in Grovio

Currently:

```text
Public Routes
│
├── /
├── /products
├── /categories
├── /features
├── /contact
├── /signin
└── /signup

Protected Routes
│
├── /cart
└── /checkout
```

The protected route list can be expanded later if required.

For example:

```jsx
const protectedRoutes = [
  "/cart",
  "/checkout",
  "/orders",
  "/profile",
];
```

and the corresponding matcher would also need to include those routes.

---

# Relationship with `AuthContext`

The Proxy and `AuthContext` have different responsibilities.

### Proxy

Handles **server-side route protection**:

```text
Request
   ↓
Proxy
   ↓
Supabase Session
   ↓
Allow / Redirect
```

### AuthContext

Handles **client-side authentication state**:

```text
Supabase Session
       ↓
AuthContext
       ↓
user
loading
login()
logout()
       ↓
React Components
```

Together:

```text
                Supabase
                   │
          ┌────────┴────────┐
          │                 │
       Proxy           AuthContext
          │                 │
 Route Protection      UI User State
          │                 │
          ▼                 ▼
      /cart              Navbar
     /checkout            Profile
                          Logout
```

---

# Key Concepts Used

**Next.js Proxy → NextResponse → Supabase SSR → Server Authentication → Cookies → Session Validation → Protected Routes → Route Matching → Redirects → Middleware-Style Access Control**

---
