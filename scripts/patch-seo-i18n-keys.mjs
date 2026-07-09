import { readFileSync, writeFileSync } from "fs";

const locales = ["es", "fr", "it", "pt", "de", "ru", "ar-AE"];

const packs = {
  es: {
    viewBookDetails: "Ver detalles del libro →",
    jumpHowItWorks: "Cómo funciona",
    jumpProof: "Prueba de autoría",
    metaTitleHome: "AuthorChain | Publicación Web3 para autores independientes",
    metaDescHome:
      "AuthorChain ayuda a autores independientes a registrar prueba de autoría en cadena, preparar manuscritos listos para publicar, vender con Stripe y entregar libros verificados a lectores.",
    metaTitleExplore: "Descubre libros verificados en ReaderChain",
    metaDescExplore:
      "Explora libros de autores independientes con prueba de autoría en cadena, vistas previas seguras y acceso a la biblioteca ReaderChain.",
    loginMetaTitle: "Iniciar sesión",
    loginMetaDesc:
      "Inicia sesión en AuthorChain para publicar libros, gestionar tu biblioteca o acceder a títulos comprados en ReaderChain.",
    browseAllBooks: "Explorar todos los libros verificados",
    backToReaderchain: "← Volver a explorar ReaderChain",
  },
  de: {
    viewBookDetails: "Buchdetails ansehen →",
    jumpHowItWorks: "So funktioniert's",
    jumpProof: "Autorennachweis",
    metaTitleHome: "AuthorChain | Web3-Publishing für unabhängige Autoren",
    metaDescHome:
      "AuthorChain hilft unabhängigen Autoren, Autorennachweis on-chain zu registrieren, veröffentlichungsfertige Manuskripte vorzubereiten, direkt mit Stripe zu verkaufen und verifizierte Bücher an Leser zu liefern.",
    metaTitleExplore: "Verifizierte Bücher auf ReaderChain entdecken",
    metaDescExplore:
      "Entdecken Sie Bücher unabhängiger Autoren mit On-Chain-Autorennachweis, sicheren Vorschauen und ReaderChain-Bibliothekszugang.",
    loginMetaTitle: "Anmelden",
    loginMetaDesc:
      "Melden Sie sich bei AuthorChain an, um Bücher zu veröffentlichen, Ihre Bibliothek zu verwalten oder gekaufte Titel in ReaderChain zu öffnen.",
    browseAllBooks: "Alle verifizierten Bücher durchsuchen",
    backToReaderchain: "← Zurück zu ReaderChain entdecken",
  },
  fr: {
    viewBookDetails: "Voir la fiche du livre →",
    jumpHowItWorks: "Comment ça marche",
    jumpProof: "Preuve de paternité",
    metaTitleHome: "AuthorChain | Édition Web3 pour auteurs indépendants",
    metaDescHome:
      "AuthorChain aide les auteurs indépendants à enregistrer une preuve de paternité on-chain, préparer des manuscrits prêts à publier, vendre avec Stripe et livrer des livres vérifiés aux lecteurs.",
    metaTitleExplore: "Découvrir des livres vérifiés sur ReaderChain",
    metaDescExplore:
      "Parcourez des livres d'auteurs indépendants avec preuve de paternité on-chain, aperçus sécurisés et accès à la bibliothèque ReaderChain.",
    loginMetaTitle: "Connexion",
    loginMetaDesc:
      "Connectez-vous à AuthorChain pour publier des livres, gérer votre bibliothèque ou accéder à vos achats sur ReaderChain.",
    browseAllBooks: "Parcourir tous les livres vérifiés",
    backToReaderchain: "← Retour à l'exploration ReaderChain",
  },
  it: {
    viewBookDetails: "Vedi dettagli del libro →",
    jumpHowItWorks: "Come funziona",
    jumpProof: "Prova di paternità",
    metaTitleHome: "AuthorChain | Editoria Web3 per autori indipendenti",
    metaDescHome:
      "AuthorChain aiuta gli autori indipendenti a registrare la prova di paternità on-chain, preparare manoscritti pronti per la pubblicazione, vendere con Stripe e consegnare libri verificati ai lettori.",
    metaTitleExplore: "Scopri libri verificati su ReaderChain",
    metaDescExplore:
      "Esplora libri di autori indipendenti con prova di paternità on-chain, anteprime sicure e accesso alla biblioteca ReaderChain.",
    loginMetaTitle: "Accedi",
    loginMetaDesc:
      "Accedi ad AuthorChain per pubblicare libri, gestire la libreria o aprire i titoli acquistati su ReaderChain.",
    browseAllBooks: "Sfoglia tutti i libri verificati",
    backToReaderchain: "← Torna a esplorare ReaderChain",
  },
  pt: {
    viewBookDetails: "Ver detalhes do livro →",
    jumpHowItWorks: "Como funciona",
    jumpProof: "Prova de autoria",
    metaTitleHome: "AuthorChain | Publicação Web3 para autores independentes",
    metaDescHome:
      "A AuthorChain ajuda autores independentes a registar prova de autoria on-chain, preparar manuscritos prontos a publicar, vender com Stripe e entregar livros verificados aos leitores.",
    metaTitleExplore: "Descubra livros verificados no ReaderChain",
    metaDescExplore:
      "Explore livros de autores independentes com prova de autoria on-chain, pré-visualizações seguras e acesso à biblioteca ReaderChain.",
    loginMetaTitle: "Entrar",
    loginMetaDesc:
      "Entre na AuthorChain para publicar livros, gerir a sua biblioteca ou aceder a títulos comprados no ReaderChain.",
    browseAllBooks: "Ver todos os livros verificados",
    backToReaderchain: "← Voltar a explorar o ReaderChain",
  },
  ru: {
    viewBookDetails: "Подробнее о книге →",
    jumpHowItWorks: "Как это работает",
    jumpProof: "Подтверждение авторства",
    metaTitleHome: "AuthorChain | Web3-издательство для независимых авторов",
    metaDescHome:
      "AuthorChain помогает независимым авторам регистрировать подтверждение авторства on-chain, готовить рукописи к публикации, продавать через Stripe и доставлять проверенные книги читателям.",
    metaTitleExplore: "Открывайте проверенные книги на ReaderChain",
    metaDescExplore:
      "Каталог книг независимых авторов с on-chain подтверждением авторства, безопасными превью и доступом к библиотеке ReaderChain.",
    loginMetaTitle: "Вход",
    loginMetaDesc:
      "Войдите в AuthorChain, чтобы публиковать книги, управлять библиотекой или открывать купленные издания в ReaderChain.",
    browseAllBooks: "Смотреть все проверенные книги",
    backToReaderchain: "← Назад к каталогу ReaderChain",
  },
  "ar-AE": {
    viewBookDetails: "عرض تفاصيل الكتاب ←",
    jumpHowItWorks: "كيف يعمل",
    jumpProof: "إثبات التأليف",
    metaTitleHome: "AuthorChain | نشر Web3 للمؤلفين المستقلين",
    metaDescHome:
      "تساعد AuthorChain المؤلفين المستقلين على تسجيل إثبات التأليف على السلسلة، وتجهيز مخطوطات جاهزة للنشر، والبيع عبر Stripe، وتسليم كتب موثّقة للقرّاء.",
    metaTitleExplore: "اكتشف كتبًا موثّقة على ReaderChain",
    metaDescExplore:
      "تصفّح كتب مؤلفين مستقلين مع إثبات تأليف على السلسلة ومعاينات آمنة ووصول لمكتبة ReaderChain.",
    loginMetaTitle: "تسجيل الدخول",
    loginMetaDesc:
      "سجّل الدخول إلى AuthorChain للنشر وإدارة مكتبتك أو الوصول إلى العناوين المشتراة في ReaderChain.",
    browseAllBooks: "تصفّح كل الكتب الموثّقة",
    backToReaderchain: "→ العودة لاستكشاف ReaderChain",
  },
};

for (const loc of locales) {
  const path = `src/i18n/locales/${loc}.ts`;
  let c = readFileSync(path, "utf8");
  const p = packs[loc];

  if (!c.includes("viewBookDetails:")) {
    c = c.replace(
      /(startPublishing: "[^"]+",)/,
      `$1\n    viewBookDetails: ${JSON.stringify(p.viewBookDetails)},`,
    );
  }

  if (!c.includes("jumpHowItWorks:")) {
    c = c.replace(
      /(heroSubtitle:\s*\n\s*"[^"]+",)/,
      `$1\n    jumpHowItWorks: ${JSON.stringify(p.jumpHowItWorks)},\n    jumpProof: ${JSON.stringify(p.jumpProof)},`,
    );
    // single-line heroSubtitle
    if (!c.includes("jumpHowItWorks:")) {
      c = c.replace(
        /(heroSubtitle: "[^"]+",)/,
        `$1\n    jumpHowItWorks: ${JSON.stringify(p.jumpHowItWorks)},\n    jumpProof: ${JSON.stringify(p.jumpProof)},`,
      );
    }
  }

  // home meta
  c = c.replace(
    /(metaTitle: )"[^"]*",(\s*\n\s*metaDescription:\s*\n?\s*)"[^"]*"/,
    (_, a, b) => {
      // only first home occurrence — replace carefully by context
      return null;
    },
  );

  // Replace first metaTitle/metaDescription pair (home)
  let homeDone = false;
  c = c.replace(
    /metaTitle: "[^"]*",\s*\n\s*metaDescription:\s*\n?\s*"[^"]*"/,
    (match) => {
      if (!homeDone) {
        homeDone = true;
        return `metaTitle: ${JSON.stringify(p.metaTitleHome)},\n    metaDescription:\n      ${JSON.stringify(p.metaDescHome)}`;
      }
      // second is explore
      return `metaTitle: ${JSON.stringify(p.metaTitleExplore)},\n    metaDescription:\n      ${JSON.stringify(p.metaDescExplore)}`;
    },
  );

  if (!c.includes("metaTitle:") || !c.includes("login:")) {
    console.warn("structure unexpected", loc);
  }

  if (!c.includes("login: {\n    metaTitle:") && !c.includes("login: {\r\n    metaTitle:")) {
    c = c.replace(
      /(login: \{\s*\n)/,
      `$1    metaTitle: ${JSON.stringify(p.loginMetaTitle)},\n    metaDescription:\n      ${JSON.stringify(p.loginMetaDesc)},\n`,
    );
  }

  if (!c.includes("browseAllBooks:")) {
    c = c.replace(
      /(backToReaderchain: "[^"]*",)/,
      `backToReaderchain: ${JSON.stringify(p.backToReaderchain)},\n    browseAllBooks: ${JSON.stringify(p.browseAllBooks)},`,
    );
  }

  writeFileSync(path, c);
  console.log("patched", loc, {
    viewBook: c.includes("viewBookDetails:"),
    jump: c.includes("jumpHowItWorks:"),
    loginMeta: c.includes("metaTitle:") && c.includes("login:"),
    browse: c.includes("browseAllBooks:"),
  });
}
