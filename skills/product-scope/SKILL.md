---
name: product-scope
description: Use when pensando o departamento de Produto de uma direção de negócio — definir escopo de MVP, o que fica de fora, riscos técnicos e roteiro. Dispara junto com `business-direction`, ou isoladamente quando o usuário pede "pensa o produto dessa ideia" sem querer o fluxo completo.
---

# product-scope

## Overview

Gera as perguntas de Produto para uma direção de negócio, e transforma as respostas em uma seção estruturada: escopo do MVP, o que fica fora, riscos técnicos e roteiro. Nunca escreve a seção sem antes ter as respostas — se chamado sem respostas, devolve só as perguntas.

## Duas responsabilidades

### 1. Gerar perguntas (dado o contexto da direção)

Perguntas centrais de Produto — adapte à direção, mas cubra pelo menos:

- Qual é o menor conjunto de funcionalidades que já resolve a dor principal (MVP real, não "versão 1 enxuta de tudo")?
- O que fica **fora** de propósito nesta fase, mesmo que pareça óbvio incluir?
- Existe alguma dependência técnica de risco (API de terceiro, dado que não existe ainda, regulação)?
- Quem constrói isso e em quanto tempo, realisticamente?
- Como o usuário vai saber que o MVP funcionou (critério de sucesso, não só "lançar")?

Se estiver em uma revisão (Q&A anterior existe), não repita perguntas já respondidas — pergunte só o que mudou desde então.

### 2. Redigir a seção (dado o Q&A)

Formato da seção redigida:

```markdown
### Seção redigida
**Escopo do MVP:** ...
**Fora de escopo (por ora):** ...
**Riscos técnicos:** ...
**Roteiro (fases):** ...
**Métricas de sucesso do produto:** ...
```

Baseie-se só no que o usuário respondeu — não complete lacunas com suposições. Se uma resposta ficar vaga demais para virar seção, isso é sinal de que a pergunta precisa ser refeita, não de preencher com uma suposição sua.

## Uso isolado

Quando invocada fora do fluxo de `business-direction` (sem `state.md`), responda só no chat: pergunte, receba resposta, gere a seção — sem persistir nada em disco.

## Erros comuns

| Erro | Por quê é errado |
|---|---|
| Assumir o MVP "óbvio" sem perguntar | O que é óbvio pra você pode não ser a prioridade real do usuário |
| Misturar fase 1, 2 e 3 num único bloco de escopo | Perde a disciplina de "o que fica fora por ora", que é o ponto central desta subskill |
| Preencher métricas de sucesso genéricas ("ter usuários") | Não é acionável; a métrica deve amarrar ao problema descrito na direção |
