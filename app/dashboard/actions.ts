"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { insertLink, updateLink, deleteLink } from "@/data/links";
import type { Link } from "@/db/schema";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

type CreateLinkInput = {
  url: string;
  slug: string;
};

const createLinkSchema = z.object({
  url: z.string().url("Ingresá una URL válida (ej: https://ejemplo.com)"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug no puede superar los 50 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "El slug solo puede contener letras, números, guiones y guiones bajos"
    ),
});

/**
 * Creates a new shortened link for the authenticated user.
 * @param input - Object containing the destination URL and desired slug
 * @returns ActionResult with the created Link or an error message
 */
export async function createLink(
  input: CreateLinkInput
): Promise<ActionResult<Link>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "No autenticado" };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  try {
    const link = await insertLink({
      url: parsed.data.url,
      shortCode: parsed.data.slug,
      userId,
    });
    return { success: true, data: link };
  } catch (err) {
    // Most likely a unique constraint violation on the slug
    const message =
      err instanceof Error && err.message.includes("unique")
        ? "Ese slug ya está en uso. Elegí otro."
        : "Ocurrió un error al crear el enlace.";
    return { success: false, error: message };
  }
}

type EditLinkInput = {
  id: number;
  url: string;
  slug: string;
};

const editLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url("Ingresá una URL válida (ej: https://ejemplo.com)"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug no puede superar los 50 caracteres")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "El slug solo puede contener letras, números, guiones y guiones bajos"
    ),
});

/**
 * Updates an existing shortened link for the authenticated user.
 * @param input - Object containing the link ID, new URL and new slug
 * @returns ActionResult with the updated Link or an error message
 */
export async function editLink(
  input: EditLinkInput
): Promise<ActionResult<Link>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "No autenticado" };

  const parsed = editLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  try {
    const link = await updateLink(parsed.data.id, userId, {
      url: parsed.data.url,
      shortCode: parsed.data.slug,
    });
    if (!link) return { success: false, error: "Enlace no encontrado." };
    return { success: true, data: link };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("unique")
        ? "Ese slug ya está en uso. Elegí otro."
        : "Ocurrió un error al actualizar el enlace.";
    return { success: false, error: message };
  }
}

/**
 * Deletes a shortened link owned by the authenticated user.
 * @param id - The link ID to delete
 * @returns ActionResult indicating success or failure
 */
export async function removeLinkById(
  id: number
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "No autenticado" };

  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: "ID de enlace inválido." };
  }

  try {
    await deleteLink(id, userId);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Ocurrió un error al eliminar el enlace." };
  }
}
