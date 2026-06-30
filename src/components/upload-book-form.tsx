"use client";

import { useActionState } from "react";
import { createBookAction, type CreateBookState } from "@/app/dashboard/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <div>
          <label className="mb-1 block text-sm font-medium">Manuscript file</label>
          <input name="file" type="file" className={field} disabled />
          <p className="mt-1 text-xs text-muted">
            File upload arrives in Phase 7 (storage driver). Metadata saves now as a draft.
          </p>
        </div>

        {state.error ? (
          <p className="rounded-lg bg-warning/15 px-3 py-2 text-sm text-warning">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save as draft"}
        </Button>
      </form>
    </Card>
  );
}
