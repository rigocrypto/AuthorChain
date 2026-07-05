"use client";

import { Button } from "@/components/ui/button";

/**
 * Submits a book visibility server action for `bookId`, with an optional
 * confirmation dialog. Server actions are passed in as props from server
 * components. Used on My Books and the manage page.
 */
export function BookActionButton({
  action,
  bookId,
  label,
  confirmText,
  variant = "secondary",
  className = "",
}: {
  action: (formData: FormData) => void | Promise<void>;
  bookId: string;
  label: string;
  confirmText?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="bookId" value={bookId} />
      <Button type="submit" variant={variant} className={className}>
        {label}
      </Button>
    </form>
  );
}
