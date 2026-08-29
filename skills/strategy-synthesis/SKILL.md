---
name: strategy-synthesis
description: Use when todos os departamentos relevantes de uma direção de negócio (`business-direction`) já têm seção redigida e é hora de cruzar as informações entre eles, priorizar e sequenciar os próximos passos. Sempre a última etapa do fluxo — nunca substitui as subskills de departamento.
---

# strategy-synthesis

## Overview

Recebe as seções já redigidas de todos os departamentos relevantes de uma linha de planejamento e produz a síntese final: cruza informações entre departamentos, aponta incoerências, prioriza e sequencia próximos passos concretos. Não gera perguntas próprias nem reabre departamentos — isso é trabalho de `business-direction` e das subskills de departamento.

## Pré-condição

Só rode depois que **todos** os departamentos relevantes estiverem com `status: sintetizado` no `state.md`. Se algum ainda estiver `pending` ou `perguntado`, isso é um sinal de que `business-direction` te invocou cedo demais — recuse e aponte qual departamento falta.

## O que fazer

### 1. Cruzar informações entre departamentos

Procure especificamente por incompatibilidades entre seções, por exemplo:

- O preço/pacote implícito em Vendas é compatível com o custo variável descrito em Financeiro?
- O esforço de MVP descrito em Produto cabe no prazo/capital descrito em Financeiro?
- O canal de aquisição de Marketing alcança o ICP que Vendas está desenhando o funil para atender?
- O time mínimo viável de Operações dá conta do volume que Vendas/Marketing esperam gerar?

Liste cada incompatibilidade encontrada como um risco explícito — não tente resolver sozinho decisões que são do usuário (ex.: "o preço proposto não cobre o custo variável estimado; ajuste um dos dois" em vez de simplesmente escolher um número novo).

### 2. Priorizar e sequenciar

Produza uma lista curta de próximos passos concretos, ordenados, cobrindo o horizonte imediato (tipicamente 30-60-90 dias ou equivalente à natureza da direção). Cada passo deve ser acionável, não um objetivo vago.

### 3. Gravar a síntese

Escreva o resultado na seção `## Síntese` do `state.md` (topo ou fim do arquivo), formato:

```markdown
## Síntese
**Riscos/incoerências entre departamentos:** ...
**Próximos passos priorizados:** ...
```

## Erros comuns

| Erro | Por quê é errado |
|---|---|
| Rodar com departamento ainda não `sintetizado` | Produz síntese incompleta ou contraditória com o que aquele departamento ainda vai decidir |
| Resolver sozinho uma incoerência entre departamentos (ex.: escolher o preço) | Decisão é do usuário; o papel aqui é apontar o conflito, não decidir por ele |
| Repetir o conteúdo de cada seção em vez de cruzar informação entre elas | Síntese vira resumo, não análise — o valor está no cruzamento |
