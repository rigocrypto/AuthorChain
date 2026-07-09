import type { LegalBundle } from "./types";

const es: LegalBundle = {
  privacy: {
    sections: [
      {
        title: "1. Quiénes somos",
        blocks: [
          {
            p: 'AuthorChain ("nosotros") opera la plataforma de publicación AuthorChain y la experiencia de lectura ReaderChain. Contacto: {{email}}. Véase también nuestra [[/contact|página de contacto]].',
          },
        ],
      },
      {
        id: "data-protection",
        title: "2. Datos que recopilamos",
        blocks: [
          { p: "Según cómo uses el servicio, podemos tratar:" },
          {
            list: [
              "Datos de cuenta (correo, dirección de monedero, nombre visible, identificadores de autenticación de nuestro proveedor de identidad).",
              "Datos de publicación (metadatos del libro, portadas, manuscritos, previews, precios, ISBN y activos relacionados que subas).",
              "Datos de transacciones (compras, reembolsos si aplica y referencias del procesador de pagos — no números completos de tarjeta).",
              "Datos técnicos (IP, tipo de dispositivo/navegador, ubicación aproximada derivada de la IP, registros y señales de seguridad).",
              "Comunicaciones de soporte que nos envíes.",
            ],
          },
        ],
      },
      {
        title: "3. Cómo usamos los datos",
        blocks: [
          {
            list: [
              "Prestar, asegurar y mejorar AuthorChain y ReaderChain.",
              "Autenticar usuarios, prevenir abusos y analizar cargas en busca de malware antes de almacenarlas.",
              "Procesar ventas, entregar libros comprados a la biblioteca del lector y dar soporte a autores.",
              "Registrar pruebas de autoría en cadena cuando lo solicites (las redes blockchain públicas pueden almacenar hashes y datos de transacción de forma permanente).",
              "Cumplir la ley y responder a requerimientos legales.",
            ],
          },
        ],
      },
      {
        title: "4. Bases legales (cuando aplica el RGPD / UK GDPR)",
        blocks: [
          {
            p: "Tratamos datos personales cuando es necesario para ejecutar un contrato contigo, por intereses legítimos (seguridad, mejora del producto, prevención del fraude), con consentimiento cuando se requiera (ciertas cookies o marketing) y para cumplir obligaciones legales.",
          },
        ],
      },
      {
        title: "5. Compartición",
        blocks: [
          {
            p: "Usamos encargados del tratamiento (hosting, almacenamiento, autenticación, pagos, correo y analítica) con salvaguardas contractuales. No vendemos información personal. Podemos divulgar datos si lo exige la ley o para proteger derechos, seguridad e integridad de la plataforma.",
          },
        ],
      },
      {
        title: "6. Transferencias internacionales",
        blocks: [
          {
            p: "Nuestra infraestructura y proveedores pueden tratar datos en Estados Unidos y otros países. Cuando se requiera, usamos mecanismos de transferencia adecuados (como cláusulas contractuales tipo).",
          },
        ],
      },
      {
        title: "7. Conservación",
        blocks: [
          {
            p: "Conservamos datos de cuenta y publicación mientras la cuenta esté activa y según necesidades legales, fiscales, de seguridad y de disputas. Los registros en cadena son públicos y no podemos borrarlos.",
          },
        ],
      },
      {
        title: "8. Tus derechos",
        blocks: [
          {
            p: "Según tu ubicación, puedes tener derechos de acceso, rectificación, supresión, limitación o portabilidad, y a oponerte a ciertos tratamientos o retirar el consentimiento. Contáctanos para ejercerlos. También puedes reclamar ante una autoridad de control.",
          },
        ],
      },
      {
        title: "9. Menores",
        blocks: [
          {
            p: "El servicio no está dirigido a menores de 16 años (o la edad superior exigida en tu región). No recopilamos a sabiendas sus datos.",
          },
        ],
      },
      {
        title: "10. Cambios",
        blocks: [
          {
            p: 'Podemos actualizar esta política. Los cambios materiales se reflejarán en la fecha de "Última actualización" y, cuando proceda, con aviso adicional.',
          },
        ],
      },
    ],
  },
  terms: {
    sections: [
      {
        title: "1. Acuerdo",
        blocks: [
          {
            p: "Al acceder o usar AuthorChain o ReaderChain aceptas estos Términos y nuestra [[/privacy|Política de privacidad]], [[/acceptable-use|Uso aceptable]] y políticas relacionadas. Si no estás de acuerdo, no uses el servicio.",
          },
        ],
      },
      {
        title: "2. El servicio",
        blocks: [
          {
            p: "AuthorChain ofrece herramientas para que los autores suban, preparen, prueben la autoría y vendan libros digitales. ReaderChain ofrece descubrimiento, compra y biblioteca para lectores. Las funciones pueden cambiar, limitarse por región o requerir configuración (pagos, cadena, almacenamiento).",
          },
        ],
      },
      {
        title: "3. Cuentas",
        blocks: [
          {
            list: [
              "Debes proporcionar información veraz y mantener seguras tus credenciales.",
              "Eres responsable de la actividad bajo tu cuenta.",
              "Podemos suspender o cancelar cuentas que violen estos Términos o generen riesgo de seguridad.",
            ],
          },
        ],
      },
      {
        title: "4. Contenido del autor y licencias",
        blocks: [
          {
            p: "Conservas la titularidad de manuscritos y materiales que subas, sujeto a derechos de terceros. Otorgas a AuthorChain una licencia limitada para alojar, procesar, mostrar, entregar y promocionar tu contenido según sea necesario para operar el servicio (incluido el análisis de malware, el manejo de formatos y la vitrina cuando publiques).",
          },
          {
            p: "Declaras que tienes todos los derechos necesarios para publicar y vender el contenido y que no infringe derechos de terceros ni la ley aplicable.",
          },
        ],
      },
      {
        title: "5. Prueba en cadena",
        blocks: [
          {
            p: "Las pruebas de autoría son registros técnicos (por ejemplo un hash de contenido en una blockchain pública). No son un registro de copyright gubernamental, una marca ni un título legal. Las transacciones en blockchain pueden ser irreversibles y públicas.",
          },
        ],
      },
      {
        title: "6. Pagos",
        blocks: [
          {
            p: "Los precios los fijan los autores cuando el producto lo permite. Los procesadores de pago (p. ej. Stripe) gestionan las tarjetas bajo sus términos. Pueden aplicar comisiones, impuestos y contracargos. Las opciones cripto, cuando existan, dependen de la red y la configuración.",
          },
        ],
      },
      {
        id: "disclaimers",
        title: "7. Exenciones de responsabilidad",
        blocks: [
          {
            p: 'EL SERVICIO SE OFRECE "TAL CUAL" Y "SEGÚN DISPONIBILIDAD". EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, RENUNCIAMOS A GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN DETERMINADO Y NO INFRACCIÓN. No garantizamos disponibilidad ininterrumpida, resultados de ventas, exactitud de la IA ni que las pruebas en cadena sean aceptadas por terceros o tribunales.',
          },
        ],
      },
      {
        title: "8. Limitación de responsabilidad",
        blocks: [
          {
            p: "EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, AUTHORCHAIN Y SUS OPERADORES NO SERÁN RESPONSABLES DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENCIALES O PUNITIVOS, NI DE LUCRO CESANTE, PÉRDIDA DE DATOS O DE FONDO DE COMERCIO. NUESTRA RESPONSABILIDAD AGREGADA SE LIMITA AL MAYOR ENTRE (A) LO QUE NOS HAYAS PAGADO POR EL SERVICIO EN LOS 12 MESES ANTERIORES A LA RECLAMACIÓN O (B) 100 USD.",
          },
        ],
      },
      {
        title: "9. Indemnización",
        blocks: [
          {
            p: "Defenderás e indemnizarás a AuthorChain frente a reclamaciones derivadas de tu contenido, tu uso del servicio o tu incumplimiento de estos Términos o de la ley.",
          },
        ],
      },
      {
        title: "10. Cambios y contacto",
        blocks: [
          {
            p: "Podemos actualizar estos Términos. El uso continuado tras los cambios implica aceptación. Consultas: {{email}}.",
          },
        ],
      },
    ],
  },
  cookies: {
    sections: [
      {
        title: "1. Qué son las cookies",
        blocks: [
          {
            p: "Las cookies y tecnologías similares (almacenamiento local, píxeles) ayudan a los sitios a recordar preferencias, mantener la sesión e entender el uso.",
          },
        ],
      },
      {
        title: "2. Cómo las usamos",
        blocks: [
          {
            list: [
              "Esenciales: sesiones de autenticación (p. ej. Privy), seguridad, balanceo de carga y función principal de la app.",
              "Preferencias: idioma y opciones similares de interfaz.",
              "Analítica (si está activa): tráfico agregado y mejora del producto — nunca para vender datos personales.",
              "Pagos: los procesadores pueden establecer sus propias cookies al completar el checkout.",
            ],
          },
        ],
      },
      {
        title: "3. Tus opciones",
        blocks: [
          {
            p: "Puedes controlar las cookies en la configuración del navegador. Bloquear las esenciales puede impedir el inicio de sesión o las compras. Cuando la ley lo exija, pediremos consentimiento para cookies no esenciales.",
          },
        ],
      },
      {
        title: "4. Más información",
        blocks: [
          {
            p: "Consulta nuestra [[/privacy|Política de privacidad]] para prácticas de datos más amplias, o [[/contact|contáctanos]].",
          },
        ],
      },
    ],
  },
  security: {
    sections: [
      {
        title: "1. Nuestro enfoque",
        blocks: [
          {
            p: "AuthorChain se construye con defensa en profundidad: acceso de mínimo privilegio, fallos cerrados en seguridad de cargas y separación cuidadosa entre marketing público y áreas privadas de autor y lector.",
          },
        ],
      },
      {
        id: "uploads",
        title: "2. Análisis de cargas",
        blocks: [
          {
            list: [
              "Manuscritos, portadas y previews se analizan en busca de malware antes del almacenamiento duradero cuando el análisis está configurado.",
              "Los archivos infectados o no analizables se rechazan con mensajes seguros — sin salida cruda del escáner, rutas internas, claves de almacenamiento ni URLs firmadas en la UI.",
              "Si el escáner no está disponible, las nuevas cargas fallan en cerrado en lugar de guardar archivos sin comprobar.",
            ],
          },
        ],
      },
      {
        title: "3. Control de acceso",
        blocks: [
          {
            list: [
              "Author Studio y la biblioteca del lector requieren autenticación.",
              "Los activos y descargas se autorizan por usuario y derecho de compra.",
              "El panel y las APIs privadas se excluyen de la indexación de búsqueda.",
            ],
          },
        ],
      },
      {
        title: "4. Pagos y secretos",
        blocks: [
          {
            p: "Los pagos con tarjeta los gestiona Stripe (o procesadores similares). Los secretos y tokens viven en la configuración del entorno — nunca en el bundle del cliente ni en páginas públicas. Los webhooks verifican firmas antes de actualizar el estado.",
          },
        ],
      },
      {
        title: "5. Pruebas en blockchain",
        blocks: [
          {
            p: "Los registros de autoría en cadena usan hashes de contenido. Ofrecen verificabilidad pública de una huella del manuscrito; no sustituyen el almacenamiento privado seguro de los archivos completos.",
          },
        ],
      },
      {
        title: "6. Divulgación responsable",
        blocks: [
          {
            p: "Si crees haber encontrado una vulnerabilidad, escribe a {{email}} con una descripción clara. Evita pruebas invasivas de privacidad, ingeniería social o interrupción de sistemas de producción.",
          },
        ],
      },
      {
        title: "7. Políticas relacionadas",
        blocks: [{ policyLinks: true }],
      },
    ],
  },
  copyright: {
    sections: [
      {
        title: "1. Respeto a la propiedad intelectual",
        blocks: [
          {
            p: "Los autores solo deben subir y vender obras de las que sean titulares o estén licenciados para distribuir. El contenido infractor está prohibido. Véase también nuestra política de [[/acceptable-use|Uso aceptable]].",
          },
        ],
      },
      {
        title: "2. La prueba en cadena no es un registro de copyright",
        blocks: [
          {
            p: "La función de prueba de autoría de AuthorChain registra un hash técnico del manuscrito (y metadatos de transacción relacionados) en una blockchain pública. No es un depósito en una oficina de copyright, no es asesoramiento legal ni una garantía de ejecutabilidad en ninguna jurisdicción.",
          },
        ],
      },
      {
        title: "3. Denuncia de infracción (aviso tipo DMCA)",
        blocks: [
          {
            p: "Si crees que un contenido en AuthorChain infringe tu copyright, envía un aviso a {{email}} incluyendo:",
          },
          {
            list: [
              "Tu nombre de contacto, dirección, teléfono y correo.",
              "Identificación de la obra protegida que se alega infringida.",
              "La URL o ubicación exacta del material presuntamente infractor en AuthorChain.",
              "Una declaración de buena fe de que el uso no está autorizado.",
              "Una declaración, bajo pena de perjurio, de que la información es exacta y de que eres el titular o estás autorizado a actuar.",
              "Tu firma física o electrónica.",
            ],
          },
          {
            p: "Podemos retirar o deshabilitar el acceso al material y notificar al usuario que lo subió. Podemos dar de baja a infractores reincidentes cuando proceda.",
          },
        ],
      },
      {
        title: "4. Contranotificación",
        blocks: [
          {
            p: "Si se retiró tu material y crees que fue un error o una identificación incorrecta, puedes enviar una contranotificación a la misma dirección con la información exigida por la ley aplicable (incluido el consentimiento a la jurisdicción de un tribunal competente).",
          },
        ],
      },
      {
        title: "5. Marcas",
        blocks: [
          {
            p: "Los nombres y logotipos AuthorChain y ReaderChain son nuestras marcas. No los uses de forma que confunda sobre afiliación o respaldo.",
          },
        ],
      },
    ],
  },
  acceptableUse: {
    sections: [
      {
        title: "1. Propósito",
        blocks: [
          {
            p: "Estas normas mantienen AuthorChain y ReaderChain seguros para autores, lectores y partners. Las infracciones pueden conllevar retirada de contenido, suspensión de cuenta o acciones legales.",
          },
        ],
      },
      {
        title: "2. Contenido prohibido",
        blocks: [
          {
            list: [
              "Malware, exploits, kits de phishing o archivos pensados para dañar sistemas o robar datos.",
              "Obras con copyright infringido, abuso de marcas o volcados no autorizados de datos personales.",
              "Material de abuso sexual infantil o cualquier explotación de menores.",
              "Contenido terrorista, amenazas creíbles de violencia o instrucciones para delitos violentos.",
              "Facilitación de bienes/servicios ilegales, fraudes o estafas evidentes.",
              "Imágenes íntimas no consentidas o doxxing.",
              "Spam, metadatos engañosos o prácticas manipuladoras de SEO/vitrina.",
            ],
          },
        ],
      },
      {
        title: "3. Conducta prohibida",
        blocks: [
          {
            list: [
              "Intentar eludir autenticación, controles de derecho o el análisis de malware.",
              "Hacer scraping de bibliotecas privadas, recolectar datos personales a granel o abusar de APIs.",
              "Interferir con el acceso de otros usuarios o con la integridad de pruebas y registros de ventas.",
              "Falsificar afiliación gubernamental, licencias o estado de copyright.",
            ],
          },
        ],
      },
      {
        title: "4. Integridad editorial",
        blocks: [
          {
            p: "Los autores deben describir con exactitud libros, precios y derechos. Las herramientas de IA pueden ayudar con el marketing, pero tú sigues siendo responsable de la exactitud y del cumplimiento de las normas de tiendas de terceros al exportar fuera de la plataforma.",
          },
        ],
      },
      {
        title: "5. Cumplimiento",
        blocks: [
          {
            p: "Podemos investigar denuncias, retirar contenido y cooperar con las autoridades cuando se requiera. Consultas: [[/contact|Contacto]].",
          },
        ],
      },
    ],
  },
  contact: {
    sections: [
      {
        title: "Soporte y consultas generales",
        blocks: [
          {
            p: "Correo {{email}}. Intentamos responder lo antes posible.",
          },
          {
            p: "Para solicitudes de privacidad, avisos legales e informes de copyright, usa el mismo correo e incluye detalle suficiente (véase [[/copyright|Copyright y DMCA]]).",
          },
        ],
      },
      {
        title: "Informes de seguridad",
        blocks: [
          {
            p: 'Vulnerabilidades sospechadas: escribe a {{email}} con "Security" en el asunto. Detalles: [[/security|Seguridad]].',
          },
        ],
      },
      {
        title: "Políticas",
        blocks: [{ policyLinks: true }],
      },
    ],
  },
};

export default es;
