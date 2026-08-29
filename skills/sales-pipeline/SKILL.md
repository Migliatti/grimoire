---
name: sales-pipeline
description: Use when pensando o departamento de Vendas de uma direção de negócio — modelo de venda, funil, objeções e precificação percebida pelo cliente. Dispara junto com `business-direction`, ou isoladamente quando o usuário pede "pensa as vendas dessa ideia" sem querer o fluxo completo.
---

# sales-pipeline

## Overview

Gera as perguntas de Vendas para uma direção de negócio, e transforma as respostas em uma seção estruturada: modelo de venda, funil, objeções e argumento de valor. Nunca escreve a seção sem antes ter as respostas — se chamado sem respostas, devolve só as perguntas.

## Duas responsabilidades

### 1. Gerar perguntas (dado o contexto da direção)

Perguntas centrais de Vendas — adapte à direção, mas cubra pelo menos:

- Quem vende no início (o próprio fundador, uma equipe, um canal/parceiro)?
- Como é o ciclo de decisão do cliente: decisor único ou múltiplos aprovadores, ciclo curto ou longo?
- Que etapas o funil precisa ter (prospecção → demo/piloto → conversão → expansão), e onde a maior fricção é esperada?
- Quais objeções o cliente provavelmente vai levantar, e o que responde a cada uma?
- Existe intenção de oferecer piloto/teste gratuito, e por quanto tempo?

Se estiver em uma revisão (Q&A anterior existe), não repita perguntas já respondidas — pergunte só o que mudou desde então.

### 2. Redigir a seção (dado o Q&A)

Formato da seção redigida:

```markdown
### Seção redigida
**Modelo de venda:** ...
**Funil:** ...
**Objeções e respostas:** ...
**Piloto/oferta de entrada:** ...
```

Baseie-se só no que o usuário respondeu — não complete lacunas com suposições. Se uma resposta ficar vaga demais para virar seção, isso é sinal de que a pergunta precisa ser refeita, não de preencher com uma suposição sua.

## Uso isolado

Quando invocada fora do fluxo de `business-direction` (sem `state.md`), responda só no chat: pergunte, receba resposta, gere a seção — sem persistir nada em disco.

## Erros comuns

| Erro | Por quê é errado |
|---|---|
| Assumir preço/pacote sem checar com o usuário se já existe uma direção de precificação | Precificação de fato é decisão financeira — aqui é só como isso é vendido/percebido, não o número final |
| Listar objeções genéricas de SaaS em vez das específicas do público descrito | Reduz a utilidade prática da seção |
| Pular a pergunta sobre quem vende no início | Muda completamente o funil recomendado (fundador vendendo é diferente de equipe comercial) |
