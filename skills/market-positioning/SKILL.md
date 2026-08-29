---
name: market-positioning
description: Use when pensando o departamento de Marketing de uma direção de negócio — posicionamento, ICP (perfil de cliente ideal) e canal de aquisição. Dispara junto com `business-direction`, ou isoladamente quando o usuário pede "pensa o marketing dessa ideia" sem querer o fluxo completo.
---

# market-positioning

## Overview

Gera as perguntas de Marketing para uma direção de negócio, e transforma as respostas em uma seção estruturada: posicionamento, ICP, canais e métricas. Nunca escreve a seção sem antes ter as respostas — se chamado sem respostas, devolve só as perguntas.

## Duas responsabilidades

### 1. Gerar perguntas (dado o contexto da direção)

Perguntas centrais de Marketing — adapte à direção, mas cubra pelo menos:

- Quem exatamente é o cliente ideal (ICP): segmento, tamanho, características que o diferenciam de "todo mundo que poderia comprar"?
- Qual é o posicionamento — por que esse cliente escolheria isso em vez do que já usa hoje (concorrente direto, alternativa manual, ou "não fazer nada")?
- Que canal(is) de aquisição fazem sentido dado o orçamento e o tempo disponíveis agora (outbound, conteúdo, parcerias, ads pagos)?
- Existe validação de mercado já feita (conversas reais com clientes potenciais), ou isso ainda está por fazer?
- Qual métrica de marketing importa mais agora (CAC, taxa de conversão lead→cliente, custo por lead)?

Se estiver em uma revisão (Q&A anterior existe), não repita perguntas já respondidas — pergunte só o que mudou desde então.

### 2. Redigir a seção (dado o Q&A)

Formato da seção redigida:

```markdown
### Seção redigida
**ICP:** ...
**Posicionamento:** ...
**Canais priorizados:** ...
**Validação já feita / a fazer:** ...
**Métricas a acompanhar:** ...
```

Baseie-se só no que o usuário respondeu — não complete lacunas com suposições. Se uma resposta ficar vaga demais para virar seção, isso é sinal de que a pergunta precisa ser refeita, não de preencher com uma suposição sua.

## Uso isolado

Quando invocada fora do fluxo de `business-direction` (sem `state.md`), responda só no chat: pergunte, receba resposta, gere a seção — sem persistir nada em disco.

## Erros comuns

| Erro | Por quê é errado |
|---|---|
| Definir ICP amplo demais ("qualquer empresa que precise de X") | Não é acionável para escolher canal nem mensagem |
| Assumir canal pago como ponto de partida | Costuma ter CAC alto antes de a mensagem estar validada; pergunte antes de recomendar |
| Confundir posicionamento com lista de funcionalidades | Posicionamento é sobre por que escolher isso, não sobre o que o produto faz |
