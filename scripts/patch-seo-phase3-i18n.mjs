import { readFileSync, writeFileSync } from "fs";

const en = readFileSync("src/i18n/locales/en.ts", "utf8");
for (const k of [
  "seoIntro",
  "h1By",
  "verifiedProofBody",
  "viewOnExplorer",
  "aboutTitle",
  "linkProof",
]) {
  if (!en.includes(`${k}:`)) console.error("missing en", k);
}

const shortMeta = {
  es: "AuthorChain ayuda a autores independientes a probar autoría en cadena, vender con Stripe y entregar libros verificados a lectores.",
  de: "AuthorChain hilft unabhängigen Autoren, Autorenschaft on-chain zu beweisen, direkt mit Stripe zu verkaufen und verifizierte Bücher zu liefern.",
  fr: "AuthorChain aide les auteurs indépendants à prouver la paternité on-chain, vendre avec Stripe et livrer des livres vérifiés.",
  it: "AuthorChain aiuta autori indipendenti a provare la paternità on-chain, vendere con Stripe e consegnare libri verificati.",
  pt: "A AuthorChain ajuda autores independentes a provar autoria on-chain, vender com Stripe e entregar livros verificados.",
  ru: "AuthorChain помогает независимым авторам доказывать авторство on-chain, продавать через Stripe и доставлять проверенные книги.",
  "ar-AE":
    "تساعد AuthorChain المؤلفين المستقلين على إثبات التأليف على السلسلة والبيع عبر Stripe وتسليم كتب موثّقة.",
};

const legalTitles = {
  es: {
    privacyTitle: "Política de privacidad de AuthorChain",
    privacyDesc:
      "Cómo AuthorChain recopila, usa y protege datos personales y de publicación de autores y lectores.",
    termsTitle: "Términos del servicio de AuthorChain",
    cookiesTitle: "Política de cookies de AuthorChain",
    securityTitle: "Seguridad y cumplimiento de la publicación AuthorChain",
    copyrightTitle: "Política de copyright y DMCA de AuthorChain",
    acceptableUseTitle: "Política de uso aceptable de AuthorChain",
    contactTitle: "Contacta con el equipo de AuthorChain",
    contactDesc:
      "Contacta con AuthorChain para soporte de autores, seguridad, alianzas, privacidad y asuntos legales.",
    socialTitle: "Perfiles sociales",
  },
  de: {
    privacyTitle: "AuthorChain-Datenschutzerklärung",
    privacyDesc:
      "Wie AuthorChain personenbezogene und Publishing-Daten von Autoren und Lesern erhebt, nutzt und schützt.",
    termsTitle: "AuthorChain-Nutzungsbedingungen",
    cookiesTitle: "AuthorChain-Cookie-Richtlinie",
    securityTitle: "Sicherheit und Compliance für AuthorChain Publishing",
    copyrightTitle: "AuthorChain Urheberrecht & DMCA-Richtlinie",
    acceptableUseTitle: "AuthorChain Richtlinie zur zulässigen Nutzung",
    contactTitle: "Kontakt zum AuthorChain-Team",
    contactDesc:
      "Erreichen Sie AuthorChain für Autoren-Support, Sicherheitsmeldungen, Partnerschaften, Datenschutz und Rechtliches.",
    socialTitle: "Sociale Profile",
  },
  fr: {
    privacyTitle: "Politique de confidentialité AuthorChain",
    privacyDesc:
      "Comment AuthorChain collecte, utilise et protège les données personnelles et d'édition des auteurs et lecteurs.",
    termsTitle: "Conditions d'utilisation AuthorChain",
    cookiesTitle: "Politique de cookies AuthorChain",
    securityTitle: "Sécurité et conformité pour l'édition AuthorChain",
    copyrightTitle: "Politique copyright et DMCA AuthorChain",
    acceptableUseTitle: "Politique d'utilisation acceptable AuthorChain",
    contactTitle: "Contacter l'équipe AuthorChain",
    contactDesc:
      "Joindre AuthorChain pour le support auteurs, la sécurité, les partenariats, la confidentialité et le juridique.",
    socialTitle: "Profils sociaux",
  },
  it: {
    privacyTitle: "Informativa sulla privacy di AuthorChain",
    privacyDesc:
      "Come AuthorChain raccoglie, usa e protegge i dati personali e di pubblicazione di autori e lettori.",
    termsTitle: "Termini di servizio di AuthorChain",
    cookiesTitle: "Cookie policy di AuthorChain",
    securityTitle: "Sicurezza e conformità per l'editoria AuthorChain",
    copyrightTitle: "Copyright e DMCA di AuthorChain",
    acceptableUseTitle: "Politica di uso accettabile di AuthorChain",
    contactTitle: "Contatta il team AuthorChain",
    contactDesc:
      "Contatta AuthorChain per supporto autori, segnalazioni di sicurezza, partnership, privacy e legale.",
    socialTitle: "Profili social",
  },
  pt: {
    privacyTitle: "Política de privacidade da AuthorChain",
    privacyDesc:
      "Como a AuthorChain recolhe, usa e protege dados pessoais e de publicação de autores e leitores.",
    termsTitle: "Termos de serviço da AuthorChain",
    cookiesTitle: "Política de cookies da AuthorChain",
    securityTitle: "Segurança e conformidade da publicação AuthorChain",
    copyrightTitle: "Copyright e DMCA da AuthorChain",
    acceptableUseTitle: "Política de uso aceitável da AuthorChain",
    contactTitle: "Contacte a equipa AuthorChain",
    contactDesc:
      "Contacte a AuthorChain para suporte a autores, segurança, parcerias, privacidade e assuntos legais.",
    socialTitle: "Perfis sociais",
  },
  ru: {
    privacyTitle: "Политика конфиденциальности AuthorChain",
    privacyDesc:
      "Как AuthorChain собирает, использует и защищает персональные и издательские данные авторов и читателей.",
    termsTitle: "Условия использования AuthorChain",
    cookiesTitle: "Политика cookie AuthorChain",
    securityTitle: "Безопасность и compliance публикации AuthorChain",
    copyrightTitle: "Авторские права и DMCA AuthorChain",
    acceptableUseTitle: "Правила допустимого использования AuthorChain",
    contactTitle: "Связаться с командой AuthorChain",
    contactDesc:
      "Свяжитесь с AuthorChain по вопросам поддержки авторов, безопасности, партнёрств, конфиденциальности и права.",
    socialTitle: "Соцпрофили",
  },
  "ar-AE": {
    privacyTitle: "سياسة خصوصية AuthorChain",
    privacyDesc:
      "كيف تجمع AuthorChain بيانات المؤلفين والقرّاء الشخصية وبيانات النشر وتستخدمها وتحميها.",
    termsTitle: "شروط خدمة AuthorChain",
    cookiesTitle: "سياسة ملفات تعريف الارتباط لـ AuthorChain",
    securityTitle: "الأمان والامتثال لنشر AuthorChain",
    copyrightTitle: "سياسة حقوق النشر وDMCA لـ AuthorChain",
    acceptableUseTitle: "سياسة الاستخدام المقبول لـ AuthorChain",
    contactTitle: "تواصل مع فريق AuthorChain",
    contactDesc:
      "تواصل مع AuthorChain لدعم المؤلفين وتقارير الأمان والشراكات والخصوصية والطلبات القانونية.",
    socialTitle: "ملفات التواصل",
  },
};

// Slice explore Phase3 from EN
const aboutIdx = en.indexOf("    aboutTitle:");
const bookIdx = en.indexOf("\n  book: {");
const explorePhase3 = en.slice(aboutIdx, bookIdx);

const bookInject = `
    verifiedProofBody: "“{title}” has a registered manuscript fingerprint on {network}. Only the SHA-256 hash is on-chain — never the full manuscript file.",
    viewOnExplorer: "View transaction on BaseScan",
    seoIntro: "“{title}” by {author} is available on AuthorChain with optional verified authorship proof, secure reader access, and protected delivery after purchase.",
    h1By: "{title} by {author}",
`;

function setKey(c, key, value) {
  const re = new RegExp(`(${key}:\\s*)"[^"]*"`);
  if (re.test(c)) return c.replace(re, `$1${JSON.stringify(value)}`);
  const re2 = new RegExp(`(${key}:\\s*\\n\\s*)"[^"]*"`);
  if (re2.test(c)) return c.replace(re2, `$1${JSON.stringify(value)}`);
  return c;
}

for (const loc of Object.keys(shortMeta)) {
  let c = readFileSync(`src/i18n/locales/${loc}.ts`, "utf8");

  // First metaDescription under home
  let n = 0;
  c = c.replace(/metaDescription:\s*\n?\s*"[^"]*"/g, (m) => {
    n += 1;
    if (n === 1) {
      return `metaDescription:\n      ${JSON.stringify(shortMeta[loc])}`;
    }
    return m;
  });

  for (const [k, v] of Object.entries(legalTitles[loc])) {
    c = setKey(c, k, v);
  }

  if (!c.includes("aboutTitle:")) {
    if (!c.includes("soonCollectorDesc:")) {
      console.warn(loc, "missing soonCollectorDesc");
    } else {
      c = c.replace(
        /(soonCollectorDesc:\s*\n?\s*"[^"]*",)/,
        `$1\n${explorePhase3}`,
      );
    }
  }

  if (!c.includes("seoIntro:")) {
    if (c.includes("verifiedProofTitle:")) {
      c = c.replace(
        /(verifiedProofTitle: "[^"]*",)/,
        `$1${bookInject}`,
      );
    } else {
      console.warn(loc, "no verifiedProofTitle");
    }
  }

  // printComingDesc with title placeholder (EN text ok)
  if (c.includes("printComingDesc:") && !c.includes("{title}")) {
    c = setKey(
      c,
      "printComingDesc",
      'A print edition for “{title}” is not listed yet. Authors can publish print specs from Studio when ready.',
    );
  }

  writeFileSync(`src/i18n/locales/${loc}.ts`, c);
  console.log(loc, {
    about: c.includes("aboutTitle:"),
    seo: c.includes("seoIntro:"),
    short: c.includes(shortMeta[loc].slice(0, 40)),
  });
}
