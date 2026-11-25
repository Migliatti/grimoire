---
name: edu-research
description: Pesquise e escreva roteiros educativos curtos com fontes verificadas, classificação das afirmações e plano de cenas, para narração por IA.
---

# Pesquisa e roteiro educativo

Use para pesquisar, corrigir afirmações ou preparar a etapa de roteiro de vídeos educativos em qualquer área. Idioma padrão pt-BR; inglês quando solicitado. Não exige cosmologia.

## Entradas e saídas

Entrada: tema, idioma, duração aproximada e pasta de execução. Saída: `manifest.json`, `sources.md`, `work/narration.txt`; roteiro em `scenes[].narration`, fontes em `sources[]`, plano visual em campos separados. Instale junto com `edu-narration` e `edu-video`, que contém o runtime compartilhado. Leia [contrato](../edu-video/references/contract.md).

1. Crie uma execução com o script `new_run.py` de edu-video. Obtenha fontes primárias atuais por ferramentas de pesquisa disponíveis; abra as páginas, não confie apenas em snippets. Para ciências use instituições e artigos; para história documentos e bibliografia acadêmica; para tecnologia documentação oficial. Verifique data e contexto.
2. Registre URL, título, data consultada e paráfrase da evidência em `sources`. Relacione cada cena às fontes que sustentam sua afirmação. Se fonte contradiz outra, registre o conflito e limite a conclusão. Não marque fonte verificada só porque URL existe.
3. Classifique cada afirmação: `established`, `model`, `hypothesis`, `analogy` ou `unknown`. Divida cenas mistas; escreva limites da analogia. Imagens observacionais exigem origem e licença; gráficos ilustrativos não devem parecer dados medidos.
4. Escreva cerca de 120–150 palavras como ponto inicial para 60 s, depois ajuste pela voz medida. Divida a fala em frases naturais de até 120 caracteres. Não envie citações, URLs, Markdown, rubricas nem instruções visuais ao sintetizador. Use `claim`, `template`, `takeaway` e opcional `renderer` para orientar os visuais.
5. Após ler evidências, marque `research.reviewed=true` e identifique o revisor. Execute validação/exportação; o script verifica o contrato, não prova a verdade das afirmações.

## Comandos e exemplo

`KIT` é a pasta do kit. Após instalar, encontre-a em `edu-video/references/runtime.json`.

```bash
"$KIT/.venv/bin/python" "$KIT/skills/edu-video/scripts/new_run.py" "$KIT/runs/fotossintese" --topic "Como a fotossíntese funciona?"
# Preencha fontes, cenas e revisão no manifesto com pesquisa real.
"$KIT/.venv/bin/python" "$KIT/skills/edu-research/scripts/research.py" "$KIT/runs/fotossintese/manifest.json"
```

Para o exemplo pronto: `examples/universe-center.json`. O runtime não inventa roteiro para temas arbitrários: Codex pesquisa e preenche o manifesto a partir do pedido.

## Erros

Sem fonte acessível: preserve rascunho e registre a lacuna; não marque revisão concluída. Afirmação incerta: reescreva explicitando incerteza. Contrato inválido: corrija o campo indicado pelo JSON Schema. Não altere uma fala aprovada silenciosamente; mudança de roteiro invalida voz e cenas dependentes.
