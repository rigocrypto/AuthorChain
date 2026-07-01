"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { uploadManuscriptAction, type UploadManuscriptState } from "./actions";

const initial: UploadManuscriptState = {};

export function ManuscriptUploadForm({
  bookId,
  hasFile,
}: {
  bookId: string;
  hasFile: boolean;
}) {
  const [state, action, pending] = useActionState(uploadManuscriptAction, initial);

  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="bookId" value={bookId} />
      <input
        name="file"
        type="file"
        accept=".pdf,.epub,application/pdf,application/epub+zip"
        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-surface file:px-2 file:py-1 file:text-xs file:text-foreground"
      />
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? "Uploading…" : hasFile ? "Replace manuscript" : "Upload manuscript"}
      </Button>
      {state.error ? <p className="text-xs text-warning">{state.error}</p> : null}
      {state.ok ? (
        <p className="text-xs text-success">Manuscript saved. Hash updated.</p>
      ) : null}
    </form>
  );
}
