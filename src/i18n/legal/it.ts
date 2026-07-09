import type { LegalBundle } from "./types";

const bundle: LegalBundle = {
  "privacy": {
    "sections": [
      {
        "title": "1. Chi siamo",
        "blocks": [
          {
            "p": "AuthorChain (\"noi\") gestisce AuthorChain e ReaderChain. Contatto: {{email}}. Vedi [[/contact|contatti]]."
          }
        ]
      },
      {
        "id": "data-protection",
        "title": "2. Dati raccolti",
        "blocks": [
          {
            "p": "A seconda dell’uso possiamo trattare:"
          },
          {
            "list": [
              "Dati account (email, wallet, nome, ID auth).",
              "Dati di pubblicazione (metadati, copertine, manoscritti, preview, prezzi, ISBN).",
              "Transazioni (acquisti, rimborsi, riferimenti pagamento — non numeri carta completi).",
              "Dati tecnici (IP, device/browser, posizione approssimativa, log).",
              "Comunicazioni di supporto."
            ]
          }
        ]
      },
      {
        "title": "3. Uso dei dati",
        "blocks": [
          {
            "list": [
              "Fornire e migliorare i servizi.",
              "Autenticare e scansionare upload.",
              "Gestire vendite e libreria.",
              "Prove on-chain su richiesta.",
              "Rispettare la legge."
            ]
          }
        ]
      },
      {
        "title": "4. Basi giuridiche (GDPR)",
        "blocks": [
          {
            "p": "Trattamento per contratto, interessi legittimi, consenso se richiesto e obblighi di legge."
          }
        ]
      },
      {
        "title": "5. Condivisione",
        "blocks": [
          {
            "p": "Processori con garanzie contrattuali. Non vendiamo dati personali."
          }
        ]
      },
      {
        "title": "6. Trasferimenti internazionali",
        "blocks": [
          {
            "p": "Elaborazione possibile in USA e altrove con meccanismi adeguati."
          }
        ]
      },
      {
        "title": "7. Conservazione",
        "blocks": [
          {
            "p": "Per la durata dell’account e necessità legali. Record on-chain pubblici non cancellabili da noi."
          }
        ]
      },
      {
        "title": "8. I tuoi diritti",
        "blocks": [
          {
            "p": "Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione o revoca. Contattaci."
          }
        ]
      },
      {
        "title": "9. Minori",
        "blocks": [
          {
            "p": "Non destinato a minori di 16 anni (o età superiore locale)."
          }
        ]
      },
      {
        "title": "10. Modifiche",
        "blocks": [
          {
            "p": "Politica aggiornabile; cambiamenti rilevanti nella data di aggiornamento."
          }
        ]
      }
    ]
  },
  "terms": {
    "sections": [
      {
        "title": "1. Accordo",
        "blocks": [
          {
            "p": "Usando AuthorChain o ReaderChain accetti Termini, [[/privacy|Privacy]] e [[/acceptable-use|Uso accettabile]]."
          }
        ]
      },
      {
        "title": "2. Il servizio",
        "blocks": [
          {
            "p": "Strumenti per autori e marketplace/biblioteca per lettori."
          }
        ]
      },
      {
        "title": "3. Account",
        "blocks": [
          {
            "list": [
              "Informazioni accurate e credenziali sicure.",
              "Responsabilità sull’attività.",
              "Sospensione possibile per violazioni."
            ]
          }
        ]
      },
      {
        "title": "4. Contenuti e licenze",
        "blocks": [
          {
            "p": "Resti titolare; concedi licenza limitata per operare il servizio."
          },
          {
            "p": "Dichiari di avere i diritti di pubblicazione e vendita."
          }
        ]
      },
      {
        "title": "5. Prova on-chain",
        "blocks": [
          {
            "p": "Record tecnico (hash pubblico), non registrazione governativa di copyright."
          }
        ]
      },
      {
        "title": "6. Pagamenti",
        "blocks": [
          {
            "p": "Prezzi degli autori. Stripe per carte. Commissioni, tasse, chargeback possibili."
          }
        ]
      },
      {
        "id": "disclaimers",
        "title": "7. Disclaimer",
        "blocks": [
          {
            "p": "SERVIZIO \"COSÌ COM’È\". NEI LIMITI DI LEGGE SENZA GARANZIE DI DISPONIBILITÀ, VENDITE O ACCURATEZZA IA."
          }
        ]
      },
      {
        "title": "8. Limitazione di responsabilità",
        "blocks": [
          {
            "p": "Niente danni indiretti nei limiti di legge. Cap: max((A) pagamenti 12 mesi, (B) 100 USD)."
          }
        ]
      },
      {
        "title": "9. Manleva",
        "blocks": [
          {
            "p": "Indennizzerai AuthorChain per reclami da contenuti o violazioni."
          }
        ]
      },
      {
        "title": "10. Modifiche e contatti",
        "blocks": [
          {
            "p": "Termini aggiornabili. Uso continuato = accettazione. Domande: {{email}}."
          }
        ]
      }
    ]
  },
  "cookies": {
    "sections": [
      {
        "title": "1. Cosa sono i cookie",
        "blocks": [
          {
            "p": "Cookie e tecnologie simili per preferenze, sessione e uso."
          }
        ]
      },
      {
        "title": "2. Come li usiamo",
        "blocks": [
          {
            "list": [
              "Essenziali: auth, sicurezza, core.",
              "Preferenze: lingua e UI.",
              "Analytics (se attiva): traffico aggregato.",
              "Pagamenti: cookie del processore."
            ]
          }
        ]
      },
      {
        "title": "3. Le tue scelte",
        "blocks": [
          {
            "p": "Controllo dal browser. Bloccare gli essenziali può impedire login/acquisti."
          }
        ]
      },
      {
        "title": "4. Maggiori info",
        "blocks": [
          {
            "p": "Vedi [[/privacy|privacy]] o [[/contact|contattaci]]."
          }
        ]
      }
    ]
  },
  "security": {
    "sections": [
      {
        "title": "1. Postura",
        "blocks": [
          {
            "p": "Difesa in profondità, least privilege, upload fail-closed."
          }
        ]
      },
      {
        "id": "uploads",
        "title": "2. Scansione upload",
        "blocks": [
          {
            "list": [
              "Scan malware prima dello storage se configurato.",
              "Rifiuti con messaggi sicuri senza output grezzo in UI.",
              "Scanner down ⇒ nuovi upload bloccati."
            ]
          }
        ]
      },
      {
        "title": "3. Controllo accessi",
        "blocks": [
          {
            "list": [
              "Studio/libreria autenticati.",
              "Download per diritto d’acquisto.",
              "API private non indicizzate."
            ]
          }
        ]
      },
      {
        "title": "4. Pagamenti e segreti",
        "blocks": [
          {
            "p": "Carte via Stripe. Secret solo in env. Webhook firmati."
          }
        ]
      },
      {
        "title": "5. Prove blockchain",
        "blocks": [
          {
            "p": "Hash di contenuto per verificabilità pubblica."
          }
        ]
      },
      {
        "title": "6. Responsible disclosure",
        "blocks": [
          {
            "p": "Vulnerabilità: {{email}} con descrizione chiara."
          }
        ]
      },
      {
        "title": "7. Policy collegate",
        "blocks": [
          {
            "policyLinks": true
          }
        ]
      }
    ]
  },
  "copyright": {
    "sections": [
      {
        "title": "1. Proprietà intellettuale",
        "blocks": [
          {
            "p": "Carica/vendi solo opere di cui hai i diritti. [[/acceptable-use|Uso accettabile]]."
          }
        ]
      },
      {
        "title": "2. Prova on-chain ≠ copyright ufficiale",
        "blocks": [
          {
            "p": "Hash tecnico pubblico — non deposito governativo."
          }
        ]
      },
      {
        "title": "3. Segnalazione (stile DMCA)",
        "blocks": [
          {
            "p": "Scrivi a {{email}} includendo:"
          },
          {
            "list": [
              "Contatti.",
              "Opera protetta.",
              "URL del materiale.",
              "Buona fede di uso non autorizzato.",
              "Accuratezza e qualità di titolare.",
              "Firma."
            ]
          },
          {
            "p": "Possiamo rimuovere il materiale e avvisare l’uploader."
          }
        ]
      },
      {
        "title": "4. Contro-notifica",
        "blocks": [
          {
            "p": "Se la rimozione è errata, contro-notifica allo stesso indirizzo."
          }
        ]
      },
      {
        "title": "5. Marchi",
        "blocks": [
          {
            "p": "AuthorChain e ReaderChain sono nostri marchi."
          }
        ]
      }
    ]
  },
  "acceptableUse": {
    "sections": [
      {
        "title": "1. Scopo",
        "blocks": [
          {
            "p": "Regole per uso sicuro. Violazioni: rimozione, sospensione o azioni legali."
          }
        ]
      },
      {
        "title": "2. Contenuti proibiti",
        "blocks": [
          {
            "list": [
              "Malware/phishing.",
              "Opere in violazione e dump di dati.",
              "Sfruttamento di minori.",
              "Minacce violente.",
              "Frodi.",
              "Immagini intime non consensuali / doxxing.",
              "Spam e metadati ingannevoli."
            ]
          }
        ]
      },
      {
        "title": "3. Condotte proibite",
        "blocks": [
          {
            "list": [
              "Eludere auth/scan.",
              "Scraping librerie private.",
              "Interferire con prove/vendite.",
              "Fingere affiliazione ufficiale."
            ]
          }
        ]
      },
      {
        "title": "4. Integrità editoriale",
        "blocks": [
          {
            "p": "Descrizioni accurate. L’IA aiuta il marketing; resti responsabile."
          }
        ]
      },
      {
        "title": "5. Enforcement",
        "blocks": [
          {
            "p": "Indagini e rimozioni. [[/contact|Contatti]]."
          }
        ]
      }
    ]
  },
  "contact": {
    "sections": [
      {
        "title": "Supporto e richieste generali",
        "blocks": [
          {
            "p": "Email {{email}}. Rispondiamo appena possibile."
          },
          {
            "p": "Privacy e copyright: stessa email ([[/copyright|Copyright e DMCA]])."
          }
        ]
      },
      {
        "title": "Segnalazioni di sicurezza",
        "blocks": [
          {
            "p": "Vulnerabilità: {{email}} con \"Security\" nell’oggetto. [[/security|Sicurezza]]."
          }
        ]
      },
      {
        "title": "Policy",
        "blocks": [
          {
            "policyLinks": true
          }
        ]
      }
    ]
  }
};

export default bundle;
