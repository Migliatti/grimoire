---
name: edu-video
description: Produza e revise um MP4 educativo com narração sincronizada, animações HTML/Canvas determinísticas e legendas, retomando etapas e corrigindo cenas localmente.
---

# Produção de vídeos educativos

Use para pedidos completos como “Crie um vídeo de 60 segundos sobre X”, para renderizar cenas, retomar execução ou revisar MP4. Funciona para temas gerais; cosmologia é apenas a demonstração. Coordene edu-research e edu-narration. Não publique, compre serviços nem faça chamadas pagas sem autorização.

## Runtime e arquivos

As três skills compartilham estes scripts. Depois da instalação, leia `references/runtime.json` para localizar KIT e Python; antes da instalação o KIT é a raiz desta distribuição. Não copie só SKILL.md. Entrada/saída: manifesto versionado e arquivos definidos no [contrato](references/contract.md). Intermediários em `work/`; entregas em `final/`; inspeção em `review/`. Leia [licenças](references/licenses.md) ao escolher vozes.

## Fluxo completo

1. Para tema novo execute `scripts/new_run.py RUN --topic "TEMA" [--language en]`. Pesquise com edu-research, escreva e valide o manifesto. Não reutilize as fontes de cosmologia para outro assunto.
2. Configure voz local e execute a pipeline. Nenhuma credencial é necessária no caminho inicial.
3. Inspecione as capturas e a voz; rode `check_speech.py` se o ASR opcional estiver instalado. Transcrição é auxiliar, não escuta humana. Registre no manifesto `review` o método, escopo e hash do vídeo examinado. Não diga que houve escuta humana quando só usou ASR.
4. Entregue MP4, SRT, fontes e relatório. A revisão técnica não certifica a ciência, licenças de terceiros ou qualidade editorial.

```bash
"$KIT/.venv/bin/python" "$KIT/skills/edu-video/scripts/pipeline.py" run "$KIT/runs/episodio/manifest.json"
```

Este comando retoma um manifesto já pesquisado. Um pedido único ao Codex faz pesquisa e preenchimento antes dele: “Use $edu-video para criar um vídeo educativo de 60 s sobre como funciona a fotossíntese, em pt-BR, com fontes primárias e pipeline local gratuita.”

## Etapas e correções

```bash
"$KIT/.venv/bin/python" "$KIT/skills/edu-video/scripts/pipeline.py" render "$KIT/runs/episodio/manifest.json"
"$KIT/.venv/bin/python" "$KIT/skills/edu-video/scripts/pipeline.py" render "$KIT/runs/episodio/manifest.json" --scene grid
"$KIT/.venv/bin/python" "$KIT/skills/edu-video/scripts/pipeline.py" encode "$KIT/runs/episodio/manifest.json"
"$KIT/.venv/bin/python" "$KIT/skills/edu-video/scripts/pipeline.py" validate "$KIT/runs/episodio/manifest.json"
```

Altere somente dados/renderer daquela cena e use `--scene ID`; outras cenas precisam estar atuais. Alterar o template compartilhado invalida todas. Alterar fala requer narration antes de render. Há lock por execução, gravação atômica de quadros e manifesto, status por etapa e cache por conteúdo. Executar run novamente reutiliza fala/quadros e MP4 atuais; nunca considera um MP4 antigo aprovado após modificação.

## Animações

`assets/scene.html` contém diagramas de expansão, observadores, horizonte, comparação, barras, timeline e tópicos. Escolha os que explicam o assunto; barras exigem unidades, fontes e escala explícitas para dados reais. Para outro diagrama copie `assets/custom-scene.js` para a execução e use `scene.renderer`. HTML/CSS/SVG podem ser implementados no template; a API obrigatória é `configure(payload)` e `renderAt(seconds)`.

Tempo absoluto e funções puras controlam o visual. Não use timers, Date, Math.random, animações dependentes do relógio, rede ou gravação manual de tela. Aguarde fontes/imagens carregarem. Use arquivos locais e mantenha indicação `visual_kind` visível. Ajuste margens no manifesto. Todas as legendas ficam em até três linhas a 52 px no exemplo 1080×1920.

## Validação e erros

Valida resolução, fps, H.264/yuv420p, AAC, legendas mov_text, duração, áudio não silencioso/clipping, janela dos cues e decodificação completa. Produz quadros do começo/meio/fim. Falha não é sucesso parcial: preserve artefatos e reporte stage/last_error.

Chromium com “MachPort ... Permission denied” no sandbox macOS: solicite execução local com permissão de processo no ambiente, sem trocar por simulação. FFprobe ausente: setup ou `FFPROBE`. Fonte/asset ausente: corrija antes da captura. Texto que não cabe: encurte frase/título ou ajuste template, recapture cena. Vídeo fora da tolerância: retorne à narração. Áudio importado sem alinhamento: etapa bloqueada até cues reais. Sem API paga: preserve fluxo local; jamais registre credenciais.
