---
description: Read before working on UI components to understand the guidelines for using shadcn/ui in the project.
---

# UI Components Guidelines

## Overview

This project uses **shadcn/ui** as its component library. Do not install or use other component libraries (e.g., MUI, Chakra UI, Radix UI directly, Ant Design).

## Configuration

- **Style:** `new-york`
- **Base color:** `neutral`
- **CSS variables:** enabled
- **Icon library:** `lucide-react`
- **Path alias:** `@/components/ui`

## Rules

- **Only shadcn/ui** — Do not install third-party component libraries outside of what shadcn/ui provides.
- **Add components via CLI** — Always use the shadcn CLI to add new components. Never copy-paste component code manually.
- **Icons via Lucide** — Use `lucide-react` for all icons.
- **No inline styles** — Use Tailwind CSS utility classes exclusively.
- **Dark mode** — The app runs in forced dark mode (`dark` class on `<html>`). Always verify components render correctly in dark mode using `dark:` variants.

## Adding Components

```bash
npx shadcn@latest add <component-name>
```

Examples:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Components are placed in `@/components/ui/`.

## Usage Patterns

### Importing Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

### Utility Function

Use the `cn()` helper from `@/lib/utils` to merge class names conditionally:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```

### Icons

```tsx
import { Link, Copy, Trash2 } from "lucide-react";

<Link className="w-4 h-4" />
```

### Forms

Use shadcn/ui `Form` components built on top of `react-hook-form`:

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
```

## Custom Components

Place reusable custom components in `@/components/` (not inside `@/components/ui/`, which is reserved for shadcn/ui components).

- Use PascalCase for component file names: `LinkCard.tsx`
- Accept a typed `props` interface exported from the same file
- Compose shadcn/ui primitives rather than building from scratch
