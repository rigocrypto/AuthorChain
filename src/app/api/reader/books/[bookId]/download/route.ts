import { getStorage } from "@/lib/storage";
import { getCurrentReader } from "@/lib/auth/reader-session";
import { hasActiveEntitlement } from "@/lib/data/reader";
import { getManuscriptForServing } from "@/lib/data/book-files";

/**
 * Protected manuscript download. Requires a signed-in reader with an ACTIVE
 * entitlement for this book. Manuscripts are never served through the public
 * asset route and the storage key is never exposed.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookId: string }> },
): Promise<Response> {
  const { bookId } = await params;

  const reader = await getCurrentReader();
  if (!reader) return new Response("Sign in to access your library.", { status: 403 });

  const allowed = await hasActiveEntitlement(reader.id, bookId);
  if (!allowed) return new Response("You do not have access to this book.", { status: 403 });

  const file = await getManuscriptForServing(bookId);
  if (!file) return new Response("Manuscript not available.", { status: 404 });

  try {
    const bytes = await getStorage().get(file.storageKey);
    // Sanitize the filename for the header.
    const safe = file.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": file.fileType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safe}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Manuscript not available.", { status: 404 });
  }
}
