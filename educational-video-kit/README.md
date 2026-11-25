# Educational Video Kit

Três skills reutilizáveis para vídeos educativos em qualquer assunto: edu-research, edu-narration, edu-video. Cosmologia é o exemplo validado. Sem MoneyPrinterTurbo, serviços pagos ou credenciais.

## Uso local

```bash
cd educational-video-kit  # a partir da raiz do repositório
.venv/bin/python skills/edu-video/scripts/pipeline.py run runs/universe-center/manifest.json
```

Para outro tema, faça um único pedido ao Codex após instalar:

> Use $edu-video para criar um vídeo educativo de aproximadamente 60 segundos sobre como funciona a fotossíntese, em português brasileiro, usando pesquisa em fontes primárias, narração local e animações explicativas. Salve os artefatos em uma nova pasta de execução e revise o MP4.

O shell executa manifesto pesquisado; não contém um LLM nem uma pesquisa científica automática escondida. O Codex faz pesquisa/roteiro com ferramentas disponíveis e preenche o contrato, depois chama os scripts.

## Instalação em outro Mac

Python 3.12+, Node/npm, macOS arm64; mantenha a pasta do kit, incluindo exemplos e os três diretórios de skills. Para macOS Intel/Linux, instale ffprobe no sistema ou exporte FFPROBE. O pacote de FFmpeg é escolhido pela plataforma por imageio-ffmpeg.

```bash
python3 skills/edu-video/scripts/setup.py --asr
# opcional: --english baixa o modelo inglês
.venv/bin/python skills/edu-video/scripts/install_skills.py
```

O instalador copia as três skills para `${CODEX_HOME:-~/.codex}/skills` e registra o caminho do runtime local. Não substitui skills existentes. Reinicie a sessão Codex para nova descoberta. Não mover/apagar o kit depois; reinstale/reconfigure runtime.json se mudar a pasta. Instalação global não foi executada automaticamente; a criação/validação local está concluída.

O setup instala dependências somente em .venv, .browsers, node_modules, models. Downloads são gratuitos; reserve cerca de 1–2 GB com ASR e algumas centenas de MB para quadros por episódio. PyAV 16.1.0 é fixado para compatibilidade com faster-whisper. Não requer Homebrew nem muda configurações globais.

## Etapas

```bash
.venv/bin/python skills/edu-video/scripts/new_run.py runs/novo --topic "Seu tema"
# Codex preenche fontes, cenas e reviewed no manifesto.
.venv/bin/python skills/edu-research/scripts/research.py runs/novo/manifest.json
.venv/bin/python skills/edu-narration/scripts/narrate.py runs/novo/manifest.json
.venv/bin/python skills/edu-video/scripts/pipeline.py render runs/novo/manifest.json
.venv/bin/python skills/edu-video/scripts/pipeline.py encode runs/novo/manifest.json
.venv/bin/python skills/edu-video/scripts/pipeline.py validate runs/novo/manifest.json
.venv/bin/python skills/edu-video/scripts/check_speech.py runs/novo/manifest.json
```

Veja [contrato](skills/edu-video/references/contract.md), [licenças](skills/edu-video/references/licenses.md), [manifesto de exemplo](examples/universe-center.json) e [resultados da validação](VALIDATION.md).

## Limites reais

Piper é uma voz neural local econômica, mas a expressividade é inferior a serviços premium. Timestamps são de frases curtas com duração medida; não há destaque palavra a palavra. Importação exige cues reais. O adapter de comando permite extensão, mas não é uma integração com fornecedores comerciais. Inglês e imagens observacionais não foram validados ponta a ponta.

A validação técnica e ASR auxiliam a revisão; conteúdo científico e escolha de analogias exigem leitura de fontes e julgamento editorial. Assuntos médicos/jurídicos/financeiros precisam de revisão especializada adequada ao conteúdo. Scripts nunca publicam vídeos.
