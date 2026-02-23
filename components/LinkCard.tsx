import { Card, CardContent } from "@/components/ui/card";
import { Link2, ExternalLink } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { EditLinkDialog } from "@/components/EditLinkDialog";
import { DeleteLinkButton } from "@/components/DeleteLinkButton";
import type { Link } from "@/db/schema";

interface LinkCardProps {
  link: Link;
  baseUrl: string;
}

export function LinkCard({ link, baseUrl }: LinkCardProps) {
  const shortUrl = `${baseUrl}/l/${link.shortCode}`;
  const createdAt = new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(link.createdAt));

  return (
    <Card className="transition-colors hover:bg-muted/40">
      <CardContent className="flex items-start gap-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6c47ff]/10">
          <Link2 className="h-4 w-4 text-[#6c47ff]" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          {/* Short URL */}
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm truncate">{shortUrl}</span>
            <CopyButton text={shortUrl} />
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir enlace corto"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          </div>

          {/* Original URL */}
          <p className="text-xs text-muted-foreground truncate">{link.url}</p>

          {/* Date */}
          <p className="text-xs text-muted-foreground">Creado: {createdAt}</p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <EditLinkDialog link={link} />
          <DeleteLinkButton linkId={link.id} shortCode={link.shortCode} />
        </div>
      </CardContent>
    </Card>
  );
}

