import { redirect, notFound } from "next/navigation";
import { type NextRequest } from "next/server";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    notFound();
  }

  redirect(link.url);
}
