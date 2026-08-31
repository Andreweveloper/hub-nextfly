/* ────────────────────────────────────────────────
   NEXTFLY · TORRE — fonte única de dados.

   Hoje tudo aqui é local e fixo. Quando o Hub subir pra VPS com
   banco, é ESTE arquivo que muda: cada função vira um fetch()
   e o resto do Hub não precisa saber. Nenhum outro arquivo lê
   dado direto — todos passam por Dados.*
   ──────────────────────────────────────────────── */

window.Dados = (function () {
  'use strict';

  /* ── Agentes: espelham ~/.claude/agents/*.md ───────────── */

  var agentes = [
    {
      id: 'spy',
      codigo: 'SPY-01',
      nome: 'Spy',
      papel: 'Inteligência competitiva de anúncios',
      estado: 'ativo',
      tarefa: 'Varredura Meta Ad Library · nicho estética',
      tempo: '03:12',
      metrica: '1.284 ads',
      modelo: 'sessão',
      ferramentas: ['Read', 'Write', 'Bash', 'Grep', 'Glob', 'WebSearch', 'WebFetch'],
      entrega: 'Um mapa de ofertas, ângulos de copy e formatos que os concorrentes de um nicho estão validando agora — gravado em SQLite, uma linha por ad_id.',
      pontos: [
        ['Coleta', 'Meta Ad Library por API oficial quando há token; Playwright como fallback.'],
        ['Classifica', 'cada anúncio por ângulo (dor / desejo / prova / mecanismo / urgência), formato e estágio de funil.'],
        ['Sinaliza', 'repetição sustentada — anúncio que fica no ar é o sinal mais forte de que algo funciona.']
      ],
      pedeAntes: 'Nicho, produto ou página do anunciante, e o país.',
      comando: 'Use o agente spy para mapear os ângulos e ofertas em circulação no nicho de [NICHO] no Brasil.'
    },
    {
      id: 'traffic',
      codigo: 'TRF-02',
      nome: 'Traffic',
      papel: 'Matemática de escala e decisão de budget',
      estado: 'espera',
      tarefa: 'Aguardando piso de 50 conversões · CBO Litoral',
      tempo: '--:--',
      metrica: '38 / 50 conv',
      modelo: 'sessão',
      ferramentas: ['Read', 'Write', 'Bash', 'Grep'],
      entrega: 'Um veredito por adset — escalar, manter, cortar ou matar — sempre com a justificativa numérica explícita, nunca "está indo bem".',
      pontos: [
        ['Piso de 50 conversões', 'abaixo disso a variância separa mal sinal de ruído. Recomendação padrão: aguardar.'],
        ['Teto de 20% por passo', 'salto maior reinicia o aprendizado da Meta e degrada performance.'],
        ['Cooldown de 48h', 'entre qualquer alteração de budget no mesmo adset.'],
        ['Intervalo de Wilson', 'só declara vencedor quando os intervalos de 95% não se sobrepõem.']
      ],
      pedeAntes: 'Gasto, conversões, CPA, CVR e período de veiculação do adset.',
      comando: 'Use o agente traffic para decidir o que fazer com o adset [NOME]: gasto R$ [X], [N] conversões, CPA R$ [Y], rodando há [D] dias.'
    },
    {
      id: 'creative',
      codigo: 'CRE-03',
      nome: 'Creative',
      papel: 'Roteiros de alta retenção e diagnóstico de criativo',
      estado: 'ativo',
      tarefa: 'Roteiro Reels · 3 variações de hook',
      tempo: '00:41',
      metrica: '3 hooks',
      modelo: 'sessão',
      ferramentas: ['Read', 'Write', 'Bash', 'Grep'],
      entrega: 'Roteiro em Hook / Body / CTA com marcação de tempo e nota de direção — ou o diagnóstico de em qual etapa um criativo já rodando está falhando.',
      pontos: [
        ['Hook (0–3s)', 'a tensão que impede o scroll. Sempre 3 variações, para teste A/B.'],
        ['Body', 'dor → agita → mecanismo único → prova. Cada frase justifica a permanência.'],
        ['CTA', 'uma instrução só, alinhada ao estágio de funil.'],
        ['Diagnóstico', 'hook rate baixo culpa a abertura; queda entre 25–50% culpa o corpo; CTR baixo culpa a oferta.']
      ],
      pedeAntes: 'Produto, avatar, dor principal e oferta. Para diagnóstico: hook rate e hold rate reais.',
      comando: 'Use o agente creative para escrever um roteiro de Reels para [PRODUTO], avatar [QUEM], dor principal [DOR].'
    },
    {
      id: 'prospector-local',
      codigo: 'PRO-04',
      nome: 'Prospector Local',
      papel: 'Varredura de comércios sem site no litoral de SC',
      estado: 'ativo',
      tarefa: 'Google Maps · barbearias · Itajaí',
      tempo: '12:08',
      metrica: '47 leads',
      modelo: 'sonnet',
      ferramentas: ['Bash', 'PowerShell', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Artifact'],
      entrega: 'Uma lista de comércios que atendem hoje, aparecem no Maps e não têm site — cada um com a mensagem de WhatsApp já escrita para a dor do ramo, publicada no Cais 47.',
      pontos: [
        ['Varre', 'a matriz nicho × cidade no Maps, extrai nome, telefone e site.'],
        ['Descarta', 'quem já tem site — o produto é justamente quem não tem.'],
        ['Escreve', 'a copy de abordagem por ramo e injeta no painel.'],
        ['Publica', 'no Cais 47, a bancada onde a situação de cada lead é marcada.']
      ],
      pedeAntes: 'O nicho e a cidade. Ex.: "acha pet shops em Navegantes".',
      comando: 'Use o agente prospector-local para varrer [NICHO] em [CIDADE] e publicar no Cais 47.'
    }
  ];

  /* ── Prospecção ───────────────────────────── */

  var cidades = [
    { nome: 'Itajaí',             leads: 312, semSite: 187 },
    { nome: 'Balneário Camboriú', leads: 268, semSite: 121 },
    { nome: 'Navegantes',         leads: 154, semSite: 98  },
    { nome: 'Camboriú',           leads: 97,  semSite: 63  },
    { nome: 'Itapema',            leads: 88,  semSite: 44  }
  ];

  var leads = [
    { nome: 'Barbearia Maré Alta',     ramo: 'Barbearia',   cidade: 'Itajaí',             fone: '(47) 9 8812-4471', estado: 'respondeu' },
    { nome: 'Pet Shop Focinho Feliz',  ramo: 'Pet shop',    cidade: 'Navegantes',         fone: '(47) 9 9134-2280', estado: 'enviado'   },
    { nome: 'Studio Bianca Nails',     ramo: 'Estética',    cidade: 'Balneário Camboriú', fone: '(47) 9 9902-7715', estado: 'fechado'   },
    { nome: 'Mecânica do Zé',          ramo: 'Automotivo',  cidade: 'Itajaí',             fone: '(47) 3348-1120',   estado: 'novo'      },
    { nome: 'Padaria Pão da Praia',    ramo: 'Alimentação', cidade: 'Itapema',            fone: '(47) 9 8877-0031', estado: 'novo'      },
    { nome: 'Odonto Sorriso Costa',    ramo: 'Saúde',       cidade: 'Camboriú',           fone: '(47) 9 9451-6688', estado: 'enviado'   },
    { nome: 'Academia Corpo & Cais',   ramo: 'Fitness',     cidade: 'Itajaí',             fone: '(47) 9 9203-4412', estado: 'respondeu' },
    { nome: 'Ótica Vista Mar',         ramo: 'Varejo',      cidade: 'Navegantes',         fone: '(47) 3342-7789',   estado: 'novo'      },
    { nome: 'Lava-jato Onda Limpa',    ramo: 'Automotivo',  cidade: 'Balneário Camboriú', fone: '(47) 9 9871-3304', estado: 'novo'      },
    { nome: 'Doceria Maré Doce',       ramo: 'Alimentação', cidade: 'Itapema',            fone: '(47) 9 9012-5567', estado: 'enviado'   },
    { nome: 'Serralheria Porto Novo',  ramo: 'Construção',  cidade: 'Itajaí',             fone: '(47) 3349-2201',   estado: 'novo'      },
    { nome: 'Salão Onda Cacheada',     ramo: 'Estética',    cidade: 'Camboriú',           fone: '(47) 9 9330-8845', estado: 'novo'      }
  ];

  /* ── Site institucional ───────────────────────── */

  var site = {
    dominio: 'nextfly.com.br',
    hospedagem: 'local · ainda não publicado',
    ultimoDeploy: 'nunca',
    paginas: [
      { rota: '/',          nome: 'Início',    estado: 'ativo'  },
      { rota: '/servicos',  nome: 'Serviços',  estado: 'ativo'  },
      { rota: '/cases',     nome: 'Cases',     estado: 'espera' },
      { rota: '/sobre',     nome: 'Sobre',     estado: 'ativo'  },
      { rota: '/contato',   nome: 'Contato',   estado: 'ativo'  },
      { rota: '/orcamento', nome: 'Orçamento', estado: 'parado' }
    ]
  };

  /* ── CRM ───────────────────────────────────── */

  var funil = [
    { etapa: 'Lead encontrado', qtd: 513, valor: 0     },
    { etapa: 'Abordado',        qtd: 218, valor: 0     },
    { etapa: 'Respondeu',       qtd: 74,  valor: 0     },
    { etapa: 'Reunião marcada', qtd: 31,  valor: 46500 },
    { etapa: 'Proposta',        qtd: 17,  valor: 32300 },
    { etapa: 'Fechado',         qtd: 9,   valor: 21600 }
  ];

  /* ── Tráfego ──────────────────────────────── */

  var campanhas = [
    { nome: 'CBO · Sites Litoral',  gasto: 4820, conv: 62, cpa: 77.7,  cvr: 3.4, dias: 14, veredito: 'escalar'  },
    { nome: 'ABO · Barbearias BC',  gasto: 1930, conv: 38, cpa: 50.8,  cvr: 4.1, dias: 9,  veredito: 'aguardar' },
    { nome: 'ABO · Pet shops Nav.', gasto: 2410, conv: 12, cpa: 200.8, cvr: 1.2, dias: 11, veredito: 'matar'    },
    { nome: 'CBO · Automação',      gasto: 3105, conv: 54, cpa: 57.5,  cvr: 3.9, dias: 16, veredito: 'manter'   }
  ];

  var regrasTrafego = [
    { n: '50',  nome: 'Piso de significância',     texto: 'Nenhuma decisão de escalar ou matar sai com menos de 50 conversões acumuladas. Abaixo disso, a recomendação padrão é aguardar mais dados.' },
    { n: '20%', nome: 'Teto por passo de escala',  texto: 'O aumento máximo de budget é 20% do valor atual. Dobrar budget reinicia o aprendizado da Meta e degrada a performance.' },
    { n: '48h', nome: 'Cooldown entre alterações', texto: 'Depois de qualquer mudança de budget, 48h de espera antes da próxima alteração no mesmo adset.' },
    { n: '95%', nome: 'Intervalo de Wilson',       texto: 'Taxas brutas não se comparam. Só há vencedor quando os intervalos de confiança de 95% não se sobrepõem.' }
  ];

  /* ── API pública ───────────────────────────── */

  return {
    agentes:       function () { return agentes; },
    agentePorId:   function (id) { return agentes.filter(function (a) { return a.id === id; })[0] || null; },
    cidades:       function () { return cidades; },
    leads:         function () { return leads; },
    site:          function () { return site; },
    funil:         function () { return funil; },
    campanhas:     function () { return campanhas; },
    regrasTrafego: function () { return regrasTrafego; }
  };
})();
