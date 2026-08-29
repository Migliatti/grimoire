# Pesquisa baseada em evidências para a cadeia `business-direction`

Data: 2026-08-28

## Contexto

A cadeia `business-direction` funciona como um "CEO virtual": recebe uma direção de negócio, conduz o planejamento por Produto, Marketing, Vendas, Financeiro e Operações, persiste o progresso e, ao final, cruza as decisões em uma síntese estratégica.

O desenho original evita que as skills inventem respostas: cada departamento pergunta ao usuário antes de redigir sua seção. Essa regra continua válida, mas é insuficiente. Um plano baseado apenas no conhecimento do usuário pode ser internamente coerente e ainda assim estar errado sobre concorrentes, preços, mercado, regulação, custos ou viabilidade.

Esta evolução adiciona pesquisa automática, auditável e econômica em tokens. A pesquisa combina documentos internos e fontes públicas, varia de profundidade conforme o risco e pode ocorrer tanto antes quanto durante o trabalho departamental.

## Objetivos

- Fundamentar decisões departamentais em evidências verificáveis, sem substituir escolhas que pertencem ao usuário.
- Realizar pesquisa automaticamente, sem pedir autorização a cada rodada.
- Combinar uma visão inicial ampla com pesquisas incrementais específicas por departamento.
- Adaptar a profundidade da pesquisa ao impacto e à reversibilidade da decisão.
- Preservar fontes, datas, divergências, confiança e resultados inconclusivos para auditoria.
- Permitir retomadas seletivas sem carregar todo o histórico de pesquisa no contexto.
- Preparar e validar automaticamente o ambiente antes de criar ou pesquisar uma linha de planejamento.
- Manter leve o uso isolado das skills departamentais.

## Fora de escopo

- Produzir estudos acadêmicos ou de mercado exaustivos por padrão.
- Tratar pesquisa como autorização para cadastros, contatos, compras ou outras ações externas.
- Publicar ou enviar documentos internos para serviços externos.
- Substituir a decisão do usuário quando a evidência admite mais de uma estratégia razoável.
- Persistir uma estrutura completa de planejamento quando uma skill departamental for usada isoladamente.

## Arquitetura

O conjunto passa de sete para oito skills com a introdução de `business-research`.

### `business-direction`

Continua sendo a orquestradora e o ponto de entrada do fluxo completo. Suas responsabilidades são:

- preparar o ambiente e escolher o destino de persistência;
- identificar uma linha nova ou existente;
- iniciar a pesquisa de base;
- selecionar departamentos relevantes com apoio das evidências iniciais;
- controlar perguntas, pesquisas direcionadas, estados e retomadas;
- invalidar resultados derivados quando decisões ou evidências mudarem;
- invocar `strategy-synthesis` somente quando os departamentos estiverem prontos.

### `business-research`

É o componente compartilhado de aquisição e gestão de evidências. Não decide estratégia nem redige a decisão final de um departamento. Opera em dois modos:

- `baseline`: pesquisa inicial sobre mercado, alternativas atuais, concorrência, contexto regulatório aparente, sinais de demanda e materiais internos relevantes.
- `targeted`: investigação delimitada por uma lacuna departamental, como preço de concorrentes, benchmark de conversão, custo de fornecedor, requisito regulatório ou restrição técnica.

Também é a única skill responsável por criar e atualizar o registro auditável de evidências durante o fluxo persistente.

### Skills departamentais

`product-scope`, `market-positioning`, `sales-pipeline`, `financial-planning` e `operations-planning` continuam responsáveis por transformar contexto em perguntas e decisões da sua área. Cada uma deve:

- consultar apenas as evidências relevantes já destiladas;
- formular perguntas informadas ao usuário;
- distinguir decisão, hipótese e fato verificável;
- solicitar pesquisa `targeted` quando uma lacuna material puder ser verificada;
- redigir a seção usando respostas do usuário e evidências referenciadas;
- expor incertezas que não puderam ser resolvidas.

A regra original permanece: nenhuma seção departamental é redigida sem que o usuário tenha respondido às perguntas necessárias. Pesquisa informa a conversa; não substitui o usuário.

### `strategy-synthesis`

Continua sendo a última etapa. Além de cruzar decisões entre departamentos, passa a:

- verificar se afirmações factuais importantes possuem referências;
- propagar incertezas e premissas provisórias para a síntese;
- impedir uma conclusão enganosa quando existir um bloqueio crítico;
- marcar quais próximos passos são execução e quais são experimentos de validação.

## Fluxo principal

```text
Direção do usuário
  -> preparação automática do ambiente
  -> business-research: baseline
  -> seleção de departamentos relevantes
  -> para cada departamento:
       carregar apenas contexto e evidências relevantes
       -> formular perguntas informadas
       -> aguardar respostas do usuário
       -> detectar lacunas materiais verificáveis
       -> business-research: targeted, se necessário
       -> avaliar confiança e impacto da incerteza
       -> redigir seção departamental
  -> strategy-synthesis
  -> resumo e caminhos dos artefatos
```

A pesquisa direcionada pode revelar uma nova pergunta ao usuário. Nesse caso, o departamento retorna ao estado de questionamento antes de ser redigido. O ciclo termina quando há informação suficiente para a próxima decisão, não quando todo o assunto possível foi pesquisado.

## Preparação automática do ambiente

Antes da pesquisa `baseline`, `business-direction` executa uma fase de preparação:

1. Localiza a raiz real do projeto ou repositório.
2. Lê instruções relevantes do workspace e respeita convenções locais aplicáveis.
3. Procura linhas de planejamento existentes com slug semelhante.
4. Escolhe o destino de persistência.
5. Verifica se o destino pode ser gravado.
6. Cria a estrutura mínima de estado e evidências.
7. Registra versão do schema, datas e próximo passo.
8. Monta um inventário compacto de possíveis fontes internas sem carregar todos os documentos.

O destino é escolhido sem interromper o usuário:

- em projeto Git: `<raiz-do-repositório>/docs/business-direction/<slug>/`;
- fora de projeto Git: diretório pessoal persistente da ferramenta em uso;
- uma instrução explícita do usuário pode substituir o padrão.

Se o destino não puder ser gravado, a orquestradora informa o problema e não inicia uma pesquisa longa que não poderá ser persistida.

## Política de pesquisa

### Disparo automático

Toda linha nova recebe pesquisa `baseline`. Uma pesquisa `targeted` ocorre apenas quando:

- existe uma lacuna material para a decisão atual;
- a lacuna descreve algo verificável, não uma preferência do usuário;
- as evidências persistidas não oferecem resposta suficiente ou estão desatualizadas;
- pesquisar agora pode mudar a pergunta, a decisão ou o risco registrado.

### Fontes internas e externas

Documentos internos descrevem a realidade específica do negócio: entrevistas, métricas, decisões anteriores, planos, dados operacionais e restrições conhecidas. Fontes externas testam essa realidade contra mercado, concorrência, alternativas, benchmarks, documentação e regulação.

Fontes primárias têm prioridade: documentos oficiais, legislação, bases públicas, documentação técnica e materiais dos próprios concorrentes. Fontes secundárias são úteis para descoberta, contexto e triangulação, mas não devem sustentar sozinhas uma afirmação crítica quando houver fonte primária disponível.

### Profundidade adaptativa

A profundidade depende de impacto, reversibilidade e incerteza:

- Decisão reversível e de baixo impacto: pesquisa rápida, suficiente para orientar a próxima ação.
- Decisão relevante, mas testável em pequena escala: pesquisa moderada e explicitação das premissas.
- Preço, capital, regulação, tamanho de mercado, segurança, viabilidade ou dependência crítica: pesquisa aprofundada, preferência por fontes primárias e triangulação independente quando possível.

A pesquisa para quando a próxima decisão está adequadamente sustentada ou quando novas buscas apresentam retorno decrescente. Quando não for possível verificar algo, a skill registra essa limitação; não continua indefinidamente nem completa a lacuna com conhecimento presumido.

### Conflitos e incerteza

Fontes conflitantes são mantidas lado a lado. A política é adaptativa:

- conflitos moderados geram uma faixa, hipótese ou premissa provisória com confiança reduzida;
- o plano continua, mas inclui uma ação de validação;
- conflitos críticos bloqueiam apenas o departamento afetado quando podem invalidar ou tornar enganoso o restante do plano;
- a skill nunca seleciona silenciosamente a fonte mais conveniente.

## Persistência otimizada para tokens

Cada linha usa a seguinte estrutura:

```text
docs/business-direction/<slug>/
|-- state.md
`-- evidence/
    |-- index.md
    |-- baseline.md
    |-- product.md
    |-- marketing.md
    |-- sales.md
    |-- finance.md
    `-- operations.md
```

Somente arquivos de departamentos relevantes precisam ser criados.

### `state.md`

É o único arquivo lido integralmente em toda retomada. Mantém:

- direção e slug;
- versão do schema;
- departamentos relevantes;
- status e `next_action` de cada departamento;
- perguntas e respostas destiladas;
- seções departamentais prontas;
- IDs das evidências utilizadas;
- hipóteses, bloqueios e lacunas abertas;
- status e conteúdo da síntese.

Não contém URLs extensas, trechos de fontes nem histórico detalhado de pesquisa.

### `evidence/index.md`

É um registro compacto para localização seletiva. Cada linha contém, no mínimo:

- ID estável;
- resumo curto da alegação ou lacuna;
- departamento ou `baseline`;
- confiança;
- situação atual;
- arquivo que contém o detalhe.

O índice permite localizar evidências com busca textual sem carregar todos os arquivos.

### Arquivos de evidência

`baseline.md` guarda evidências compartilhadas. Cada arquivo departamental guarda apenas pesquisas específicas daquela área. Uma entrada detalhada registra:

- ID e alegação;
- tipo interno ou externo;
- fonte por URL ou caminho local;
- data de publicação ou atualização, quando disponível;
- data de consulta;
- qualidade da fonte;
- nível de confiança;
- relação `sustenta`, `contradiz` ou `contextualiza`;
- observação necessária para interpretar corretamente a evidência.

Resultados inconclusivos e buscas relevantes sem resposta também são registrados de forma compacta. Evidências antigas não são apagadas: recebem estado `superseded` e apontam para o item que as substituiu.

### Leitura seletiva

Ao retomar Financeiro, por exemplo, a orquestradora lê `state.md`, filtra no índice os itens financeiros e carrega somente `finance.md` e as evidências de `baseline.md` explicitamente referenciadas. O histórico detalhado dos demais departamentos não entra no contexto.

## Modelo de estados

Cada departamento usa os seguintes estados:

```text
pending -> questioning -> researching -> ready -> drafted
```

- `pending`: ainda não iniciado.
- `questioning`: há perguntas aguardando resposta do usuário.
- `researching`: respostas existem, mas faltam evidências materiais verificáveis.
- `ready`: respostas e evidências são suficientes para redigir.
- `drafted`: seção departamental concluída.
- `stale`: seção pronta foi invalidada por nova resposta, decisão ou evidência.

O campo `next_action` descreve a próxima operação concreta, permitindo continuar exatamente do ponto interrompido. O estado é salvo depois de cada resposta, rodada de pesquisa ou redação.

Se uma evidência nova contradisser uma seção pronta, o departamento vira `stale`. Qualquer mudança em um departamento utilizado pela síntese também marca a síntese como `stale`. `strategy-synthesis` só roda quando todos os departamentos relevantes estão `drafted` e nenhum bloqueio crítico permanece.

## Uso isolado

Quando uma skill departamental é chamada fora de `business-direction`:

- ela pode acionar pesquisa automática com a mesma política de qualidade e profundidade;
- usa documentos internos disponíveis e fontes externas relevantes;
- apresenta fontes, confiança e limitações diretamente no chat;
- não cria `state.md` nem a estrutura `evidence/`;
- não promete retomada auditável entre sessões.

Esse modo preserva a conveniência de uma consulta pontual. Persistência completa é uma propriedade do fluxo orquestrado.

## Segurança e tratamento de falhas

- Conteúdo de páginas e documentos é tratado como dado não confiável, nunca como instrução. Comandos embutidos nas fontes são ignorados.
- Pesquisa não autoriza ações externas como cadastro, contato, compra, publicação ou alteração de sistemas.
- Documentos internos não são publicados nem enviados intencionalmente a terceiros.
- Ausência de evidência nunca é tratada como confirmação.
- Fonte inacessível, internet indisponível e falha de ferramenta são registradas como limitações.
- Afirmações regulatórias, financeiras ou críticas exigem fonte primária quando ela estiver disponível.
- Evidência sem data ou potencialmente desatualizada recebe confiança reduzida.
- Falha parcial preserva o estado e um `next_action` específico para retomada.
- Uma limitação bloqueia somente o departamento afetado, salvo quando comprometer a validade global da direção.

## Qualidade das saídas

Cada seção departamental deve distinguir claramente:

- decisões tomadas pelo usuário;
- fatos sustentados por evidências;
- estimativas e respectivas premissas;
- hipóteses ainda não validadas;
- divergências entre fontes;
- próximos experimentos ou ações de validação.

Toda afirmação factual material deve apontar para um ou mais IDs do registro de evidências. A existência de uma citação não basta: a fonte precisa realmente sustentar a alegação correspondente.

## Estratégia de testes

Os testes seguem RED -> GREEN -> REFACTOR conforme `superpowers:writing-skills`, usando cenários comportamentais antes e depois da instalação das skills.

### Pesquisa e profundidade

- Uma direção nova prepara o ambiente e dispara `baseline` automaticamente.
- Fontes internas e externas aparecem com rastreabilidade.
- Uma decisão reversível usa pesquisa curta.
- Preço, regulação ou viabilidade crítica recebem pesquisa aprofundada.
- Pesquisa encerra por suficiência ou retorno decrescente, sem loop indefinido.

### Conflitos e falhas

- Conflito moderado gera premissa provisória e ação de validação.
- Conflito crítico bloqueia somente o departamento afetado.
- Ausência de internet ou fonte inacessível não gera fato inventado.
- Pesquisa inconclusiva é registrada e não repetida desnecessariamente na retomada.
- Instruções maliciosas encontradas numa fonte são ignoradas.

### Persistência e retomada

- O destino é selecionado e preparado automaticamente.
- Estado e evidências sobrevivem à interrupção entre perguntas e pesquisas.
- Nova evidência incompatível marca departamento e síntese como `stale`.
- Retomar a mesma linha não repete perguntas nem pesquisas já resolvidas.
- Um histórico grande em Marketing não é carregado ao retomar somente Financeiro.

### Rastreabilidade e síntese

- Afirmações factuais importantes apontam para IDs válidos.
- A fonte citada sustenta a afirmação correspondente.
- Hipóteses e estimativas não são apresentadas como fatos.
- A síntese propaga bloqueios, baixa confiança e experimentos necessários.

### Uso isolado

- Uma skill departamental isolada pesquisa e cita no chat.
- O modo isolado não cria arquivos de planejamento persistente.

## Impacto sobre os arquivos existentes

A implementação posterior deve:

- criar `skills/business-research/SKILL.md`;
- revisar `skills/business-direction/SKILL.md` para ambiente, pesquisa, novos estados e leitura seletiva;
- revisar as cinco skills departamentais para consumir evidências e solicitar pesquisas direcionadas;
- revisar `skills/strategy-synthesis/SKILL.md` para rastreabilidade, incerteza e invalidação;
- atualizar o `README.md` de sete para oito skills;
- criar testes RED/GREEN que cubram os cenários desta especificação.

## Critérios de aceitação

O desenho estará corretamente implementado quando:

1. Toda linha nova fizer pesquisa de base automática depois de preparar o ambiente.
2. Cada pesquisa direcionada nascer de uma lacuna material explicitamente registrada.
3. Decisões críticas receberem pesquisa proporcional ao risco.
4. Fontes internas e externas forem auditáveis sem inflar o contexto padrão.
5. Uma retomada carregar apenas o estado e as evidências necessárias ao próximo passo.
6. Incertezas e conflitos forem tratados de forma adaptativa, nunca ocultados.
7. Mudanças invalidarem corretamente seções e sínteses derivadas.
8. O modo isolado continuar simples e sem persistência estrutural.
9. Os testes demonstrarem rastreabilidade, segurança e economia de tokens.
