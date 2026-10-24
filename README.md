# Lógica de Papel 📎💡

Jogo de circuitos e lógica digital para navegador, desenvolvido com React, TypeScript e Tailwind CSS, reproduzindo a estética de papel caderno com chaves feitas de clipes metálicos, pilha 9V, portas lógicas e lâmpada.

## 🚀 Como Executar

O projeto utiliza Vite e Node.js:

```bash
# Instalar dependências (caso necessário)
npm install

# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Executar testes unitários de lógica
npx --yes tsx --test src/logic/logic.test.ts

# Compilar para produção
npm run build
```

## 📐 Arquitetura do Projeto

O código está estruturado com clara separação entre a avaliação lógica e a renderização visual:

- `src/logic/`
  - `types.ts`: Tipos do domínio, portas lógicas, circuitos, fases e ranking.
  - `gates.ts`: Operações booleanas das 7 portas (AND, OR, NOT, NAND, NOR, XOR, XNOR) e tabelas-verdade.
  - `evaluator.ts`: Avaliador determinístico de circuitos e verificação de missão (acender/apagar lâmpada).
  - `levels.ts`: As 15 fases do jogo (A1 até E3), cobrindo os 5 níveis de dificuldade.
  - `scoring.ts`: Módulo isolado de pontuação e ordenação de ranking (RF-024: pontuação maior e mais recente).
  - `sound.ts`: Sintetizador procedimental de áudio via Web Audio API (sem dependências externas de áudio).
  - `logic.test.ts`: Bateria de testes unitários com o executor nativo `node:test`.

- `src/components/`
  - `BatterySvg.tsx`: Pilha 9V desenhada à mão com fita adesiva e terminais `+` e `-`.
  - `LightbulbSvg.tsx`: Lâmpada incandescente ilustrada com filamento e iluminação radiante ao acender.
  - `PaperclipSwitch.tsx`: Clipe metálico interativo que rotaciona para abrir e fechar o circuito.
  - `LogicGateSvg.tsx`: Símbolos esquemáticos das portas lógicas sobre o papel.
  - `CircuitCanvas.tsx`: Canvas SVG responsivo que orquestra conexões, fios de grafite e circulação de energia.
  - `StickyNoteHUD.tsx`: Post-it rosa com fita adesiva contendo corações, cronômetro (0 a 5 min), botões "Concluir" e "Redefinir".
  - `EducationalModal.tsx`: Post-it educativo exibido quando uma nova porta lógica é introduzida.
  - `HintModal.tsx`: Post-it com a dica exclusiva da fase, liberada após tentativa incorreta.
  - `TitleScreen.tsx`: Tela inicial com visual de caderno, início rápido e atalhos.
  - `RankingScreen.tsx`: Mural de recordes ordenado por pontos e recência.
  - `GameOutcomeModals.tsx`: Modais de vitória (conclusão de E3) e derrota (tempo ou corações).

- `PENDENCIAS.md`: Documentação das decisões funcionais pendentes na especificação e das suposições provisórias adotadas.
