import type { LegalBundle } from "./types";

const en: LegalBundle = {
  privacy: {
    sections: [
      {
        title: "1. Who we are",
        blocks: [
          {
            p: 'AuthorChain ("we", "us") operates the AuthorChain publishing platform and the ReaderChain reader experience. Contact: {{email}}. See also our [[/contact|contact page]].',
          },
        ],
      },
      {
        id: "data-protection",
        title: "2. Data we collect",
        blocks: [
          { p: "Depending on how you use the service, we may process:" },
          {
            list: [
              "Account data (email, wallet address, display name, authentication identifiers from our identity provider).",
              "Publishing data (book metadata, covers, manuscripts, previews, pricing, ISBNs, and related assets you upload).",
              "Transaction data (purchases, refunds where applicable, and payment processor references — not full card numbers).",
              "Technical data (IP address, device/browser type, approximate location derived from IP, logs, and security signals).",
              "Support communications you send us.",
            ],
          },
        ],
      },
      {
        title: "3. How we use data",
        blocks: [
          {
            list: [
              "Provide, secure, and improve AuthorChain and ReaderChain.",
              "Authenticate users, prevent abuse, and malware-scan uploads before storage.",
              "Process sales, deliver purchased books to the reader library, and support authors.",
              "Register on-chain authorship proofs when you request them (public blockchain networks may store hashes and related transaction data permanently).",
              "Comply with law and respond to lawful requests.",
            ],
          },
        ],
      },
      {
        title: "4. Legal bases (where GDPR/UK GDPR applies)",
        blocks: [
          {
            p: "We process personal data where necessary to perform a contract with you, for our legitimate interests (security, product improvement, fraud prevention), with consent where required (certain cookies or marketing), and to meet legal obligations.",
          },
        ],
      },
      {
        title: "5. Sharing",
        blocks: [
          {
            p: "We use processors such as hosting, storage, authentication, payment, email, and analytics providers under contractual safeguards. We do not sell personal information. We may disclose data if required by law or to protect rights, safety, and the integrity of the platform.",
          },
        ],
      },
      {
        title: "6. International transfers",
        blocks: [
          {
            p: "Our infrastructure and vendors may process data in the United States and other countries. Where required, we use appropriate transfer mechanisms (such as standard contractual clauses).",
          },
        ],
      },
      {
        title: "7. Retention",
        blocks: [
          {
            p: "We retain account and publishing data while your account is active and as needed for legal, tax, security, and dispute purposes. On-chain records are public and cannot be erased by us.",
          },
        ],
      },
      {
        title: "8. Your rights",
        blocks: [
          {
            p: "Depending on your location, you may have rights to access, correct, delete, restrict, or port personal data, and to object to certain processing or withdraw consent. Contact us to exercise rights. You may also lodge a complaint with a supervisory authority.",
          },
        ],
      },
      {
        title: "9. Children",
        blocks: [
          {
            p: "The service is not directed to children under 16 (or the higher age required in your region). We do not knowingly collect their data.",
          },
        ],
      },
      {
        title: "10. Changes",
        blocks: [
          {
            p: 'We may update this policy. Material changes will be reflected by the "Last updated" date and, where appropriate, additional notice.',
          },
        ],
      },
    ],
  },

  terms: {
    sections: [
      {
        title: "1. Agreement",
        blocks: [
          {
            p: "By accessing or using AuthorChain or ReaderChain you agree to these Terms and our [[/privacy|Privacy Policy]], [[/acceptable-use|Acceptable Use]], and related policies. If you do not agree, do not use the service.",
          },
        ],
      },
      {
        title: "2. The service",
        blocks: [
          {
            p: "AuthorChain provides tools for authors to upload, prepare, prove authorship of, and sell digital books. ReaderChain provides discovery, purchase, and library access for readers. Features may change, be limited by region, or require configuration (payments, chain, storage).",
          },
        ],
      },
      {
        title: "3. Accounts",
        blocks: [
          {
            list: [
              "You must provide accurate information and keep credentials secure.",
              "You are responsible for activity under your account.",
              "We may suspend or terminate accounts that violate these Terms or create security risk.",
            ],
          },
        ],
      },
      {
        title: "4. Author content & licenses",
        blocks: [
          {
            p: "You retain ownership of manuscripts and materials you upload, subject to third-party rights. You grant AuthorChain a limited license to host, process, display, deliver, and promote your content as needed to operate the service (including malware scanning, format handling, and storefront display when published).",
          },
          {
            p: "You represent that you have all rights needed to publish and sell the content and that it does not infringe others' rights or applicable law.",
          },
        ],
      },
      {
        title: "5. On-chain proof",
        blocks: [
          {
            p: "Authorship proofs are technical records (for example a content hash registered on a public blockchain). They are not a government copyright registration, trademark filing, or legal title certificate. Blockchain transactions may be irreversible and public.",
          },
        ],
      },
      {
        title: "6. Payments",
        blocks: [
          {
            p: "Prices are set by authors where the product allows. Payment processors (e.g. Stripe) handle card payments under their terms. Fees, taxes, and chargebacks may apply. Crypto payment options, when available, depend on network conditions and configuration.",
          },
        ],
      },
      {
        id: "disclaimers",
        title: "7. Disclaimers",
        blocks: [
          {
            p: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE". TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not guarantee uninterrupted availability, sales outcomes, AI output accuracy, or that on-chain proofs will be accepted by any third party or court.',
          },
        ],
      },
      {
        title: "8. Limitation of liability",
        blocks: [
          {
            p: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUTHORCHAIN AND ITS OPERATORS ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOST PROFITS, DATA, OR GOODWILL. OUR AGGREGATE LIABILITY FOR CLAIMS RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF (A) AMOUNTS YOU PAID US FOR THE SERVICE IN THE 12 MONTHS BEFORE THE CLAIM OR (B) USD $100.",
          },
        ],
      },
      {
        title: "9. Indemnity",
        blocks: [
          {
            p: "You will defend and indemnify AuthorChain against claims arising from your content, your use of the service, or your violation of these Terms or law.",
          },
        ],
      },
      {
        title: "10. Changes & contact",
        blocks: [
          {
            p: "We may update these Terms. Continued use after changes constitutes acceptance. Questions: {{email}}.",
          },
        ],
      },
    ],
  },

  cookies: {
    sections: [
      {
        title: "1. What cookies are",
        blocks: [
          {
            p: "Cookies and similar technologies (local storage, pixels) help sites remember preferences, keep you signed in, and understand usage. AuthorChain uses them only where needed to run a secure publishing and reader experience.",
          },
        ],
      },
      {
        title: "2. Categories we use",
        blocks: [
          {
            list: [
              "Essential / session: authentication sessions (e.g. Privy), security, load balancing, and core app function so sign-in and protected routes work.",
              "Preferences: language selection (locale cookie) and similar UI choices that do not identify you for advertising.",
              "Referral attribution: when present, a short-lived referral cookie may attribute a checkout to a share link an author created — analytics for that author, not third-party ad retargeting.",
              "Payments: Stripe (or similar processors) may set their own cookies when you complete checkout; those are governed by the processor’s policies.",
              "Analytics (if enabled later): aggregate traffic and product improvement only — never sold as personal data.",
            ],
          },
        ],
      },
      {
        title: "3. Your choices",
        blocks: [
          {
            p: "You can control cookies in your browser settings. Blocking essential cookies may prevent sign-in, purchases, or library access. Where required by law we will request consent for non-essential cookies.",
          },
        ],
      },
      {
        title: "4. More information",
        blocks: [
          {
            p: "See our [[/privacy|Privacy Policy]] for broader data practices, [[/security|Security]] for platform controls, or [[/contact|contact us]].",
          },
        ],
      },
    ],
  },

  security: {
    sections: [
      {
        title: "1. Our posture",
        blocks: [
          {
            p: "AuthorChain is built with a defense-in-depth approach: least-privilege access, fail-closed security defaults for uploads, and careful separation of public marketing surfaces from private author and reader areas.",
          },
        ],
      },
      {
        title: "2. Private manuscript storage",
        blocks: [
          {
            p: "Manuscripts, covers, and related assets are stored in private object storage. They are not written into public blockchain state. Access to full files is mediated by application authorization checks.",
          },
        ],
      },
      {
        id: "uploads",
        title: "3. Malware scanning at finalize",
        blocks: [
          {
            list: [
              "When scanning is configured in production, new manuscript/cover/preview uploads are malware-scanned during finalize before durable acceptance.",
              "Infected or unscannable files are rejected with safe user-facing messages — no raw scanner output, internal paths, storage keys, or signed URLs are shown in the UI.",
              "If the scanner is unavailable, new uploads fail closed rather than storing unchecked files.",
            ],
          },
        ],
      },
      {
        title: "4. Protected downloads & reader entitlement",
        blocks: [
          {
            list: [
              "Author Studio and reader library routes require authentication.",
              "Book downloads and private assets are authorized per user and purchase entitlement.",
              "Public pages may show covers and intentional previews; they do not open paid manuscripts by default.",
              "Dashboard and private APIs are excluded from search indexing.",
            ],
          },
        ],
      },
      {
        title: "5. Payments & secrets",
        blocks: [
          {
            p: "Card payments are handled by Stripe (or similar processors). Secrets and tokens live in environment configuration — never in client bundles or public pages. Webhooks verify signatures before updating state.",
          },
        ],
      },
      {
        title: "6. SHA-256 proof privacy (what is not on-chain)",
        blocks: [
          {
            p: "On-chain authorship records use content hashes (SHA-256 fingerprints) and related proof metadata. That provides public verifiability of a manuscript fingerprint without publishing the full manuscript text to Base. Proof of authorship is not a government copyright registration.",
          },
        ],
      },
      {
        title: "7. Responsible disclosure",
        blocks: [
          {
            p: "If you believe you found a vulnerability, email {{email}} with a clear description and “Security” in the subject when possible. Please avoid privacy-invasive testing, social engineering, or disruption of production systems.",
          },
        ],
      },
      {
        title: "8. Related policies",
        blocks: [{ policyLinks: true }],
      },
    ],
  },

  copyright: {
    sections: [
      {
        title: "1. Respect for intellectual property",
        blocks: [
          {
            p: "Authors must only upload and sell works they own or are licensed to distribute. Rights holders remain responsible for the content they publish. Infringing content is prohibited. See also our [[/acceptable-use|Acceptable Use]] policy.",
          },
        ],
      },
      {
        title: "2. On-chain proof is not copyright registration",
        blocks: [
          {
            p: "AuthorChain's proof-of-authorship feature records a technical SHA-256 hash of a manuscript (and related transaction metadata) on a public blockchain. It is a provenance fingerprint — not a filing with a government copyright office, not legal advice, and not a guarantee of enforceability in any jurisdiction.",
          },
          {
            p: "Authors who need formal copyright registration should follow the process of the relevant copyright office in their country. AuthorChain does not replace that process.",
          },
        ],
      },
      {
        title: "3. Reporting infringement (DMCA-style notice)",
        blocks: [
          {
            p: "If you believe content on AuthorChain infringes your copyright, send a notice to {{email}} including:",
          },
          {
            list: [
              "Your contact name, address, phone, and email.",
              "Identification of the copyrighted work claimed to be infringed.",
              "The URL or exact location of the allegedly infringing material on AuthorChain.",
              "A statement that you have a good-faith belief the use is not authorized.",
              "A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorized to act.",
              "Your physical or electronic signature.",
            ],
          },
          {
            p: "We may remove or disable access to material and notify the uploader. We may terminate repeat infringers where appropriate.",
          },
        ],
      },
      {
        title: "4. Counter-notice",
        blocks: [
          {
            p: "If your material was removed and you believe it was a mistake or misidentification, you may send a counter-notice to the same address with the information required under applicable law (including consent to jurisdiction of an appropriate court).",
          },
        ],
      },
      {
        title: "5. Trademarks",
        blocks: [
          {
            p: "AuthorChain and ReaderChain names and logos are our marks. Do not use them in a way that confuses users about affiliation or endorsement.",
          },
        ],
      },
    ],
  },

  acceptableUse: {
    sections: [
      {
        title: "1. Purpose",
        blocks: [
          {
            p: "These rules keep AuthorChain and ReaderChain safe for authors, readers, and partners. Violations may lead to content removal, account suspension, or legal action.",
          },
        ],
      },
      {
        title: "2. Prohibited uploads & content",
        blocks: [
          {
            list: [
              "Malware, exploits, phishing kits, or files designed to harm systems or steal data.",
              "Infringing copyrighted works, trademark abuse, or unauthorized personal data dumps.",
              "Child sexual abuse material or any exploitation of minors.",
              "Terrorist content, credible threats of violence, or instructions for violent crime.",
              "Illegal goods/services facilitation, fraud schemes, or clear scams.",
              "Non-consensual intimate imagery or doxxing.",
              "Spam, deceptive metadata, fake proof claims, or manipulative SEO/storefront practices.",
            ],
          },
        ],
      },
      {
        title: "3. Prohibited conduct (authors & readers)",
        blocks: [
          {
            list: [
              "Attempting to bypass authentication, entitlement checks, malware scanning, or payment flows.",
              "Scraping private libraries, bulk-harvesting personal data, or abusing APIs.",
              "Interfering with other users' access or the integrity of proofs and sales records.",
              "Harassing readers or authors, review fraud, or coordinated abuse of share/referral links.",
              "Misrepresenting government affiliation, licenses, KDP approval, or copyright status.",
            ],
          },
        ],
      },
      {
        title: "4. Publishing integrity",
        blocks: [
          {
            p: "Authors should accurately describe books, pricing, and rights. AI-assisted tools may help with marketing copy, but you remain responsible for accuracy and compliance with third-party store rules when you export elsewhere. AuthorChain does not guarantee Amazon KDP or other store acceptance.",
          },
        ],
      },
      {
        title: "5. Enforcement options",
        blocks: [
          {
            list: [
              "Remove or restrict content and storefront visibility.",
              "Suspend or terminate accounts involved in abuse.",
              "Block uploads that fail security scanning.",
              "Cooperate with law enforcement when legally required.",
            ],
          },
          {
            p: "Questions or reports: see [[/contact|Contact]] and [[/copyright|Copyright & DMCA]].",
          },
        ],
      },
    ],
  },

  contact: {
    sections: [
      {
        title: "How to reach us",
        blocks: [
          {
            p: "Email {{email}}. We aim to respond as soon as practical. Please choose a clear subject so we can route your message.",
          },
        ],
      },
      {
        title: "Author support & onboarding",
        blocks: [
          {
            p: "Questions about uploading manuscripts, metadata, proof registration, storefront listings, translations, or sales visibility belong here. Include your account email and the book title when relevant — never send private keys or passwords.",
          },
        ],
      },
      {
        title: "Security reports",
        blocks: [
          {
            p: 'Suspected vulnerabilities: email {{email}} with "Security" in the subject and a clear technical description. Details on posture: [[/security|Security & Compliance]].',
          },
        ],
      },
      {
        title: "Privacy, copyright & legal",
        blocks: [
          {
            p: "Privacy requests, DMCA-style notices, and legal correspondence: use the same email with enough detail for us to act. See [[/privacy|Privacy]], [[/copyright|Copyright & DMCA]], and [[/acceptable-use|Acceptable Use]].",
          },
        ],
      },
      {
        title: "Partnerships & media",
        blocks: [
          {
            p: "For partnership, press, or collaboration inquiries, email {{email}} with “Partnership” or “Media” in the subject and a short description of the opportunity.",
          },
        ],
      },
      {
        title: "Response expectations",
        blocks: [
          {
            p: "We prioritize security and abuse reports, then active author/reader account issues. Complex legal notices may take longer. This is not an emergency services channel.",
          },
        ],
      },
      {
        title: "Policies",
        blocks: [{ policyLinks: true }],
      },
    ],
  },
};

export default en;
