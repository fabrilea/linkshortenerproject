import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getLinksByUserId } from "@/data/links";
import { LinkCard } from "@/components/LinkCard";
import { CreateLinkDialog } from "@/components/CreateLinkDialog";
import { Link2Off } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const links = await getLinksByUserId(userId);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 font-sans">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis enlaces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {links.length === 0
              ? "Aún no creaste ningún enlace."
              : `${links.length} enlace${links.length !== 1 ? "s" : ""} en total`}
          </p>
        </div>
        <CreateLinkDialog />
      </div>

      {/* Link list */}
      {links.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Link2Off className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">No tenés enlaces todavía</p>
            <p className="text-sm text-muted-foreground">
              Creá tu primer enlace corto para empezar.
            </p>
          </div>
          <CreateLinkDialog />
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.id}>
              <LinkCard link={link} baseUrl={baseUrl} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
