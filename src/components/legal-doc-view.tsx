import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { LegalPage, LegalSection, LegalList } from "@/components/legal-page";
import type { LegalDocContent, LegalBlock } from "@/i18n/legal/types";
import { siteContact } from "@/lib/site-contact";

const linkClass = "text-foreground underline-offset-2 hover:underline";

/** Render paragraph text with `{{email}}` and `[[/path|Label]]` tokens. */
function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  // Match either {{email}} or [[href|label]]
  const re = /(\{\{email\}\}|\[\[[^\]]+\]\])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    }
    const token = m[0];
    if (token === "{{email}}") {
      parts.push(
        <a key={key++} className={linkClass} href={`mailto:${siteContact.email}`}>
          {siteContact.email}
        </a>,
      );
    } else {
      const inner = token.slice(2, -2); // strip [[ ]]
      const pipe = inner.indexOf("|");
      if (pipe > 0) {
        const href = inner.slice(0, pipe);
        const label = inner.slice(pipe + 1);
        parts.push(
          <Link key={key++} href={href} className={linkClass}>
            {label}
          </Link>,
        );
      } else {
        parts.push(<Fragment key={key++}>{token}</Fragment>);
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  }
  return <>{parts}</>;
}

function BlockView({
  block,
  policyLinkLabels,
}: {
  block: LegalBlock;
  policyLinkLabels: { href: string; label: string }[];
}) {
  if ("p" in block) {
    return (
      <p>
        <RichText text={block.p} />
      </p>
    );
  }
  if ("list" in block) {
    return <LegalList items={block.list} />;
  }
  if ("policyLinks" in block) {
    return (
      <p className="flex flex-wrap gap-x-3 gap-y-1">
        {policyLinkLabels.map((l, i) => (
          <Fragment key={l.href}>
            {i > 0 ? <span className="text-muted">·</span> : null}
            <Link href={l.href} className={linkClass}>
              {l.label}
            </Link>
          </Fragment>
        ))}
      </p>
    );
  }
  return null;
}

/**
 * Renders a localized legal document body (from `src/i18n/legal/*`) inside the
 * shared LegalPage chrome.
 */
export function LegalDocView({
  title,
  description,
  updated,
  lastUpdatedLabel,
  legalLabel,
  doc,
  policyLinkLabels,
  extra,
}: {
  title: string;
  description?: string;
  updated?: string;
  lastUpdatedLabel: string;
  legalLabel: string;
  doc: LegalDocContent;
  policyLinkLabels: { href: string; label: string }[];
  /** Optional blocks after sections (e.g. contact social links). */
  extra?: ReactNode;
}) {
  return (
    <LegalPage
      title={title}
      description={description}
      updated={updated}
      lastUpdatedLabel={lastUpdatedLabel}
      legalLabel={legalLabel}
    >
      {doc.sections.map((section) => (
        <LegalSection key={section.title} id={section.id} title={section.title}>
          {section.blocks.map((block, i) => (
            <BlockView
              key={i}
              block={block}
              policyLinkLabels={policyLinkLabels}
            />
          ))}
        </LegalSection>
      ))}
      {extra}
    </LegalPage>
  );
}

export function defaultPolicyLinks(labels: {
  privacy: string;
  terms: string;
  cookies: string;
  security: string;
  acceptableUse: string;
}): { href: string; label: string }[] {
  return [
    { href: "/privacy", label: labels.privacy },
    { href: "/terms", label: labels.terms },
    { href: "/cookies", label: labels.cookies },
    { href: "/security", label: labels.security },
    { href: "/acceptable-use", label: labels.acceptableUse },
  ];
}
