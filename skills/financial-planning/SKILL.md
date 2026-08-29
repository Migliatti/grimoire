---
name: financial-planning
description: Use when pensando o departamento Financeiro de uma direção de negócio — modelo de receita, estrutura de custos e necessidade de capital. Dispara junto com `business-direction`, ou isoladamente quando o usuário pede "pensa o financeiro dessa ideia" sem querer o fluxo completo.
---

# financial-planning

## Overview

Gera as perguntas Financeiras para uma direção de negócio, e transforma as respostas em uma seção estruturada: modelo de receita, custos e capital. Nunca escreve a seção sem antes ter as respostas — se chamado sem respostas, devolve só as perguntas.

## Duas responsabilidades

### 1. Gerar perguntas (dado o contexto da direção)

Perguntas centrais Financeiras — adapte à direção, mas cubra pelo menos:

- Qual modelo de receita faz sentido (assinatura, uso, comissão, venda única) e por quê?
- Quais são os custos variáveis mais sensíveis (ex.: custo por unidade vendida/atendida) que crescem junto com o volume?
- O negócio precisa de capital externo para começar, ou dá para bootstrapar a fase de validação?
- Existe algum número real já conhecido (ticket médio do mercado, custo de um fornecedor específico), ou tudo ainda é estimativa?
- Qual seria um resultado financeiro "bom o suficiente" nos primeiros 3-6 meses para considerar a direção validada?

Se estiver em uma revisão (Q&A anterior existe), não repita perguntas já respondidas — pergunte só o que mudou desde então.

### 2. Redigir a seção (dado o Q&A)

Formato da seção redigida:

```markdown
### Seção redigida
**Modelo de receita:** ...
**Estrutura de custos:** ...
**Necessidade de capital:** ...
**Critério de "validado" nos primeiros meses:** ...
```

Baseie-se só no que o usuário respondeu — não complete lacunas com suposições. Números ilustrativos só quando o próprio usuário pedir uma projeção, e sempre marcados como ilustrativos, nunca como previsão real de mercado.

## Uso isolado

Quando invocada fora do fluxo de `business-direction` (sem `state.md`), responda só no chat: pergunte, receba resposta, gere a seção — sem persistir nada em disco.

## Erros comuns

| Erro | Por quê é errado |
|---|---|
| Inventar uma tabela de projeção de MRR sem o usuário ter pedido nem fornecido premissas | Passa segurança falsa sobre números que ninguém validou |
| Ignorar a pergunta sobre necessidade de capital | Muda o ritmo de todo o plano (bootstrapped vs. captação muda prioridades de outros departamentos) |
| Tratar "modelo de receita" e "como isso é vendido" como a mesma coisa | Modelo de receita é estrutura (assinatura/uso/comissão); a venda em si é `sales-pipeline` |
