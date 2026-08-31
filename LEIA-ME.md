# Nextfly · Torre

Centro de operações da Nextfly. Hoje é a casca visual, funcionando local,
sem servidor e sem banco.

## Como abrir

**Duas opções, as duas funcionam:**

1. Dê dois cliques em `index.html` — abre direto no navegador.
2. Dê dois cliques em `abrir-hub.bat` — sobe um servidor local em
   `http://localhost:8010` e abre o navegador sozinho. Feche a janela preta
   para desligar.

Não precisa instalar nada. Para mandar pro sócio, zipe a pasta inteira.

## O que já funciona

- Navegação entre os seis setores (o endereço muda, dá pra favoritar).
- **Agentes** — puxar a tira abre a ficha do agente; **Copiar** põe o comando
  pronto na área de transferência para colar no Claude Code.
- **Ligar / desligar agente** — muda o quadro da Torre e fica salvo na máquina.
- **Prospecção** — busca por nome, ramo ou cidade; clicar na situação de um
  lead avança novo → enviado → respondeu → fechado, e fica salvo.
- Tema claro, escuro ou automático, também salvo.

## O que ainda é demonstração

Todo número vem de `js/data.js`. Nenhuma tela conversa com API, banco ou com
os agentes de verdade.

## Onde a integração entra

`js/data.js` é a única porta de dados do Hub — nenhum outro arquivo lê dado
direto. Cada função ali (`Dados.agentes()`, `Dados.leads()`, …) vira um
`fetch()` quando a VPS existir, e o resto do Hub não precisa mudar.

O estado do usuário (situação de lead, agente ligado, tema) fica em
`js/store.js`, no `localStorage`. Com banco, é ali que entram as chamadas de
gravação.

## Mapa dos arquivos

```
index.html          estrutura e ordem dos scripts
css/tokens.css      cores, tipografia, espaçamento — mexa aqui para mudar a cara
css/base.css        reset e vozes tipográficas
css/layout.css      faixa de topo, coluna de setores, cabine
css/strips.css      a tira (flight strip) — a peça que carrega o design
css/components.css  placas, botões, selos, tabelas
css/modules.css     estilos de cada setor
js/data.js          TODOS os dados — a costura da integração
js/store.js         estado que sobrevive ao fechar a aba
js/util.js          DOM, formatação em pt-BR, copiar, avisos
js/pecas.js         instrumento, proa, selo, nota
js/strips.js        montagem da tira e da baia
js/router.js        navegação por hash
js/views/*.js       um arquivo por setor
js/app.js           partida
```

## Próxima etapa

1. VPS contratada e domínio `nextfly.com.br` apontado.
2. Banco, e `js/data.js` passando a ler dele.
3. Disparo dos agentes pelo Hub (hoje o botão entrega o comando para colar).
4. Cais 47 embutido no setor Prospecção em vez de link para `localhost:8003`.
