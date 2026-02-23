---
description: Read before working on authentication to understand the guidelines for using Clerk in the project.
---

# Authentication Guidelines

## Overview

All authentication in this project is handled exclusively by **Clerk**. No other authentication methods, libraries, or custom implementations should be used under any circumstances.

## Rules

- **Only Clerk** — Do not implement custom auth, NextAuth, Auth.js, or any other auth solution.
- **No `middleware.ts`** — Route protection must NOT use Next.js middleware. Use `proxy.ts` instead.
- Sign-in and sign-up flows must always be launched as a **modal** (never a redirect to a dedicated sign-in/sign-up page).

## Protected Routes

| Route        | Requirement                                      |
| ------------ | ------------------------------------------------ |
| `/dashboard` | User **must** be authenticated to access         |
| `/`          | Authenticated users are redirected to `/dashboard` |

## Implementation Patterns

### Clerk Provider

Wrap the root layout with `ClerkProvider`:

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Modal Sign-In / Sign-Up

Always use Clerk's modal mode. Never redirect to a standalone sign-in page:

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

// Sign in modal
<SignInButton mode="modal">
  <button>Sign In</button>
</SignInButton>

// Sign up modal
<SignUpButton mode="modal">
  <button>Sign Up</button>
</SignUpButton>
```

### Protecting `/dashboard` (Server Component)

```tsx
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // render dashboard...
}
```

### Redirecting Authenticated Users Away from `/`

```tsx
// app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  // render landing page...
}
```

### Accessing the Current User (Server)

```ts
import { auth, currentUser } from "@clerk/nextjs/server";

const { userId } = await auth();         // lightweight — just the ID
const user = await currentUser();        // full user object (more expensive)
```

### Accessing the Current User (Client)

```tsx
"use client";
import { useAuth, useUser } from "@clerk/nextjs";

const { userId, isSignedIn } = useAuth();
const { user } = useUser();
```

## Authorization

- Always verify user ownership on **server actions and API routes** using `userId` from `auth()`.
- Never rely on client-side auth state to restrict data access.
- Associate database records with `userId` returned by Clerk.

## Environment Variables

Add these to `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```
