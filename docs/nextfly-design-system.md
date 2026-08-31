# Nextfly Design System

Sistema visual da Nextfly Torre: uma central operacional dark editorial para agentes, prospecção, site, CRM e tráfego. A referência visual usada foi o Campaign Canvas, mas a identidade abaixo é própria da Nextfly e mantém o vocabulário de operação da Torre.

## Direção

A interface trabalha com silêncio visual e sinais precisos. O fundo não é preto puro: as superfícies alternam entre void, ardósia e chumbo. Linhas finas separam áreas, enquanto gradientes e halos aparecem apenas para indicar uma ação, um estado ou um domínio do produto.

Princípios:

- Uma superfície escura deve receber hierarquia por contraste, não por bordas pesadas.
- Cor indica função: esmeralda é prospecção, azul é agente ativo, rosa é CRM/conversão.
- Métricas e comandos têm voz monoespaçada; títulos e leitura comum têm voz Satoshi.
- Glow é sinal, não decoração: um estado ativo pode brilhar; cada card não precisa brilhar.
- Toda ação deve continuar compreensível sem cor, animação ou hover.

## Tokens

Os tokens vivem em `css/tokens.css`. Componentes devem usar variáveis, nunca hex direto.

### Superfícies e texto

| Token | Valor | Uso |
| --- | --- | --- |
| `--c-void` | `#080A0F` | fundo mais profundo |
| `--c-slate-1` | `#0E131B` | shell e sidebar |
| `--c-slate-2` | `#141B25` | cards e dados |
| `--c-slate-3` | `#1B2430` | hover, campos e superfícies elevadas |
| `--c-text` | `#F4F6FA` | texto principal |
| `--c-muted` | `#8994A4` | texto de suporte |
| `--c-quiet` | `#5C6878` | metadata e estados inativos |
| `--c-line` | `rgba(210,220,235,.13)` | borda padrão |
| `--c-line-strong` | `rgba(210,220,235,.22)` | borda em hover ou foco |

Aliases legados como `--placa`, `--tinta`, `--fraca` e `--linha` continuam disponíveis para os templates existentes. Novos componentes devem preferir os tokens `--c-*` e `--a-*`.

### Acentos funcionais

| Domínio | Cor | Gradiente | Aplicação |
| --- | --- | --- | --- |
| Prospecção | `--a-emerald` `#36E09A` | `--gradient-emerald` | varredura, cidades, progresso e leads |
| Agentes | `--a-blue` `#6C9BFF` | `--gradient-blue` | agentes ativos, navegação e comandos |
| CRM | `--a-pink` `#F58FBE` | `--gradient-pink` | conversão, prioridade e ação principal |
| Atenção | `--a-amber` `#E8B75A` | sem gradiente obrigatório | espera e revisão necessária |
| Erro | `--a-red` `#F16C7A` | sem gradiente obrigatório | falha ou ação destrutiva |

Use também os véus `--a-emerald-veil`, `--a-blue-veil`, `--a-pink-veil`, `--a-amber-veil` e `--a-red-veil` para fundos de baixa intensidade.

## Tipografia

- `--display` e `--corpo`: Satoshi, com fallback para Geist, Inter e system sans.
- `--dado`: IBM Plex Mono, Cascadia Mono ou Consolas.
- Títulos de tela: `clamp(2.25rem, 5vw, 4.35rem)`, peso 800, tracking aproximado de `-.065em`.
- Subtítulos e descrições: 14px, line-height entre 1.5 e 1.65, cor `--c-muted`.
- Eyebrows: 9–10px, mono, uppercase, tracking entre `.18em` e `.2em`.
- Números de métricas: display, peso 800, tracking negativo e `font-variant-numeric: tabular-nums`.

## Geometria

- Unidade base: 4px.
- Espaçamentos recorrentes: 8, 12, 16, 24, 32 e 48px.
- Cards e painéis: `--raio-g` (20px).
- Painéis grandes: `--raio-xl` (24px).
- Campos: `--raio` (12px).
- Botões e badges: `--pill` (999px).
- Bordas: sempre 1px, preferencialmente `var(--c-line)`.
- Sombra padrão: `var(--sombra-tira)`; use `var(--sombra-alta)` somente em painéis de destaque.

## Componentes

### Shell

O shell desktop usa sidebar de 248px e uma faixa de topo de 64px. A sidebar fica quieta por padrão; o setor ativo recebe fundo translucido, borda azul e uma barra interna de 2px. Abaixo de 860px, a sidebar vira uma navegação horizontal com pills.

### Card

Use `.placa` para uma superfície geral. Ele já traz fundo em camadas, borda sutil, raio de 20px e uma linha de luz no topo. Evite criar novos cards com `background: #...` ou com uma borda forte customizada.

### Métrica

Use `.instrumento` para números de resumo. O label fica em mono, o valor em Satoshi e a linha de 2px no topo usa o acento da tela. `.instrumento--acento` representa a métrica mais importante da seção.

### Botão

- `.botao`: ação secundária ou neutra.
- `.botao--acento`: ação principal; usa gradiente funcional.
- `.botao--nu`: ação quieta, com borda apenas em hover.
- `aria-pressed="true"`: estado ligado ou selecionado; usa o gradiente azul.

Os botões têm altura mínima de 40px e foco visível. Em ações destrutivas, mantenha o texto explícito e use o token vermelho apenas como sinal semântico.

### Badge e estado

`.selo` é uma pill com ponto de estado. Use `.selo--ativo`, `.selo--espera`, `.selo--erro`, `.selo--azul` ou `.selo--acento`. O estado ativo pode pulsar, mas espera, parado e erro ficam estáticos.

### Tabela e listas

`.placar-envelope` fornece a moldura arredondada. `.placar` mantém densidade operacional, com headers em mono e linhas de 1px. Em mobile, a tabela pode rolar horizontalmente; os demais módulos não devem criar overflow acidental.

### Flight strip

`.tira` é o item operacional da Nextfly. A rail lateral comunica estado, o código usa mono e o conteúdo principal usa peso 700. Hover desloca a tira poucos pixels e reforça sua borda; o efeito não deve parecer uma animação de painel.

## Movimento

- Entrada de view: 360ms, opacity + translateY de 8px.
- Blocos subsequentes: stagger de 40ms, limitado aos primeiros blocos.
- Hover: 140–180ms, com deslocamento máximo de 4px.
- Pulse: reservado a `.tira[data-estado="ativo"]` e pontos realmente ativos.
- `prefers-reduced-motion: reduce` reduz todas as transições e animações ao estado estático.

## Acessibilidade

- Toda cor de estado deve vir acompanhada de texto, forma ou posição.
- Todo controle interativo deve ter foco visível.
- Alvos de toque devem ter pelo menos 40px de altura; no mobile, prefira 44px quando couber.
- Não use tracking alto em textos longos.
- Preserve labels ocultos para leitores de tela em campos de busca.
- Teste a interface sem hover e com zoom de texto aumentado.

## Checklist de novo módulo

1. Registrar o setor na rota existente e definir `data-setor` quando houver acento específico.
2. Usar `Pecas.proa`, `.grade`, `.baia`, `.placa` e `.instrumento` antes de criar uma estrutura nova.
3. Escolher um único acento funcional e aplicá-lo a ação, progresso e foco do módulo.
4. Referenciar tokens CSS; não inserir valores hex ou sombras isoladas no template.
5. Criar estados vazio, hover, foco, carregamento, sucesso e erro.
6. Verificar desktop, 860px, 620px e 520px.
7. Verificar `prefers-reduced-motion` e navegação só por teclado.
