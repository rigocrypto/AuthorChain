"use client";

import { useActionState } from "react";
import { createBookAction, type CreateBookState } from "@/app/dashboard/actions";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

const initial: CreateBookState = {};

export function UploadBookForm() {
  const { dict } = useI18n();
  const d = dict.dashboard;
  const [state, formAction, pending] = useActionState(createBookAction, initial);
  const formId = "upload-book";

  return (
    <Card>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor={`${formId}-title`} className="mb-1 block text-sm font-medium">{d.fTitle}</label>
          <input id={`${formId}-title`} name="title" required className={field} placeholder="The Last Block" />
        </div>
        <div>
          <label htmlFor={`${formId}-subtitle`} className="mb-1 block text-sm font-medium">{d.fSubtitle}</label>
          <input id={`${formId}-subtitle`} name="subtitle" className={field} placeholder={dict.dashboard.optional} />
        </div>
        <div>
          <label htmlFor={`${formId}-description`} className="mb-1 block text-sm font-medium">{d.fDescription}</label>
          <textarea
            id={`${formId}-description`}
            name="description"
            required
            aria-label={d.fDescription}
            className={field}
            rows={4}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-category`} className="mb-1 block text-sm font-medium">{d.fCategory}</label>
            <input id={`${formId}-category`} name="category" className={field} placeholder="Sci-Fi" />
          </div>
          <div>
            <label htmlFor={`${formId}-language`} className="mb-1 block text-sm font-medium">{dict.book.language}</label>
            <input id={`${formId}-language`} name="language" className={field} placeholder="English" defaultValue="English" />
          </div>
        </div>
        <div>
          <label htmlFor={`${formId}-price`} className="mb-1 block text-sm font-medium">{d.fPrice}</label>
          <input
            id={`${formId}-price`}
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
          {d.nextStepManuscript}
        </p>

        {state.error ? (
          <p className="rounded-lg bg-warning/15 px-3 py-2 text-sm text-warning">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? d.saving : d.saveContinue}
          </Button>
          <ButtonLink href="/dashboard/books" variant="ghost">
            {dict.common.cancel}
          </ButtonLink>
        </div>
      </form>
    </Card>
  );
}
