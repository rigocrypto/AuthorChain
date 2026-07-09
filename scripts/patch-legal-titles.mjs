import { readFileSync, writeFileSync } from "fs";

const titles = {
  es: {
    privacyTitle: "Política de privacidad",
    privacyDesc:
      "Cómo AuthorChain recopila, usa y protege datos personales y de publicación.",
    termsTitle: "Términos del servicio",
    termsDesc: "Normas de uso de AuthorChain, ReaderChain y servicios relacionados.",
    cookiesTitle: "Política de cookies",
    cookiesDesc: "Cómo usamos cookies y tecnologías similares.",
    securityTitle: "Seguridad",
    securityDesc:
      "Cómo protegemos cuentas, manuscritos, pagos e integridad de la plataforma.",
    copyrightTitle: "Copyright y DMCA",
    copyrightDesc:
      "Expectativas de propiedad intelectual y cómo reportar infracciones.",
    acceptableUseTitle: "Uso aceptable",
    acceptableUseDesc:
      "Normas de contenido y conducta para autores, lectores y partners.",
    contactTitle: "Contacto",
    contactDesc:
      "Cómo contactar a AuthorChain para soporte, privacidad y asuntos legales.",
    updated: "8 de julio de 2026",
  },
  de: {
    privacyTitle: "Datenschutzerklärung",
    privacyDesc:
      "Wie AuthorChain personenbezogene und Publishing-Daten erhebt, nutzt und schützt.",
    termsTitle: "Nutzungsbedingungen",
    termsDesc:
      "Regeln für die Nutzung von AuthorChain, ReaderChain und verwandten Diensten.",
    cookiesTitle: "Cookie-Richtlinie",
    cookiesDesc: "Wie wir Cookies und ähnliche Technologien verwenden.",
    securityTitle: "Sicherheit",
    securityDesc:
      "Wie wir Konten, Manuskripte, Zahlungen und die Plattformintegrität schützen.",
    copyrightTitle: "Urheberrecht und DMCA",
    copyrightDesc:
      "Erwartungen an geistiges Eigentum und Meldung von Verletzungen.",
    acceptableUseTitle: "Zulässige Nutzung",
    acceptableUseDesc:
      "Inhalts- und Verhaltensregeln für Autoren, Leser und Partner.",
    contactTitle: "Kontakt",
    contactDesc:
      "So erreichen Sie AuthorChain für Support, Datenschutz und rechtliche Anfragen.",
    updated: "8. Juli 2026",
  },
  fr: {
    privacyTitle: "Politique de confidentialité",
    privacyDesc:
      "Comment AuthorChain collecte, utilise et protège les données personnelles et d'édition.",
    termsTitle: "Conditions d'utilisation",
    termsDesc:
      "Règles d'utilisation d'AuthorChain, ReaderChain et services associés.",
    cookiesTitle: "Politique de cookies",
    cookiesDesc: "Comment nous utilisons les cookies et technologies similaires.",
    securityTitle: "Sécurité",
    securityDesc:
      "Comment nous protégeons les comptes, manuscrits, paiements et l'intégrité de la plateforme.",
    copyrightTitle: "Copyright et DMCA",
    copyrightDesc:
      "Attentes en propriété intellectuelle et signalement des infractions.",
    acceptableUseTitle: "Utilisation acceptable",
    acceptableUseDesc:
      "Règles de contenu et de conduite pour auteurs, lecteurs et partenaires.",
    contactTitle: "Contact",
    contactDesc:
      "Comment joindre AuthorChain pour le support, la confidentialité et le juridique.",
    updated: "8 juillet 2026",
  },
  it: {
    privacyTitle: "Informativa sulla privacy",
    privacyDesc:
      "Come AuthorChain raccoglie, usa e protegge i dati personali e di pubblicazione.",
    termsTitle: "Termini di servizio",
    termsDesc: "Regole d'uso di AuthorChain, ReaderChain e servizi correlati.",
    cookiesTitle: "Cookie policy",
    cookiesDesc: "Come usiamo cookie e tecnologie simili.",
    securityTitle: "Sicurezza",
    securityDesc:
      "Come proteggiamo account, manoscritti, pagamenti e integrità della piattaforma.",
    copyrightTitle: "Copyright e DMCA",
    copyrightDesc:
      "Aspettative sulla proprietà intellettuale e come segnalare violazioni.",
    acceptableUseTitle: "Uso accettabile",
    acceptableUseDesc:
      "Regole di contenuto e condotta per autori, lettori e partner.",
    contactTitle: "Contatti",
    contactDesc:
      "Come contattare AuthorChain per supporto, privacy e questioni legali.",
    updated: "8 luglio 2026",
  },
  pt: {
    privacyTitle: "Política de privacidade",
    privacyDesc:
      "Como a AuthorChain recolhe, usa e protege dados pessoais e de publicação.",
    termsTitle: "Termos de serviço",
    termsDesc:
      "Regras de uso do AuthorChain, ReaderChain e serviços relacionados.",
    cookiesTitle: "Política de cookies",
    cookiesDesc: "Como usamos cookies e tecnologias semelhantes.",
    securityTitle: "Segurança",
    securityDesc:
      "Como protegemos contas, manuscritos, pagamentos e a integridade da plataforma.",
    copyrightTitle: "Copyright e DMCA",
    copyrightDesc:
      "Expectativas de propriedade intelectual e como reportar infrações.",
    acceptableUseTitle: "Uso aceitável",
    acceptableUseDesc:
      "Regras de conteúdo e conduta para autores, leitores e parceiros.",
    contactTitle: "Contacto",
    contactDesc:
      "Como contactar a AuthorChain para suporte, privacidade e assuntos legais.",
    updated: "8 de julho de 2026",
  },
  ru: {
    privacyTitle: "Политика конфиденциальности",
    privacyDesc:
      "Как AuthorChain собирает, использует и защищает персональные и издательские данные.",
    termsTitle: "Условия использования",
    termsDesc:
      "Правила использования AuthorChain, ReaderChain и связанных сервисов.",
    cookiesTitle: "Политика cookie",
    cookiesDesc: "Как мы используем cookie и похожие технологии.",
    securityTitle: "Безопасность",
    securityDesc:
      "Как мы защищаем аккаунты, рукописи, платежи и целостность платформы.",
    copyrightTitle: "Авторские права и DMCA",
    copyrightDesc:
      "Ожидания по интеллектуальной собственности и как сообщать о нарушениях.",
    acceptableUseTitle: "Правила использования",
    acceptableUseDesc:
      "Правила контента и поведения для авторов, читателей и партнёров.",
    contactTitle: "Контакты",
    contactDesc:
      "Как связаться с AuthorChain по вопросам поддержки, конфиденциальности и права.",
    updated: "8 июля 2026",
  },
  "ar-AE": {
    privacyTitle: "سياسة الخصوصية",
    privacyDesc:
      "كيف تجمع AuthorChain البيانات الشخصية وبيانات النشر وتستخدمها وتحميها.",
    termsTitle: "شروط الخدمة",
    termsDesc: "قواعد استخدام AuthorChain وReaderChain والخدمات ذات الصلة.",
    cookiesTitle: "سياسة ملفات تعريف الارتباط",
    cookiesDesc: "كيف نستخدم ملفات تعريف الارتباط والتقنيات المشابهة.",
    securityTitle: "الأمان",
    securityDesc: "كيف نحمي الحسابات والمخطوطات والمدفوعات وسلامة المنصة.",
    copyrightTitle: "حقوق النشر وDMCA",
    copyrightDesc: "توقعات الملكية الفكرية وكيفية الإبلاغ عن الانتهاكات.",
    acceptableUseTitle: "الاستخدام المقبول",
    acceptableUseDesc: "قواعد المحتوى والسلوك للمؤلفين والقرّاء والشركاء.",
    contactTitle: "تواصل",
    contactDesc:
      "كيف تتواصل مع AuthorChain للدعم والخصوصية والطلبات القانونية.",
    updated: "8 يوليو 2026",
  },
};

for (const [loc, map] of Object.entries(titles)) {
  const path = `src/i18n/locales/${loc}.ts`;
  let c = readFileSync(path, "utf8");
  for (const [k, v] of Object.entries(map)) {
    const re = new RegExp(`(${k}:\\s*)"[^"]*"`);
    if (!re.test(c)) {
      console.warn("missing", loc, k);
      continue;
    }
    c = c.replace(re, `$1${JSON.stringify(v)}`);
  }
  writeFileSync(path, c);
  console.log("ok", loc);
}
