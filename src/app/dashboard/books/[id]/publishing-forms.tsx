"use client";

import { useActionState, useEffect, useState } from "react";
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
  saveBookTranslationAction,
  removeBookTranslationAction,
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
import { locales, localeNames, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import type { BookTranslationDTO } from "@/lib/data/book-translations";

const initial: PublishingState = {};

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

function Feedback({ state }: { state: PublishingState }) {
  const { dict } = useI18n();
  if (state.error)
    return <p className="text-xs text-warning">{state.error}</p>;
  if (state.ok) return <p className="text-xs text-success">{dict.dashboard.saved}</p>;
  return null;
}

const coverAccept = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
const coverInputClass = `${field} file:mr-3 file:rounded file:border-0 file:bg-surface file:px-2 file:py-1 file:text-xs file:text-foreground`;

/** Local / server-proxied cover upload (posts through the server action). */
function CoverProxyUpload({ bookId, hasCover }: { bookId: string; hasCover: boolean }) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, action, pending] = useActionState(uploadCoverAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input name="file" type="file" accept={coverAccept} aria-label={d.frontCover} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasCover ? d.replaceCover : d.uploadCover}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

/** Presigned direct-to-R2 cover upload: presign → PUT → finalize. */
function CoverDirectUpload({ bookId, hasCover }: { bookId: string; hasCover: boolean }) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, setState] = useState<PublishingState>(initial);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setState({ error: dict.errors.chooseImage });
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
        setState({ error: dict.errors.uploadToStorageFailed });
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
      setState({ error: dict.errors.uploadFailed });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <input name="file" type="file" accept={coverAccept} aria-label={d.frontCover} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasCover ? d.replaceCover : d.uploadCover}
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
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, action, pending] = useActionState(uploadBackCoverAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input name="file" type="file" accept={coverAccept} aria-label={d.backCover} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasBackCover ? d.replaceBackCover : d.uploadBackCover}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

/** Presigned direct-to-R2 back-cover upload: presign → PUT → finalize. */
function BackCoverDirectUpload({ bookId, hasBackCover }: { bookId: string; hasBackCover: boolean }) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, setState] = useState<PublishingState>(initial);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setState({ error: dict.errors.chooseImage });
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
        setState({ error: dict.errors.uploadToStorageFailed });
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
      setState({ error: dict.errors.uploadFailed });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <input name="file" type="file" accept={coverAccept} aria-label={d.backCover} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasBackCover ? d.replaceBackCover : d.uploadBackCover}
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
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, action, pending] = useActionState(uploadPreviewAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input name="file" type="file" accept={previewAccept} aria-label={d.readerPreview} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasPreview ? d.replacePreview : d.uploadPreview}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

/** Presigned direct-to-R2 reader-preview PDF upload: presign → PUT → finalize. */
function PreviewDirectUpload({ bookId, hasPreview }: { bookId: string; hasPreview: boolean }) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, setState] = useState<PublishingState>(initial);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setState({ error: dict.errors.choosePreview });
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
        setState({ error: dict.errors.uploadToStorageFailed });
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
      setState({ error: dict.errors.uploadFailed });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2">
      <input name="file" type="file" accept={previewAccept} aria-label={d.readerPreview} className={coverInputClass} />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasPreview ? d.replacePreview : d.uploadPreview}
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
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, action, pending] = useActionState(updateBookDetailsAction, initial);
  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="bookId" value={bookId} />
      <div>
        <label className="mb-1 block text-xs text-muted">{d.fTitle}</label>
        <input name="title" required defaultValue={defaults.title} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">{d.fSubtitleOptional}</label>
        <input name="subtitle" defaultValue={defaults.subtitle ?? ""} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">{d.fDescription}</label>
        <textarea
          name="description"
          required
          rows={4}
          aria-label={d.fDescription}
          defaultValue={defaults.description}
          className={field}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">{d.fCategory}</label>
          <input name="category" defaultValue={defaults.category} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{d.fPrice}</label>
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
        {pending ? d.saving : d.saveDetails}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export function BookTranslationForm({
  bookId,
  translations,
  currentLocale,
}: {
  bookId: string;
  translations: BookTranslationDTO[];
  currentLocale: Locale;
}) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [locale, setLocale] = useState<Locale>(currentLocale);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const existing = translations.find((t) => t.locale === locale) ?? null;
  const [saveState, saveAction, savePending] = useActionState(saveBookTranslationAction, initial);
  const [removeState, removeAction, removePending] = useActionState(
    removeBookTranslationAction,
    initial,
  );

  // Load the existing translation into the fields whenever the selected locale
  // (or the saved translations) changes — resetting a form to match the current
  // selection is a legitimate effect sync, not a render-time mutation.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const nextExisting = translations.find((t) => t.locale === locale) ?? null;
    setTitle(nextExisting?.title ?? "");
    setSubtitle(nextExisting?.subtitle ?? "");
    setDescription(nextExisting?.description ?? "");
  }, [locale, translations]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
  };

  return (
    <div className="mt-4 space-y-4 rounded-xl border border-border/70 bg-surface-2/60 p-4">
      <div>
        <h3 className="text-sm font-semibold">{d.translatedPublicMetadata}</h3>
        <p className="mt-1 text-xs text-muted">{d.translatedPublicMetadataNote}</p>
      </div>

      <form action={saveAction} className="space-y-3">
        <input type="hidden" name="bookId" value={bookId} />
        <div>
          <label className="mb-1 block text-xs text-muted">{d.translationLocale}</label>
          <select
            name="locale"
            value={locale}
            onChange={(e) => handleLocaleChange(e.target.value as Locale)}
            className={field}
          >
            {locales.map((loc) => (
              <option key={loc} value={loc}>
                {localeNames[loc]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{d.translationTitle}</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{d.translationSubtitle}</label>
          <input
            name="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{d.translationDescription}</label>
          <textarea
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={field}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" variant="secondary" disabled={savePending}>
            {savePending ? d.saving : d.saveTranslation}
          </Button>
        </div>
        <Feedback state={saveState} />
      </form>
      {existing ? (
        <form action={removeAction} className="inline-flex">
          <input type="hidden" name="bookId" value={bookId} />
          <input type="hidden" name="locale" value={locale} />
          <Button type="submit" variant="ghost" disabled={removePending}>
            {removePending ? d.saving : d.removeTranslation}
          </Button>
          <Feedback state={removeState} />
        </form>
      ) : null}
    </div>
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
  const { dict } = useI18n();
  const d = dict.dashboard;
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
          <label className="mb-1 block text-xs text-muted">{dict.book.pages}</label>
          <input name="pageCount" type="number" min="1" defaultValue={v(defaults.pageCount)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{d.readingTimeMin}</label>
          <input name="readingTimeMinutes" type="number" min="1" defaultValue={v(defaults.readingTimeMinutes)} className={field} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">{d.audience}</label>
        <input name="audience" aria-label={d.audience} defaultValue={v(defaults.audience)} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">{d.whatLearn}</label>
        <textarea name="whatYouWillLearn" rows={3} aria-label={d.whatLearn} defaultValue={v(defaults.whatYouWillLearn)} className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">{d.topics}</label>
        <input name="topics" aria-label={d.topics} defaultValue={v(defaults.topics)} className={field} />
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{d.creditsSection}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted">{dict.book.editor}</label>
            <input name="editorName" defaultValue={v(defaults.editorName)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">{dict.book.coverDesigner}</label>
            <input name="coverDesignerName" defaultValue={v(defaults.coverDesignerName)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">{dict.book.illustrator}</label>
            <input name="illustratorName" defaultValue={v(defaults.illustratorName)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">{dict.book.translator}</label>
            <input name="translatorName" defaultValue={v(defaults.translatorName)} className={field} />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-muted">{dict.book.collaborators}</label>
          <input name="collaborators" aria-label={dict.book.collaborators} defaultValue={v(defaults.collaborators)} className={field} />
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs text-muted">{dict.book.contributors}</label>
          <input name="contributors" aria-label={dict.book.contributors} defaultValue={v(defaults.contributors)} className={field} />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <label className="mb-1 block text-xs text-muted">{d.thanksAck}</label>
        <textarea name="acknowledgments" rows={3} aria-label={d.thanksAck} defaultValue={v(defaults.acknowledgments)} className={field} />
      </div>

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? d.saving : d.saveDetailsCredits}
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
  const { dict } = useI18n();
  const d = dict.dashboard;
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
        <label className="mb-1 block text-xs text-muted">{dict.book.isbn13}</label>
        <input
          name="isbn13"
          defaultValue={defaults.isbn13 ?? ""}
          placeholder="978-1-56581-231-4"
          className={field}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">{d.isbn10}</label>
          <input name="isbn10" aria-label={d.isbn10} defaultValue={defaults.isbn10 ?? ""} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{dict.book.format}</label>
          <select name="bookFormat" aria-label={dict.book.format} defaultValue={defaults.bookFormat ?? ""} className={field}>
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
          <label className="mb-1 block text-xs text-muted">{dict.book.publisher}</label>
          <input
            name="publisherName"
            aria-label={dict.book.publisher}
            defaultValue={defaults.publisherName ?? ""}
            className={field}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{d.publicationDate}</label>
          <input name="publicationDate" type="date" aria-label={d.publicationDate} defaultValue={dateValue} className={field} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">{dict.book.edition}</label>
        <input
          name="edition"
          defaultValue={defaults.edition ?? ""}
          placeholder="1st edition"
          className={field}
        />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? d.saving : d.savePublishingMetadata}
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
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, action, pending] = useActionState(generateBarcodeAction, initial);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <Button type="submit" variant="secondary" disabled={pending || disabled}>
        {pending ? d.saving : d.generateBarcode}
      </Button>
      {disabled ? (
        <p className="text-xs text-muted">{d.barcodeNeedsIsbn}</p>
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
  const { dict } = useI18n();
  const L = dict.dashboard;
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
        {L.printAvailableToggle}
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">{dict.book.trimSize}</label>
          <select
            name="trimSize"
            aria-label={dict.book.trimSize}
            defaultValue={d?.trimSize ?? "US_TRADE_6X9"}
            onChange={(e) => setTrimSize(e.target.value as typeof trimSize)}
            className={field}
          >
            {enumOptions(TRIM_SIZE_LABELS)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{L.fInteriorColor}</label>
          <select name="interiorColor" aria-label={L.fInteriorColor} defaultValue={d?.interiorColor ?? "BLACK_AND_WHITE"} className={field}>
            {enumOptions(INTERIOR_COLOR_LABELS)}
          </select>
        </div>
      </div>

      {trimSize === "CUSTOM" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted">{L.customWidth}</label>
            <input name="trimWidthIn" type="number" min="0" step="0.01" aria-label={L.customWidth} defaultValue={v(d?.trimWidthIn)} className={field} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">{L.customHeight}</label>
            <input name="trimHeightIn" type="number" min="0" step="0.01" aria-label={L.customHeight} defaultValue={v(d?.trimHeightIn)} className={field} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">{L.fPaperType}</label>
          <select name="paperType" aria-label={L.fPaperType} defaultValue={d?.paperType ?? "WHITE"} className={field}>
            {enumOptions(PAPER_TYPE_LABELS)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{dict.book.coverFinish}</label>
          <select name="coverFinish" aria-label={dict.book.coverFinish} defaultValue={d?.coverFinish ?? "MATTE"} className={field}>
            {enumOptions(COVER_FINISH_LABELS)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">{dict.book.binding}</label>
        <select name="binding" aria-label={dict.book.binding} defaultValue={d?.binding ?? "PERFECT_BOUND"} className={field}>
          {enumOptions(BINDING_LABELS)}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">{L.printPageCount}</label>
          <input name="pageCount" type="number" min="1" aria-label={L.printPageCount} defaultValue={v(d?.pageCount)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{L.spineWidthAuto}</label>
          <input
            readOnly
            value={d?.spineWidthIn != null ? `${d.spineWidthIn.toFixed(3)} in` : "—"}
            aria-label={L.spineWidthAuto}
            className={`${field} text-muted`}
          />
        </div>
      </div>
      <p className="text-xs text-muted">{L.spineNote}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">{dict.book.printIsbn13}</label>
          <input name="printIsbn13" defaultValue={v(d?.printIsbn13)} placeholder="978-…" className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{dict.book.imprint}</label>
          <input name="imprintName" aria-label={dict.book.imprint} defaultValue={v(d?.imprintName)} className={field} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-muted">{L.printPrice}</label>
          <input name="price" type="number" min="0" step="0.01" aria-label={L.printPrice} defaultValue={v(d?.price)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{L.currency}</label>
          <input name="currency" aria-label={L.currency} defaultValue={d?.currency ?? "USD"} className={field} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted">{L.fWeightOz}</label>
          <input name="weightOz" type="number" min="0" step="0.1" aria-label={L.fWeightOz} defaultValue={v(d?.weightOz)} className={field} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">{L.fDistributor}</label>
          <input name="distributor" defaultValue={v(d?.distributor)} placeholder="e.g. Global print network" className={field} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">{L.availabilityNote}</label>
        <input name="availabilityNote" defaultValue={v(d?.availabilityNote)} placeholder="Ships in 5–7 business days" className={field} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted">{L.printNotes}</label>
        <textarea name="printNotes" rows={2} aria-label={L.printNotes} defaultValue={v(d?.printNotes)} className={field} />
      </div>

      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? L.saving : L.savePrintSettings}
      </Button>
      <Feedback state={state} />
    </form>
  );
}
