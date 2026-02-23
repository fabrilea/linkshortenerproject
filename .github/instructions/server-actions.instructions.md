---
description: Read this file to understand how to handle data mutations via server actions in the project.
---

# Server Actions Guidelines

This document outlines the required patterns for all data mutations in this project. Follow these rules strictly to ensure correctness, security, and consistency.

## 1. Server Actions for All Mutations

ALL data mutations (create, update, delete) must be done via **server actions**. Never mutate data directly from a client component or inside a route handler.

## 2. File Naming and Colocation

Server action files **MUST** be named `actions.ts` and placed in the **same directory** as the client component that calls them.

```
app/dashboard/
  page.tsx          ← server component
  LinkForm.tsx      ← client component
  actions.ts        ← server actions used by LinkForm.tsx
```

## 3. Called from Client Components

Server actions must be called from **client components** (files with `"use client"` directive). Do not call server actions directly from server components.

## 4. TypeScript Types — No FormData

ALL data passed to server actions must have **explicit TypeScript types**. 

- **NEVER** use the `FormData` TypeScript type as a parameter.
- Define a dedicated input type or interface for each server action.

```typescript
// ✅ Correct
type CreateLinkInput = {
  url: string;
  slug: string;
};

export async function createLink(input: CreateLinkInput) { ... }

// ❌ Incorrect
export async function createLink(formData: FormData) { ... }
```

## 5. Return Objects — Never Throw

Server actions **must NOT throw errors**. Instead, always return a typed result object so the client can handle success and failure gracefully.

```typescript
// ✅ Correct
export async function createLink(input: CreateLinkInput) {
  // ... validation, auth, db ...
  return { success: true, data: link };
  // on failure:
  return { success: false, error: "Invalid input" };
}

// ❌ Incorrect
export async function createLink(input: CreateLinkInput) {
  throw new Error("Invalid input");
}
```

Define a reusable return type when possible:

```typescript
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
```

## 6. Zod Validation

ALL inputs to server actions **must be validated with Zod** before any database operation.

```typescript
import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1).max(50),
});

export async function createLink(input: CreateLinkInput): Promise<ActionResult<Link>> {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };
  // ...
}
```

## 7. Authentication Check First

ALL server actions **must verify a logged-in user** before performing any database operation. Use `auth()` from `@clerk/nextjs/server`.

```typescript
import { auth } from "@clerk/nextjs/server";

export async function createLink(input: CreateLinkInput): Promise<ActionResult<Link>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };
  // proceed with db operations...
}
```

## 8. Use /data Helper Functions for DB Operations

Server actions **must NOT** use Drizzle queries directly. All database operations must go through the helper functions located in the `/data` directory.

```typescript
// ✅ Correct
import { insertLink } from "@/data/links";

export async function createLink(input: CreateLinkInput): Promise<ActionResult<Link>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const link = await insertLink({ ...parsed.data, userId });
  return { success: true, data: link };
}

// ❌ Incorrect — do not use drizzle directly in actions.ts
import { db } from "@/db";
import { links } from "@/db/schema";
await db.insert(links).values({ ... });
```

## Summary Checklist

Before completing a server action, verify:

- [ ] File is named `actions.ts` and colocated with the calling client component
- [ ] Called only from a `"use client"` component
- [ ] Input parameter uses a typed interface (not `FormData`)
- [ ] Returns `{ success: true, data }` or `{ success: false, error }` — never throws
- [ ] Input is validated with Zod
- [ ] `auth()` is called and `userId` is checked before any DB operation
- [ ] DB operations use `/data` helper functions, not raw Drizzle queries
