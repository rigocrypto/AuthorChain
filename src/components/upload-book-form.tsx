"use client";

import { useActionState } from "react";
import { createBookAction, type CreateBookState } from "@/app/dashboard/actions";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

const initial: CreateBookState = {};

export function UploadBookForm() {
  const [state, formAction, pending] = useActionState(createBookAction, initial);

  return (
    <Card>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input name="title" required className={field} placeholder="The Last Block" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Subtitle</label>
          <input name="subtitle" className={field} placeholder="Optional" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            className={field}
            rows={4}
            placeholder="What is your book about?"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <input name="category" className={field} placeholder="Sci-Fi" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Language</label>
            <input name="language" className={field} placeholder="English" defaultValue="English" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Price (USD)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            className={field}
            placeholder="9.99"
          />
        </div>
        <p className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs text-muted">
          Next step: after saving, you&apos;ll upload your manuscript (PDF or EPUB)
          on the book&apos;s page. It&apos;s stored privately — only its SHA-256 hash
          becomes your on-chain proof of authorship.
        </p>

        {state.error ? (
          <p className="rounded-lg bg-warning/15 px-3 py-2 text-sm text-warning">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save & continue"}
          </Button>
          <ButtonLink href="/dashboard/books" variant="ghost">
            Cancel
          </ButtonLink>
        </div>
      </form>
    </Card>
  );
}
