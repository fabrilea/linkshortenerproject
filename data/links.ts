import { db } from "@/db";
import { links } from "@/db/schema";
import type { Link, NewLink } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

/**
 * Fetches a single link by its short code.
 * @param shortCode - The unique short code of the link
 * @returns The matching Link object or null if not found
 */
export async function getLinkByShortCode(shortCode: string): Promise<Link | null> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);
  return link ?? null;
}

/**
 * Fetches all links belonging to a specific user, ordered by creation date descending.
 * @param userId - The Clerk user ID
 * @returns A promise that resolves to an array of Link objects
 */
export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

/**
 * Inserts a new link into the database.
 * @param data - The link data to insert (url, shortCode, userId)
 * @returns The created Link object
 */
export async function insertLink(
  data: Pick<NewLink, "url" | "shortCode" | "userId">
): Promise<Link> {
  const [link] = await db.insert(links).values(data).returning();
  return link;
}

/**
 * Updates a link's url and shortCode. Only updates if the link belongs to the given user.
 * @param id - The link ID
 * @param userId - The Clerk user ID (ownership check)
 * @param data - Fields to update (url, shortCode)
 * @returns The updated Link object or null if not found
 */
export async function updateLink(
  id: number,
  userId: string,
  data: Pick<NewLink, "url" | "shortCode">
): Promise<Link | null> {
  const [link] = await db
    .update(links)
    .set({ url: data.url, shortCode: data.shortCode, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return link ?? null;
}

/**
 * Deletes a link. Only deletes if the link belongs to the given user.
 * @param id - The link ID
 * @param userId - The Clerk user ID (ownership check)
 */
export async function deleteLink(id: number, userId: string): Promise<void> {
  await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)));
}
