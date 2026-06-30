"use client";

import { useActionState, useState } from "react";
import {
  generateAgentAction,
  type GenerateState,
} from "@/app/dashboard/agents/actions";
import type { AgentMeta } from "@/lib/agents";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

export type StudioBook = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
};

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary/60 focus:outline-none";

const initial: GenerateState = {};

/** Prefill agent fields from the selected book where the names line up. */
function prefill(name: string, book?: StudioBook): string {
  if (!book) return "";
  if (name === "title") return book.title;
  if (name === "subtitle") return book.subtitle ?? "";
  if (name === "description") return book.description;
  if (name === "category") return book.category;
  return "";
}

export function AgentStudio({
  agents,
  books,
}: {
  agents: AgentMeta[];
  books: StudioBook[];
}) {
  const [agentId, setAgentId] = useState(agents[0]?.id ?? "copy");
  const [bookId, setBookId] = useState(books[0]?.id ?? "");
  const [state, formAction, pending] = useActionState(
    generateAgentAction,
    initial,
  );

  const agent = agents.find((a) => a.id === agentId) ?? agents[0];
  const selectedBook = books.find((b) => b.id === bookId);

  if (books.length === 0) {
    return (
      <Card className="text-center">
        <p>You need a book before running an agent.</p>
        <p className="mt-1 text-sm text-muted">
          Upload a book, then come back to generate marketing assets.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Controls */}
      <div className="space-y-4">
        <Card>
          <div className="mb-3 text-sm font-medium">1. Choose an agent</div>
          <div className="grid gap-2">
            {agents.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAgentId(a.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  a.id === agentId
                    ? "border-primary/60 bg-surface-2"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted">{a.description}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          {/* key forces field remount so prefilled defaults refresh on change */}
          <form action={formAction} key={`${agent.id}-${bookId}`} className="space-y-4">
            <input type="hidden" name="agentId" value={agent.id} />
            <input type="hidden" name="bookId" value={bookId} />

            <div>
              <label className="mb-1 block text-sm font-medium">2. Select a book</label>
              <select
                className={field}
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm font-medium">3. Inputs</div>
            {agent.fields.map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-sm font-medium">
                  {f.label}
                  {f.required ? <span className="text-warning"> *</span> : null}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    rows={3}
                    className={field}
                    placeholder={f.placeholder}
                    defaultValue={prefill(f.name, selectedBook)}
                  />
                ) : f.type === "select" ? (
                  <select name={f.name} className={field} defaultValue={f.options?.[0]}>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={f.name}
                    className={field}
                    placeholder={f.placeholder}
                    defaultValue={prefill(f.name, selectedBook)}
                  />
                )}
              </div>
            ))}

            {state.error ? (
              <p className="rounded-lg bg-warning/15 px-3 py-2 text-sm text-warning">
                {state.error}
              </p>
            ) : null}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Generating…" : `Generate with ${agent.name}`}
            </Button>
          </form>
        </Card>
      </div>

      {/* Result */}
      <div>
        {state.result ? (
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Result</h2>
                <p className="text-sm text-muted">
                  {state.result.bookTitle}
                </p>
              </div>
              <StatusBadge tone={state.result.mocked ? "warning" : "success"}>
                {state.result.mocked
                  ? `${state.result.providerName} mode`
                  : `Live · ${state.result.providerName}`}
              </StatusBadge>
            </div>
            <div className="space-y-4">
              {state.result.assets.map((a) => (
                <div key={a.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{a.label}</span>
                    <CopyButton text={a.content} />
                  </div>
                  <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface-2 p-3 text-sm text-foreground">
                    {a.content}
                  </pre>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="grid h-full place-items-center text-center">
            <div>
              <p className="text-foreground">No output yet.</p>
              <p className="mt-1 text-sm text-muted">
                Pick an agent and a book, fill the inputs, then generate. Results save
                to your account automatically.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="text-xs text-accent hover:underline"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
