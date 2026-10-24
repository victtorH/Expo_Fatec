---
title: "Lógica de Papel — Documentação Funcional Consolidada"
aliases:
  - Lógica de Papel
  - Logica de Papel
  - Especificação funcional do Lógica de Papel
tags:
  - jogo/documentacao
  - jogo/requisitos
  - logica-digital
status: "Em definição — mecânicas centrais atualizadas; geração de circuitos e pontuação ainda precisam de especificação técnica"
version: "3.0"
---

# Lógica de Papel — Documentação Funcional Consolidada

## 1. Finalidade e autoridade deste documento

Este documento descreve o comportamento funcional esperado de **Lógica de Papel**, um jogo single-player de circuitos lógicos. Ele deve servir como fonte de referência para o responsável pelo produto, desenvolvedores, testadores e agentes de IA que planejem, implementem ou revisem o jogo.

A documentação prioriza regras de negócio, estados, entradas, saídas e critérios verificáveis. Não especifica tecnologia, arquitetura de software ou decisões puramente visuais.

### 1.1 Como interpretar as regras

- **Definido:** decisão confirmada pelo responsável pelo produto ou regra explícita da documentação original.
- **Pendente:** informação ainda não especificada, ambígua ou contraditória. Não deve ser inventada por um agente.
- **Estrutura de referência:** organização proposta para facilitar implementação e testes, sem adicionar uma regra de negócio nova.

> [!IMPORTANT] Regra para agentes de IA
> Não transforme itens pendentes em comportamentos definitivos. Antes de implementar uma funcionalidade dependente de uma pendência, registre a dependência e solicite uma decisão. Quando gerar código parcial, isole o comportamento ainda indefinido e documente a suposição utilizada.

## 2. Resumo do jogo

**Lógica de Papel** é um jogo single-player de lógica digital. O jogador controla clipes que funcionam como chaves em caminhos de um circuito e deve cumprir a missão da fase, que define se a lâmpada deve ficar acesa ou apagada.

O percurso possui 15 fases, em cinco níveis de três fases: A1–A3, B1–B3, C1–C3, D1–D3 e E1–E3. A dificuldade aumenta durante a progressão. Os circuitos não precisam ser todos previamente desenhados de forma fixa: o sistema deve gerar um circuito de acordo com a dificuldade correspondente à fase atual. O algoritmo exato e os parâmetros de cada dificuldade ainda precisam ser definidos.

A validação ocorre somente quando o jogador pressiona **Concluir**. Se a configuração estiver errada, o sistema informa o erro, mantém a fase e a configuração atual, aplica as penalidades e disponibiliza a dica única daquela fase. **Redefinir** devolve os clipes à configuração original da fase, mas não reinicia o contador de tempo, não recupera corações e não desfaz bônus ou penalidades já registrados.

O tempo de cada fase começa em zero e pode chegar a no máximo cinco minutos. Cada erro acrescenta 10 segundos ao tempo atual; concluir corretamente na primeira tentativa reduz 5 segundos do tempo atual e recupera meio coração. Os corações persistem durante a partida, enquanto o contador de tempo atual é reiniciado ao entrar em uma nova fase. Os ajustes de bônus e penalidades devem ser registrados ao longo da partida; sua aplicação exata à fórmula global de pontuação permanece pendente.

Ao perder, o jogador é encaminhado ao ranking, de onde pode iniciar outra partida ou sair para a tela inicial. Concluir E3 também encaminha ao ranking.

## 3. Escopo funcional

### 3.1 Funcionalidades contempladas

- Partida single-player.
- Progressão fixa por 15 fases, de A1 até E3.
- Missão por fase que exige acender ou apagar a lâmpada.
- Circuitos com clipes/chaves e portas lógicas.
- Validação explícita por meio da ação **Concluir**.
- Feedback de erro sem abandonar a fase atual.
- Dica textual exclusiva para cada fase, disponibilizada após uma conclusão incorreta.
- Redefinição dos clipes para a configuração inicial da fase.
- Temporizador por fase e recursos de corações.
- Regras de recompensa por conclusão na primeira tentativa, com alguns detalhes ainda pendentes.
- Pontuação e ranking.
- Textos introdutórios curtos para explicar portas lógicas quando forem introduzidas.
- Interação por mouse, conforme a especificação original.

### 3.2 Itens não definidos como requisitos

Não presumir a existência de:

- multiplayer;
- contas ou autenticação;
- sincronização entre dispositivos;
- salvamento de progresso entre sessões;
- pausa de jogo;
- controles por teclado ou toque;
- conquistas, moedas, itens consumíveis ou missões paralelas;
- configurações de áudio, idioma ou acessibilidade;
- APIs, banco de dados ou tecnologia específica.

Esses recursos só devem ser incluídos se forem aprovados separadamente.

## 4. Vocabulário do domínio

| Termo | Significado funcional |
|---|---|
| **Partida** | Uma execução completa do jogo, incluindo as fases percorridas até vitória, derrota ou abandono. |
| **Nível** | Grupo de três fases identificado por uma letra de A a E. |
| **Fase** | Unidade de progressão com uma missão, um circuito inicial e uma dica exclusiva. |
| **Missão** | Instrução que define o resultado esperado para a lâmpada: acesa ou apagada. |
| **Circuito** | Conjunto conectado de caminhos, entradas, clipes/chaves e portas lógicas que determina o resultado final. |
| **Clipe/chave** | Elemento interativo que conecta ou interrompe um caminho do circuito. |
| **Fechado/conectado** | Estado do clipe que conecta o caminho e representa `true` / `1`. |
| **Aberto/desconectado** | Estado do clipe que interrompe o caminho e representa `false` / `0`. |
| **Porta lógica** | Operação que recebe valores binários e calcula uma saída conforme sua tabela-verdade. |
| **Concluir** | Ação do jogador que solicita a validação do circuito atual. |
| **Redefinir** | Ação que restaura os clipes à configuração original da fase sem restaurar recursos. |
| **Erro de solução** | Resultado validado que não satisfaz a missão da fase. |
| **Dica** | Orientação textual exclusiva de uma fase, disponível após uma tentativa de conclusão incorreta. |
| **Coração** | Recurso de tolerância a erros que persiste durante a partida. |
| **Temporizador da fase** | Contagem de tempo da fase atual, com limite-base de cinco minutos. |
| **Bônus de primeira tentativa** | Ao concluir a fase na primeira ação Concluir, reduz 5 segundos e recupera meio coração; o efeito específico na pontuação ainda está pendente. |
| **Pontuação** | Valor numérico associado ao desempenho e utilizado para ordenar o ranking. |
| **Abandono** | Saída voluntária da partida antes de concluir o percurso. Os pontos daquela execução são descartados. |

## 5. Organização e progressão das fases

### 5.1 Sequência fixa

O jogo possui exatamente 15 fases:

| Nível | Fases | Posição na progressão |
|---|---|---|
| A | A1, A2, A3 | Introdução aos circuitos e às portas básicas. |
| B | B1, B2, B3 | Progressão para novas portas e/ou combinações. |
| C | C1, C2, C3 | Aumento gradual da complexidade. |
| D | D1, D2, D3 | Aumento gradual da complexidade. |
| E | E1, E2, E3 | Etapa de maior dificuldade; E3 encerra o jogo. |

A ordem é A1 → A2 → A3 → B1 → B2 → B3 → C1 → C2 → C3 → D1 → D2 → D3 → E1 → E2 → E3.

### 5.2 Progressão da dificuldade e geração de circuitos

Regras definidas:

1. A dificuldade aumenta ao longo das 15 fases.
2. O nível A começa com circuitos básicos, sem mesclagem entre portas, conforme a especificação original.
3. A progressão introduz novas portas e, depois, combinações entre portas.
4. Quando uma porta lógica nova for introduzida, deve ser apresentado um texto curto explicando seu funcionamento.
5. E3 é a última fase e representa a maior dificuldade.
6. O circuito apresentado em uma fase deve ser gerado pelo sistema de acordo com a dificuldade aplicável naquele momento, em vez de depender obrigatoriamente de um circuito fixo desenhado manualmente para cada execução.
7. Cada fase mantém uma dica exclusiva identificada pelo código da fase. A geração deve ser compatível com essa dica; a estratégia para garantir isso ainda precisa ser especificada.

O algoritmo de geração, os parâmetros concretos de cada dificuldade, os limites de complexidade, a distribuição das portas e o modo como a dica se mantém correta para o circuito gerado ainda estão pendentes. Os agentes não devem inventar essas regras e tratá-las como aprovadas.

### 5.3 Primeira fase — A1

A1 é a introdução funcional mais simples e deve conter:

- uma fonte de energia representada por uma pilha;
- um caminho de circuito;
- um clipe/chave;
- uma lâmpada;
- uma missão para acender a lâmpada.

A solução esperada é fechar/conectar o clipe para completar o circuito e acender a lâmpada. A configuração inicial de referência mostra o clipe desconectado e a lâmpada apagada. O sistema deve definir esse estado inicial ao gerar A1 e preservá-lo como referência para a ação **Redefinir** durante aquela instância da fase.

## 6. Modelo lógico de circuitos

### 6.1 Estados de um clipe

Cada clipe/chave pode estar em um de dois estados:

| Estado físico | Valor funcional | Valor binário |
|---|---|---:|
| Fechado/conectado | `true` | `1` |
| Aberto/desconectado | `false` | `0` |

A implementação deve usar esse mapeamento de forma consistente em todas as fases.

### 6.2 Portas e caminhos

As portas lógicas são representadas funcionalmente por caminhos de entrada controlados por clipes. A configuração de cada caminho determina o valor que chega à porta. A saída da porta deve ser calculada conforme a operação lógica correspondente.

Exemplo obrigatório para AND com duas entradas:

- cada caminho corresponde a uma entrada;
- para que a saída AND seja `1`, os dois caminhos devem estar fechados/conectados (`1 AND 1 = 1`);
- se pelo menos um dos caminhos estiver aberto/desconectado, a saída AND será `0`;
- quando a missão exige que a saída final seja verdadeira/`1`, deixar um dos caminhos de AND aberto resulta em uma solução incorreta, desde que essa porta determine o resultado da missão.

O mesmo princípio vale para todas as portas: o jogo não deve aplicar a regra de AND às outras portas; deve calcular cada uma por sua própria tabela-verdade.

### 6.3 Saída final e missão

O objetivo de uma fase é satisfazer a missão apresentada:

- **Acender a lâmpada:** a saída final esperada é `1`.
- **Apagar a lâmpada:** a saída final esperada é `0`.

A solução está correta quando o resultado final calculado para o circuito corresponde ao resultado solicitado pela missão. Se os resultados forem diferentes, a solução está incorreta.

### 6.4 Portas lógicas suportadas

#### AND (E)

A saída é `1` somente quando todas as entradas forem `1`.

| A | B | Saída |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

#### OR (OU)

A saída é `1` quando pelo menos uma entrada for `1`. A saída só é `0` quando todas forem `0`.

| A | B | Saída |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

#### NOT (NÃO / inversora)

Possui uma entrada e inverte seu valor.

| A | Saída |
|---:|---:|
| 0 | 1 |
| 1 | 0 |

#### NAND (NÃO-E)

Equivale a AND seguida de inversão. A saída só é `0` quando todas as entradas forem `1`.

| A | B | Saída |
|---:|---:|---:|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

#### NOR (NÃO-OU)

Equivale a OR seguida de inversão. A saída é `1` somente quando todas as entradas forem `0`.

| A | B | Saída |
|---:|---:|---:|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 0 |

#### XOR (OU exclusivo)

Para duas entradas, a saída é `1` quando os valores são diferentes.

| A | B | Saída |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

#### XNOR (NÃO-OU exclusivo)

É a inversão de XOR. Para duas entradas, a saída é `1` quando os valores são iguais.

| A | B | Saída |
|---:|---:|---:|
| 0 | 0 | 1 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

### 6.5 Regras de cálculo

1. Cada entrada conectada deve ser avaliada como `1`; cada entrada desconectada, como `0`.
2. Cada porta deve calcular sua saída de acordo com a tabela-verdade correspondente.
3. Em circuitos combinados, a saída de uma porta pode alimentar a entrada de outra.
4. O resultado final do circuito deve ser comparado com a missão ao acionar **Concluir**.
5. Portas com entradas ausentes, ligações inválidas, ciclos de conexão ou circuitos incompletos ainda não têm comportamento especificado; não inventar como tratá-los.

## 7. Fluxo de resolução e validação

### 7.1 Configuração

O jogador modifica o estado dos clipes para configurar o circuito. Durante essa configuração, os cliques não causam, isoladamente, uma avaliação de sucesso ou erro. A verificação formal ocorre quando o jogador aciona **Concluir**.

### 7.2 Ação Concluir

Ao clicar em **Concluir**, o sistema deve:

1. ler o estado atual de todos os clipes e caminhos;
2. calcular as saídas das portas de acordo com as tabelas-verdade;
3. calcular a saída final da lâmpada;
4. comparar o resultado com a missão da fase;
5. processar uma única avaliação para aquela ação.

#### Quando a configuração está correta

- A fase é considerada concluída.
- Se esta foi a primeira tentativa de conclusão da fase, o jogador recebe os bônus definidos: recuperação de meio coração e redução de cinco segundos do tempo atual. A pontuação também segue a regra de bônus por primeira tentativa, embora a fórmula completa de pontuação ainda esteja pendente.
- O sistema registra os ajustes de bônus correspondentes.
- O jogador avança para a fase seguinte.
- O contador de tempo da nova fase começa novamente em zero, com limite de cinco minutos. Os corações não são reiniciados.
- Ao concluir E3, o percurso termina e o jogador é encaminhado ao ranking.

Para este documento, **primeira tentativa** significa a primeira ação **Concluir** naquela fase, desde que ainda não tenha ocorrido nenhuma conclusão incorreta naquela mesma fase. A ação **Redefinir** não apaga o histórico de tentativas da fase. Se for necessário definir outro critério, ele deve ser aprovado explicitamente.

#### Quando a configuração está incorreta

- O sistema informa que a solução não corresponde à missão.
- O jogador permanece na mesma fase.
- A configuração atual dos clipes é preservada; o circuito não volta automaticamente ao estado inicial.
- O contador de tempo continua em andamento.
- O tempo atual aumenta em **10 segundos** como penalidade.
- O jogador perde **1 coração**.
- A dica exclusiva da fase fica disponível para consulta.
- O sistema aguarda uma nova ação explícita de **Concluir** antes de avaliar outra tentativa e aplicar outra penalidade.
- Se a perda de coração deixar o jogador com zero corações, a partida termina em derrota e o jogador é encaminhado ao ranking.

A penalidade é aplicada uma vez por submissão incorreta, nunca repetidamente só porque o circuito permanece incorreto.

## 8. Tempo, corações, bônus e penalidades

### 8.1 Contador de tempo por fase

- Cada fase inicia com o contador de tempo em **0 segundos**.
- O contador tem limite máximo de **5 minutos (300 segundos)** por fase.
- O tempo efetivamente decorrido avança durante a fase. **Interpretação operacional adotada nesta versão:** os segundos de erro e o bônus de primeira tentativa ajustam esse contador; a interação exata entre o cronômetro natural e os ajustes ainda deve ser confirmada (ver pendências).
- Cada conclusão incorreta acrescenta **10 segundos** ao tempo atual como penalidade.
- Ao concluir corretamente na primeira tentativa, o tempo atual é reduzido em **5 segundos** como bônus.
- O contador de tempo da fase volta a zero quando o jogador entra na fase seguinte.
- Ao usar **Redefinir**, o contador não volta a zero nem é pausado.
- Se o contador atingir 5 minutos, a partida termina em derrota e o jogador é encaminhado ao ranking.
- O contador não pode ficar abaixo de zero; quando um bônus subtrair 5 segundos de um valor menor que 5 segundos, o valor mínimo é zero.

Os bônus e as penalidades também devem ser registrados como eventos persistentes durante a partida, mesmo que o contador de tempo exibido seja reiniciado na próxima fase. A forma exata como os totais persistentes de bônus e penalidades influenciam a pontuação global ainda está pendente.

### 8.2 Corações

- O jogador começa com **3 corações**.
- Cada conclusão incorreta consome **1 coração**.
- Os corações persistem durante a partida inteira; avançar ou redefinir uma fase não restaura os corações.
- Concluir corretamente na primeira tentativa recupera **meio coração**.
- Se o jogador ficar com zero corações, a partida termina em derrota e o jogador é encaminhado ao ranking.
- O limite máximo de corações e a forma exata de apresentar valores fracionários precisam ser definidos. Até essa decisão, não presumir que o jogador pode acumular corações acima de três.

### 8.3 Penalidade por erro

Cada conclusão incorreta aplica, uma única vez, as seguintes penalidades:

1. acrescentar 10 segundos ao contador de tempo atual da fase;
2. remover 1 coração;
3. registrar o evento de penalidade na partida.

Redefinir o circuito não anula nenhuma penalidade já aplicada. Uma nova penalidade só pode acontecer depois de outra ação **Concluir** resultar incorreta.

### 8.4 Recompensa por primeira tentativa

Quando o jogador conclui uma fase corretamente na primeira ação **Concluir**, são aplicados:

- redução de **5 segundos** no contador de tempo atual;
- recuperação de **meio coração**;
- bônus de pontuação de primeira tentativa, cujo escopo matemático exato ainda precisa ser definido.

A definição operacional de primeira tentativa e o efeito de **Redefinir** sobre o histórico de tentativas estão descritos na seção 7.2: redefinir restaura os clipes, mas não apaga uma tentativa incorreta já realizada.

### 8.5 Condições de derrota

A partida termina quando ocorrer uma destas condições:

1. o contador da fase atual atingir 5 minutos;
2. o jogador perder todos os corações.

Após a derrota, o jogador é encaminhado ao ranking. Na tela de ranking, poderá iniciar uma nova partida ou sair para a tela inicial. A política de registro da pontuação parcial em caso de derrota ainda precisa ser confirmada.

## 9. Ação Redefinir

### 9.1 Comportamento definido

Ao clicar em **Redefinir**, o sistema retorna todos os clipes da fase atual à mesma configuração inicial com a qual a fase foi gerada.

A ação deve:

- restaurar os estados iniciais dos clipes e caminhos controlados por eles;
- manter a fase atual;
- manter os corações atuais;
- manter o temporizador em andamento, sem reiniciá-lo;
- não devolver recursos já gastos;
- não avançar a fase;
- não validar automaticamente o circuito.

A configuração de referência da fase deve ser armazenada ou definida nos dados da fase, para que o reinício seja determinístico. Não se deve redefinir para uma configuração arbitrária nem para a última configuração do jogador.

### 9.2 O que Redefinir não significa

**Redefinir** não reinicia a partida inteira e não reinicia o temporizador. Também não restaura os corações. O efeito confirmado é restaurar os clipes à configuração original da fase atual.

### 9.3 Nome da ação

O requisito fornecido usa o nome **Redefinir**. A imagem de referência contém o rótulo **Resetar Circuito**. O nome funcional neste documento é **Redefinir**; a nomenclatura definitiva apresentada no produto pode ser padronizada posteriormente sem alterar o comportamento especificado.

## 10. Dicas e instruções educativas

### 10.1 Dica exclusiva por fase

Cada fase possui uma dica própria e única. Não se deve reutilizar uma única dica genérica como substituta das dicas específicas de A1, A2 etc.

### 10.2 Disponibilidade da dica

Quando o jogador pressiona **Concluir** e a solução está incorreta:

- o sistema informa que houve um erro;
- o jogador permanece na fase, sem perder a configuração que havia feito;
- a dica daquela fase fica disponível para consulta.

A dica não substitui a validação. Depois de consultá-la, o jogador deve ajustar o circuito conforme entender e pressionar **Concluir** novamente para validar a solução.

### 10.3 Conteúdo das dicas

O formato exato do texto ainda não está definido. A dica deve ser escrita para a fase correspondente e ajudar a resolver sua missão. Não presumir que a dica revela a solução completa, que é progressiva, que existe limite de consultas ou que consultá-la altera a pontuação. Essas regras ainda precisam ser decididas.

### 10.4 Post-its explicativos de portas

Quando uma nova porta lógica for introduzida, deve haver um texto curto que explique seu funcionamento. Esse texto educativo não é a mesma coisa que a dica específica da fase:

- **Post-it de porta:** explica o conceito da operação lógica.
- **Dica da fase:** orienta a resolução da missão daquela fase e é exclusiva dela.

A obrigatoriedade de fechar o post-it e o momento exato em que ele é apresentado precisam ser especificados. A exigência de que exista um texto introdutório ao introduzir uma nova porta está definida.

## 11. Pontuação e ranking

### 11.1 Pontuação

As regras informadas são:

- concluir em menos tempo deve gerar mais pontos;
- a referência original informa **100 pontos por cada 10 segundos**;
- concluir uma fase na primeira tentativa dobra o valor de pontuação correspondente;
- a pontuação é usada para ordenar o ranking.

A fórmula exata ainda não está definida. Não se deve presumir se os 100 pontos são calculados sobre o tempo restante ou o tempo utilizado, como são tratados intervalos incompletos de 10 segundos, ou se a pontuação é confirmada por fase, por porta ou ao final da partida.

### 11.2 Pontuação recorde de um jogador

- Se um jogador obtiver uma pontuação menor que sua pontuação anterior mais alta, o placar mais alto deve ser mantido.
- Uma execução abandonada não deve manter os pontos obtidos naquela partida como resultado válido.
- A regra acima estabelece a manutenção da melhor pontuação, mas ainda é necessário definir como o jogo identifica o mesmo jogador e como trata duas execuções que alcançam o mesmo recorde.

### 11.3 Ordenação do ranking

A ordenação deve seguir estas regras:

1. pontuação maior aparece antes de pontuação menor;
2. quando os pontos forem iguais, o resultado mais recente aparece antes do mais antigo.

Assim, não há empate de posição: resultados com pontuação igual são ordenados por recência.

### 11.4 Encerramento e navegação

- Ao concluir E3, o jogador é encaminhado ao ranking.
- Ao perder por tempo ou por falta de corações, o jogador também é encaminhado ao ranking.
- A partir do ranking, o jogador pode iniciar uma nova partida ou sair para a tela inicial.
- Ao abandonar voluntariamente uma partida antes de seu encerramento, os pontos daquela execução são descartados.
- Ainda é necessário definir se uma derrota registra a pontuação parcial da partida ou descarta os pontos daquela execução.
- Também está pendente a definição de persistência do ranking após fechar/recarregar o jogo, identificação do jogador, campos exibidos e limite de posições.

## 12. Fluxo completo da partida

1. O jogador inicia uma partida e entra na fase A1.
2. O sistema identifica a dificuldade da fase e gera um circuito compatível com ela. Para A1, o circuito é o tutorial simples de uma chave e uma lâmpada.
3. O sistema apresenta a missão, inicializa os clipes, disponibiliza a dica exclusiva correspondente à fase e inicia o contador da fase em zero, com limite de cinco minutos.
4. O jogador configura os clipes usando o mouse.
5. O jogador pode acionar **Redefinir** para restaurar os clipes à configuração inicial daquela instância de fase. O contador de tempo continua e os corações não são restaurados.
6. Para verificar a solução, o jogador aciona **Concluir**.
7. O sistema calcula o circuito e compara a saída final com a missão.
8. Se a solução estiver incorreta, o sistema informa o erro, preserva a configuração, acrescenta 10 segundos ao contador atual, remove um coração, disponibiliza a dica e aguarda outra ação **Concluir**.
9. Se a solução estiver correta na primeira tentativa, o sistema reduz cinco segundos, recupera meio coração, processa o bônus de pontuação aplicável e conclui a fase.
10. Se a solução estiver correta depois de uma ou mais tentativas incorretas, a fase é concluída sem o bônus de primeira tentativa.
11. Ao entrar na fase seguinte, o contador da nova fase começa em zero e os corações mantêm o valor atual. Os eventos de bônus e penalidade já registrados permanecem no histórico da partida.
12. O ciclo se repete até a conclusão de E3 ou até que o contador da fase alcance cinco minutos ou os corações cheguem a zero.
13. Após concluir E3 ou perder, o sistema encaminha o jogador ao ranking.
14. A partir do ranking, o jogador pode iniciar outra partida ou retornar à tela inicial.
15. Se o jogador abandonar voluntariamente uma partida antes de ela terminar, os pontos daquela execução são descartados.

## 13. Estados funcionais e transições

Os nomes abaixo são identificadores funcionais para implementação, não textos obrigatórios de interface.

| Estado | Significado | Eventos/transições válidas |
|---|---|---|
| `PartidaIniciada` | A partida foi iniciada e a fase atual está sendo preparada. | Gerar circuito e carregar A1 → `FaseEmAndamento`. |
| `FaseEmAndamento` | O jogador pode configurar clipes, redefinir, consultar dica se já liberada ou concluir. | `Concluir` correto → `FaseConcluida`; `Concluir` incorreto → `ErroDeSolucao`; `Redefinir` mantém o estado; contador em 300s ou zero corações → `PartidaPerdida`. |
| `ErroDeSolucao` | A configuração enviada não satisfez a missão. A fase e a configuração ficam preservadas, as penalidades são aplicadas e a dica é liberada. | Após o feedback, retorna a `FaseEmAndamento`, se o jogador ainda tiver corações e o contador não tiver atingido o limite. |
| `FaseConcluida` | A missão foi satisfeita e as recompensas correspondentes foram processadas. | Carregar próxima fase → `FaseEmAndamento`; se a fase concluída era E3 → `Ranking`. |
| `PartidaPerdida` | O contador da fase atingiu cinco minutos ou os corações chegaram a zero. | Registrar/descartar o resultado conforme a regra final e encaminhar → `Ranking`. |
| `PartidaAbandonada` | O jogador saiu voluntariamente antes do fim. | Descartar pontos daquela execução e encerrar a partida. O destino imediato ainda depende da navegação aprovada. |
| `Ranking` | O jogador visualiza a classificação depois de vitória ou derrota. | Iniciar nova partida → `PartidaIniciada`; sair → `TelaInicial`. |
| `TelaInicial` | Tela inicial do jogo. | Iniciar partida → `PartidaIniciada`. |

### 13.1 Invariantes

- A progressão contém as 15 fases A1–E3, em ordem.
- Cada fase gera ou carrega um circuito compatível com sua dificuldade.
- A validação formal ocorre somente em **Concluir**, não a cada clique em um clipe.
- Uma conclusão incorreta não avança a fase e não restaura a configuração atual dos clipes.
- Cada conclusão incorreta aplica no máximo uma penalidade: +10 segundos e −1 coração.
- A primeira conclusão correta da fase reduz cinco segundos e recupera meio coração.
- **Redefinir** restaura os clipes iniciais da fase, mas não reinicia o tempo, não restaura corações nem limpa o histórico de tentativas.
- O contador da fase é reiniciado ao entrar em nova fase e não pode ultrapassar o limite sem encerrar a partida.
- Os corações persistem entre fases.
- A partida não continua ativa depois de uma condição terminal confirmada.
- Após derrota ou vitória, o jogador chega ao ranking e pode recomeçar ou retornar à tela inicial.

## 14. Requisitos funcionais

| ID | Requisito | Critério verificável | Situação |
|---|---|---|---|
| `RF-001` | O jogo deve ser single-player. | Uma partida é executada por um jogador. | Definido |
| `RF-002` | O jogo deve conter 15 fases. | A sequência contém A1–E3, totalizando 15 fases. | Definido |
| `RF-003` | As fases devem ser agrupadas em cinco níveis. | A, B, C, D e E têm três fases cada. | Definido |
| `RF-004` | A progressão deve terminar em E3. | E3 é a última fase. | Definido |
| `RF-005` | Cada fase deve apresentar uma missão. | A missão especifica lâmpada acesa (`1`) ou apagada (`0`). | Definido |
| `RF-006` | Clipes devem representar estados binários. | Fechado/conectado = `true`/`1`; aberto/desconectado = `false`/`0`. | Definido |
| `RF-007` | As portas devem calcular saídas conforme suas regras lógicas. | Cada combinação de entradas produz o valor previsto pela tabela-verdade. | Definido |
| `RF-008` | A solução deve ser avaliada ao acionar Concluir. | Alterar um clipe, isoladamente, não valida nem penaliza. | Definido |
| `RF-009` | A solução correta conclui a fase. | A saída final corresponde à missão e o sistema avança. | Definido |
| `RF-010` | Uma solução incorreta deve informar o erro. | O sistema apresenta feedback e mantém a fase atual. | Definido |
| `RF-011` | Após erro, a configuração atual deve ser preservada. | Os clipes permanecem como estavam após a mensagem de erro. | Definido |
| `RF-012` | Após erro, a dica exclusiva da fase deve ficar disponível. | A dica própria daquela fase pode ser consultada após uma conclusão incorreta. | Definido; conteúdo pendente |
| `RF-013` | Cada fase deve ter uma dica única. | Há uma dica própria vinculada ao identificador da fase. | Definido; mecanismo de compatibilidade com circuito gerado pendente |
| `RF-014` | Redefinir deve restaurar os clipes iniciais. | Os clipes voltam à configuração inicial salva para a instância de fase. | Definido |
| `RF-015` | Redefinir não deve restaurar recursos ou tentativas. | O tempo continua, os corações mantêm seu valor e o histórico de erros não é apagado. | Definido |
| `RF-016` | Cada fase deve ter contador de tempo. | O contador começa em zero e tem máximo de 300 segundos. | Definido |
| `RF-017` | O jogo deve controlar corações. | A partida começa com três; perder todos encerra a partida. | Definido; limite superior ao recuperar meio coração pendente |
| `RF-018` | Erro deve penalizar o jogador. | Cada conclusão incorreta acrescenta 10 segundos e remove um coração. | Definido |
| `RF-019` | Conclusão correta na primeira tentativa deve recompensar. | O tempo atual é reduzido em 5 segundos e meio coração é recuperado. | Definido; teto de corações e pontuação pendentes |
| `RF-020` | A dificuldade deve aumentar ao longo do percurso. | Os parâmetros de dificuldade aumentam entre níveis/fases. | Definido em princípio; parâmetros pendentes |
| `RF-021` | Novas portas devem ter instrução curta. | Um texto explicativo é associado à introdução de cada nova porta. | Definido; conteúdo/gatilho pendentes |
| `RF-022` | A pontuação deve premiar o desempenho temporal. | A fórmula aprovada atribui mais pontos ao desempenho mais rápido e aplica bônus da primeira tentativa. | Parcial; fórmula pendente |
| `RF-023` | A melhor pontuação deve ser preservada. | Resultado inferior não substitui o recorde individual. | Definido; identidade de jogador pendente |
| `RF-024` | Ranking deve ordenar por pontuação e recência. | Pontuação maior vem primeiro; em igualdade, resultado mais recente vem primeiro. | Definido |
| `RF-025` | Abandono descarta os pontos da execução. | Os pontos de uma partida abandonada não são mantidos como resultado válido. | Definido |
| `RF-026` | Vitória ou derrota deve levar ao ranking. | Concluir E3 ou perder por tempo/corações encaminha ao ranking. | Definido |
| `RF-027` | Os circuitos devem ser gerados conforme a dificuldade atual. | A fase recebe um circuito válido que obedece ao perfil de dificuldade aplicável. | Definido em princípio; algoritmo e perfis pendentes |
| `RF-028` | O ranking deve permitir recomeçar ou sair. | Ações disponíveis: iniciar nova partida ou voltar à tela inicial. | Definido |
| `RF-029` | Ajustes de tempo devem ser registrados ao longo da partida. | Erros e bônus de primeira tentativa são guardados como eventos persistentes, mesmo quando o contador por fase reinicia. | Definido; uso na fórmula global pendente |

## 15. Matriz de dificuldade e geração de circuitos

Os identificadores das fases são fixos, mas o circuito deve ser gerado pelo sistema conforme a dificuldade da fase no momento. Portanto, a tabela abaixo define os perfis conceituais, não circuitos exatos já aprovados.

| Nível | Fases | Perfil funcional esperado | Parâmetros concretos |
|---|---|---|---|
| A | A1–A3 | Circuitos introdutórios; portas básicas sem mesclagem. A1 é um circuito de um clipe e uma lâmpada. | Pendente |
| B | B1–B3 | Introdução de outras portas e maior número de escolhas. | Pendente |
| C | C1–C3 | Circuitos com aumento de complexidade e combinações conforme o algoritmo aprovado. | Pendente |
| D | D1–D3 | Circuitos mais complexos, com mais dependências entre entradas e portas. | Pendente |
| E | E1–E3 | Maior dificuldade; E3 é o desafio final. | Pendente |

### 15.1 Contrato mínimo do gerador

Cada circuito gerado precisa possuir, no mínimo:

- código da fase a que pertence;
- identificador único da instância gerada, se os circuitos puderem variar entre partidas;
- perfil de dificuldade utilizado;
- missão: acender ou apagar a lâmpada;
- uma definição válida de fonte, caminhos, clipes e portas;
- configuração inicial de cada clipe, para permitir **Redefinir**;
- uma solução válida de referência ou um método verificável para avaliar a solução;
- dica exclusiva compatível com o circuito apresentado;
- post-it educativo associado a qualquer porta lógica introduzida pela primeira vez.

### 15.2 Restrições do gerador

1. O circuito gerado deve ser logicamente avaliável e ter pelo menos uma solução válida, salvo se uma fase sem solução for definida intencionalmente — comportamento que não faz parte dos requisitos atuais.
2. O gerador não pode produzir conexões que o avaliador não consiga interpretar.
3. A dificuldade deve seguir o perfil do nível atual e não reduzir arbitrariamente a complexidade em fases posteriores.
4. A dica mostrada precisa ser válida para o circuito que o jogador recebeu.
5. **Redefinir** deve recuperar a configuração inicial exata da instância gerada, não gerar um circuito novo.
6. O mesmo circuito precisa permanecer estável durante uma fase, mesmo após erro ou redefinição.

### 15.3 Pontos técnicos ainda pendentes

- Se o circuito é gerado aleatoriamente, por regras determinísticas ou por um conjunto de modelos.
- Se a geração cria um circuito novo em toda nova partida ou se alguns circuitos são fixos por fase.
- Quantidade mínima e máxima de clipes, entradas e portas por dificuldade.
- Como garantir que o circuito tenha solução válida e dificuldade compatível.
- Como gerar ou selecionar uma dica exclusiva e correta para uma instância variável.
- Como a missão (lâmpada acesa/apagada) é escolhida e como evitar casos triviais ou ambíguos.
- Qual é a distribuição exata das portas AND, OR, NOT, NAND, NOR, XOR e XNOR por nível.

## 16. Critérios de aceitação e testes funcionais

### 16.1 Circuito e validação

- [ ] Um clipe fechado é interpretado como conectado, `true` e `1`.
- [ ] Um clipe aberto é interpretado como desconectado, `false` e `0`.
- [ ] As sete portas suportadas seguem as tabelas-verdade desta documentação.
- [ ] A1 apresenta inicialmente um circuito simples de um clipe e uma lâmpada, com a lâmpada apagada.
- [ ] Em A1, fechar o clipe e clicar em **Concluir** satisfaz a missão de acender a lâmpada.
- [ ] Mudar um clipe não dispara validação nem penalidade imediatamente.
- [ ] Uma conclusão incorreta informa o erro, mantém a fase e preserva a configuração atual.
- [ ] Uma conclusão incorreta acrescenta 10 segundos ao contador e remove um coração, uma única vez por envio.
- [ ] Após o primeiro erro da fase, a dica exclusiva correspondente fica disponível.
- [ ] A fase só é concluída quando a saída final corresponde à missão.
- [ ] O circuito permanece o mesmo após erro ou **Redefinir**.

### 16.2 Tempo, corações e redefinição

- [ ] Ao entrar em uma fase, o contador começa em zero.
- [ ] O contador não ultrapassa 300 segundos sem encerrar a partida em derrota.
- [ ] **Redefinir** não zera nem pausa o contador.
- [ ] **Redefinir** não restaura corações, não remove penalidades e não apaga o histórico de tentativas.
- [ ] Cada conclusão incorreta adiciona 10 segundos e remove um coração.
- [ ] A primeira conclusão correta da fase reduz cinco segundos, com o contador limitado a zero como mínimo.
- [ ] A primeira conclusão correta da fase recupera meio coração.
- [ ] Os corações mantêm o valor entre fases.
- [ ] O contador de tempo reinicia em zero ao entrar na fase seguinte.
- [ ] Os eventos de bônus e penalidade permanecem registrados durante a partida.
- [ ] A derrota ocorre quando o contador chega a 300 segundos ou os corações chegam a zero.

### 16.3 Geração de fases, ranking e encerramento

- [ ] Existem exatamente 15 identificadores de fase, de A1 a E3.
- [ ] A geração de circuito respeita o perfil de dificuldade da fase.
- [ ] Cada circuito gerado tem ao menos uma solução válida.
- [ ] A dica exclusiva corresponde ao circuito efetivamente gerado.
- [ ] **Redefinir** retorna à configuração inicial da mesma instância de circuito.
- [ ] Concluir E3 leva ao ranking.
- [ ] Perder por tempo ou corações leva ao ranking.
- [ ] A tela de ranking permite iniciar outra partida ou retornar à tela inicial.
- [ ] Uma pontuação inferior não substitui o recorde individual.
- [ ] O ranking é ordenado por pontuação decrescente e, em caso de igualdade, pela recência decrescente.
- [ ] Abandonar uma partida descarta os pontos daquela execução.
- [ ] Os testes da fórmula final de pontuação só são considerados definitivos após aprovação da fórmula.

## 17. Decisões que ainda faltam fechar

As regras centrais de erro, tempo e navegação foram atualizadas com base nas respostas do responsável pelo produto. Os pontos abaixo continuam pendentes e não devem ser inventados pelos agentes.

### 17.1 Prioridade alta — tempo, recursos e pontuação

1. **Corações fracionários:** o limite máximo continua sendo três corações? Se o jogador estiver no máximo, a recompensa de meio coração é descartada ou convertida em outro benefício?
2. **Contagem do tempo:** confirmar se o contador representa tempo decorrido (de 0 a 300 segundos) e se a passagem natural do tempo é somada às penalidades de +10 segundos e aos bônus de −5 segundos. Esta documentação adota essa leitura, baseada no intervalo informado de 0 a 5 minutos.
3. **Eventos persistentes de tempo:** definir como os totais de bônus e penalidades que persistem durante a partida influenciam a pontuação global, já que o contador exibido reinicia por fase.
4. **Fórmula de pontuação:** a regra original cita 100 pontos por cada 10 segundos e pontuação dobrada na primeira tentativa, mas não define a equação completa. Determinar se os pontos usam o tempo decorrido, o tempo restante ou outra métrica; como tratar intervalos incompletos de 10 segundos; e se a pontuação é calculada por fase ou ao final.
5. **Pontuação após derrota:** decidir se a derrota por tempo/corações registra a pontuação parcial ou descarta os pontos daquela execução.
6. **Identificação do jogador:** definir como o jogo reconhece um jogador para preservar seu recorde entre partidas.
7. **Empate técnico por timestamp:** se duas pontuações iguais forem registradas no mesmo instante, definir um critério secundário determinístico.

### 17.2 Prioridade alta — geração dinâmica de circuitos

8. Definir se os circuitos são gerados aleatoriamente, por algoritmo determinístico ou a partir de modelos pré-definidos.
9. Definir quando o circuito é gerado: a cada nova partida, a cada entrada em uma fase ou uma vez por fase até a sessão terminar.
10. Definir limites quantitativos por nível: quantidade de portas, clipes, entradas e profundidade máxima de combinações.
11. Definir quais portas são permitidas em cada nível e em que momento cada nova porta é introduzida.
12. Definir como o gerador garante pelo menos uma solução correta.
13. Definir como a missão de acender/apagar é escolhida sem gerar ambiguidades ou soluções indesejadas.
14. Definir como a dica única da fase permanece correta quando o circuito é gerado dinamicamente. A dica pode ser vinculada ao código da fase ou gerada/adaptada à instância, mas a estratégia ainda não foi escolhida.
15. Definir o que acontece se o gerador falhar ou produzir um circuito inválido. A recomendação funcional é impedir que um circuito inválido seja exibido ao jogador, mas essa recuperação deve ser especificada.

### 17.3 Regras de interação e conteúdo

16. Definir quando os post-its educativos aparecem, se são obrigatórios e se podem ser reabertos.
17. Definir se consultar a dica tem limite ou consequência para tempo/pontuação. A regra atual não aplica penalidade especificada pela simples consulta.
18. Definir comportamento de conexões inválidas, entradas ausentes ou circuitos incompletos, quando esses estados puderem ser representados.
19. Definir quantidade de entradas permitida em cada porta lógica dentro do jogo.
20. Definir se é possível pausar o jogo e como o temporizador se comporta quando a janela perde foco.

### 17.4 Ranking e persistência

21. Definir se o ranking persiste após fechar/recarregar o jogo e se é local ou compartilhado.
22. Definir os campos exibidos no ranking e o limite de posições.
23. Definir para onde vai o jogador se abandonar voluntariamente a partida, sem alterar a regra já definida de descartar os pontos daquela execução.
24. Definir o tratamento de um empate de timestamp após o desempate por pontuação e recência.
25. Definir a prioridade se o contador atingir 300 segundos no mesmo instante em que o jogador pressiona **Concluir** com uma solução correta.

## 18. Orientações para agentes de IA

1. Trate as regras marcadas como definidas como requisitos; não as altere sem decisão explícita.
2. Não invente parâmetros de geração de circuito que ainda estejam pendentes.
3. Separe a lógica das portas da apresentação visual. A saída lógica deve ser calculada independentemente da aparência dos clipes.
4. Use uma função ou regra determinística por porta lógica; mesmas entradas e mesma porta devem produzir sempre a mesma saída.
5. A validação formal acontece somente ao acionar **Concluir**.
6. Depois de uma conclusão incorreta, preserve a configuração atual, aplique exatamente +10 segundos e −1 coração, disponibilize a dica e aguarde uma nova ação de conclusão.
7. **Redefinir** restaura a configuração inicial da mesma instância de circuito. Não gere outro circuito e não limpe o histórico de tentativas.
8. Não restaure corações nem reinicie o contador por causa de **Redefinir**.
9. O contador da fase inicia em zero, tem máximo de 300 segundos e reinicia ao entrar na fase seguinte.
10. A primeira conclusão correta de uma fase concede −5 segundos e +0,5 coração. A pontuação associada segue a fórmula aprovada quando ela estiver definida.
11. Registre eventos de bônus e penalidade de tempo de forma persistente durante a partida, sem confundir esses registros com o contador reiniciado por fase.
12. Distinga post-it educativo de dica exclusiva da fase.
13. Se circuitos forem gerados dinamicamente, valide que cada circuito tem uma solução válida e que a dica corresponde à instância apresentada.
14. Ao perder, encaminhe ao ranking. Ofereça as ações de iniciar nova partida ou retornar à tela inicial.
15. Não trate o sistema como totalmente especificado enquanto as pendências da seção 17 que afetam a implementação permanecerem abertas.
16. Ao alterar uma regra funcional, atualize este documento, os requisitos e os testes de aceitação correspondentes.

## 19. Histórico de versões

| Versão | Alterações |
|---|---|
| 1.0 | Estrutura inicial da documentação funcional, portas lógicas, fluxo geral, requisitos e pendências. |
| 2.0 | Validação somente por Concluir; erro preserva fase e configuração e libera dica exclusiva; Redefinir restaura a configuração inicial dos clipes sem restaurar corações nem reiniciar o tempo; ranking com recorde preservado e desempate por recência. |
| 3.0 | Tempo por fase definido de 0 a 5 minutos; cada erro acrescenta 10 segundos e remove um coração; primeira conclusão correta na fase reduz 5 segundos e recupera meio coração; circuitos devem ser gerados conforme a dificuldade; derrota leva ao ranking, com opções de nova partida ou retorno à tela inicial. Fórmula de pontuação e algoritmo de geração permanecem pendentes. |
