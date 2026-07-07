"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import {
  uploadManuscriptAction,
  presignManuscriptUploadAction,
  finalizeManuscriptUploadAction,
  type UploadManuscriptState,
} from "./actions";

const initial: UploadManuscriptState = {};

/**
 * Local / server-proxied upload: the file posts through the server action. Used
 * when the active storage driver does not support presigned direct uploads.
 */
function ManuscriptProxyUpload({ bookId, hasFile }: { bookId: string; hasFile: boolean }) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, action, pending] = useActionState(uploadManuscriptAction, initial);

  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input
        name="file"
        type="file"
        accept=".pdf,.epub,application/pdf,application/epub+zip"
        aria-label={d.manuscript}
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-surface file:px-2 file:py-1 file:text-xs file:text-foreground"
      />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasFile ? d.replaceManuscript : d.uploadManuscript}
      </Button>
      {state.error ? <p className="text-xs text-warning">{state.error}</p> : null}
      {state.ok ? <p className="text-xs text-success">{d.manuscriptSaved}</p> : null}
    </form>
  );
}

/**
 * Presigned direct-to-R2 upload: presign → PUT straight to storage → finalize
 * (server fetches the bytes back and computes the authoritative hash). Keeps
 * large manuscripts off the server request-body path.
 */
function ManuscriptDirectUpload({ bookId, hasFile }: { bookId: string; hasFile: boolean }) {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, setState] = useState<UploadManuscriptState>(initial);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setState({ error: dict.errors.chooseManuscript });
      return;
    }

    setPending(true);
    setState(initial);
    try {
      const pre = await presignManuscriptUploadAction(bookId, file.name);
      if (!pre.ok) {
        setState({ error: pre.error });
        return;
      }
      const put = await fetch(pre.uploadUrl, { method: "PUT", body: file });
      if (!put.ok) {
        setState({ error: dict.errors.uploadToStorageFailed });
        return;
      }
      const fin = await finalizeManuscriptUploadAction(bookId, pre.key, file.name);
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
      <input
        name="file"
        type="file"
        accept=".pdf,.epub,application/pdf,application/epub+zip"
        aria-label={d.manuscript}
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-surface file:px-2 file:py-1 file:text-xs file:text-foreground"
      />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? d.uploading : hasFile ? d.replaceManuscript : d.uploadManuscript}
      </Button>
      {state.error ? <p className="text-xs text-warning">{state.error}</p> : null}
      {state.ok ? <p className="text-xs text-success">{d.manuscriptSaved}</p> : null}
    </form>
  );
}

export function ManuscriptUploadForm({
  bookId,
  hasFile,
  directUpload,
}: {
  bookId: string;
  hasFile: boolean;
  directUpload: boolean;
}) {
  return directUpload ? (
    <ManuscriptDirectUpload bookId={bookId} hasFile={hasFile} />
  ) : (
    <ManuscriptProxyUpload bookId={bookId} hasFile={hasFile} />
  );
}
