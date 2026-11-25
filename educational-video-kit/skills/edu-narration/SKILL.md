---
name: edu-narration
description: Gere narração educativa real com Piper local ou reutilize áudio existente, medindo duração e timestamps de trechos para cenas e legendas.
---

# Narração local intercambiável

Use para sintetizar, ajustar ritmo ou importar áudio de um roteiro educativo. Entrada: manifesto pesquisado. Saída: WAV mono, timestamps medidos, cenas sincronizadas e SRT. Requer edu-video instalado junto; leia [contrato e adaptadores](../edu-video/references/contract.md) e [licenças](../edu-video/references/licenses.md).

O provedor inicial é Piper, voz pt_BR-faber-medium. Custo por chamada: zero; processamento no Mac, sem credenciais. Não use `say` ou serviços Edge como substituto comercial sem verificar seus termos. Não use serviço pago sem autorização.

## Comandos

```bash
"$KIT/.venv/bin/python" "$KIT/skills/edu-narration/scripts/narrate.py" "$KIT/runs/universe-center/manifest.json"
```

`voice.length_scale` altera ritmo; valores maiores tendem a alongar a fala. Meça novamente, não presuma relação linear. Nunca preencha silêncio longo só para bater 60 s. Ajuste roteiro/ritmo quando sair da tolerância do manifesto.

Piper sintetiza separadamente cada frase natural; o script mede amostras WAV e adiciona pausas conhecidas. Legendas têm timestamps de **trechos**, não de palavras. Cenas usam início/fim reais dos trechos correspondentes. Frases idênticas com mesmos parâmetros usam cache. O arquivo enviado ao provedor contém somente fala.

## Reutilizar áudio

Defina `voice.provider="existing"`, `voice.audio="inputs/voice.wav"` e `voice.timestamps="inputs/cues.json"`. Os caminhos são relativos à execução. Os cues devem ter `text`, `start`, `end` em segundos, um por trecho, texto idêntico ao roteiro. Forneça alinhamento real revisado; não divida duração por palavras. O script aceita formatos que FFmpeg lê e normaliza o áudio. Sem timestamps, preserve áudio e peça alinhamento; não finja sincronização.

Para outro sintetizador local gratuito, use `provider="command"`: argv sem shell, placeholders `{text_file}`/`{output}`, `revision`, `commercial_reviewed=true`, `free_local=true`. O comando deve produzir WAV válido e receber segredos somente pelo ambiente, nunca no argv. Leia o contrato. Esse adaptador é um ponto de extensão; apenas Piper e importação foram validados nesta entrega. Para provedor pago implemente adapter explícito e obtenha autorização antes da primeira chamada.

## Erros

Modelo ausente: execute setup. Idioma incompatível: configure um modelo do idioma e reveja sua licença. WAV inválido: preserve cache válido e corrija adapter. Duração inadequada: ajuste e repita esta etapa; quadros afetados serão invalidados. Voz muito artificial: revise pronúncia e frases; transcrição automática não avalia expressividade.
