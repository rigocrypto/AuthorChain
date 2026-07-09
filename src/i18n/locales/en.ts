// English — the source dictionary. Its shape (`Dictionary`) is what every other
// locale must satisfy. UI copy only; never author-entered book content.

const en = {
  nav: {
    readerchain: "ReaderChain",
    readerLibrary: "Reader Library",
    studio: "AuthorChain Studio",
    proof: "Proof of Authorship",
    explore: "Explore",
    dashboard: "Dashboard",
    books: "My Books",
    upload: "Upload",
    aiTools: "AI Tools",
    sales: "Sales",
    backToSite: "← Back to site",
    backToMyBooks: "← Back to My Books",
    allBooks: "← All books",
    menu: "Site menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  common: {
    login: "Login",
    logout: "Sign out",
    save: "Save",
    cancel: "Cancel",
    share: "Share",
    copyLink: "Copy link",
    copied: "Copied ✓",
    language: "Language",
    comingSoon: "Coming soon",
    verifiedOnChain: "Verified on-chain",
    verifiedProof: "✓ Verified proof",
    openBook: "Open book →",
    openApp: "Open App",
    startPublishing: "Start publishing",
    viewBookDetails: "View book details →",
  },
  footer: {
    tagline:
      "AI-powered Web3 publishing: prove authorship on-chain, sell directly, and deliver books through ReaderChain.",
    product: "Product",
    legal: "Legal",
    trust: "Security & compliance",
    contact: "Contact",
    social: "Social",
    explore: "Explore books",
    library: "Reader library",
    studio: "AuthorChain Studio",
    proof: "Proof of authorship",
    privacy: "Privacy policy",
    terms: "Terms of service",
    cookies: "Cookie policy",
    copyright: "Copyright & DMCA",
    acceptableUse: "Acceptable use",
    securityPolicy: "Security",
    dataProtection: "Data protection",
    uploadScanning: "Upload scanning",
    disclaimers: "Disclaimers",
    contactPage: "Contact us",
    supportForm: "Support form",
    rights: "All rights reserved.",
    complianceNote:
      "We design for privacy, security, and publishing compliance. On-chain proof is a technical authorship record — not a government copyright registration.",
    malwareNote:
      "New uploads are malware-scanned before they are stored. We never expose scanner internals in the UI.",
  },
  home: {
    metaTitle: "AuthorChain | Web3 Publishing for Independent Authors",
    metaDescription:
      "AuthorChain helps independent authors prove authorship on-chain, sell directly with Stripe, and deliver verified books to readers.",
    badge: "Proof-of-authorship · Verified on-chain · Built for independent authors",
    heroTitle: "Publish. Own. Earn. Grow.",
    heroSubtitle:
      "AuthorChain is the Web3 publishing platform where authors prove their work is theirs on-chain, prepare a publish-ready manuscript, and sell directly — while readers discover, buy, and enjoy verified books.",
    jumpHowItWorks: "How it works",
    jumpProof: "Proof of authorship",
    readerBadge: "ReaderChain",
    readerTitle: "For readers & collectors",
    readerDesc:
      "Discover verified books, support independent authors, and build your secure digital library.",
    exploreReaderchain: "Explore ReaderChain",
    myLibrary: "My Library",
    authorBadge: "AuthorChain Studio",
    authorTitle: "For authors & creators",
    authorDesc:
      "Register proof-of-authorship on-chain, prepare a publish-ready manuscript, sell directly with Stripe, and grow your audience with AI-assisted tools.",
    enterStudio: "Enter AuthorChain Studio",
    startPublishing: "Start Publishing",
    featuredTitle: "Featured on ReaderChain",
    featuredSubtitle: "Verified books from independent authors.",
    exploreAll: "Explore all →",
    howItWorks: "How it works",
    step1t: "Author uploads",
    step1d: "Upload your book (PDF, EPUB, Audio).",
    step2t: "Prove authorship",
    step2d: "A SHA-256 proof is registered on Base.",
    step3t: "Publish & sell",
    step3d: "Sell to global readers in fiat or crypto.",
    step4t: "Earn & grow",
    step4d: "Track sales in Studio and grow your audience.",
    proofBadge: "Proof of authorship",
    proofTitle: "Verified ownership, on-chain",
    proofDesc:
      "Every manuscript is hashed with SHA-256 and its proof is registered on Base — a public, verifiable record that you are the author. Readers see a verified badge; you keep full control of your work.",
    proofCardLabel: "On-chain proof",
    proofCardNote: "shown on every verified book",

    // --- SEO Phase 2: deeper people-first explanations ---
    proofHowTitle: "How on-chain authorship proof works",
    proofHowLead:
      "AuthorChain is a Web3 publishing platform that records manuscript provenance without putting your private file on a public chain.",
    proofHow1t: "Hash the manuscript",
    proofHow1d:
      "When you register proof, AuthorChain computes a SHA-256 fingerprint of the manuscript file you uploaded. The fingerprint identifies that exact file content.",
    proofHow2t: "Register the proof on Base",
    proofHow2d:
      "Only the hash (and related proof metadata) is registered through the AuthorChain registry on Base. Readers and third parties can later verify the fingerprint against a public record.",
    proofHow3t: "Keep the manuscript private",
    proofHow3d:
      "Your full manuscript is not stored on-chain. Private files stay in protected storage and are delivered through authorized reader access after purchase.",
    proofHow4t: "Show a verified badge",
    proofHow4d:
      "Books with a successful registration can display verified on-chain proof of authorship on public pages — a timestamped provenance signal, not a legal title certificate.",
    proofHowNote:
      "On-chain proof of authorship is technical evidence of a manuscript fingerprint at a point in time. It is not government copyright registration, trademark filing, or a guarantee of enforceability in court.",

    whyProofTitle: "Why independent authors need proof",
    whyProofLead:
      "Independent author publishing moves fast — drafts, AI-assisted edits, collaborators, and public launches. Provenance helps you document what you held, and when.",
    whyProof1t: "Plagiarism and copy disputes",
    whyProof1d:
      "A public hash record gives you a clear fingerprint to compare if someone later claims your work or circulates a near-identical file.",
    whyProof2t: "Manuscript ownership history",
    whyProof2d:
      "Co-authors, editors, and freelancers can change over time. Timestamped proof helps you show which manuscript version you controlled before a release.",
    whyProof3t: "AI-assisted workflow documentation",
    whyProof3d:
      "Many authors use AI-assisted publishing tools for research or copy. Proof still fingerprints the manuscript file you register — you remain responsible for originality and rights.",
    whyProof4t: "Evidence before public release",
    whyProof4d:
      "Registering proof before wide distribution creates an earlier on-chain reference point for manuscript provenance.",

    salesTitle: "Direct sales and verified book delivery",
    salesLead:
      "AuthorChain connects checkout to a protected reader library so buyers get access without emailing files around.",
    sales1t: "Stripe checkout for readers",
    sales1d:
      "Readers can buy with card through Stripe when payments are configured. Checkout is designed for independent authors selling digital books directly.",
    sales2t: "Reader entitlement after purchase",
    sales2d:
      "A successful purchase creates reader access for that title. Entitlement — not a public download link — is what unlocks the library experience.",
    sales3t: "Protected ReaderChain library",
    sales3d:
      "Purchased titles appear in the reader’s secured library. Access is tied to the signed-in buyer rather than an open file drop.",
    sales4t: "Sales visibility for authors",
    sales4d:
      "Author Studio surfaces sales activity so you can track orders and reader access. Payout timing and methods depend on your Stripe (or other) payment configuration — AuthorChain does not invent guaranteed instant bank deposits.",

    aiWorkflowTitle: "AI-assisted publishing — with the author in control",
    aiWorkflowLead:
      "Studio AI tools can speed blurbs, launch plans, and community copy. They support your workflow; they do not replace your judgment or store rules elsewhere.",
    aiWorkflow1t: "Assist, don’t replace",
    aiWorkflow1d:
      "Agents draft marketing and planning assets from the book details you provide. You review, edit, and decide what goes public.",
    aiWorkflow2t: "You stay responsible",
    aiWorkflow2d:
      "You remain responsible for accuracy, rights, and claims about your book — including any export to other platforms.",
    aiWorkflow3t: "Publish-ready positioning only",
    aiWorkflow3d:
      "AuthorChain helps you prepare and sell a publish-ready manuscript experience. It does not guarantee acceptance by Amazon KDP, Apple Books, or any third-party store.",
    aiWorkflowNote:
      "We do not promise to bypass AI detectors, “pass filters,” or certify editorial quality. AI-assisted publishing here means optional productivity tools inside AuthorChain Studio.",

    securityTitle: "Security, privacy, and compliance posture",
    securityLead:
      "A blockchain publishing stack still needs ordinary product security: private storage, authorized downloads, and careful wording about what the chain actually holds.",
    security1t: "Private manuscript storage",
    security1d:
      "Manuscripts and assets are kept in private object storage, not pasted into public chain state.",
    security2t: "Protected downloads",
    security2d:
      "Reader download routes check entitlement before serving files. Public pages show covers and previews you choose to expose — not the full paid manuscript by default.",
    security3t: "Upload malware scanning",
    security3d:
      "When scanning is configured in production, new uploads are malware-scanned at finalize before durable acceptance. Infected or unscannable files are rejected with safe user-facing messages.",
    security4t: "Proof hash privacy",
    security4d:
      "The on-chain record is about a hash fingerprint and proof metadata. It is not a publication of your full manuscript text on Base.",

    diffTitle: "What makes AuthorChain different",
    diffLead:
      "Most tools solve one slice of the problem. AuthorChain combines on-chain authorship proof, direct sales, and verified book delivery in one independent-author workflow.",
    diff1t: "Traditional self-publishing portals",
    diff1d:
      "Classic portals focus on storefront distribution and print logistics. They rarely give you a public, portable proof hash of the manuscript you held before launch.",
    diff2t: "Simple cloud file storage",
    diff2d:
      "Drive folders keep files private but do not create buyer entitlement, a reader library, or a verifiable authorship fingerprint.",
    diff3t: "Generic marketplaces",
    diff3d:
      "Marketplaces optimize discovery and checkout, but manuscript provenance and author-controlled proof registration are usually outside the product.",
    diff4t: "AuthorChain’s combination",
    diff4d:
      "Upload and prepare a manuscript, register proof of authorship on-chain, sell directly, and deliver through a protected reader library — with AI-assisted tools when you want them.",

    faqTitle: "Frequently asked questions",
    faqSubtitle:
      "Straight answers for independent authors evaluating a Web3 publishing platform.",
    faq1q: "Does AuthorChain store my manuscript on-chain?",
    faq1a:
      "No. AuthorChain registers a SHA-256 hash (fingerprint) of the manuscript for proof of authorship. The full manuscript stays in private storage and is not published to the blockchain.",
    faq2q: "Is AuthorChain the same as copyright registration?",
    faq2a:
      "No. On-chain authorship proof is a technical provenance record. It is not a filing with a government copyright office and is not legal advice about your rights in any country.",
    faq3q: "Can readers access a book without buying it?",
    faq3a:
      "Public pages may show marketing details, covers, and optional previews. Full manuscript access for paid titles is delivered through reader entitlement after a successful purchase (or other access you configure).",
    faq4q: "Can authors translate their book metadata?",
    faq4a:
      "Yes. Author Studio supports localized metadata so storefront titles, subtitles, and descriptions can be shown in the reader’s language when you provide translations.",
    faq5q: "Does AuthorChain guarantee KDP approval?",
    faq5a:
      "No. AuthorChain does not guarantee Amazon KDP (or any store) acceptance, ranking, or policy outcomes. We help you prepare and sell on AuthorChain/ReaderChain; third-party stores have their own rules.",
    faq6q: "How does proof-of-authorship work?",
    faq6a:
      "You upload a manuscript, AuthorChain hashes the file with SHA-256, and a successful registration records that proof on Base via the AuthorChain registry. Readers can see a verified badge when proof is registered — without your private file living on-chain.",

    agentsTitle: "AI tools in AuthorChain Studio",
    agentsSubtitle: "Smart assistants that write, plan, and grow your book.",
    agentCopyName: "Copy Agent",
    agentCopyDesc:
      "Writes your blurb, description, social posts, emails, and keywords.",
    agentLaunchName: "Launch Agent",
    agentLaunchDesc:
      "Builds a 14-day launch calendar, checklists, and a pricing strategy.",
    agentCommunityName: "Community Agent",
    agentCommunityDesc:
      "Creates a reader FAQ, discussion questions, and engagement posts.",
    agentPricingName: "Pricing Agent",
    agentPricingDesc:
      "Suggests the best price based on real sales and conversion data.",
    agentOpportunityName: "Opportunity Agent",
    agentOpportunityDesc:
      "Finds trends, keywords, and market opportunities for your books.",
    collectorReaderBadge: "Coming soon · ReaderChain",
    collectorReaderTitle: "Collector Editions",
    collectorReaderDesc:
      "Collect limited digital editions, unlock premium content, and support independent authors directly.",
    collectorAuthorBadge: "Coming soon · AuthorChain Studio",
    collectorAuthorTitle: "Tokenized Collector Editions",
    collectorAuthorDesc:
      "Launch limited digital editions and premium book collections backed by verified proof-of-authorship.",
    ctaTitle: "One ecosystem. Two ways in.",
    ctaDesc:
      "Readers discover and collect verified books. Authors create, prove, and earn. Blockchain proves ownership; AI helps creators grow.",
  },
  explore: {
    metaTitle: "Discover Verified Books on ReaderChain",
    metaDescription:
      "Browse independent authors' books with on-chain proof of authorship, secure previews, and ReaderChain library access.",
    heroBadge: "ReaderChain · Verified books from independent authors",
    heroTitle: "Discover verified books on ReaderChain",
    heroSubtitle:
      "Buy directly from independent authors, access your secure digital library, and support creators building the future of publishing.",
    myLibrary: "My Library",
    featuredTitle: "Featured titles with on-chain proof",
    featuredBadge: "✓ Proof of authorship",
    featuredSubtitle: "Independent authors with a registered manuscript fingerprint on Base.",
    allBooks: "Full catalog",
    emptyTitle: "ReaderChain is getting ready",
    emptyDesc: "New verified books will appear here soon.",
    visitStudio: "Visit AuthorChain Studio",
    comingSoonTitle: "Roadmap for the reader experience",
    comingSoonSubtitle: "Planned ReaderChain capabilities beyond today's catalog and library.",
    booksAvailable: "{count} verified books available.",
    booksAvailableOne: "1 verified book available.",
    soon: "Soon",
    comingSoonBadge: "Coming soon",
    collectorEditionsTitle: "Limited digital collector editions",
    collectorEditionsDesc:
      "Limited digital editions and premium unlocks are planned for ReaderChain — always backed by verified proof-of-authorship when registered.",
    soonAudiobooks: "Audiobooks",
    soonAudiobooksDesc: "Listen to verified books from independent authors.",
    soonVideoBooks: "Video Books",
    soonVideoBooksDesc: "Watch companion lessons and visual editions.",
    soonBookClubs: "Book Clubs",
    soonBookClubsDesc: "Read together and discuss with the community.",
    soonReaderRewards: "Reader Rewards",
    soonReaderRewardsDesc: "Earn perks for supporting the creators you love.",
    soonAiRecs: "AI Recommendations",
    soonAiRecsDesc: "Discover your next read, personalized to your taste.",
    soonCollector: "Collector editions (planned)",
    soonCollectorDesc:
      "Collect limited digital editions and unlock premium content.",
    // Phase 3: richer explore copy
    aboutTitle: "A catalog built for verified independent publishing",
    aboutLead:
      "ReaderChain is the public discovery surface of AuthorChain — a Web3 publishing platform where independent authors can prove manuscript provenance on-chain, sell directly, and deliver books through a protected library.",
    aboutP1:
      "Every listing you open here is a public book page: marketing details, optional previews, and purchase options when the author has enabled sales. Full manuscript access is not open by default; it is delivered after a successful purchase through reader entitlement.",
    verifiedTitle: "What “verified books” means here",
    verifiedLead:
      "When a book shows verified proof of authorship, AuthorChain has registered a SHA-256 fingerprint of the manuscript (and related proof metadata) via the on-chain registry. That is technical provenance — not a government copyright certificate.",
    verifiedP1:
      "Only the hash goes on-chain. The private manuscript file stays in protected storage. Readers still evaluate the book’s content, description, and previews as they would anywhere else; the badge adds a transparent fingerprint record authors can point to.",
    accessTitle: "How reader access works",
    accessLead:
      "Discovery is open. Delivery of paid digital manuscripts is gated.",
    access1t: "Browse and preview",
    access1d:
      "Explore covers, descriptions, and any preview the author published. Previews are intentional marketing assets — not the full paid file.",
    access2t: "Buy with checkout",
    access2d:
      "When Stripe is configured, readers can purchase with card. Checkout is designed for independent authors selling digital books directly.",
    access3t: "Open in your library",
    access3d:
      "After purchase, the title appears in the signed-in reader’s library. Download and reading routes check entitlement before serving protected files.",
    protectTitle: "Why ReaderChain protects readers and authors",
    protectP1:
      "Authors get a storefront path that pairs sales with optional on-chain proof of authorship. Readers get a clear place to discover independent work without chasing file drops in email inboxes.",
    protectP2:
      "AuthorChain Studio is where creators upload manuscripts, prepare metadata, register proof, and manage books. ReaderChain is where the public discovers and buys. Together they form a blockchain publishing workflow focused on independent author publishing and verified book delivery.",
    protectP3:
      "Want the deeper explanation of hashes, Base registration, and privacy? Read about proof of authorship on the homepage, then return here to browse the catalog.",
    linkProof: "How on-chain proof works →",
    linkHome: "Back to AuthorChain home →",
  },
  book: {
    backToReaderchain: "← Back to ReaderChain explore",
    browseAllBooks: "Browse all verified books",
    myLibrary: "My Library →",
    by: "by",
    about: "About this book",
    whoFor: "Who this book is for",
    whatLearn: "What you'll learn",
    buyTitle: "Buy this book",
    buyThisBook: "Buy this book",
    backToBookPage: "Back to book page",
    closePreview: "Close preview",
    readerPreview: "Reader preview",
    previewFirstPages: "Preview first pages",
    previewBook: "Preview book",
    buyCard: "Buy with Card (Stripe)",
    buyCardUnavailable: "Card payments are not available yet. Check back soon.",
    buyUsdc: "Pay with USDC (Base)",
    buyNote:
      "No crypto wallet needed. After purchase, read from your ReaderChain library.",
    shareTitle: "Share this book",
    bookLink: "Book link",
    details: "Book details",
    credits: "Credits",
    acknowledgments: "Thanks & acknowledgments",
    verifiedProofTitle: "Verified proof of authorship",
    /** {title} {network} placeholders */
    verifiedProofBody:
      "“{title}” has a registered manuscript fingerprint on {network}. Only the SHA-256 hash is on-chain — never the full manuscript file.",
    manuscriptHash: "Manuscript hash (SHA-256)",
    transaction: "Transaction",
    viewOnExplorer: "View transaction on BaseScan",
    printEdition: "Print edition",
    printAvailable: "Available",
    printSoon: "Planned",
    printAvailableDesc: "A physical edition of this book is available.",
    orderPrint: "Order print edition (online ordering soon)",
    printRefNote:
      "Print specs are shown for reference. Online print checkout is not enabled yet.",
    /** {title} placeholder */
    printComingDesc:
      "A print edition for “{title}” is not listed yet. Authors can publish print specs from Studio when ready.",
    /** {title} {author} placeholders */
    seoIntro:
      "“{title}” by {author} is available on AuthorChain with optional verified authorship proof, secure reader access, and protected delivery after purchase.",
    /** Visible H1 uses title + author; stored title unchanged */
    h1By: "{title} by {author}",
    notFound: "Book not found",
    // Detail row labels
    format: "Format",
    language: "Language",
    pages: "Pages",
    readingTime: "Reading time",
    edition: "Edition",
    publisher: "Publisher",
    published: "Published",
    isbn13: "ISBN-13",
    author: "Author",
    editor: "Editor",
    coverDesigner: "Cover designer",
    illustrator: "Illustrator",
    translator: "Translator",
    collaborators: "Collaborators",
    contributors: "Contributors",
    binding: "Binding",
    trimSize: "Trim size",
    interior: "Interior",
    paper: "Paper",
    coverFinish: "Cover finish",
    spineWidth: "Spine width",
    weight: "Weight",
    printIsbn13: "Print ISBN-13",
    imprint: "Imprint",
    distribution: "Distribution",
    minutes: "min",
  },
  share: {
    sharedFrom: "Shared from",
    readerchainBy: "ReaderChain by AuthorChain",
    shareLink: "Share link",
  },
  login: {
    metaTitle: "Sign in",
    metaDescription:
      "Sign in to AuthorChain to publish books, manage your library, or access purchased titles on ReaderChain.",
    loading: "Loading…",
    signingIn: "Signing you in…",
    alreadyTitle: "You are already signed in",
    goDashboard: "Go to author dashboard →",
    goLibrary: "Go to reader library →",
    signInTitle: "Sign in to AuthorChain",
    signInDesc:
      "Log in with your email — no crypto wallet required. Buyers should use the same email they purchased with. A secure wallet is created for you automatically.",
    continueEmail: "Continue with email",
    notConfiguredTitle: "Sign-in not configured",
    notConfiguredDesc:
      "Authentication isn't set up in this environment. Set NEXT_PUBLIC_PRIVY_APP_ID and PRIVY_APP_SECRET to enable login.",
    backHome: "Back to home",
  },
  dashboard: {
    // Page titles (shown in the dashboard header)
    titleDashboard: "Dashboard",
    titleMyBooks: "My books",
    titleUpload: "Register a book",
    titleBookDetails: "Book details",
    titleSales: "Sales & royalties",
    titleAgents: "AI agents",
    uploadBook: "Upload book",

    // Dashboard home
    totalSales: "Total Sales",
    earningsUsdc: "Earnings (USDC)",
    booksSold: "Books Sold",
    activeReaders: "Active Readers",
    recentSales: "Recent sales",
    viewAllSales: "View all sales →",
    noSalesYet: "No sales yet.",
    colBook: "Book",
    colBuyer: "Buyer",
    colAmount: "Amount",
    colStatus: "Status",
    colDate: "Date",
    colProvider: "Provider",
    colAccess: "Access",
    topBook: "Top book",
    sold: "sold",
    viewDetails: "View details →",
    publishToSeeTop: "Publish a book to see your top seller.",
    aiActivity: "AI agent activity",
    aiActivityDesc: "Run the AI agents to generate marketing assets for your books.",
    openAiTools: "Open AI tools →",
    collectorEditions: "Collector Editions",
    collectorEditionsDesc:
      "Tokenized Collector Editions are coming soon — launch limited digital editions and premium book collections backed by verified proof-of-authorship.",

    // My Books
    tabActive: "Active",
    tabDrafts: "Drafts",
    tabPublished: "Published",
    tabArchived: "Archived",
    noBooksYet: "You haven't added any books yet.",
    noBooksYetDesc: "Upload your first manuscript to start generating marketing and selling.",
    uploadFirstBook: "Upload your first book",
    noBooksInView: "No books in this view.",
    archivedBadge: "Archived",
    manageRegister: "Manage & register proof →",
    viewPublicPage: "View public page →",
    publish: "Publish",
    unpublish: "Unpublish",
    archive: "Archive",
    restore: "Restore",
    confirmUnpublish:
      "Unpublish this book? It will be removed from ReaderChain and the public storefront.",
    confirmArchive:
      "Archive this book? It will be hidden from your active dashboard list and from public pages. Files, proof, and sales are kept.",

    // Status
    statusDraft: "Draft",
    statusPublished: "Published",
    statusActive: "Active",
    statusInactive: "Inactive",

    // Sales page
    salesIntro: "Transparent tracking of every sale and payout across card and USDC.",
    totalRevenue: "Total revenue",
    paidRoyalties: "Paid royalties",
    pendingPayouts: "Pending payouts",
    transactions: "Transactions",
    noSalesYetDesc: "No sales yet. Your transactions will appear here.",

    // Agents page
    agentsIntro:
      "Generate marketing and community assets from your books. Outputs are saved to your account.",
    liveConfigured: "Live provider configured",
    mockMode: "Mock mode (no API key)",
    previousOutputs: "Previous outputs",
    noOutputsYet: "No outputs yet. Generate something above and it will appear here.",
    viewAssets: "View assets",
    comingPhase2: "Coming in Phase 2",

    // Upload page
    uploadIntro:
      "Start with your book's details. It saves as a draft, then you'll continue on the book's page to upload the manuscript, add a cover, and register on-chain proof. You can publish it from My Books anytime.",
    nextStepManuscript:
      "Next step: after saving, you'll upload your manuscript (PDF or EPUB) on the book's page. It's stored privately — only its SHA-256 hash becomes your on-chain proof of authorship.",
    saveContinue: "Save & continue",

    // Manage page — sections
    manuscript: "Manuscript",
    noManuscript:
      "No manuscript uploaded yet. Upload a PDF or EPUB to generate a real file hash.",
    manuscriptRegisteredNote:
      "This book already has an on-chain proof. Uploading a new manuscript is disabled to protect the registered hash.",
    uploadManuscript: "Upload manuscript",
    replaceManuscript: "Replace manuscript",
    manuscriptSaved: "Manuscript saved. Hash updated.",
    coverSection: "Cover",
    frontCover: "Front cover",
    backCover: "Back cover",
    readerPreview: "Reader preview",
    uploadCover: "Upload cover",
    replaceCover: "Replace cover",
    uploadBackCover: "Upload back cover",
    replaceBackCover: "Replace back cover",
    uploadPreview: "Upload preview",
    replacePreview: "Replace preview",
    fileName: "File name",
    fileSize: "Size",
    storage: "Storage",
    proofHash: "Proof hash",
    realFile: "real file",
    mvpMetadata: "MVP metadata",
    usesRealHashNote: "real manuscript file (SHA-256)",
    usesMetadataNote: "Upload a manuscript above to register the real file hash instead of the metadata fallback.",

    // Proof panel
    registerProof: "Register Proof of Authorship",
    proofOnChain: "On-chain",
    proofPending: "Pending",
    proofFailed: "Failed",
    proofNotRegistered: "Not registered",
    proofLastFailed: "The last attempt failed. You can try again.",
    proofNotConfigured: "Blockchain proof registration is not fully configured. Please contact support.",
    proofAddWallet: "Add a wallet address to your author profile to register on-chain.",
    proofContract: "Contract",
    proofTransaction: "Transaction",
    proofDescription:
      "Every manuscript is hashed with SHA-256 and its proof is registered on-chain — a public, verifiable record of authorship. Only the hash goes on-chain, never the content.",

    // Referral card
    shareReferral: "Share & Referral Link",
    createReferralDesc: "Create a shareable link that tracks clicks and sales generated from it.",
    createReferralLink: "Create referral link",
    promoLink: "Promotional share link",
    promoLinkNote: "— best previews on social platforms",
    trackingLink: "Direct tracking link",
    trackingLinkNote: "— fast redirect (advanced)",
    clicks: "Clicks",
    checkouts: "Checkouts",
    salesCount: "Sales",
    deactivate: "Deactivate",
    reactivate: "Reactivate",
    referralAnalyticsNote:
      "Track clicks and sales generated from this link. Referral tracking is for analytics only — payouts are not enabled yet.",

    // Print settings form
    printEdition: "Print edition",
    printAvailableToggle: "Show print edition as available on the public book page",
    printPageCount: "Print page count",
    spineWidthAuto: "Spine width (auto)",
    spineNote: "Spine width is estimated from page count + paper and recalculated on save.",
    printPrice: "Print price (optional)",
    currency: "Currency",
    savePrintSettings: "Save print settings",
    optional: "optional",
    customWidth: "Custom width (in)",
    customHeight: "Custom height (in)",

    // Details / metadata forms
    saveDetails: "Save details",
    translatedPublicMetadata: "Translated public metadata",
    translatedPublicMetadataNote:
      "These translations appear on the public book page when visitors select this language. If left empty, AuthorChain shows the original book details.",
    translationLocale: "Language",
    translationTitle: "Translated title",
    translationSubtitle: "Translated subtitle",
    translationDescription: "Translated description",
    saveTranslation: "Save translation",
    removeTranslation: "Remove translation",
    saveDetailsCredits: "Save details & credits",
    savePublishingMetadata: "Save publishing metadata",
    generateBarcode: "Generate ISBN barcode",
    barcodeNeedsIsbn: "Save a valid ISBN-13 to enable barcode generation.",
    creditsSection: "Credits",
    audience: "Audience",
    whatLearn: "What readers will learn",
    topics: "Topics / keywords (comma-separated)",
    readingTimeMin: "Reading time (minutes)",
    isbn10: "ISBN-10 (optional)",
    publicationDate: "Publication date",
    thanksAck: "Thanks / acknowledgments",
    fTitle: "Title",
    fSubtitle: "Subtitle",
    fSubtitleOptional: "Subtitle (optional)",
    fDescription: "Description",
    fCategory: "Category",
    fPrice: "Price (USD)",
    fInteriorColor: "Interior color",
    fPaperType: "Paper",
    fWeightOz: "Weight (oz, optional)",
    fDistributor: "Distributor (optional)",
    availabilityNote: "Availability note (optional)",
    printNotes: "Print notes (optional, public)",

    saving: "Saving…",
    saved: "Saved.",
    uploading: "Uploading…",
  },
  errors: {
    uploadFailed: "Upload failed. Please try again.",
    uploadToStorageFailed: "Upload to storage failed. Please try again.",
    storageNotConfigured: "Storage is not configured. Please contact support.",
    couldNotSaveBook: "Could not save your book. Please try again.",
    titleRequired: "Title is required.",
    descriptionRequired: "Description is required.",
    validPrice: "Enter a valid price.",
    unsupportedManuscript: "Unsupported file type. Upload a PDF or EPUB.",
    chooseManuscript: "Choose a PDF or EPUB file to upload.",
    chooseImage: "Choose an image file (JPG, PNG, or WEBP).",
    choosePreview: "Choose a PDF preview file.",
    bookNotFound: "Book not found.",
    missingBook: "Missing book.",
    proofRegistered: "Proof registered successfully.",
    proofRegistrationFailed: "Proof registration failed.",
    selectLocale: "Select a supported locale.",
    translatedTitleRequired: "Translated title is required.",
    couldNotSaveTranslation: "Could not save the translation.",
    missingTranslation: "Missing translation.",
  },
  security: {
    fileScanPending: "File is being scanned.",
    fileScanClean: "File passed the security scan.",
    fileScanFailed: "File failed the security scan.",
    fileScanRejected: "Upload rejected for security reasons.",
    uploadRejectedSecurity: "Please upload a different file.",
    uploadSecurityScanUnavailable:
      "Security scanning is temporarily unavailable. Please try again shortly.",
  },
  legal: {
    privacyTitle: "AuthorChain Privacy Policy",
    privacyDesc:
      "How AuthorChain collects, uses, and protects personal and publishing data for authors and readers.",
    termsTitle: "AuthorChain Terms of Service",
    termsDesc: "Rules for using AuthorChain, ReaderChain, and related services.",
    cookiesTitle: "AuthorChain Cookie Policy",
    cookiesDesc:
      "How AuthorChain uses essential, preference, referral, and payment-related cookies.",
    securityTitle: "Security & Compliance for AuthorChain Publishing",
    securityDesc:
      "How AuthorChain protects accounts, manuscripts, payments, uploads, and platform integrity.",
    copyrightTitle: "AuthorChain Copyright & DMCA Policy",
    copyrightDesc:
      "Intellectual property expectations, proof-of-authorship limits, and how to report infringement.",
    acceptableUseTitle: "AuthorChain Acceptable Use Policy",
    acceptableUseDesc:
      "Content and conduct rules for authors, readers, and partners on AuthorChain and ReaderChain.",
    contactTitle: "Contact the AuthorChain Team",
    contactDesc:
      "Reach AuthorChain for author support, security reports, partnerships, privacy, and legal requests.",
    updated: "July 8, 2026",
    lastUpdatedLabel: "Last updated",
    legalLabel: "Legal",
    socialTitle: "Social profiles",
    supportForm: "support form",
    discordLabel: "Discord",
  },
};

export default en;

/** The dictionary shape every locale must implement (string-valued, so each
 *  locale provides its own copy while the key set stays enforced). */
export type Dictionary = typeof en;
