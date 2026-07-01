import type { AssetType } from "@prisma/client";
import { getStorage } from "@/lib/storage";
import { getAssetForServing } from "@/lib/data/book-assets";

/**
 * Controlled public asset route for book covers and ISBN barcodes.
 *
 * Only COVER and BARCODE assets are ever served here — manuscripts (BookFile)
 * are never reachable through this route. The storage key stays server-side; the
 * client only ever sees /api/assets/books/<id>/cover.
 */
export const dynamic = "force-dynamic";

const TYPE_MAP: Record<string, AssetType> = {
  cover: "COVER",
  barcode: "BARCODE",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookId: string; type: string }> },
): Promise<Response> {
  const { bookId, type } = await params;
  const assetType = TYPE_MAP[type];
  if (!assetType) return new Response("Not found", { status: 404 });

  const asset = await getAssetForServing(bookId, assetType);
  if (!asset) return new Response("Not found", { status: 404 });

  try {
    const bytes = await getStorage().get(asset.storageKey);
    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": asset.mimeType,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
