import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Upload book" };

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

export default function UploadBookPage() {
  return (
    <DashboardPage title="Upload a book">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Add your manuscript and metadata. Files are stored off-chain; only a proof hash goes
        on-chain later. This form is UI-only in Phase 1 — it persists in Phase 3.
      </p>

      <div className="max-w-2xl">
        <Card>
          {/* TODO Phase 3: wire to POST /api/books with the storage driver. */}
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input className={field} placeholder="The Last Block" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Subtitle</label>
              <input className={field} placeholder="Optional" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea className={field} rows={4} placeholder="What is your book about?" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <input className={field} placeholder="Sci-Fi" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Language</label>
                <input className={field} placeholder="English" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Price (USD)</label>
                <input className={field} type="number" min="0" step="0.01" placeholder="9.99" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Royalty %</label>
                <input className={field} type="number" min="0" max="100" placeholder="90" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Manuscript file</label>
              <input className={field} type="file" />
              <p className="mt-1 text-xs text-muted">
                PDF, EPUB, or Audio. Stored via the local driver for now (IPFS/S3 later).
              </p>
            </div>
            <Button type="submit" disabled>
              Save book (coming in Phase 3)
            </Button>
          </form>
        </Card>
      </div>
    </DashboardPage>
  );
}
