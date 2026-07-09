/**
 * Inject SEO Phase 2 home dictionary keys into non-EN locales.
 * Replaces from proofCardNote through agentsTitle with expanded content.
 */
import { readFileSync, writeFileSync } from "fs";

/** @type {Record<string, Record<string, string>>} */
const packs = {
  es: {
    step4d: "Sigue las ventas en Studio y haz crecer tu audiencia.",
    proofHowTitle: "Cómo funciona la prueba de autoría en cadena",
    proofHowLead:
      "AuthorChain es una plataforma de publicación Web3 que registra la procedencia del manuscrito sin poner tu archivo privado en una cadena pública.",
    proofHow1t: "Hashear el manuscrito",
    proofHow1d:
      "Al registrar la prueba, AuthorChain calcula una huella SHA-256 del archivo de manuscrito que subiste. Esa huella identifica ese contenido exacto.",
    proofHow2t: "Registrar la prueba en Base",
    proofHow2d:
      "Solo el hash (y metadatos de prueba relacionados) se registra mediante el registry de AuthorChain en Base. Lectores y terceros pueden verificar la huella frente a un registro público.",
    proofHow3t: "Mantener el manuscrito privado",
    proofHow3d:
      "El manuscrito completo no se almacena en cadena. Los archivos privados permanecen en almacenamiento protegido y se entregan con acceso autorizado tras la compra.",
    proofHow4t: "Mostrar insignia verificada",
    proofHow4d:
      "Los libros con registro exitoso pueden mostrar prueba de autoría verificada en páginas públicas — una señal de procedencia con marca de tiempo, no un título legal.",
    proofHowNote:
      "La prueba de autoría en cadena es evidencia técnica de la huella de un manuscrito en un momento dado. No es registro de copyright gubernamental, marca ni garantía de ejecutabilidad en tribunales.",
    whyProofTitle: "Por qué los autores independientes necesitan prueba",
    whyProofLead:
      "La publicación independiente avanza rápido: borradores, edición asistida por IA, colaboradores y lanzamientos. La procedencia ayuda a documentar qué tenías y cuándo.",
    whyProof1t: "Plagio y disputas de copia",
    whyProof1d:
      "Un registro público de hash te da una huella clara para comparar si alguien reclama tu obra o circula un archivo casi idéntico.",
    whyProof2t: "Historial de propiedad del manuscrito",
    whyProof2d:
      "Coautores, editores y freelancers cambian. La prueba con marca de tiempo ayuda a mostrar qué versión controlabas antes del lanzamiento.",
    whyProof3t: "Documentar flujos con IA",
    whyProof3d:
      "Muchos autores usan herramientas de IA. La prueba sigue huellando el archivo que registras — tú sigues responsable de originalidad y derechos.",
    whyProof4t: "Evidencia antes del lanzamiento público",
    whyProof4d:
      "Registrar la prueba antes de una distribución amplia crea un punto de referencia anterior en cadena para la procedencia del manuscrito.",
    salesTitle: "Ventas directas y entrega de libros verificados",
    salesLead:
      "AuthorChain conecta el checkout con una biblioteca de lector protegida para que el comprador acceda sin intercambiar archivos por correo.",
    sales1t: "Checkout con Stripe",
    sales1d:
      "Los lectores pueden comprar con tarjeta mediante Stripe cuando los pagos están configurados. Pensado para autores independientes que venden libros digitales directamente.",
    sales2t: "Derecho de acceso tras la compra",
    sales2d:
      "Una compra exitosa crea acceso del lector a ese título. El entitlement — no un enlace público — desbloquea la biblioteca.",
    sales3t: "Biblioteca ReaderChain protegida",
    sales3d:
      "Los títulos comprados aparecen en la biblioteca segura del lector. El acceso se vincula al comprador autenticado.",
    sales4t: "Visibilidad de ventas para autores",
    sales4d:
      "AuthorChain Studio muestra la actividad de ventas. Los plazos y métodos de cobro dependen de tu configuración de Stripe u otros pagos — AuthorChain no inventa depósitos bancarios instantáneos garantizados.",
    aiWorkflowTitle: "Publicación asistida por IA — con el autor al mando",
    aiWorkflowLead:
      "Las herramientas de IA del Studio aceleran blurbs, planes de lanzamiento y copy de comunidad. Apoyan tu flujo; no sustituyen tu criterio ni las reglas de otras tiendas.",
    aiWorkflow1t: "Asistir, no reemplazar",
    aiWorkflow1d:
      "Los agentes borran activos de marketing y planificación a partir de los datos del libro. Tú revisas, editas y decides qué publicar.",
    aiWorkflow2t: "Tú eres responsable",
    aiWorkflow2d:
      "Sigues siendo responsable de exactitud, derechos y afirmaciones sobre tu libro — también al exportar a otras plataformas.",
    aiWorkflow3t: "Solo posicionamiento listo para publicar",
    aiWorkflow3d:
      "AuthorChain te ayuda a preparar y vender una experiencia de manuscrito listo para publicar. No garantiza aceptación en Amazon KDP, Apple Books ni otras tiendas.",
    aiWorkflowNote:
      "No prometemos eludir detectores de IA, “pasar filtros” ni certificar calidad editorial. Publicación asistida por IA significa herramientas opcionales de productividad en AuthorChain Studio.",
    securityTitle: "Seguridad, privacidad y postura de cumplimiento",
    securityLead:
      "Un stack de publicación Web3 sigue necesitando seguridad de producto: almacenamiento privado, descargas autorizadas y un lenguaje preciso sobre lo que hay en la cadena.",
    security1t: "Almacenamiento privado del manuscrito",
    security1d:
      "Manuscritos y activos viven en almacenamiento de objetos privado, no en el estado público de la cadena.",
    security2t: "Descargas protegidas",
    security2d:
      "Las rutas de descarga del lector comprueban el entitlement antes de servir archivos. Las páginas públicas muestran portadas y previews que eliges exponer.",
    security3t: "Análisis de malware en subidas",
    security3d:
      "Cuando el análisis está configurado en producción, las nuevas subidas se escanean en el finalize antes de la aceptación duradera. Archivos infectados o no escaneables se rechazan con mensajes seguros.",
    security4t: "Privacidad del hash de prueba",
    security4d:
      "El registro en cadena trata de una huella hash y metadatos de prueba. No publica el texto completo del manuscrito en Base.",
    diffTitle: "Qué hace diferente a AuthorChain",
    diffLead:
      "La mayoría de herramientas resuelven una parte. AuthorChain combina prueba de autoría en cadena, ventas directas y entrega verificada en un flujo para autores independientes.",
    diff1t: "Portales de autoedición tradicionales",
    diff1d:
      "Se centran en distribución y logística de impresión. Rara vez ofrecen un hash de prueba portable del manuscrito que tenías antes del lanzamiento.",
    diff2t: "Almacenamiento simple en la nube",
    diff2d:
      "Las carpetas guardan archivos en privado pero no crean entitlement de comprador, biblioteca de lector ni huella verificable de autoría.",
    diff3t: "Marketplaces genéricos",
    diff3d:
      "Optimizan descubrimiento y checkout, pero la procedencia del manuscrito y el registro de prueba controlado por el autor suelen quedar fuera del producto.",
    diff4t: "La combinación AuthorChain",
    diff4d:
      "Sube y prepara un manuscrito, registra prueba de autoría en cadena, vende directamente y entrega con una biblioteca de lector protegida — con herramientas de IA cuando quieras.",
    faqTitle: "Preguntas frecuentes",
    faqSubtitle:
      "Respuestas claras para autores independientes que evalúan una plataforma de publicación Web3.",
    faq1q: "¿AuthorChain almacena mi manuscrito en la cadena?",
    faq1a:
      "No. AuthorChain registra un hash SHA-256 (huella) del manuscrito como prueba de autoría. El manuscrito completo permanece en almacenamiento privado y no se publica en la blockchain.",
    faq2q: "¿AuthorChain es lo mismo que un registro de copyright?",
    faq2a:
      "No. La prueba de autoría en cadena es un registro técnico de procedencia. No es un depósito en una oficina de copyright ni asesoramiento legal sobre tus derechos.",
    faq3q: "¿Pueden los lectores acceder a un libro sin comprarlo?",
    faq3a:
      "Las páginas públicas pueden mostrar marketing, portadas y previews opcionales. El acceso al manuscrito de títulos de pago se entrega mediante entitlement tras una compra exitosa (u otro acceso que configures).",
    faq4q: "¿Pueden los autores traducir los metadatos del libro?",
    faq4a:
      "Sí. AuthorChain Studio admite metadatos localizados para que títulos, subtítulos y descripciones se muestren en el idioma del lector cuando aportas traducciones.",
    faq5q: "¿AuthorChain garantiza la aprobación de KDP?",
    faq5a:
      "No. AuthorChain no garantiza la aceptación, ranking ni resultados de políticas de Amazon KDP (ni de ninguna tienda). Te ayuda a preparar y vender en AuthorChain/ReaderChain; las tiendas de terceros tienen sus propias reglas.",
    faq6q: "¿Cómo funciona la prueba de autoría?",
    faq6a:
      "Subes un manuscrito, AuthorChain lo hashea con SHA-256 y un registro exitoso deja esa prueba en Base mediante el registry de AuthorChain. Los lectores pueden ver una insignia verificada cuando la prueba está registrada — sin que tu archivo privado viva en la cadena.",
  },
};

// Use Spanish pack as base for other Latin languages with overrides via EN structure filled by machine-quality translations below.
function block(p) {
  return `
    proofHowTitle: ${JSON.stringify(p.proofHowTitle)},
    proofHowLead: ${JSON.stringify(p.proofHowLead)},
    proofHow1t: ${JSON.stringify(p.proofHow1t)},
    proofHow1d: ${JSON.stringify(p.proofHow1d)},
    proofHow2t: ${JSON.stringify(p.proofHow2t)},
    proofHow2d: ${JSON.stringify(p.proofHow2d)},
    proofHow3t: ${JSON.stringify(p.proofHow3t)},
    proofHow3d: ${JSON.stringify(p.proofHow3d)},
    proofHow4t: ${JSON.stringify(p.proofHow4t)},
    proofHow4d: ${JSON.stringify(p.proofHow4d)},
    proofHowNote: ${JSON.stringify(p.proofHowNote)},
    whyProofTitle: ${JSON.stringify(p.whyProofTitle)},
    whyProofLead: ${JSON.stringify(p.whyProofLead)},
    whyProof1t: ${JSON.stringify(p.whyProof1t)},
    whyProof1d: ${JSON.stringify(p.whyProof1d)},
    whyProof2t: ${JSON.stringify(p.whyProof2t)},
    whyProof2d: ${JSON.stringify(p.whyProof2d)},
    whyProof3t: ${JSON.stringify(p.whyProof3t)},
    whyProof3d: ${JSON.stringify(p.whyProof3d)},
    whyProof4t: ${JSON.stringify(p.whyProof4t)},
    whyProof4d: ${JSON.stringify(p.whyProof4d)},
    salesTitle: ${JSON.stringify(p.salesTitle)},
    salesLead: ${JSON.stringify(p.salesLead)},
    sales1t: ${JSON.stringify(p.sales1t)},
    sales1d: ${JSON.stringify(p.sales1d)},
    sales2t: ${JSON.stringify(p.sales2t)},
    sales2d: ${JSON.stringify(p.sales2d)},
    sales3t: ${JSON.stringify(p.sales3t)},
    sales3d: ${JSON.stringify(p.sales3d)},
    sales4t: ${JSON.stringify(p.sales4t)},
    sales4d: ${JSON.stringify(p.sales4d)},
    aiWorkflowTitle: ${JSON.stringify(p.aiWorkflowTitle)},
    aiWorkflowLead: ${JSON.stringify(p.aiWorkflowLead)},
    aiWorkflow1t: ${JSON.stringify(p.aiWorkflow1t)},
    aiWorkflow1d: ${JSON.stringify(p.aiWorkflow1d)},
    aiWorkflow2t: ${JSON.stringify(p.aiWorkflow2t)},
    aiWorkflow2d: ${JSON.stringify(p.aiWorkflow2d)},
    aiWorkflow3t: ${JSON.stringify(p.aiWorkflow3t)},
    aiWorkflow3d: ${JSON.stringify(p.aiWorkflow3d)},
    aiWorkflowNote: ${JSON.stringify(p.aiWorkflowNote)},
    securityTitle: ${JSON.stringify(p.securityTitle)},
    securityLead: ${JSON.stringify(p.securityLead)},
    security1t: ${JSON.stringify(p.security1t)},
    security1d: ${JSON.stringify(p.security1d)},
    security2t: ${JSON.stringify(p.security2t)},
    security2d: ${JSON.stringify(p.security2d)},
    security3t: ${JSON.stringify(p.security3t)},
    security3d: ${JSON.stringify(p.security3d)},
    security4t: ${JSON.stringify(p.security4t)},
    security4d: ${JSON.stringify(p.security4d)},
    diffTitle: ${JSON.stringify(p.diffTitle)},
    diffLead: ${JSON.stringify(p.diffLead)},
    diff1t: ${JSON.stringify(p.diff1t)},
    diff1d: ${JSON.stringify(p.diff1d)},
    diff2t: ${JSON.stringify(p.diff2t)},
    diff2d: ${JSON.stringify(p.diff2d)},
    diff3t: ${JSON.stringify(p.diff3t)},
    diff3d: ${JSON.stringify(p.diff3d)},
    diff4t: ${JSON.stringify(p.diff4t)},
    diff4d: ${JSON.stringify(p.diff4d)},
    faqTitle: ${JSON.stringify(p.faqTitle)},
    faqSubtitle: ${JSON.stringify(p.faqSubtitle)},
    faq1q: ${JSON.stringify(p.faq1q)},
    faq1a: ${JSON.stringify(p.faq1a)},
    faq2q: ${JSON.stringify(p.faq2q)},
    faq2a: ${JSON.stringify(p.faq2a)},
    faq3q: ${JSON.stringify(p.faq3q)},
    faq3a: ${JSON.stringify(p.faq3a)},
    faq4q: ${JSON.stringify(p.faq4q)},
    faq4a: ${JSON.stringify(p.faq4a)},
    faq5q: ${JSON.stringify(p.faq5q)},
    faq5a: ${JSON.stringify(p.faq5a)},
    faq6q: ${JSON.stringify(p.faq6q)},
    faq6a: ${JSON.stringify(p.faq6a)},
`;
}

// Build remaining locales from structured EN keys with translations
packs.de = {
  step4d: "Verfolgen Sie Verkäufe im Studio und lassen Sie Ihr Publikum wachsen.",
  proofHowTitle: "So funktioniert der On-Chain-Autorennachweis",
  proofHowLead:
    "AuthorChain ist eine Web3-Publishing-Plattform, die Manuskript-Provenienz erfasst, ohne Ihre private Datei in eine öffentliche Chain zu legen.",
  proofHow1t: "Manuskript hashen",
  proofHow1d:
    "Bei der Registrierung berechnet AuthorChain einen SHA-256-Fingerabdruck der hochgeladenen Manuskriptdatei. Der Fingerabdruck identifiziert genau diesen Dateiinhalt.",
  proofHow2t: "Nachweis auf Base registrieren",
  proofHow2d:
    "Nur der Hash (und zugehörige Proof-Metadaten) wird über das AuthorChain-Registry auf Base registriert. Leser und Dritte können den Fingerabdruck später mit einem öffentlichen Eintrag abgleichen.",
  proofHow3t: "Manuskript privat halten",
  proofHow3d:
    "Ihr vollständiges Manuskript wird nicht on-chain gespeichert. Private Dateien bleiben in geschütztem Storage und werden nach dem Kauf über autorisierten Leserzugriff geliefert.",
  proofHow4t: "Verifiziertes Badge anzeigen",
  proofHow4d:
    "Bücher mit erfolgreicher Registrierung können auf öffentlichen Seiten einen verifizierten On-Chain-Autorennachweis zeigen — ein zeitgestempeltes Provenienzsignal, kein Rechtstitel.",
  proofHowNote:
    "On-Chain-Autorennachweis ist technischer Beleg für einen Manuskript-Fingerabdruck zu einem Zeitpunkt. Es ist keine behördliche Copyright-Registrierung, Markenanmeldung oder Durchsetzbarkeitsgarantie vor Gericht.",
  whyProofTitle: "Warum unabhängige Autoren einen Nachweis brauchen",
  whyProofLead:
    "Unabhängiges Publizieren ist schnell: Entwürfe, KI-gestützte Bearbeitung, Mitwirkende und Launches. Provenienz hilft zu dokumentieren, was Sie wann gehalten haben.",
  whyProof1t: "Plagiat und Kopie-Streit",
  whyProof1d:
    "Ein öffentlicher Hash-Eintrag gibt Ihnen einen klaren Fingerabdruck zum Vergleich, falls jemand Ihr Werk beansprucht oder eine fast identische Datei verbreitet.",
  whyProof2t: "Eigentumshistorie des Manuskripts",
  whyProof2d:
    "Co-Autoren, Lektoren und Freelancer ändern sich. Ein zeitgestempelter Nachweis hilft zu zeigen, welche Version Sie vor dem Release kontrolliert haben.",
  whyProof3t: "Dokumentation KI-gestützter Workflows",
  whyProof3d:
    "Viele Autoren nutzen KI-Tools. Der Nachweis fingerprinted weiterhin die Datei, die Sie registrieren — Sie bleiben für Originalität und Rechte verantwortlich.",
  whyProof4t: "Beleg vor öffentlichem Release",
  whyProof4d:
    "Ein Nachweis vor breiter Verbreitung schafft einen früheren On-Chain-Referenzpunkt für die Manuskript-Provenienz.",
  salesTitle: "Direktvertrieb und verifizierte Buchauslieferung",
  salesLead:
    "AuthorChain verbindet Checkout mit einer geschützten Leser-Bibliothek, damit Käufer Zugang erhalten, ohne Dateien per E-Mail zu teilen.",
  sales1t: "Stripe-Checkout für Leser",
  sales1d:
    "Leser können per Karte über Stripe kaufen, wenn Zahlungen konfiguriert sind. Für unabhängige Autoren, die digitale Bücher direkt verkaufen.",
  sales2t: "Leserberechtigung nach dem Kauf",
  sales2d:
    "Ein erfolgreicher Kauf erzeugt Zugang zu diesem Titel. Entitlement — nicht ein öffentlicher Download-Link — schaltet die Bibliothek frei.",
  sales3t: "Geschützte ReaderChain-Bibliothek",
  sales3d:
    "Gekaufte Titel erscheinen in der sicheren Bibliothek des Lesers. Zugang ist an den angemeldeten Käufer gebunden.",
  sales4t: "Verkaufssicht für Autoren",
  sales4d:
    "AuthorChain Studio zeigt Verkaufsaktivität. Auszahlungszeit und -methode hängen von Ihrer Stripe- oder anderen Zahlungskonfiguration ab — AuthorChain verspricht keine garantierten Sofort-Banküberweisungen.",
  aiWorkflowTitle: "KI-gestütztes Publishing — Autor bleibt in Kontrolle",
  aiWorkflowLead:
    "Studio-KI-Tools beschleunigen Blurbs, Launch-Pläne und Community-Copy. Sie unterstützen Ihren Workflow; sie ersetzen weder Ihr Urteil noch Fremdshop-Regeln.",
  aiWorkflow1t: "Unterstützen, nicht ersetzen",
  aiWorkflow1d:
    "Agenten entwerfen Marketing- und Planungsassets aus Ihren Buchangaben. Sie prüfen, bearbeiten und entscheiden, was öffentlich wird.",
  aiWorkflow2t: "Sie bleiben verantwortlich",
  aiWorkflow2d:
    "Sie bleiben für Genauigkeit, Rechte und Aussagen über Ihr Buch verantwortlich — auch beim Export auf andere Plattformen.",
  aiWorkflow3t: "Nur publish-ready Positionierung",
  aiWorkflow3d:
    "AuthorChain hilft, ein publish-ready Manuskript-Erlebnis vorzubereiten und zu verkaufen. Es garantiert keine Annahme bei Amazon KDP, Apple Books oder anderen Stores.",
  aiWorkflowNote:
    "Wir versprechen kein Umgehen von KI-Detektoren, kein „Filter bestehen“ und keine redaktionelle Zertifizierung. KI-gestütztes Publishing hier meint optionale Produktivitätstools im Studio.",
  securityTitle: "Sicherheit, Privatsphäre und Compliance-Haltung",
  securityLead:
    "Ein Blockchain-Publishing-Stack braucht weiterhin Produkt-Sicherheit: privater Storage, autorisierte Downloads und präzise Sprache darüber, was die Chain hält.",
  security1t: "Privater Manuskript-Storage",
  security1d:
    "Manuskripte und Assets liegen in privatem Object Storage, nicht im öffentlichen Chain-State.",
  security2t: "Geschützte Downloads",
  security2d:
    "Download-Routen prüfen Entitlement, bevor Dateien ausgeliefert werden. Öffentliche Seiten zeigen Cover und Previews, die Sie freigeben.",
  security3t: "Malware-Scan bei Uploads",
  security3d:
    "Wenn Scanning in Production konfiguriert ist, werden neue Uploads beim Finalize auf Malware geprüft, bevor sie dauerhaft akzeptiert werden. Infizierte oder nicht scannbare Dateien werden mit sicheren Meldungen abgelehnt.",
  security4t: "Privatsphäre des Proof-Hash",
  security4d:
    "Der On-Chain-Eintrag betrifft Hash-Fingerabdruck und Proof-Metadaten. Er veröffentlicht nicht den vollen Manuskripttext auf Base.",
  diffTitle: "Was AuthorChain unterscheidet",
  diffLead:
    "Die meisten Tools lösen einen Teil. AuthorChain kombiniert On-Chain-Autorennachweis, Direktverkauf und verifizierte Auslieferung in einem Workflow für unabhängige Autoren.",
  diff1t: "Klassische Self-Publishing-Portale",
  diff1d:
    "Fokus auf Distribution und Drucklogistik. Selten ein öffentlicher, portabler Proof-Hash des Manuskripts vor dem Launch.",
  diff2t: "Einfacher Cloud-Dateispeicher",
  diff2d:
    "Ordner halten Dateien privat, schaffen aber weder Käufer-Entitlement, Leser-Bibliothek noch verifizierbaren Autorenschafts-Fingerabdruck.",
  diff3t: "Generische Marktplätze",
  diff3d:
    "Optimieren Entdeckung und Checkout; Manuskript-Provenienz und autorengesteuerte Proof-Registrierung liegen meist außerhalb des Produkts.",
  diff4t: "Die AuthorChain-Kombination",
  diff4d:
    "Manuskript hochladen und vorbereiten, Autorennachweis on-chain registrieren, direkt verkaufen und über eine geschützte Leser-Bibliothek ausliefern — optional mit KI-Tools.",
  faqTitle: "Häufige Fragen",
  faqSubtitle:
    "Klare Antworten für unabhängige Autoren, die eine Web3-Publishing-Plattform bewerten.",
  faq1q: "Speichert AuthorChain mein Manuskript on-chain?",
  faq1a:
    "Nein. AuthorChain registriert einen SHA-256-Hash (Fingerabdruck) des Manuskripts als Autorennachweis. Das vollständige Manuskript bleibt in privatem Storage und wird nicht in die Blockchain veröffentlicht.",
  faq2q: "Ist AuthorChain dasselbe wie eine Copyright-Registrierung?",
  faq2a:
    "Nein. On-Chain-Autorennachweis ist ein technischer Provenienz-Eintrag. Es ist keine Einreichung bei einem Copyright-Amt und keine Rechtsberatung zu Ihren Rechten.",
  faq3q: "Können Leser ein Buch ohne Kauf lesen?",
  faq3a:
    "Öffentliche Seiten können Marketing, Cover und optionale Previews zeigen. Voller Manuskriptzugriff bei bezahlten Titeln erfolgt über Leser-Entitlement nach erfolgreichem Kauf (oder anderem von Ihnen konfigurierten Zugang).",
  faq4q: "Können Autoren Buchmetadaten übersetzen?",
  faq4a:
    "Ja. AuthorChain Studio unterstützt lokalisierte Metadaten, damit Titel, Untertitel und Beschreibungen in der Sprache des Lesers erscheinen, wenn Sie Übersetzungen bereitstellen.",
  faq5q: "Garantiert AuthorChain KDP-Zulassung?",
  faq5a:
    "Nein. AuthorChain garantiert keine Annahme, Rankings oder Policy-Ergebnisse von Amazon KDP (oder anderen Stores). Wir helfen beim Vorbereiten und Verkaufen auf AuthorChain/ReaderChain; Drittstores haben eigene Regeln.",
  faq6q: "Wie funktioniert Proof-of-Authorship?",
  faq6a:
    "Sie laden ein Manuskript hoch, AuthorChain hasht die Datei mit SHA-256, und eine erfolgreiche Registrierung hält den Nachweis über das AuthorChain-Registry auf Base fest. Leser können ein verifiziertes Badge sehen — ohne dass Ihre private Datei on-chain liegt.",
};

// FR, IT, PT, RU, ar-AE — full packs (abbreviated carefully but complete keys)
packs.fr = {
  step4d: "Suivez les ventes dans le Studio et développez votre audience.",
  proofHowTitle: "Comment fonctionne la preuve de paternité on-chain",
  proofHowLead:
    "AuthorChain est une plateforme d’édition Web3 qui enregistre la provenance du manuscrit sans placer votre fichier privé sur une chaîne publique.",
  proofHow1t: "Hacher le manuscrit",
  proofHow1d:
    "Lors de l’enregistrement, AuthorChain calcule une empreinte SHA-256 du fichier manuscrit téléversé. L’empreinte identifie exactement ce contenu.",
  proofHow2t: "Enregistrer la preuve sur Base",
  proofHow2d:
    "Seul le hash (et des métadonnées de preuve) est enregistré via le registry AuthorChain sur Base. Lecteurs et tiers peuvent vérifier l’empreinte par rapport à un enregistrement public.",
  proofHow3t: "Garder le manuscrit privé",
  proofHow3d:
    "Le manuscrit complet n’est pas stocké on-chain. Les fichiers privés restent en stockage protégé et sont livrés via un accès lecteur autorisé après achat.",
  proofHow4t: "Afficher un badge vérifié",
  proofHow4d:
    "Les livres avec enregistrement réussi peuvent afficher une preuve de paternité vérifiée — un signal de provenance horodaté, pas un titre juridique.",
  proofHowNote:
    "La preuve de paternité on-chain est une preuve technique d’empreinte de manuscrit à un instant donné. Ce n’est pas un dépôt de copyright gouvernemental ni une garantie d’opposabilité en justice.",
  whyProofTitle: "Pourquoi les auteurs indépendants ont besoin d’une preuve",
  whyProofLead:
    "L’édition indépendante va vite : brouillons, édition assistée par IA, collaborateurs et lancements. La provenance aide à documenter ce que vous déteniez, et quand.",
  whyProof1t: "Plagiat et litiges de copie",
  whyProof1d:
    "Un enregistrement public de hash donne une empreinte claire à comparer si quelqu’un revendique votre œuvre ou diffuse un fichier quasi identique.",
  whyProof2t: "Historique de propriété du manuscrit",
  whyProof2d:
    "Coauteurs, éditeurs et freelances évoluent. Une preuve horodatée aide à montrer quelle version vous contrôliez avant la sortie.",
  whyProof3t: "Documenter les flux assistés par IA",
  whyProof3d:
    "Beaucoup d’auteurs utilisent l’IA. La preuve empreinte toujours le fichier que vous enregistrez — vous restez responsable de l’originalité et des droits.",
  whyProof4t: "Preuve avant diffusion large",
  whyProof4d:
    "Enregistrer la preuve avant une large distribution crée un point de référence on-chain plus précoce pour la provenance.",
  salesTitle: "Ventes directes et livraison de livres vérifiés",
  salesLead:
    "AuthorChain relie le paiement à une bibliothèque lecteur protégée pour que l’acheteur accède sans échanger des fichiers par e-mail.",
  sales1t: "Checkout Stripe pour les lecteurs",
  sales1d:
    "Les lecteurs peuvent payer par carte via Stripe lorsque les paiements sont configurés. Conçu pour les auteurs indépendants vendant des livres numériques en direct.",
  sales2t: "Droit d’accès après achat",
  sales2d:
    "Un achat réussi crée l’accès lecteur pour ce titre. L’entitlement — pas un lien public — débloque la bibliothèque.",
  sales3t: "Bibliothèque ReaderChain protégée",
  sales3d:
    "Les titres achetés apparaissent dans la bibliothèque sécurisée du lecteur, liée à l’acheteur connecté.",
  sales4t: "Visibilité des ventes pour les auteurs",
  sales4d:
    "AuthorChain Studio affiche l’activité de ventes. Délais et méthodes de paiement dépendent de votre configuration Stripe (ou autre) — pas de virements bancaires instantanés garantis inventés par AuthorChain.",
  aiWorkflowTitle: "Édition assistée par IA — l’auteur reste maître",
  aiWorkflowLead:
    "Les outils IA du Studio accélèrent blurbs, plans de lancement et copy communauté. Ils aident votre flux ; ils ne remplacent pas votre jugement ni les règles d’autres boutiques.",
  aiWorkflow1t: "Assister, pas remplacer",
  aiWorkflow1d:
    "Les agents rédigent des actifs marketing et de planification à partir de vos détails. Vous révisez, éditez et décidez ce qui est public.",
  aiWorkflow2t: "Vous restez responsable",
  aiWorkflow2d:
    "Vous restez responsable de l’exactitude, des droits et des affirmations sur votre livre — y compris à l’export vers d’autres plateformes.",
  aiWorkflow3t: "Positionnement publish-ready uniquement",
  aiWorkflow3d:
    "AuthorChain aide à préparer et vendre une expérience de manuscrit prêt à publier. Aucune garantie d’acceptation Amazon KDP, Apple Books ou autre.",
  aiWorkflowNote:
    "Nous ne promettons pas de contourner des détecteurs d’IA, de « passer des filtres » ni de certifier la qualité éditoriale. L’IA ici = outils de productivité optionnels du Studio.",
  securityTitle: "Sécurité, confidentialité et posture de conformité",
  securityLead:
    "Une stack d’édition blockchain a toujours besoin de sécurité produit : stockage privé, téléchargements autorisés, langage précis sur ce que la chaîne contient.",
  security1t: "Stockage privé du manuscrit",
  security1d:
    "Manuscrits et actifs restent en stockage d’objets privé, pas dans l’état public de la chaîne.",
  security2t: "Téléchargements protégés",
  security2d:
    "Les routes de téléchargement vérifient l’entitlement avant de servir les fichiers. Les pages publiques montrent couvertures et aperçus que vous exposez.",
  security3t: "Analyse malware des envois",
  security3d:
    "Lorsque le scan est configuré en production, les nouveaux envois sont analysés au finalize avant acceptation durable. Fichiers infectés ou non analysables refusés avec messages sûrs.",
  security4t: "Confidentialité du hash de preuve",
  security4d:
    "L’enregistrement on-chain porte sur une empreinte hash et des métadonnées de preuve. Il ne publie pas le texte intégral du manuscrit sur Base.",
  diffTitle: "Ce qui rend AuthorChain différent",
  diffLead:
    "La plupart des outils couvrent une tranche. AuthorChain combine preuve de paternité on-chain, ventes directes et livraison vérifiée pour auteurs indépendants.",
  diff1t: "Portails d’autoédition classiques",
  diff1d:
    "Focalisés distribution et impression. Rarement un hash de preuve portable du manuscrit détenu avant le lancement.",
  diff2t: "Simple stockage cloud",
  diff2d:
    "Les dossiers gardent les fichiers privés mais ne créent ni entitlement acheteur, ni bibliothèque lecteur, ni empreinte d’auteur vérifiable.",
  diff3t: "Marketplaces génériques",
  diff3d:
    "Optimisent découverte et checkout ; la provenance du manuscrit et l’enregistrement de preuve par l’auteur restent souvent hors produit.",
  diff4t: "La combinaison AuthorChain",
  diff4d:
    "Téléverser et préparer un manuscrit, enregistrer la preuve on-chain, vendre en direct et livrer via une bibliothèque lecteur protégée — avec outils IA si besoin.",
  faqTitle: "Questions fréquentes",
  faqSubtitle:
    "Réponses claires pour auteurs indépendants évaluant une plateforme d’édition Web3.",
  faq1q: "AuthorChain stocke-t-il mon manuscrit on-chain ?",
  faq1a:
    "Non. AuthorChain enregistre un hash SHA-256 (empreinte) du manuscrit comme preuve de paternité. Le manuscrit complet reste en stockage privé et n’est pas publié sur la blockchain.",
  faq2q: "AuthorChain équivaut-il à un dépôt de copyright ?",
  faq2a:
    "Non. La preuve de paternité on-chain est un enregistrement technique de provenance. Ce n’est pas un dépôt auprès d’un office de copyright ni un conseil juridique.",
  faq3q: "Les lecteurs peuvent-ils accéder sans acheter ?",
  faq3a:
    "Les pages publiques peuvent montrer marketing, couvertures et aperçus optionnels. L’accès au manuscrit des titres payants passe par l’entitlement lecteur après achat réussi (ou autre accès que vous configurez).",
  faq4q: "Les auteurs peuvent-ils traduire les métadonnées ?",
  faq4a:
    "Oui. AuthorChain Studio prend en charge des métadonnées localisées pour afficher titres, sous-titres et descriptions dans la langue du lecteur lorsque vous fournissez des traductions.",
  faq5q: "AuthorChain garantit-il l’approbation KDP ?",
  faq5a:
    "Non. AuthorChain ne garantit ni acceptation Amazon KDP (ni d’aucune boutique), ni classement, ni résultat de politique. Nous aidons à préparer et vendre sur AuthorChain/ReaderChain ; les boutiques tierces ont leurs propres règles.",
  faq6q: "Comment fonctionne la preuve de paternité ?",
  faq6a:
    "Vous téléversez un manuscrit, AuthorChain le hache en SHA-256, et un enregistrement réussi consigne cette preuve sur Base via le registry AuthorChain. Les lecteurs peuvent voir un badge vérifié — sans que votre fichier privé vive on-chain.",
};

// For it, pt, ru, ar-AE use EN as structure with translated packs (copy from en with targeted translations)
import { createRequire } from "module";
// We'll inline compact packs for it/pt/ru/ar by reusing French structure adapted

packs.it = Object.fromEntries(
  Object.entries(packs.fr).map(([k, v]) => [k, v]),
);
// Override with Italian
Object.assign(packs.it, {
  step4d: "Monitora le vendite in Studio e fai crescere il pubblico.",
  proofHowTitle: "Come funziona la prova di paternità on-chain",
  proofHowLead:
    "AuthorChain è una piattaforma di editoria Web3 che registra la provenienza del manoscritto senza mettere il file privato su una chain pubblica.",
  proofHow1t: "Hash del manoscritto",
  proofHow1d:
    "Alla registrazione, AuthorChain calcola un’impronta SHA-256 del file manoscritto caricato. L’impronta identifica esattamente quel contenuto.",
  proofHow2t: "Registra la prova su Base",
  proofHow2d:
    "Solo l’hash (e metadati di prova correlati) viene registrato tramite il registry AuthorChain su Base. Lettori e terzi possono verificare l’impronta rispetto a un record pubblico.",
  proofHow3t: "Mantieni il manoscritto privato",
  proofHow3d:
    "Il manoscritto completo non è memorizzato on-chain. I file privati restano in storage protetto e vengono consegnati con accesso lettore autorizzato dopo l’acquisto.",
  proofHow4t: "Mostra un badge verificato",
  proofHow4d:
    "I libri con registrazione riuscita possono mostrare prova di paternità verificata — segnale di provenienza con timestamp, non un titolo legale.",
  proofHowNote:
    "La prova di paternità on-chain è evidenza tecnica dell’impronta di un manoscritto in un momento. Non è registrazione di copyright governativa né garanzia di opponibilità in tribunale.",
  whyProofTitle: "Perché gli autori indipendenti hanno bisogno della prova",
  whyProofLead:
    "L’editoria indipendente è rapida: bozze, editing assistito da IA, collaboratori e lanci. La provenienza aiuta a documentare cosa detenevi e quando.",
  whyProof1t: "Plagio e dispute di copia",
  whyProof1d:
    "Un record pubblico di hash offre un’impronta chiara da confrontare se qualcuno rivendica la tua opera o fa circolare un file quasi identico.",
  whyProof2t: "Cronologia di proprietà del manoscritto",
  whyProof2d:
    "Coautori, editor e freelance cambiano. Una prova con timestamp aiuta a mostrare quale versione controllavi prima del rilascio.",
  whyProof3t: "Documentare workflow assistiti da IA",
  whyProof3d:
    "Molti autori usano strumenti IA. La prova impronta comunque il file che registri — resti responsabile di originalità e diritti.",
  whyProof4t: "Evidenza prima del rilascio pubblico",
  whyProof4d:
    "Registrare la prova prima di un’ampia distribuzione crea un riferimento on-chain più precoce per la provenienza.",
  salesTitle: "Vendite dirette e consegna di libri verificati",
  salesLead:
    "AuthorChain collega il checkout a una libreria lettore protetta così l’acquirente ottiene l’accesso senza scambiare file via email.",
  sales1t: "Checkout Stripe per i lettori",
  sales1d:
    "I lettori possono pagare con carta tramite Stripe quando i pagamenti sono configurati. Pensato per autori indipendenti che vendono libri digitali direttamente.",
  sales2t: "Diritto di accesso dopo l’acquisto",
  sales2d:
    "Un acquisto riuscito crea l’accesso del lettore a quel titolo. L’entitlement — non un link pubblico — sblocca la libreria.",
  sales3t: "Libreria ReaderChain protetta",
  sales3d:
    "I titoli acquistati compaiono nella libreria sicura del lettore, legata all’acquirente autenticato.",
  sales4t: "Visibilità vendite per gli autori",
  sales4d:
    "AuthorChain Studio mostra l’attività di vendita. Tempi e metodi di pagamento dipendono dalla configurazione Stripe (o altra) — AuthorChain non inventa bonifici bancari istantanei garantiti.",
  aiWorkflowTitle: "Editoria assistita da IA — l’autore resta al comando",
  aiWorkflowLead:
    "Gli strumenti IA dello Studio accelerano blurb, piani di lancio e copy community. Supportano il flusso; non sostituiscono il tuo giudizio né le regole di altri store.",
  aiWorkflow1t: "Assistere, non sostituire",
  aiWorkflow1d:
    "Gli agenti redigono asset di marketing e pianificazione dai dettagli del libro. Tu rivedi, editi e decidi cosa rendere pubblico.",
  aiWorkflow2t: "Resti responsabile",
  aiWorkflow2d:
    "Resti responsabile di accuratezza, diritti e affermazioni sul libro — anche esportando su altre piattaforme.",
  aiWorkflow3t: "Solo posizionamento publish-ready",
  aiWorkflow3d:
    "AuthorChain aiuta a preparare e vendere un’esperienza di manoscritto pronto per la pubblicazione. Non garantisce l’accettazione su Amazon KDP, Apple Books o altri store.",
  aiWorkflowNote:
    "Non promettiamo di aggirare detector IA, “passare filtri” o certificare qualità editoriale. Qui IA significa strumenti opzionali di produttività nello Studio.",
  securityTitle: "Sicurezza, privacy e postura di conformità",
  securityLead:
    "Uno stack di editoria blockchain richiede ancora sicurezza di prodotto: storage privato, download autorizzati e linguaggio preciso su cosa c’è on-chain.",
  security1t: "Storage privato del manoscritto",
  security1d:
    "Manoscritti e asset restano in object storage privato, non nello stato pubblico della chain.",
  security2t: "Download protetti",
  security2d:
    "Le route di download verificano l’entitlement prima di servire i file. Le pagine pubbliche mostrano copertine e anteprime che scegli di esporre.",
  security3t: "Scansione malware in upload",
  security3d:
    "Quando lo scan è configurato in production, i nuovi upload vengono analizzati al finalize prima dell’accettazione duratura. File infetti o non scansionabili sono rifiutati con messaggi sicuri.",
  security4t: "Privacy dell’hash di prova",
  security4d:
    "Il record on-chain riguarda un’impronta hash e metadati di prova. Non pubblica il testo completo del manoscritto su Base.",
  diffTitle: "Cosa rende AuthorChain diverso",
  diffLead:
    "La maggior parte degli strumenti risolve una fetta. AuthorChain combina prova di paternità on-chain, vendite dirette e consegna verificata per autori indipendenti.",
  diff1t: "Portali di self-publishing tradizionali",
  diff1d:
    "Focus su distribuzione e stampa. Raramente un hash di prova portabile del manoscritto detenuto prima del lancio.",
  diff2t: "Semplice cloud storage",
  diff2d:
    "Le cartelle tengono i file privati ma non creano entitlement acquirente, libreria lettore né impronta d’autore verificabile.",
  diff3t: "Marketplace generici",
  diff3d:
    "Ottimizzano scoperta e checkout; provenienza del manoscritto e registrazione della prova restano spesso fuori prodotto.",
  diff4t: "La combinazione AuthorChain",
  diff4d:
    "Carica e prepara un manoscritto, registra la prova on-chain, vendi direttamente e consegna tramite libreria lettore protetta — con strumenti IA se vuoi.",
  faqTitle: "Domande frequenti",
  faqSubtitle:
    "Risposte chiare per autori indipendenti che valutano una piattaforma di editoria Web3.",
  faq1q: "AuthorChain memorizza il mio manoscritto on-chain?",
  faq1a:
    "No. AuthorChain registra un hash SHA-256 (impronta) del manoscritto come prova di paternità. Il manoscritto completo resta in storage privato e non viene pubblicato sulla blockchain.",
  faq2q: "AuthorChain equivale a una registrazione di copyright?",
  faq2a:
    "No. La prova di paternità on-chain è un record tecnico di provenienza. Non è un deposito presso un ufficio copyright né consulenza legale sui tuoi diritti.",
  faq3q: "I lettori possono accedere senza acquistare?",
  faq3a:
    "Le pagine pubbliche possono mostrare marketing, copertine e anteprime opzionali. L’accesso al manoscritto dei titoli a pagamento avviene tramite entitlement lettore dopo un acquisto riuscito (o altro accesso che configuri).",
  faq4q: "Gli autori possono tradurre i metadati del libro?",
  faq4a:
    "Sì. AuthorChain Studio supporta metadati localizzati così titoli, sottotitoli e descrizioni possono apparire nella lingua del lettore quando fornisci le traduzioni.",
  faq5q: "AuthorChain garantisce l’approvazione KDP?",
  faq5a:
    "No. AuthorChain non garantisce accettazione, ranking o esiti di policy di Amazon KDP (né di altri store). Aiutiamo a preparare e vendere su AuthorChain/ReaderChain; gli store terzi hanno regole proprie.",
  faq6q: "Come funziona la proof-of-authorship?",
  faq6a:
    "Carichi un manoscritto, AuthorChain lo hasha con SHA-256 e una registrazione riuscita fissa la prova su Base tramite il registry AuthorChain. I lettori possono vedere un badge verificato — senza che il file privato viva on-chain.",
});

packs.pt = {
  step4d: "Acompanhe as vendas no Studio e faça crescer a audiência.",
  proofHowTitle: "Como funciona a prova de autoria on-chain",
  proofHowLead:
    "A AuthorChain é uma plataforma de publicação Web3 que regista a proveniência do manuscrito sem colocar o seu ficheiro privado numa cadeia pública.",
  proofHow1t: "Calcular o hash do manuscrito",
  proofHow1d:
    "Ao registar a prova, a AuthorChain calcula uma impressão SHA-256 do ficheiro de manuscrito carregado. A impressão identifica exatamente esse conteúdo.",
  proofHow2t: "Registar a prova na Base",
  proofHow2d:
    "Apenas o hash (e metadados de prova relacionados) é registado através do registry AuthorChain na Base. Leitores e terceiros podem verificar a impressão face a um registo público.",
  proofHow3t: "Manter o manuscrito privado",
  proofHow3d:
    "O manuscrito completo não é armazenado on-chain. Os ficheiros privados ficam em armazenamento protegido e são entregues com acesso de leitor autorizado após a compra.",
  proofHow4t: "Mostrar distintivo verificado",
  proofHow4d:
    "Livros com registo bem-sucedido podem mostrar prova de autoria verificada — um sinal de proveniência com carimbo temporal, não um título legal.",
  proofHowNote:
    "A prova de autoria on-chain é evidência técnica da impressão de um manuscrito num momento. Não é registo de copyright governamental nem garantia de oponibilidade em tribunal.",
  whyProofTitle: "Porque autores independentes precisam de prova",
  whyProofLead:
    "A publicação independente é rápida: rascunhos, edição assistida por IA, colaboradores e lançamentos. A proveniência ajuda a documentar o que tinha e quando.",
  whyProof1t: "Plágio e disputas de cópia",
  whyProof1d:
    "Um registo público de hash dá uma impressão clara para comparar se alguém reclamar a sua obra ou circular um ficheiro quase idêntico.",
  whyProof2t: "Histórico de propriedade do manuscrito",
  whyProof2d:
    "Coautores, editores e freelancers mudam. Uma prova com carimbo temporal ajuda a mostrar que versão controlava antes do lançamento.",
  whyProof3t: "Documentar fluxos assistidos por IA",
  whyProof3d:
    "Muitos autores usam ferramentas de IA. A prova ainda imprime o ficheiro que regista — continua responsável pela originalidade e direitos.",
  whyProof4t: "Evidência antes da divulgação pública",
  whyProof4d:
    "Registar a prova antes de uma distribuição ampla cria um ponto de referência on-chain mais cedo para a proveniência.",
  salesTitle: "Vendas diretas e entrega de livros verificados",
  salesLead:
    "A AuthorChain liga o checkout a uma biblioteca de leitor protegida para o comprador aceder sem trocar ficheiros por email.",
  sales1t: "Checkout Stripe para leitores",
  sales1d:
    "Os leitores podem comprar com cartão via Stripe quando os pagamentos estão configurados. Pensado para autores independentes que vendem livros digitais diretamente.",
  sales2t: "Direito de acesso após a compra",
  sales2d:
    "Uma compra bem-sucedida cria acesso do leitor a esse título. O entitlement — não um link público — desbloqueia a biblioteca.",
  sales3t: "Biblioteca ReaderChain protegida",
  sales3d:
    "Os títulos comprados aparecem na biblioteca segura do leitor, ligada ao comprador autenticado.",
  sales4t: "Visibilidade de vendas para autores",
  sales4d:
    "O AuthorChain Studio mostra a atividade de vendas. Prazos e métodos de pagamento dependem da sua configuração Stripe (ou outra) — a AuthorChain não inventa depósitos bancários instantâneos garantidos.",
  aiWorkflowTitle: "Publicação assistida por IA — o autor no controlo",
  aiWorkflowLead:
    "As ferramentas de IA do Studio aceleram blurbs, planos de lançamento e copy de comunidade. Apoiam o fluxo; não substituem o seu julgamento nem as regras de outras lojas.",
  aiWorkflow1t: "Assistir, não substituir",
  aiWorkflow1d:
    "Os agentes redigem ativos de marketing e planeamento a partir dos dados do livro. Você revê, edita e decide o que fica público.",
  aiWorkflow2t: "Continua responsável",
  aiWorkflow2d:
    "Continua responsável pela exatidão, direitos e afirmações sobre o livro — inclusive ao exportar para outras plataformas.",
  aiWorkflow3t: "Apenas posicionamento publish-ready",
  aiWorkflow3d:
    "A AuthorChain ajuda a preparar e vender uma experiência de manuscrito pronto a publicar. Não garante aceitação na Amazon KDP, Apple Books ou outras lojas.",
  aiWorkflowNote:
    "Não prometemos contornar detetores de IA, “passar filtros” nem certificar qualidade editorial. IA aqui significa ferramentas opcionais de produtividade no Studio.",
  securityTitle: "Segurança, privacidade e postura de conformidade",
  securityLead:
    "Uma stack de publicação blockchain ainda precisa de segurança de produto: armazenamento privado, downloads autorizados e linguagem precisa sobre o que a chain contém.",
  security1t: "Armazenamento privado do manuscrito",
  security1d:
    "Manuscritos e ativos ficam em object storage privado, não no estado público da chain.",
  security2t: "Downloads protegidos",
  security2d:
    "As rotas de download verificam o entitlement antes de servir ficheiros. As páginas públicas mostram capas e pré-visualizações que escolhe expor.",
  security3t: "Análise de malware nos uploads",
  security3d:
    "Quando o scan está configurado em produção, novos uploads são analisados no finalize antes da aceitação duradoura. Ficheiros infetados ou não analisáveis são rejeitados com mensagens seguras.",
  security4t: "Privacidade do hash de prova",
  security4d:
    "O registo on-chain refere-se a uma impressão hash e metadados de prova. Não publica o texto completo do manuscrito na Base.",
  diffTitle: "O que torna a AuthorChain diferente",
  diffLead:
    "A maioria das ferramentas resolve uma fatia. A AuthorChain combina prova de autoria on-chain, vendas diretas e entrega verificada para autores independentes.",
  diff1t: "Portais de autoedição tradicionais",
  diff1d:
    "Foco em distribuição e impressão. Raramente um hash de prova portátil do manuscrito detido antes do lançamento.",
  diff2t: "Simples armazenamento na cloud",
  diff2d:
    "Pastas mantêm ficheiros privados mas não criam entitlement de comprador, biblioteca de leitor nem impressão de autoria verificável.",
  diff3t: "Marketplaces genéricos",
  diff3d:
    "Otimizam descoberta e checkout; a proveniência do manuscrito e o registo de prova controlado pelo autor ficam muitas vezes fora do produto.",
  diff4t: "A combinação AuthorChain",
  diff4d:
    "Carregue e prepare um manuscrito, registe prova de autoria on-chain, venda diretamente e entregue através de uma biblioteca de leitor protegida — com ferramentas de IA quando quiser.",
  faqTitle: "Perguntas frequentes",
  faqSubtitle:
    "Respostas claras para autores independentes que avaliam uma plataforma de publicação Web3.",
  faq1q: "A AuthorChain armazena o meu manuscrito on-chain?",
  faq1a:
    "Não. A AuthorChain regista um hash SHA-256 (impressão) do manuscrito como prova de autoria. O manuscrito completo permanece em armazenamento privado e não é publicado na blockchain.",
  faq2q: "A AuthorChain é o mesmo que registo de copyright?",
  faq2a:
    "Não. A prova de autoria on-chain é um registo técnico de proveniência. Não é um depósito num gabinete de copyright nem aconselhamento jurídico sobre os seus direitos.",
  faq3q: "Os leitores podem aceder sem comprar?",
  faq3a:
    "As páginas públicas podem mostrar marketing, capas e pré-visualizações opcionais. O acesso ao manuscrito de títulos pagos é entregue por entitlement de leitor após compra bem-sucedida (ou outro acesso que configure).",
  faq4q: "Os autores podem traduzir os metadados do livro?",
  faq4a:
    "Sim. O AuthorChain Studio suporta metadados localizados para que títulos, subtítulos e descrições apareçam no idioma do leitor quando fornece traduções.",
  faq5q: "A AuthorChain garante aprovação no KDP?",
  faq5a:
    "Não. A AuthorChain não garante aceitação, ranking ou resultados de política da Amazon KDP (nem de qualquer loja). Ajudamos a preparar e vender na AuthorChain/ReaderChain; lojas de terceiros têm as suas regras.",
  faq6q: "Como funciona a proof-of-authorship?",
  faq6a:
    "Carrega um manuscrito, a AuthorChain faz o hash SHA-256 e um registo bem-sucedido grava essa prova na Base via registry AuthorChain. Os leitores podem ver um distintivo verificado — sem o ficheiro privado viver on-chain.",
};

packs.ru = {
  step4d: "Отслеживайте продажи в Studio и растите аудиторию.",
  proofHowTitle: "Как работает on-chain подтверждение авторства",
  proofHowLead:
    "AuthorChain — Web3-платформа публикации, которая фиксирует происхождение рукописи, не помещая ваш приватный файл в публичную сеть.",
  proofHow1t: "Хеширование рукописи",
  proofHow1d:
    "При регистрации AuthorChain вычисляет SHA-256-отпечаток загруженного файла рукописи. Отпечаток идентифицирует именно это содержимое.",
  proofHow2t: "Регистрация доказательства на Base",
  proofHow2d:
    "Только хеш (и связанные метаданные доказательства) регистрируется через AuthorChain registry на Base. Читатели и третьи стороны могут сверить отпечаток с публичной записью.",
  proofHow3t: "Рукопись остаётся приватной",
  proofHow3d:
    "Полная рукопись не хранится on-chain. Приватные файлы остаются в защищённом storage и доставляются через авторизованный доступ читателя после покупки.",
  proofHow4t: "Показ verified-бейджа",
  proofHow4d:
    "Книги с успешной регистрацией могут показывать verified on-chain proof of authorship — сигнал происхождения с меткой времени, а не правовой титул.",
  proofHowNote:
    "On-chain proof of authorship — техническое свидетельство отпечатка рукописи в момент времени. Это не государственная регистрация copyright, не товарный знак и не гарантия принудимости в суде.",
  whyProofTitle: "Зачем независимым авторам доказательство",
  whyProofLead:
    "Независимая публикация идёт быстро: черновики, AI-правки, соавторы, релизы. Происхождение помогает фиксировать, что вы держали и когда.",
  whyProof1t: "Плагиат и споры о копии",
  whyProof1d:
    "Публичная hash-запись даёт ясный отпечаток для сравнения, если кто-то заявит права или распространит почти идентичный файл.",
  whyProof2t: "История владения рукописью",
  whyProof2d:
    "Соавторы, редакторы и фрилансеры меняются. Доказательство с меткой времени помогает показать, какую версию вы контролировали до релиза.",
  whyProof3t: "Документирование AI-воркфлоу",
  whyProof3d:
    "Многие авторы используют AI-инструменты. Доказательство всё равно отпечатывает файл, который вы регистрируете — вы отвечаете за оригинальность и права.",
  whyProof4t: "Свидетельство до широкого релиза",
  whyProof4d:
    "Регистрация до широкой дистрибуции создаёт более раннюю on-chain точку отсчёта для provenance рукописи.",
  salesTitle: "Прямые продажи и доставка проверенных книг",
  salesLead:
    "AuthorChain связывает checkout с защищённой библиотекой читателя, чтобы покупатель получил доступ без пересылки файлов по почте.",
  sales1t: "Stripe-checkout для читателей",
  sales1d:
    "Читатели могут платить картой через Stripe, когда платежи настроены. Для независимых авторов, продающих цифровые книги напрямую.",
  sales2t: "Право доступа после покупки",
  sales2d:
    "Успешная покупка создаёт доступ читателя к этому тайтлу. Entitlement — не публичная ссылка — открывает библиотеку.",
  sales3t: "Защищённая библиотека ReaderChain",
  sales3d:
    "Купленные тайтлы появляются в защищённой библиотеке читателя, привязанной к вошедшему покупателю.",
  sales4t: "Видимость продаж для авторов",
  sales4d:
    "AuthorChain Studio показывает активность продаж. Сроки и способы выплат зависят от вашей настройки Stripe (или иной) — AuthorChain не обещает гарантированные мгновенные банковские переводы.",
  aiWorkflowTitle: "AI-assisted publishing — автор остаётся главным",
  aiWorkflowLead:
    "AI-инструменты Studio ускоряют аннотации, планы запуска и community-copy. Они помогают workflow; не заменяют ваше суждение и правила чужих магазинов.",
  aiWorkflow1t: "Помогать, не заменять",
  aiWorkflow1d:
    "Агенты готовят маркетинговые и плановые материалы из данных книги. Вы проверяете, правите и решаете, что публиковать.",
  aiWorkflow2t: "Вы несёте ответственность",
  aiWorkflow2d:
    "Вы отвечаете за точность, права и утверждения о книге — в том числе при экспорте на другие платформы.",
  aiWorkflow3t: "Только publish-ready позиционирование",
  aiWorkflow3d:
    "AuthorChain помогает подготовить и продавать publish-ready опыт рукописи. Не гарантирует приём Amazon KDP, Apple Books или других магазинов.",
  aiWorkflowNote:
    "Мы не обещаем обход AI-детекторов, «прохождение фильтров» или сертификацию редакционного качества. AI здесь — опциональные productivity-инструменты Studio.",
  securityTitle: "Безопасность, приватность и compliance-подход",
  securityLead:
    "Blockchain-публикации всё равно нужна продуктовая безопасность: приватный storage, авторизованные загрузки и точный язык о том, что хранит chain.",
  security1t: "Приватное хранение рукописи",
  security1d:
    "Рукописи и ассеты лежат в приватном object storage, а не в публичном состоянии chain.",
  security2t: "Защищённые скачивания",
  security2d:
    "Маршруты скачивания проверяют entitlement перед выдачей файлов. Публичные страницы показывают обложки и превью, которые вы решили открыть.",
  security3t: "Malware-сканирование загрузок",
  security3d:
    "Когда сканирование настроено в production, новые загрузки проверяются на malware на этапе finalize до долговременного принятия. Заражённые или несканируемые файлы отклоняются с безопасными сообщениями.",
  security4t: "Приватность proof-хеша",
  security4d:
    "On-chain запись — об отпечатке hash и метаданных доказательства. Она не публикует полный текст рукописи на Base.",
  diffTitle: "Чем AuthorChain отличается",
  diffLead:
    "Большинство инструментов закрывают один срез. AuthorChain сочетает on-chain proof of authorship, прямые продажи и verified book delivery для независимых авторов.",
  diff1t: "Классические порталы self-publishing",
  diff1d:
    "Фокус на дистрибуции и печати. Редко — публичный portable proof-hash рукописи до релиза.",
  diff2t: "Простое облачное хранилище",
  diff2d:
    "Папки хранят файлы приватно, но не создают entitlement покупателя, библиотеку читателя и проверяемый отпечаток авторства.",
  diff3t: "Обычные маркетплейсы",
  diff3d:
    "Оптимизируют discovery и checkout; provenance рукописи и регистрация proof автором обычно вне продукта.",
  diff4t: "Комбинация AuthorChain",
  diff4d:
    "Загрузите и подготовьте рукопись, зарегистрируйте proof of authorship on-chain, продавайте напрямую и доставляйте через защищённую библиотеку читателя — с AI-инструментами по желанию.",
  faqTitle: "Частые вопросы",
  faqSubtitle:
    "Прямые ответы для независимых авторов, оценивающих Web3 publishing platform.",
  faq1q: "Хранит ли AuthorChain рукопись on-chain?",
  faq1a:
    "Нет. AuthorChain регистрирует SHA-256-хеш (отпечаток) рукописи как proof of authorship. Полная рукопись остаётся в приватном storage и не публикуется в blockchain.",
  faq2q: "AuthorChain — это то же, что регистрация copyright?",
  faq2a:
    "Нет. On-chain authorship proof — техническая запись provenance. Это не подача в copyright office и не юридическая консультация о ваших правах.",
  faq3q: "Могут ли читатели получить книгу без покупки?",
  faq3a:
    "Публичные страницы могут показывать маркетинг, обложки и опциональные превью. Полный доступ к платной рукописи — через entitlement читателя после успешной покупки (или иной настроенный вами доступ).",
  faq4q: "Могут ли авторы переводить метаданные книги?",
  faq4a:
    "Да. AuthorChain Studio поддерживает локализованные метаданные, чтобы заголовки, подзаголовки и описания показывались на языке читателя, когда вы предоставляете переводы.",
  faq5q: "Гарантирует ли AuthorChain одобрение KDP?",
  faq5a:
    "Нет. AuthorChain не гарантирует принятие Amazon KDP (или любого магазина), рейтинг или исход политик. Мы помогаем готовить и продавать на AuthorChain/ReaderChain; у сторонних магазинов свои правила.",
  faq6q: "Как работает proof-of-authorship?",
  faq6a:
    "Вы загружаете рукопись, AuthorChain хеширует файл SHA-256, и успешная регистрация фиксирует proof на Base через AuthorChain registry. Читатели могут видеть verified-бейдж — без размещения приватного файла on-chain.",
};

packs["ar-AE"] = {
  step4d: "تتبّع المبيعات في Studio ونمِّ جمهورك.",
  proofHowTitle: "كيف يعمل إثبات التأليف على السلسلة",
  proofHowLead:
    "AuthorChain منصة نشر Web3 تسجّل أصل المخطوطة دون وضع ملفك الخاص على سلسلة عامة.",
  proofHow1t: "تجزئة المخطوطة",
  proofHow1d:
    "عند تسجيل الإثبات تحسب AuthorChain بصمة SHA-256 لملف المخطوطة الذي رفعته. تُعرّف البصمة ذلك المحتوى بالضبط.",
  proofHow2t: "تسجيل الإثبات على Base",
  proofHow2d:
    "يُسجَّل الهاش فقط (وبيانات الإثبات ذات الصلة) عبر سجل AuthorChain على Base. يمكن للقرّاء والغير التحقق من البصمة مقابل سجل عام.",
  proofHow3t: "إبقاء المخطوطة خاصة",
  proofHow3d:
    "لا تُخزَّن المخطوطة الكاملة على السلسلة. تبقى الملفات الخاصة في تخزين محمي وتُسلَّم عبر وصول قارئ مصرّح بعد الشراء.",
  proofHow4t: "عرض شارة موثّقة",
  proofHow4d:
    "يمكن للكتب ذات التسجيل الناجح عرض إثبات تأليف موثّق على الصفحات العامة — إشارة أصل بزمن، وليست سندًا قانونيًا.",
  proofHowNote:
    "إثبات التأليف على السلسلة دليل تقني على بصمة مخطوطة في لحظة زمنية. ليس تسجيل حقوق نشر حكوميًا ولا ضمانًا للتنفيذ أمام المحاكم.",
  whyProofTitle: "لماذا يحتاج المؤلفون المستقلون إلى إثبات",
  whyProofLead:
    "نشر المستقلين سريع: مسودات وتحرير بمساعدة الذكاء الاصطناعي ومتعاونون وإطلاقات. يساعد الأصل في توثيق ما امتلكته ومتى.",
  whyProof1t: "السرقة الأدبية ونزاعات النسخ",
  whyProof1d:
    "يمنح سجل هاش عام بصمة واضحة للمقارنة إن ادّعى أحد عملك أو نشر ملفًا شبه مطابق.",
  whyProof2t: "تاريخ ملكية المخطوطة",
  whyProof2d:
    "يتغيّر المؤلفون المشاركون والمحررون والمستقلون. يساعد الإثبات المُؤرَّخ في إظهار أي نسخة كنت تتحكم بها قبل الإصدار.",
  whyProof3t: "توثيق سير العمل بمساعدة الذكاء الاصطناعي",
  whyProof3d:
    "يستخدم كثير من المؤلفين أدوات الذكاء الاصطناعي. ما يزال الإثبات يبصم الملف الذي تسجّله — وتبقى مسؤولًا عن الأصالة والحقوق.",
  whyProof4t: "دليل قبل الإطلاق العام",
  whyProof4d:
    "تسجيل الإثبات قبل التوزيع الواسع يخلق مرجعًا أبكر على السلسلة لأصل المخطوطة.",
  salesTitle: "مبيعات مباشرة وتسليم كتب موثّقة",
  salesLead:
    "تربط AuthorChain الدفع بمكتبة قارئ محمية ليحصل المشتري على الوصول دون تبادل ملفات عبر البريد.",
  sales1t: "دفع Stripe للقرّاء",
  sales1d:
    "يمكن للقرّاء الشراء بالبطاقة عبر Stripe عند تهيئة المدفوعات. مصمَّم لمؤلفين مستقلين يبيعون كتبًا رقمية مباشرة.",
  sales2t: "حق الوصول بعد الشراء",
  sales2d:
    "يُنشئ الشراء الناجح وصول القارئ لذلك العنوان. الاستحقاق — لا رابط تنزيل عام — يفتح المكتبة.",
  sales3t: "مكتبة ReaderChain المحمية",
  sales3d:
    "تظهر العناوين المشتراة في مكتبة القارئ الآمنة وترتبط بالمشتري المسجّل.",
  sales4t: "رؤية المبيعات للمؤلفين",
  sales4d:
    "يعرض AuthorChain Studio نشاط المبيعات. تعتمد أوقات وطرق الدفع على إعدادات Stripe (أو غيرها) — ولا تخترع AuthorChain ودائع بنكية فورية مضمونة.",
  aiWorkflowTitle: "نشر بمساعدة الذكاء الاصطناعي — والمؤلف في السيطرة",
  aiWorkflowLead:
    "تسرّع أدوات الاستوديو الملخصات وخطط الإطلاق ونسخ المجتمع. تدعم سير عملك؛ ولا تستبدل حكمك أو قواعد متاجر أخرى.",
  aiWorkflow1t: "مساعدة لا استبدال",
  aiWorkflow1d:
    "تصوغ الوكلاء أصول تسويق وتخطيط من تفاصيل كتابك. أنت تراجع وتعدّل وتقرر ما يُنشر.",
  aiWorkflow2t: "تبقى المسؤول",
  aiWorkflow2d:
    "تبقى مسؤولًا عن الدقة والحقوق والادعاءات حول كتابك — حتى عند التصدير لمنصات أخرى.",
  aiWorkflow3t: "تموضع جاهز للنشر فقط",
  aiWorkflow3d:
    "تساعدك AuthorChain على تجهيز وبيع تجربة مخطوطة جاهزة للنشر. لا تضمن قبول Amazon KDP أو Apple Books أو أي متجر.",
  aiWorkflowNote:
    "لا نعد بتجاوز كاشفات الذكاء الاصطناعي أو «اجتياز الفلاتر» أو اعتماد جودة تحريرية. الذكاء الاصطناعي هنا أدوات إنتاجية اختيارية في الاستوديو.",
  securityTitle: "الأمان والخصوصية ووضعية الامتثال",
  securityLead:
    "ما زالت منصة النشر على البلوكشين تحتاج أمان المنتج: تخزين خاص وتنزيلات مصرّحة ولغة دقيقة عما تحتويه السلسلة.",
  security1t: "تخزين خاص للمخطوطة",
  security1d:
    "تبقى المخطوطات والأصول في تخزين كائنات خاص، لا في حالة السلسلة العامة.",
  security2t: "تنزيلات محمية",
  security2d:
    "تتحقق مسارات تنزيل القارئ من الاستحقاق قبل تقديم الملفات. تعرض الصفحات العامة أغلفة ومعاينات تختار إظهارها.",
  security3t: "فحص البرمجيات الخبيثة عند الرفع",
  security3d:
    "عند تهيئة الفحص في الإنتاج تُفحص الرفوعات الجديدة عند الإنهاء قبل القبول الدائم. تُرفض الملفات المصابة أو غير القابلة للفحص برسائل آمنة.",
  security4t: "خصوصية هاش الإثبات",
  security4d:
    "يتعلق السجل على السلسلة ببصمة هاش وبيانات إثبات. لا ينشر نص المخطوطة الكامل على Base.",
  diffTitle: "ما الذي يميّز AuthorChain",
  diffLead:
    "تحل معظم الأدوات جزءًا واحدًا. تجمع AuthorChain إثبات التأليف على السلسلة والمبيعات المباشرة وتسليم الكتب الموثّق لمؤلفي الاستقلال.",
  diff1t: "بوابات النشر الذاتي التقليدية",
  diff1d:
    "تركّز على التوزيع والطباعة. نادرًا ما تقدّم هاش إثبات قابل للنقل للمخطوطة قبل الإطلاق.",
  diff2t: "تخزين سحابي بسيط",
  diff2d:
    "تحفظ المجلدات الملفات بخصوصية لكنها لا تنشئ استحقاق مشتري أو مكتبة قارئ أو بصمة تأليف قابلة للتحقق.",
  diff3t: "أسواق عامة",
  diff3d:
    "تحسّن الاكتشاف والدفع؛ غالبًا ما يبقى أصل المخطوطة وتسجيل الإثبات خارج المنتج.",
  diff4t: "تركيبة AuthorChain",
  diff4d:
    "ارفع وجهّز مخطوطة، سجّل إثبات التأليف على السلسلة، بِع مباشرة، وسلّم عبر مكتبة قارئ محمية — مع أدوات ذكاء اصطناعي عند الحاجة.",
  faqTitle: "أسئلة شائعة",
  faqSubtitle:
    "إجابات مباشرة للمؤلفين المستقلين الذين يقيّمون منصة نشر Web3.",
  faq1q: "هل تخزّن AuthorChain مخطوطتي على السلسلة؟",
  faq1a:
    "لا. تسجّل AuthorChain هاش SHA-256 (بصمة) للمخطوطة كإثبات تأليف. تبقى المخطوطة الكاملة في تخزين خاص ولا تُنشر على البلوكشين.",
  faq2q: "هل AuthorChain مثل تسجيل حقوق النشر؟",
  faq2a:
    "لا. إثبات التأليف على السلسلة سجل تقني للأصل. ليس إيداعًا لدى مكتب حقوق نشر ولا استشارة قانونية عن حقوقك.",
  faq3q: "هل يصل القرّاء إلى الكتاب دون شراء؟",
  faq3a:
    "قد تعرض الصفحات العامة التسويق والأغلفة ومعاينات اختيارية. يصل الوصول الكامل لعناوين مدفوعة عبر استحقاق القارئ بعد شراء ناجح (أو وصول آخر تضبطه).",
  faq4q: "هل يمكن للمؤلفين ترجمة بيانات الكتاب الوصفية؟",
  faq4a:
    "نعم. يدعم AuthorChain Studio بيانات وصفية محلية لعرض العناوين والعناوين الفرعية والأوصاف بلغة القارئ عند تقديمك للترجمات.",
  faq5q: "هل تضمن AuthorChain موافقة KDP؟",
  faq5a:
    "لا. لا تضمن AuthorChain قبول Amazon KDP (أو أي متجر) أو الترتيب أو نتائج السياسات. نساعد على التجهيز والبيع على AuthorChain/ReaderChain؛ للمتاجر قواعدها.",
  faq6q: "كيف يعمل إثبات التأليف؟",
  faq6a:
    "ترفع مخطوطة، تجزّئها AuthorChain بـ SHA-256، ويسجّل التسجيل الناجح الإثبات على Base عبر سجل AuthorChain. قد يرى القرّاء شارة موثّقة — دون أن يعيش ملفك الخاص على السلسلة.",
};

const markerStart = /proofCardNote:\s*"[^"]*",/;
// EN-style multiline note ends before agentsTitle
const reBlock = /proofCardNote:\s*"[^"]*",\s*\n(\s*)agentsTitle:/;

for (const loc of Object.keys(packs)) {
  const path = `src/i18n/locales/${loc}.ts`;
  let c = readFileSync(path, "utf8");
  const p = packs[loc];

  // step4d
  c = c.replace(/step4d:\s*"[^"]*",/, `step4d: ${JSON.stringify(p.step4d)},`);

  if (c.includes("proofHowTitle:")) {
    console.log(loc, "already has phase2");
    writeFileSync(path, c);
    continue;
  }

  if (!reBlock.test(c)) {
    // try multiline proofCardNote
    const re2 =
      /proofCardNote:\s*\n\s*"[^"]*",\s*\n(\s*)agentsTitle:/;
    if (re2.test(c)) {
      c = c.replace(re2, (m, indent) => {
        return (
          c.match(/proofCardNote:[\s\S]*?agentsTitle:/)[0].replace(
            /agentsTitle:/,
            `${block(p).replace(/^/gm, indent.trim() ? "" : "    ").split("\n").map((l) => (l ? indent + l.trimStart() : l)).join("\n")}agentsTitle:`,
          )
        );
      });
    } else {
      console.warn("pattern miss", loc);
      // brute: insert before agentsTitle first occurrence in home
      const idx = c.indexOf("agentsTitle:");
      if (idx < 0) throw new Error("no agentsTitle " + loc);
      // find last proofCardNote before agentsTitle
      const before = c.lastIndexOf("proofCardNote:", idx);
      if (before < 0) throw new Error("no proofCardNote " + loc);
      const afterNote = c.indexOf("\n", c.indexOf(",", before));
      c =
        c.slice(0, afterNote + 1) +
        block(p) +
        c.slice(afterNote + 1);
    }
  } else {
    c = c.replace(reBlock, (match, indent) => {
      const noteLine = match.slice(0, match.indexOf("\n") + 1);
      return noteLine + block(p) + `${indent}agentsTitle:`;
    });
  }

  writeFileSync(path, c);
  console.log("ok", loc, c.includes("proofHowTitle:"), c.includes("faq6a:"));
}
