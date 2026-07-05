"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  uploadCoverAction,
  presignCoverUploadAction,
  finalizeCoverUploadAction,
  uploadBackCoverAction,
  presignBackCoverUploadAction,
  finalizeBackCoverUploadAction,
  uploadPreviewAction,
  presignPreviewUploadAction,
  finalizePreviewUploadAction,
  savePublishingMetadataAction,
  updateBookDetailsAction,
  updateBookExtendedDetailsAction,
  generateBarcodeAction,
  savePrintSettingsAction,
  type PublishingState,
} from "./actions";
import {
  TRIM_SIZE_LABELS,
  INTERIOR_COLOR_LABELS,
  PAPER_TYPE_LABELS,
  BINDING_LABELS,
  COVER_FINISH_LABELS,
} from "@/lib/publishing/print";
import type { PrintSettingsDTO } from "@/lib/data/print-settings";

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

/** Local / server-proxied back-cover image upload. */
function BackCoverProxyUpload({ bookId, hasBackCover }: { bookId: string; hasBackCover: boolean }) {
  const [state, action, pending] = useActionState(uploadBackCoverAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input name="file" type="file" accept={coverAccept} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : hasBackCover ? "Replace back cover" : "Upload back cover"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

/** Presigned direct-to-R2 back-cover upload: presign → PUT → finalize. */
function BackCoverDirectUpload({ bookId, hasBackCover }: { bookId: string; hasBackCover: boolean }) {
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
      const pre = await presignBackCoverUploadAction(bookId, file.name);
      if (!pre.ok) {
        setState({ error: pre.error });
        return;
      }
      const put = await fetch(pre.uploadUrl, { method: "PUT", body: file });
      if (!put.ok) {
        setState({ error: "Upload to storage failed. Please try again." });
        return;
      }
      const fin = await finalizeBackCoverUploadAction(bookId, pre.key, file.name);
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
        {pending ? "Uploading…" : hasBackCover ? "Replace back cover" : "Upload back cover"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export function BackCoverUploadForm({
  bookId,
  hasBackCover,
  directUpload,
}: {
  bookId: string;
  hasBackCover: boolean;
  directUpload: boolean;
}) {
  return directUpload ? (
    <BackCoverDirectUpload bookId={bookId} hasBackCover={hasBackCover} />
  ) : (
    <BackCoverProxyUpload bookId={bookId} hasBackCover={hasBackCover} />
  );
}

const previewAccept = ".pdf,application/pdf";

/** Local / server-proxied reader-preview PDF upload. */
function PreviewProxyUpload({ bookId, hasPreview }: { bookId: string; hasPreview: boolean }) {
  const [state, action, pending] = useActionState(uploadPreviewAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input name="file" type="file" accept={previewAccept} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : hasPreview ? "Replace preview" : "Upload preview"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

/** Presigned direct-to-R2 reader-preview PDF upload: presign → PUT → finalize. */
function PreviewDirectUpload({ bookId, hasPreview }: { bookId: string; hasPreview: boolean }) {
  const [state, setState] = useState<PublishingState>(initial);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setState({ error: "Choose a PDF preview file." });
      return;
    }
    setPending(true);
    setState(initial);
    try {
      const pre = await presignPreviewUploadAction(bookId, file.name);
      if (!pre.ok) {
        setState({ error: pre.error });
        return;
      }
      const put = await fetch(pre.uploadUrl, { method: "PUT", body: file });
      if (!put.ok) {
        setState({ error: "Upload to storage failed. Please try again." });
        return;
      }
      const fin = await finalizePreviewUploadAction(bookId, pre.key, file.name);
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
      <input name="file" type="file" accept={previewAccept} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : hasPreview ? "Replace preview" : "Upload preview"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export function PreviewUploadForm({
  bookId,
  hasPreview,
  directUpload,
}: {
  bookId: string;
  hasPreview: boolean;
  directUpload: boolean;
}) {
  return directUpload ? (
    <PreviewDirectUpload bookId={bookId} hasPreview={hasPreview} />
  ) : (
    <PreviewProxyUpload bookId={bookId} hasPreview={hasPreview} />
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

export type BookExtendedDefaults = {
  pageCount: number | null;
  readingTimeMinutes: number | null;
  audience: string | null;
  whatYouWillLearn: string | null;
  topics: string | null;
  collaborators: string | null;
  contributors: string | null;
  editorName: string | null;
  coverDesignerName: string | null;
  illustratorName: string | null;
  translatorName: string | null;
  acknowledgments: string | null;
};

/** Edit extended catalog metadata + credits (all optional, public storefront). */
export function BookExtendedDetailsForm({
  bookId,
  defaults,
}: {
  bookId: string;
  defaults: BookExtendedDefaults;
}) {
  const [state, action, pending] = useActionState(
    updateBookExtendedDetailsAction,
    initial,
  );
  const v = (x: string | number | null) => (x === null ? "" : String(x));

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="bookId" value={bookId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Page count</label>
          <input name="pageCount" type="number" min="1" defaultValue={v(defaults.pageCount)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Reading time (minutes)</label>
          <input name="readingTimeMinutes" type="number" min="1" defaultValue={v(defaults.readingTimeMinutes)} className={field} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Audience</label>
        <input name="audience" defaultValue={v(defaults.audience)} placeholder="For entrepreneurs, students, and creators" className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">What readers will learn</label>
        <textarea name="whatYouWillLearn" rows={3} defaultValue={v(defaults.whatYouWillLearn)} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Topics / keywords (comma-separated)</label>
        <input name="topics" defaultValue={v(defaults.topics)} placeholder="AI, prompting, productivity" className={field} />
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Credits</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted">Editor</label>
            <input name="editorName" defaultValue={v(defaults.editorName)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Cover designer</label>
            <input name="coverDesignerName" defaultValue={v(defaults.coverDesignerName)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Illustrator</label>
            <input name="illustratorName" defaultValue={v(defaults.illustratorName)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Translator</label>
            <input name="translatorName" defaultValue={v(defaults.translatorName)} className={field} />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-muted">Collaborators</label>
          <input name="collaborators" defaultValue={v(defaults.collaborators)} placeholder="Comma-separated names" className={field} />
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-muted">Contributors</label>
          <input name="contributors" defaultValue={v(defaults.contributors)} placeholder="Comma-separated names" className={field} />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <label className="mb-1 block text-xs text-muted">Thanks / acknowledgments</label>
        <textarea name="acknowledgments" rows={3} defaultValue={v(defaults.acknowledgments)} className={field} />
      </div>

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Save details & credits"}
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

/** Render `<option>`s from a label map keyed by enum value. */
function enumOptions(labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));
}

/**
 * Edit a book's print edition settings (display/metadata only). The spine width
 * is derived server-side from page count + paper type on save.
 */
export function PrintEditionForm({
  bookId,
  defaults,
}: {
  bookId: string;
  defaults: PrintSettingsDTO | null;
}) {
  const [state, action, pending] = useActionState(savePrintSettingsAction, initial);
  const v = (x: string | number | null | undefined) =>
    x === null || x === undefined ? "" : String(x);
  const d = defaults;
  const [trimSize, setTrimSize] = useState(d?.trimSize ?? "US_TRADE_6X9");

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="bookId" value={bookId} />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isAvailable"
          defaultChecked={d?.isAvailable ?? false}
          className="h-4 w-4 rounded border-border"
        />
        Show print edition as available on the public book page
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Trim size</label>
          <select
            name="trimSize"
            defaultValue={d?.trimSize ?? "US_TRADE_6X9"}
            onChange={(e) => setTrimSize(e.target.value as typeof trimSize)}
            className={field}
          >
            {enumOptions(TRIM_SIZE_LABELS)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Interior color</label>
          <select name="interiorColor" defaultValue={d?.interiorColor ?? "BLACK_AND_WHITE"} className={field}>
            {enumOptions(INTERIOR_COLOR_LABELS)}
          </select>
        </div>
      </div>

      {trimSize === "CUSTOM" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted">Custom width (in)</label>
            <input name="trimWidthIn" type="number" min="0" step="0.01" defaultValue={v(d?.trimWidthIn)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Custom height (in)</label>
            <input name="trimHeightIn" type="number" min="0" step="0.01" defaultValue={v(d?.trimHeightIn)} className={field} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Paper</label>
          <select name="paperType" defaultValue={d?.paperType ?? "WHITE"} className={field}>
            {enumOptions(PAPER_TYPE_LABELS)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Cover finish</label>
          <select name="coverFinish" defaultValue={d?.coverFinish ?? "MATTE"} className={field}>
            {enumOptions(COVER_FINISH_LABELS)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">Binding</label>
        <select name="binding" defaultValue={d?.binding ?? "PERFECT_BOUND"} className={field}>
          {enumOptions(BINDING_LABELS)}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Print page count</label>
          <input name="pageCount" type="number" min="1" defaultValue={v(d?.pageCount)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Spine width (auto)</label>
          <input
            readOnly
            value={d?.spineWidthIn != null ? `${d.spineWidthIn.toFixed(3)} in` : "—"}
            aria-label="Spine width (auto-calculated)"
            className={`${field} text-muted`}
          />
        </div>
      </div>
      <p className="text-xs text-muted">
        Spine width is estimated from page count + paper and recalculated on save.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Print ISBN-13 (optional)</label>
          <input name="printIsbn13" defaultValue={v(d?.printIsbn13)} placeholder="978-…" className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Imprint (optional)</label>
          <input name="imprintName" defaultValue={v(d?.imprintName)} className={field} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">Print price (optional)</label>
          <input name="price" type="number" min="0" step="0.01" defaultValue={v(d?.price)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Currency</label>
          <input name="currency" defaultValue={d?.currency ?? "USD"} className={field} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">Weight (oz, optional)</label>
          <input name="weightOz" type="number" min="0" step="0.1" defaultValue={v(d?.weightOz)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Distributor (optional)</label>
          <input name="distributor" defaultValue={v(d?.distributor)} placeholder="e.g. Global print network" className={field} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">Availability note (optional)</label>
        <input name="availabilityNote" defaultValue={v(d?.availabilityNote)} placeholder="Ships in 5–7 business days" className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">Print notes (optional, public)</label>
        <textarea name="printNotes" rows={2} defaultValue={v(d?.printNotes)} className={field} />
      </div>

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Save print settings"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}
