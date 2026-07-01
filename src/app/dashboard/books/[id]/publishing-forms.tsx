"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  uploadCoverAction,
  savePublishingMetadataAction,
  generateBarcodeAction,
  type PublishingState,
} from "./actions";

const initial: PublishingState = {};

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

function Feedback({ state }: { state: PublishingState }) {
  if (state.error)
    return <p className="text-xs text-warning">{state.error}</p>;
  if (state.ok) return <p className="text-xs text-success">Saved.</p>;
  return null;
}

export function CoverUploadForm({
  bookId,
  hasCover,
}: {
  bookId: string;
  hasCover: boolean;
}) {
  const [state, action, pending] = useActionState(uploadCoverAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input
        name="file"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className={`${field} file:mr-3 file:rounded file:border-0 file:bg-surface file:px-2 file:py-1 file:text-xs file:text-foreground`}
      />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : hasCover ? "Replace cover" : "Upload cover"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export type PublishingDefaults = {
  isbn13: string | null;
  isbn10: string | null;
  bookFormat: string | null;
  publisherName: string | null;
  publicationDate: string | null; // ISO
  edition: string | null;
};

export function PublishingMetadataForm({
  bookId,
  defaults,
}: {
  bookId: string;
  defaults: PublishingDefaults;
}) {
  const [state, action, pending] = useActionState(
    savePublishingMetadataAction,
    initial,
  );
  const dateValue = defaults.publicationDate
    ? defaults.publicationDate.slice(0, 10)
    : "";
  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="bookId" value={bookId} />
      <div>
        <label className="mb-1 block text-xs text-muted">ISBN-13</label>
        <input
          name="isbn13"
          defaultValue={defaults.isbn13 ?? ""}
          placeholder="978-1-56581-231-4"
          className={field}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">ISBN-10 (optional)</label>
          <input name="isbn10" defaultValue={defaults.isbn10 ?? ""} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Format</label>
          <select name="bookFormat" defaultValue={defaults.bookFormat ?? ""} className={field}>
            <option value="">—</option>
            <option value="EBOOK">Ebook</option>
            <option value="PAPERBACK">Paperback</option>
            <option value="HARDCOVER">Hardcover</option>
            <option value="AUDIOBOOK">Audiobook</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Publisher</label>
          <input
            name="publisherName"
            defaultValue={defaults.publisherName ?? ""}
            className={field}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Publication date</label>
          <input name="publicationDate" type="date" defaultValue={dateValue} className={field} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Edition</label>
        <input
          name="edition"
          defaultValue={defaults.edition ?? ""}
          placeholder="1st edition"
          className={field}
        />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Save publishing metadata"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export function GenerateBarcodeForm({
  bookId,
  disabled,
}: {
  bookId: string;
  disabled: boolean;
}) {
  const [state, action, pending] = useActionState(generateBarcodeAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <Button type="submit" variant="secondary" disabled={pending || disabled}>
        {pending ? "Generating…" : "Generate ISBN barcode"}
      </Button>
      {disabled ? (
        <p className="text-xs text-muted">Save a valid ISBN-13 to enable barcode generation.</p>
      ) : null}
      <Feedback state={state} />
    </form>
  );
}
