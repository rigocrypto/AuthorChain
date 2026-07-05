"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  uploadCoverAction,
  presignCoverUploadAction,
  finalizeCoverUploadAction,
  savePublishingMetadataAction,
  updateBookDetailsAction,
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

const coverAccept = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
const coverInputClass = `${field} file:mr-3 file:rounded file:border-0 file:bg-surface file:px-2 file:py-1 file:text-xs file:text-foreground`;

/** Local / server-proxied cover upload (posts through the server action). */
function CoverProxyUpload({ bookId, hasCover }: { bookId: string; hasCover: boolean }) {
  const [state, action, pending] = useActionState(uploadCoverAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input name="file" type="file" accept={coverAccept} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : hasCover ? "Replace cover" : "Upload cover"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

/** Presigned direct-to-R2 cover upload: presign → PUT → finalize. */
function CoverDirectUpload({ bookId, hasCover }: { bookId: string; hasCover: boolean }) {
  const [state, setState] = useState<PublishingState>(initial);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setState({ error: "Choose an image file (JPG, PNG, or WEBP)." });
      return;
    }

    setPending(true);
    setState(initial);
    try {
      const pre = await presignCoverUploadAction(bookId, file.name);
      if (!pre.ok) {
        setState({ error: pre.error });
        return;
      }
      const put = await fetch(pre.uploadUrl, { method: "PUT", body: file });
      if (!put.ok) {
        setState({ error: "Upload to storage failed. Please try again." });
        return;
      }
      const fin = await finalizeCoverUploadAction(bookId, pre.key, file.name);
      if (fin.error) {
        setState({ error: fin.error });
        return;
      }
      form.reset();
      setState({ ok: true });
    } catch {
      setState({ error: "Upload failed. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <input name="file" type="file" accept={coverAccept} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : hasCover ? "Replace cover" : "Upload cover"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export function CoverUploadForm({
  bookId,
  hasCover,
  directUpload,
}: {
  bookId: string;
  hasCover: boolean;
  directUpload: boolean;
}) {
  return directUpload ? (
    <CoverDirectUpload bookId={bookId} hasCover={hasCover} />
  ) : (
    <CoverProxyUpload bookId={bookId} hasCover={hasCover} />
  );
}

export type BookDetailsDefaults = {
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  price: number;
};

/** Edit a book's core catalog fields (title, subtitle, description, category, price). */
export function BookDetailsForm({
  bookId,
  defaults,
}: {
  bookId: string;
  defaults: BookDetailsDefaults;
}) {
  const [state, action, pending] = useActionState(updateBookDetailsAction, initial);
  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="bookId" value={bookId} />
      <div>
        <label className="mb-1 block text-xs text-muted">Title</label>
        <input name="title" required defaultValue={defaults.title} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Subtitle (optional)</label>
        <input name="subtitle" defaultValue={defaults.subtitle ?? ""} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaults.description}
          className={field}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Category</label>
          <input name="category" defaultValue={defaults.category} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Price (USD)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={defaults.price}
            className={field}
          />
        </div>
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Save details"}
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
