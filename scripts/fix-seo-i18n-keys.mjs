import { readFileSync, writeFileSync } from "fs";

const packs = {
  es: {
    homeTitle: "AuthorChain | Publicación Web3 para autores independientes",
    homeDesc:
      "AuthorChain ayuda a autores independientes a registrar prueba de autoría en cadena, preparar manuscritos listos para publicar, vender con Stripe y entregar libros verificados a lectores.",
    exploreTitle: "Descubre libros verificados en ReaderChain",
    exploreDesc:
      "Explora libros de autores independientes con prueba de autoría en cadena, vistas previas seguras y acceso a la biblioteca ReaderChain.",
  },
  de: {
    homeTitle: "AuthorChain | Web3-Publishing für unabhängige Autoren",
    homeDesc:
      "AuthorChain hilft unabhängigen Autoren, Autorennachweis on-chain zu registrieren, veröffentlichungsfertige Manuskripte vorzubereiten, direkt mit Stripe zu verkaufen und verifizierte Bücher an Leser zu liefern.",
    exploreTitle: "Verifizierte Bücher auf ReaderChain entdecken",
    exploreDesc:
      "Entdecken Sie Bücher unabhängiger Autoren mit On-Chain-Autorennachweis, sicheren Vorschauen und ReaderChain-Bibliothekszugang.",
  },
  fr: {
    homeTitle: "AuthorChain | Édition Web3 pour auteurs indépendants",
    homeDesc:
      "AuthorChain aide les auteurs indépendants à enregistrer une preuve de paternité on-chain, préparer des manuscrits prêts à publier, vendre avec Stripe et livrer des livres vérifiés aux lecteurs.",
    exploreTitle: "Découvrir des livres vérifiés sur ReaderChain",
    exploreDesc:
      "Parcourez des livres d'auteurs indépendants avec preuve de paternité on-chain, aperçus sécurisés et accès à la bibliothèque ReaderChain.",
  },
  it: {
    homeTitle: "AuthorChain | Editoria Web3 per autori indipendenti",
    homeDesc:
      "AuthorChain aiuta gli autori indipendenti a registrare la prova di paternità on-chain, preparare manoscritti pronti per la pubblicazione, vendere con Stripe e consegnare libri verificati ai lettori.",
    exploreTitle: "Scopri libri verificati su ReaderChain",
    exploreDesc:
      "Esplora libri di autori indipendenti con prova di paternità on-chain, anteprime sicure e accesso alla biblioteca ReaderChain.",
  },
  pt: {
    homeTitle: "AuthorChain | Publicação Web3 para autores independentes",
    homeDesc:
      "A AuthorChain ajuda autores independentes a registar prova de autoria on-chain, preparar manuscritos prontos a publicar, vender com Stripe e entregar livros verificados aos leitores.",
    exploreTitle: "Descubra livros verificados no ReaderChain",
    exploreDesc:
      "Explore livros de autores independentes com prova de autoria on-chain, pré-visualizações seguras e acesso à biblioteca ReaderChain.",
  },
  ru: {
    homeTitle: "AuthorChain | Web3-издательство для независимых авторов",
    homeDesc:
      "AuthorChain помогает независимым авторам регистрировать подтверждение авторства on-chain, готовить рукописи к публикации, продавать через Stripe и доставлять проверенные книги читателям.",
    exploreTitle: "Открывайте проверенные книги на ReaderChain",
    exploreDesc:
      "Каталог книг независимых авторов с on-chain подтверждением авторства, безопасными превью и доступом к библиотеке ReaderChain.",
  },
  "ar-AE": {
    homeTitle: "AuthorChain | نشر Web3 للمؤلفين المستقلين",
    homeDesc:
      "تساعد AuthorChain المؤلفين المستقلين على تسجيل إثبات التأليف على السلسلة، وتجهيز مخطوطات جاهزة للنشر، والبيع عبر Stripe، وتسليم كتب موثّقة للقرّاء.",
    exploreTitle: "اكتشف كتبًا موثّقة على ReaderChain",
    exploreDesc:
      "تصفّح كتب مؤلفين مستقلين مع إثبات تأليف على السلسلة ومعاينات آمنة ووصول لمكتبة ReaderChain.",
  },
};

for (const [loc, p] of Object.entries(packs)) {
  const path = `src/i18n/locales/${loc}.ts`;
  let c = readFileSync(path, "utf8");

  // Fix broken home start: `home: {\n    null,` → proper meta
  c = c.replace(
    /home: \{\s*\n\s*null,/,
    `home: {\n    metaTitle: ${JSON.stringify(p.homeTitle)},\n    metaDescription:\n      ${JSON.stringify(p.homeDesc)},`,
  );

  // Fix explore meta that received home content (starts with AuthorChain |)
  c = c.replace(
    /explore: \{\s*\n\s*metaTitle: "[^"]*",\s*\n\s*metaDescription:\s*\n\s*"[^"]*",/,
    `explore: {\n    metaTitle: ${JSON.stringify(p.exploreTitle)},\n    metaDescription:\n      ${JSON.stringify(p.exploreDesc)},`,
  );

  writeFileSync(path, c);
  const okHome = c.includes("home: {\n    metaTitle:") || c.includes(`home: {\r\n    metaTitle:`);
  const hasNull = c.includes("null,");
  console.log(loc, { okHome: /home: \{\s*metaTitle:/.test(c), hasNull });
}
