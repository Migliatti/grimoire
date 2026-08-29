---
name: operations-planning
description: Use when pensando o departamento de Operações de uma direção de negócio — onboarding de cliente, suporte, compliance/risco operacional e time mínimo necessário. Dispara junto com `business-direction`, ou isoladamente quando o usuário pede "pensa a operação dessa ideia" sem querer o fluxo completo.
---

# operations-planning

## Overview

Gera as perguntas de Operações para uma direção de negócio, e transforma as respostas em uma seção estruturada: onboarding, suporte, risco/compliance e time mínimo. Nunca escreve a seção sem antes ter as respostas — se chamado sem respostas, devolve só as perguntas.

## Duas responsabilidades

### 1. Gerar perguntas (dado o contexto da direção)

Perguntas centrais de Operações — adapte à direção, mas cubra pelo menos:

- Como é o processo de onboarding de um novo cliente/usuário do zero até estar operando de fato?
- Quem dá suporte no início, e por qual canal?
- Existe alguma exigência regulatória, legal ou de compliance específica desse setor (dados sensíveis, licenças, normas)?
- Qual é o time mínimo necessário para operar isso nos primeiros meses?
- O que quebra o negócio operacionalmente se falhar (ponto único de falha), e existe plano de contingência?

Se estiver em uma revisão (Q&A anterior existe), não repita perguntas já respondidas — pergunte só o que mudou desde então.

### 2. Redigir a seção (dado o Q&A)

Formato da seção redigida:

```markdown
### Seção redigida
**Onboarding:** ...
**Suporte:** ...
**Compliance e risco operacional:** ...
**Time mínimo viável:** ...
```

Baseie-se só no que o usuário respondeu — não complete lacunas com suposições. Se uma resposta ficar vaga demais para virar seção, isso é sinal de que a pergunta precisa ser refeita, não de preencher com uma suposição sua.

## Uso isolado

Quando invocada fora do fluxo de `business-direction` (sem `state.md`), responda só no chat: pergunte, receba resposta, gere a seção — sem persistir nada em disco.

## Erros comuns

| Erro | Por quê é errado |
|---|---|
| Pular a pergunta de compliance por achar que "não se aplica" | Setores regulados (saúde, financeiro, dados pessoais) têm risco real que muda o plano inteiro |
| Assumir que o fundador cobre suporte indefinidamente sem perguntar | Vira gargalo não planejado ao crescer |
| Confundir "time mínimo viável" com organograma completo de contratações futuras | O foco é só o necessário para operar agora, não o roadmap de RH |
