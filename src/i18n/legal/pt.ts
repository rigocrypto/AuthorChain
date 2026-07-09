import type { LegalBundle } from "./types";

const bundle: LegalBundle = {
  "privacy": {
    "sections": [
      {
        "title": "1. Quem somos",
        "blocks": [
          {
            "p": "A AuthorChain (\"nós\") opera AuthorChain e ReaderChain. Contacto: {{email}}. Veja [[/contact|contacto]]."
          }
        ]
      },
      {
        "id": "data-protection",
        "title": "2. Dados que recolhemos",
        "blocks": [
          {
            "p": "Consoante o uso, podemos tratar:"
          },
          {
            "list": [
              "Dados de conta (email, carteira, nome, IDs de auth).",
              "Dados de publicação (metadados, capas, manuscritos, pré-visualizações, preços, ISBN).",
              "Transações (compras, reembolsos, referências de pagamento — sem números de cartão completos).",
              "Dados técnicos (IP, dispositivo/browser, localização aproximada, logs).",
              "Comunicações de suporte."
            ]
          }
        ]
      },
      {
        "title": "3. Como usamos os dados",
        "blocks": [
          {
            "list": [
              "Fornecer e melhorar os serviços.",
              "Autenticar e analisar uploads.",
              "Processar vendas e biblioteca.",
              "Provas on-chain sob pedido.",
              "Cumprir a lei."
            ]
          }
        ]
      },
      {
        "title": "4. Bases legais (RGPD)",
        "blocks": [
          {
            "p": "Tratamento para contrato, interesses legítimos, consentimento quando exigido e obrigações legais."
          }
        ]
      },
      {
        "title": "5. Partilha",
        "blocks": [
          {
            "p": "Processadores com salvaguardas contratuais. Não vendemos dados pessoais."
          }
        ]
      },
      {
        "title": "6. Transferências internacionais",
        "blocks": [
          {
            "p": "Processamento possível nos EUA e noutros países com mecanismos adequados."
          }
        ]
      },
      {
        "title": "7. Conservação",
        "blocks": [
          {
            "p": "Enquanto a conta estiver ativa e para fins legais. Registos on-chain públicos não apagáveis por nós."
          }
        ]
      },
      {
        "title": "8. Os seus direitos",
        "blocks": [
          {
            "p": "Acesso, retificação, apagamento, limitação, portabilidade, oposição ou retirada de consentimento. Contacte-nos."
          }
        ]
      },
      {
        "title": "9. Menores",
        "blocks": [
          {
            "p": "Não dirigido a menores de 16 (ou idade superior local)."
          }
        ]
      },
      {
        "title": "10. Alterações",
        "blocks": [
          {
            "p": "Política atualizável; mudanças materiais na data de atualização."
          }
        ]
      }
    ]
  },
  "terms": {
    "sections": [
      {
        "title": "1. Acordo",
        "blocks": [
          {
            "p": "Ao usar AuthorChain ou ReaderChain aceita os Termos, a [[/privacy|Privacidade]] e o [[/acceptable-use|Uso aceitável]]."
          }
        ]
      },
      {
        "title": "2. O serviço",
        "blocks": [
          {
            "p": "Ferramentas para autores e descoberta/compra/biblioteca para leitores."
          }
        ]
      },
      {
        "title": "3. Contas",
        "blocks": [
          {
            "list": [
              "Informação exata e credenciais seguras.",
              "Responsável pela atividade da conta.",
              "Suspensão possível por violação."
            ]
          }
        ]
      },
      {
        "title": "4. Conteúdo e licenças",
        "blocks": [
          {
            "p": "Mantém a titularidade; concede licença limitada para operar o serviço."
          },
          {
            "p": "Declara ter direitos de publicação e venda."
          }
        ]
      },
      {
        "title": "5. Prova on-chain",
        "blocks": [
          {
            "p": "Registo técnico (hash público), não registo governamental de copyright."
          }
        ]
      },
      {
        "title": "6. Pagamentos",
        "blocks": [
          {
            "p": "Preços dos autores. Stripe para cartões. Taxas, impostos e chargebacks possíveis."
          }
        ]
      },
      {
        "id": "disclaimers",
        "title": "7. Isenções",
        "blocks": [
          {
            "p": "SERVIÇO \"TAL COMO ESTÁ\". NA MÁXIMA MEDIDA LEGAL SEM GARANTIAS DE DISPONIBILIDADE, VENDAS OU PRECISÃO DE IA."
          }
        ]
      },
      {
        "title": "8. Limitação de responsabilidade",
        "blocks": [
          {
            "p": "Sem danos indiretos nos limites legais. Teto: max((A) pagamentos 12 meses, (B) 100 USD)."
          }
        ]
      },
      {
        "title": "9. Indemnização",
        "blocks": [
          {
            "p": "Indemnizará a AuthorChain por reclamações dos seus conteúdos ou violações."
          }
        ]
      },
      {
        "title": "10. Alterações e contacto",
        "blocks": [
          {
            "p": "Termos atualizáveis. Uso contínuo = aceitação. Questões: {{email}}."
          }
        ]
      }
    ]
  },
  "cookies": {
    "sections": [
      {
        "title": "1. O que são cookies",
        "blocks": [
          {
            "p": "Cookies e tecnologias semelhantes para preferências, sessão e uso."
          }
        ]
      },
      {
        "title": "2. Como os usamos",
        "blocks": [
          {
            "list": [
              "Essenciais: auth, segurança, core.",
              "Preferências: idioma e UI.",
              "Analytics (se ativa): tráfego agregado.",
              "Pagamentos: cookies do processador."
            ]
          }
        ]
      },
      {
        "title": "3. As suas opções",
        "blocks": [
          {
            "p": "Controlo no browser. Bloquear essenciais pode impedir login/compras."
          }
        ]
      },
      {
        "title": "4. Mais informação",
        "blocks": [
          {
            "p": "Veja [[/privacy|privacidade]] ou [[/contact|contacte-nos]]."
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
            "p": "Defesa em profundidade, least privilege, uploads fail-closed."
          }
        ]
      },
      {
        "id": "uploads",
        "title": "2. Análise de uploads",
        "blocks": [
          {
            "list": [
              "Scan de malware antes do armazenamento se configurado.",
              "Rejeições com mensagens seguras sem output bruto na UI.",
              "Scanner indisponível ⇒ novos uploads recusados."
            ]
          }
        ]
      },
      {
        "title": "3. Controlo de acesso",
        "blocks": [
          {
            "list": [
              "Studio/biblioteca autenticados.",
              "Downloads por direito de compra.",
              "APIs privadas fora da indexação."
            ]
          }
        ]
      },
      {
        "title": "4. Pagamentos e segredos",
        "blocks": [
          {
            "p": "Cartões via Stripe. Segredos só em env. Webhooks assinados."
          }
        ]
      },
      {
        "title": "5. Provas blockchain",
        "blocks": [
          {
            "p": "Hashes de conteúdo para verificabilidade pública."
          }
        ]
      },
      {
        "title": "6. Divulgação responsável",
        "blocks": [
          {
            "p": "Vulnerabilidades: {{email}} com descrição clara."
          }
        ]
      },
      {
        "title": "7. Políticas relacionadas",
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
        "title": "1. Propriedade intelectual",
        "blocks": [
          {
            "p": "Só carregue/venda obras de que tenha direitos. [[/acceptable-use|Uso aceitável]]."
          }
        ]
      },
      {
        "title": "2. Prova on-chain ≠ registo de copyright",
        "blocks": [
          {
            "p": "Hash técnico público — não é depósito governamental."
          }
        ]
      },
      {
        "title": "3. Denúncia (estilo DMCA)",
        "blocks": [
          {
            "p": "Envie aviso para {{email}} incluindo:"
          },
          {
            "list": [
              "Contactos.",
              "Obra protegida.",
              "URL do material.",
              "Boa-fé de uso não autorizado.",
              "Exatidão e qualidade de titular.",
              "Assinatura."
            ]
          },
          {
            "p": "Podemos remover o material e notificar o uploader."
          }
        ]
      },
      {
        "title": "4. Contranotificação",
        "blocks": [
          {
            "p": "Se a remoção for errada, contranotificação no mesmo endereço."
          }
        ]
      },
      {
        "title": "5. Marcas",
        "blocks": [
          {
            "p": "AuthorChain e ReaderChain são nossas marcas."
          }
        ]
      }
    ]
  },
  "acceptableUse": {
    "sections": [
      {
        "title": "1. Objetivo",
        "blocks": [
          {
            "p": "Regras para uso seguro. Violações: remoção, suspensão ou ação legal."
          }
        ]
      },
      {
        "title": "2. Conteúdo proibido",
        "blocks": [
          {
            "list": [
              "Malware/phishing.",
              "Obras infratoras e dumps de dados.",
              "Exploração de menores.",
              "Ameaças violentas.",
              "Fraudes.",
              "Imagens íntimas sem consentimento / doxxing.",
              "Spam e metadados enganosos."
            ]
          }
        ]
      },
      {
        "title": "3. Conduta proibida",
        "blocks": [
          {
            "list": [
              "Contornar auth/scan.",
              "Scraping de bibliotecas privadas.",
              "Interferir com provas/vendas.",
              "Falsificar afiliação oficial."
            ]
          }
        ]
      },
      {
        "title": "4. Integridade editorial",
        "blocks": [
          {
            "p": "Descrições exatas. IA ajuda no marketing; permanece responsável."
          }
        ]
      },
      {
        "title": "5. Aplicação",
        "blocks": [
          {
            "p": "Investigações e remoções. [[/contact|Contacto]]."
          }
        ]
      }
    ]
  },
  "contact": {
    "sections": [
      {
        "title": "Suporte e pedidos gerais",
        "blocks": [
          {
            "p": "Email {{email}}. Respondemos assim que possível."
          },
          {
            "p": "Privacidade e copyright: mesmo email ([[/copyright|Copyright e DMCA]])."
          }
        ]
      },
      {
        "title": "Relatórios de segurança",
        "blocks": [
          {
            "p": "Vulnerabilidades: {{email}} com \"Security\" no assunto. [[/security|Segurança]]."
          }
        ]
      },
      {
        "title": "Políticas",
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
