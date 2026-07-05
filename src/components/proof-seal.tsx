"use client";

import { useId } from "react";

/**
 * Gold "Proof of Authorship" certification seal, shown only on books whose
 * manuscript hash has a REGISTERED on-chain proof. Represents AuthorChain's
 * on-chain verification only — not a copyright office or legal registration.
 *
 * - `full`: engraved circular text ("PROOF OF AUTHORSHIP · VERIFIED ON-CHAIN")
 *   + checkmark + AUTHORCHAIN. For detail surfaces (~90px+).
 * - `compact`: ring + checkmark, no microtext, legible down to ~28px. For
 *   grid thumbnails.
 *
 * Pure SVG, decorative (pointer-events none), unique gradient/path ids per
 * instance so multiple seals on a page never collide.
 */
export function ProofSeal({
  variant = "compact",
  className = "",
  title = "Verified on-chain proof of authorship",
}: {
  variant?: "full" | "compact";
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const face = `${uid}-face`;
  const rim = `${uid}-rim`;
  const arcTop = `${uid}-top`;
  const arcBot = `${uid}-bot`;

  return (
    <svg
      viewBox="0 0 240 240"
      role="img"
      aria-label={title}
      className={`pointer-events-none select-none ${className}`}
    >
      <title>{title}</title>
      <defs>
        <radialGradient id={face} cx="42%" cy="34%" r="74%">
          <stop offset="0%" stopColor="#FFF7DA" />
          <stop offset="40%" stopColor="#F4D77A" />
          <stop offset="78%" stopColor="#E0AE3C" />
          <stop offset="100%" stopColor="#B9821F" />
        </radialGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBE9A6" />
          <stop offset="48%" stopColor="#CF9A2C" />
          <stop offset="100%" stopColor="#8A5F14" />
        </linearGradient>
        {variant === "full" ? (
          <>
            <path id={arcTop} d="M120,120 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
            <path id={arcBot} d="M120,120 m-88,0 a88,88 0 1,0 176,0 a88,88 0 1,0 -176,0" />
          </>
        ) : null}
      </defs>

      {variant === "full" ? (
        <>
          <circle cx="120" cy="120" r="112" fill={`url(#${rim})`} />
          <circle cx="120" cy="120" r="112" fill="none" stroke="#6f4d10" strokeWidth="2.5" />
          <circle
            cx="120"
            cy="120"
            r="104"
            fill="none"
            stroke="#8A5F14"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="0.1 9.7"
          />
          <circle cx="120" cy="120" r="99" fill={`url(#${face})`} />
          <circle cx="120" cy="120" r="99" fill="none" stroke="#B9821F" strokeWidth="1" opacity="0.55" />
          <circle cx="120" cy="120" r="71" fill="none" stroke="#B9821F" strokeWidth="1" opacity="0.55" />
          <circle cx="120" cy="120" r="69" fill={`url(#${face})`} />
          <circle cx="120" cy="120" r="69" fill="none" stroke="#8A5F14" strokeWidth="1.5" opacity="0.6" />

          <g fill="#5A3E12" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="800">
            <text fontSize="14.5" letterSpacing="2.4">
              <textPath href={`#${arcTop}`} startOffset="25%" textAnchor="middle">
                PROOF OF AUTHORSHIP
              </textPath>
            </text>
            <text fontSize="13.5" letterSpacing="2.8">
              <textPath href={`#${arcBot}`} startOffset="25%" textAnchor="middle">
                VERIFIED ON-CHAIN
              </textPath>
            </text>
          </g>
          <rect x="28.5" y="116.5" width="8" height="8" transform="rotate(45 32.5 120.5)" fill="#5A3E12" />
          <rect x="203.5" y="116.5" width="8" height="8" transform="rotate(45 207.5 120.5)" fill="#5A3E12" />

          <path d="M104,120 l11,12 l24,-27" fill="none" stroke="#5A3E12" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M104,118.5 l11,12 l24,-27" fill="none" stroke="#FFF3C4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <text x="120" y="151" textAnchor="middle" fontSize="8.6" letterSpacing="2.2" fontWeight="800" fill="#6B4A16" fontFamily="ui-sans-serif, system-ui, sans-serif">
            AUTHORCHAIN
          </text>
        </>
      ) : (
        <>
          <circle cx="120" cy="120" r="112" fill={`url(#${rim})`} />
          <circle cx="120" cy="120" r="112" fill="none" stroke="#6f4d10" strokeWidth="3" />
          <circle
            cx="120"
            cy="120"
            r="102"
            fill="none"
            stroke="#8A5F14"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="0.1 15"
          />
          <circle cx="120" cy="120" r="92" fill={`url(#${face})`} />
          <circle cx="120" cy="120" r="92" fill="none" stroke="#8A5F14" strokeWidth="2" opacity="0.6" />
          <path d="M92,122 l18,20 l40,-46" fill="none" stroke="#5A3E12" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M92,119 l18,20 l40,-46" fill="none" stroke="#FFF3C4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        </>
      )}
    </svg>
  );
}
