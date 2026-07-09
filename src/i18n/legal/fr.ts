import type { LegalBundle } from "./types";

const bundle: LegalBundle = {
  "privacy": {
    "sections": [
      {
        "title": "1. Qui nous sommes",
        "blocks": [
          {
            "p": "AuthorChain (« nous ») exploite AuthorChain et ReaderChain. Contact : {{email}}. Voir [[/contact|contact]]."
          }
        ]
      },
      {
        "id": "data-protection",
        "title": "2. Données collectées",
        "blocks": [
          {
            "p": "Selon l’usage, nous pouvons traiter :"
          },
          {
            "list": [
              "Données de compte (e-mail, portefeuille, nom, identifiants d’auth).",
              "Données d’édition (métadonnées, couvertures, manuscrits, aperçus, prix, ISBN).",
              "Transactions (achats, remboursements, références processeur — pas de numéros de carte complets).",
              "Données techniques (IP, appareil/navigateur, localisation approximative, journaux).",
              "Communications d’assistance."
            ]
          }
        ]
      },
      {
        "title": "3. Utilisation des données",
        "blocks": [
          {
            "list": [
              "Fournir et améliorer AuthorChain et ReaderChain.",
              "Authentifier, prévenir les abus et analyser les fichiers.",
              "Traiter les ventes et la bibliothèque lecteur.",
              "Enregistrer des preuves on-chain sur demande.",
              "Respecter la loi."
            ]
          }
        ]
      },
      {
        "title": "4. Bases légales (RGPD)",
        "blocks": [
          {
            "p": "Traitement pour contrat, intérêts légitimes, consentement si requis et obligations légales."
          }
        ]
      },
      {
        "title": "5. Partage",
        "blocks": [
          {
            "p": "Sous-traitants sous garanties contractuelles. Pas de vente de données personnelles. Divulgation si la loi l’exige."
          }
        ]
      },
      {
        "title": "6. Transferts internationaux",
        "blocks": [
          {
            "p": "Données pouvant être traitées aux États-Unis et ailleurs avec mécanismes appropriés."
          }
        ]
      },
      {
        "title": "7. Conservation",
        "blocks": [
          {
            "p": "Pendant la durée du compte et besoins légaux/fiscaux/sécurité. Enregistrements on-chain publics non effaçables par nous."
          }
        ]
      },
      {
        "title": "8. Vos droits",
        "blocks": [
          {
            "p": "Accès, rectification, effacement, limitation, portabilité, opposition ou retrait du consentement. Contactez-nous."
          }
        ]
      },
      {
        "title": "9. Enfants",
        "blocks": [
          {
            "p": "Non destiné aux moins de 16 ans (ou âge supérieur local)."
          }
        ]
      },
      {
        "title": "10. Modifications",
        "blocks": [
          {
            "p": "Politique actualisable ; changements matériels dans la date de mise à jour."
          }
        ]
      }
    ]
  },
  "terms": {
    "sections": [
      {
        "title": "1. Accord",
        "blocks": [
          {
            "p": "En utilisant AuthorChain ou ReaderChain vous acceptez les Conditions, la [[/privacy|confidentialité]] et l’[[/acceptable-use|utilisation acceptable]]."
          }
        ]
      },
      {
        "title": "2. Le service",
        "blocks": [
          {
            "p": "Outils auteurs et découverte/achat/bibliothèque lecteurs. Fonctions variables ou configurables."
          }
        ]
      },
      {
        "title": "3. Comptes",
        "blocks": [
          {
            "list": [
              "Informations exactes et identifiants sécurisés.",
              "Responsabilité de l’activité du compte.",
              "Suspension possible en cas de violation."
            ]
          }
        ]
      },
      {
        "title": "4. Contenus & licences",
        "blocks": [
          {
            "p": "Vous conservez la propriété ; licence limitée pour opérer le service (scan malware, formats, vitrine)."
          },
          {
            "p": "Vous déclarez disposer des droits de publication et de vente."
          }
        ]
      },
      {
        "title": "5. Preuve on-chain",
        "blocks": [
          {
            "p": "Enregistrement technique (hash public), pas un dépôt de copyright gouvernemental."
          }
        ]
      },
      {
        "title": "6. Paiements",
        "blocks": [
          {
            "p": "Prix des auteurs. Stripe (ou équivalent) pour les cartes. Frais, taxes, rétrofacturations possibles."
          }
        ]
      },
      {
        "id": "disclaimers",
        "title": "7. Avertissements",
        "blocks": [
          {
            "p": "SERVICE « EN L’ÉTAT ». PAS DE GARANTIE DE DISPONIBILITÉ, DE VENTES OU D’EXACTITUDE IA DANS LES LIMITES LÉGALES."
          }
        ]
      },
      {
        "title": "8. Limitation de responsabilité",
        "blocks": [
          {
            "p": "Pas de dommages indirects dans les limites légales. Plafond : max((A) paiements 12 mois, (B) 100 USD)."
          }
        ]
      },
      {
        "title": "9. Indemnisation",
        "blocks": [
          {
            "p": "Vous indemniserez AuthorChain pour réclamations liées à vos contenus ou violations."
          }
        ]
      },
      {
        "title": "10. Modifications & contact",
        "blocks": [
          {
            "p": "Conditions modifiables. Usage continu = acceptation. Questions : {{email}}."
          }
        ]
      }
    ]
  },
  "cookies": {
    "sections": [
      {
        "title": "1. Que sont les cookies",
        "blocks": [
          {
            "p": "Cookies et technologies similaires pour préférences, session et usage."
          }
        ]
      },
      {
        "title": "2. Utilisation",
        "blocks": [
          {
            "list": [
              "Essentiels : auth, sécurité, fonctions de base.",
              "Préférences : langue et UI.",
              "Analytics (si activée) : trafic agrégé.",
              "Paiements : cookies du processeur."
            ]
          }
        ]
      },
      {
        "title": "3. Vos choix",
        "blocks": [
          {
            "p": "Contrôle navigateur. Bloquer l’essentiel peut empêcher connexion/achats."
          }
        ]
      },
      {
        "title": "4. Plus d’infos",
        "blocks": [
          {
            "p": "Voir [[/privacy|confidentialité]] ou [[/contact|nous contacter]]."
          }
        ]
      }
    ]
  },
  "security": {
    "sections": [
      {
        "title": "1. Notre posture",
        "blocks": [
          {
            "p": "Défense en profondeur, least privilege, uploads fail-closed."
          }
        ]
      },
      {
        "id": "uploads",
        "title": "2. Analyse des envois",
        "blocks": [
          {
            "list": [
              "Scan malware avant stockage si configuré.",
              "Rejets avec messages sûrs sans sortie brute en UI.",
              "Scanner indisponible ⇒ nouveaux envois refusés."
            ]
          }
        ]
      },
      {
        "title": "3. Contrôle d’accès",
        "blocks": [
          {
            "list": [
              "Studio/bibliothèque authentifiés.",
              "Téléchargements selon droit d’achat.",
              "APIs privées hors indexation."
            ]
          }
        ]
      },
      {
        "title": "4. Paiements & secrets",
        "blocks": [
          {
            "p": "Cartes via Stripe. Secrets en variables d’environnement. Webhooks signés."
          }
        ]
      },
      {
        "title": "5. Preuves blockchain",
        "blocks": [
          {
            "p": "Hashes de contenu pour vérifiabilité publique."
          }
        ]
      },
      {
        "title": "6. Divulgation responsable",
        "blocks": [
          {
            "p": "Vulnérabilités : {{email}} avec description claire."
          }
        ]
      },
      {
        "title": "7. Politiques liées",
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
        "title": "1. Propriété intellectuelle",
        "blocks": [
          {
            "p": "N’uploadez que des œuvres dont vous avez les droits. [[/acceptable-use|Utilisation acceptable]]."
          }
        ]
      },
      {
        "title": "2. Preuve on-chain ≠ dépôt de copyright",
        "blocks": [
          {
            "p": "Hash technique public — pas un dépôt officiel."
          }
        ]
      },
      {
        "title": "3. Signalement (type DMCA)",
        "blocks": [
          {
            "p": "Écrivez à {{email}} en indiquant :"
          },
          {
            "list": [
              "Coordonnées.",
              "Œuvre protégée.",
              "URL du contenu.",
              "Bonne foi d’usage non autorisé.",
              "Exactitude sous peine de parjure et qualité de titulaire.",
              "Signature."
            ]
          },
          {
            "p": "Nous pouvons retirer le contenu et notifier l’uploader."
          }
        ]
      },
      {
        "title": "4. Contre-notification",
        "blocks": [
          {
            "p": "En cas d’erreur, contre-notification à la même adresse."
          }
        ]
      },
      {
        "title": "5. Marques",
        "blocks": [
          {
            "p": "AuthorChain et ReaderChain sont nos marques."
          }
        ]
      }
    ]
  },
  "acceptableUse": {
    "sections": [
      {
        "title": "1. Objectif",
        "blocks": [
          {
            "p": "Règles d’usage sûr. Violations : retrait, suspension ou action légale."
          }
        ]
      },
      {
        "title": "2. Contenus interdits",
        "blocks": [
          {
            "list": [
              "Malware/phishing.",
              "Contrefaçon et fuites de données.",
              "Exploitation de mineurs.",
              "Menaces violentes.",
              "Fraudes.",
              "Images intimes non consenties / doxxing.",
              "Spam et métadonnées trompeuses."
            ]
          }
        ]
      },
      {
        "title": "3. Conduites interdites",
        "blocks": [
          {
            "list": [
              "Contourner auth/scan.",
              "Scraping de bibliothèques privées.",
              "Perturber preuves/ventes.",
              "Usurpation d’affiliation officielle."
            ]
          }
        ]
      },
      {
        "title": "4. Intégrité éditoriale",
        "blocks": [
          {
            "p": "Descriptions exactes. L’IA aide au marketing ; vous restez responsable."
          }
        ]
      },
      {
        "title": "5. Application",
        "blocks": [
          {
            "p": "Enquêtes et retraits. [[/contact|Contact]]."
          }
        ]
      }
    ]
  },
  "contact": {
    "sections": [
      {
        "title": "Support & demandes générales",
        "blocks": [
          {
            "p": "E-mail {{email}}. Réponse dès que possible."
          },
          {
            "p": "Vie privée et copyright : même adresse ([[/copyright|Copyright et DMCA]])."
          }
        ]
      },
      {
        "title": "Signalements sécurité",
        "blocks": [
          {
            "p": "Vulnérabilités : {{email}} avec « Security » en objet. [[/security|Sécurité]]."
          }
        ]
      },
      {
        "title": "Politiques",
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
