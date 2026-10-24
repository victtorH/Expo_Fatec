# LÓGICA DE PAPEL — REGISTRO DE PENDÊNCIAS E SUPOSIÇÕES PROVISÓRIAS

Este documento detalha as decisões funcionais que permanecem em aberto na documentação funcional consolidada (v3.0, Seções 2, 8, 11, 15 e 17), as suposições provisórias implementadas para viabilizar um protótipo 100% jogável e testável, e os módulos exatos onde cada configuração pode ser ajustada assim que o responsável pelo produto definir as regras finais.

---

## 1. TETO DE CORAÇÕES E RECUPERAÇÃO DE MEIO-CORAÇÃO (RESOLVIDO)

### Situação na documentação
- **Definido:** O jogador começa com 3 corações. Cada conclusão incorreta remove 1 coração. Concluir corretamente na primeira tentativa recupera meio coração (`+0.5`).
- **Definição Solicitada e Implementada:** O teto máximo é fixo em **3.0 corações**. O bônus de meio coração só é adicionado caso a primeira tentativa seja um sucesso **E os três corações não estejam completos** (`hearts < 3.0`). Se o jogador já estiver com 3 corações cheios, nenhum coração adicional é acrescentado.
- **Local no código:** `src/App.tsx` (`handleConcluir`) e `src/components/StickyNoteHUD.tsx` (`renderHearts`).

---

## 2. FÓRMULA MATEMÁTICA DE PONTUAÇÃO

### Situação na documentação
- **Definido (Seção 11.1):** Desempenho mais rápido gera mais pontos; a referência original cita 100 pontos a cada 10 segundos; conclusão na primeira tentativa dobra a pontuação correspondente.
- **Pendente (Seção 11.1 e 17.1, item 4):** A fórmula global não está fechada (ex: se os 100 pontos usam o tempo decorrido ou o tempo restante dos 300s, tratamento de segundos fracionários de 10s e pontuação base por fase).

### Suposição Provisória Adotada
- Criado o módulo isolado `src/logic/scoring.ts`:
  - `BASE_PHASE_POINTS`: 200 pontos por fase concluída com sucesso.
  - `POINTS_PER_TEN_SECONDS_REMAINING`: 100 pontos para cada bloco inteiro de 10 segundos restantes do limite de 300 segundos (`Math.floor(tempoRestante / 10) * 100`).
  - `FIRST_TRY_MULTIPLIER`: Multiplicador x2 no total da fase se concluída na primeira tentativa.
- **Local no código:** `src/logic/scoring.ts` (`calculatePhaseScore`).
- **Consequência funcional:** Premia fortemente velocidade e acerto na primeira tentativa, gerando pontuações legíveis de 4 dígitos (ex: 2.000 a 6.000 por fase) que ordenam o ranking de forma natural.

---

## 3. PONTUAÇÃO PARCIAL APÓS DERROTA

### Situação na documentação
- **Definido:** Vitória em E3 ou derrota por tempo (300s) ou corações (0) encaminha ao ranking. Abandono voluntário descarta os pontos.
- **Pendente (Seção 11.4 e 17.1, item 5):** Em caso de derrota involuntária, os pontos parciais acumulados nas fases anteriores são registrados no ranking ou descartados?

### Suposição Provisória Adotada
- Em caso de derrota por tempo ou corações, os pontos das fases que o jogador **já completou com sucesso** são mantidos e registrados no ranking com o rótulo de resultado `Derrota` e a última fase alcançada. Apenas o abandono voluntário (botão "Sair") descarta a pontuação integral da sessão.
- **Local no código:** `src/App.tsx` (`handleDefeat` e `handleAbandonRun`).

---

## 4. GERAÇÃO DINÂMICA DE CIRCUITOS VS. MODELOS DE FASE

### Situação na documentação
- **Definido (Seção 5.2):** 15 fases sequenciais (A1 a E3), com dificuldade crescente. Nível A sem portas mescladas. Introdução de portas lógicas com post-its explicativos. O circuito deve ser compatível com a dica da fase e ser gerado/definido de forma determinística e solucionável.
- **Pendente (Seção 15.3 e 17.2, itens 8 a 15):** Parâmetros exatos de geração estocástica vs. determinística, e estratégia para manter a dica exclusiva válida caso o circuito variasse livremente.

### Suposição Provisória Adotada
- Criada matriz completa e modular em `src/logic/levels.ts` com 15 modelos de circuitos testados e verificados, cobrindo:
  - Nível A (A1-A3): Circuitos puros de chaves (tutorial, paralelo e série).
  - Nível B (B1-B3): Introdução a AND, OR e NOT.
  - Nível C (C1-C3): Introdução a NAND, NOR e circuitos combinados.
  - Nível D (D1-D3): Introdução a XOR, XNOR e inversões.
  - Nível E (E1-E3): Redes lógicas de alta complexidade com 3 e 4 entradas e o desafio final E3.
- Cada nível possui solução 100% verificada pelo arquivo de testes unitários `src/logic/logic.test.ts`.
- **Local no código:** `src/logic/levels.ts`.

---

## 5. IDENTIFICAÇÃO DO JOGADOR E REGISTRO NO RANKING

### Situação na documentação
- **Definido (Seção 11.2 e 11.3):** Ranking ordenado por pontuação decrescente e, em igualdade de pontos, por recência decrescente (RF-024). A melhor pontuação do mesmo jogador deve ser preservada.
- **Pendente (Seção 17.1, item 6):** Como o jogo identifica o mesmo jogador e registra seu nome antes de iniciar a partida.

### Solução Implementada
- Adicionado formulário de registro de nome/apelido na tela inicial antes de iniciar a partida (`src/components/TitleScreen.tsx`).
- O nome digitado é persistido no `localStorage` sob a chave `logica_de_papel_player_name` para conveniência nas partidas seguintes.
- O nome registrado é associado às entradas de pontuação no mural de campeões (`RankingScreen.tsx`), destacando as jogadas do usuário atual com a tag visual `Você` e borda azul.
- O nome também é exibido no crachá do cabeçalho durante a partida (`👤 [Nome]`) e nos modais finais de Vitória ou Derrota.
- **Local no código:** `src/components/TitleScreen.tsx`, `src/App.tsx` e `src/components/RankingScreen.tsx`.
