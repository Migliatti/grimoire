# Contrato v1

JSON Schema: [manifest.schema.json](manifest.schema.json). Exemplo completo: KIT/examples/universe-center.json. Caminhos de arquivos de execução são relativos à pasta do manifesto; modelo Piper é relativo ao KIT. Não use paths com segredos.

| Campo | Responsável / significado |
|---|---|
| topic, language, target_duration | pedido inicial; pt-BR ou en |
| format | width, height, fps e safe_margin em px; padrão 1080×1920/30 |
| sources | id, title, url, accessed, supports em paráfrase; lidos por Codex |
| research | reviewed booleano e reviewer; certificação editorial explícita |
| scenes | id estável, title, claim, epistemic, visual_kind, narration[], sources[], template, takeaway |
| voice | provider e configuração específica do adapter |
| timestamps | text, scene, start/end em segundos; produzidos a partir do áudio |
| files | paths, SHA256 de áudio/MP4 e chaves de entradas |
| status | pending/running/failed/validated ou technical_passed por etapa |
| review | status, método, observações e video_sha256; independente da validação técnica |
| last_error | etapa, mensagem e tempo da última falha, preservados no manifesto |

Não escreva start/end manualmente para Piper: narration deriva essas janelas. `duration_tolerance` padrão 8 s; ajuste se precisar de limite estrito. Não força 60 s por corte que interrompa fala. O vídeo dura ceil(audio_seconds*fps)/fps, diferença máxima de um frame.

## Adapter de voz

Piper: `provider=piper`, `model`, `length_scale`, `pause`. Cache por texto, hash do modelo/config e ritmo, ruído zero para resultados estáveis dentro da versão instalada.

Existente:

```json
{"provider":"existing","audio":"inputs/voice.wav","timestamps":"inputs/cues.json"}
```

```json
[{"text":"Texto exato da primeira frase.","start":0.2,"end":3.7}]
```

Um cue por elemento de narration, na mesma ordem, sem sobreposição, dentro da duração do arquivo. Silêncios são permitidos; ASR pode ajudar a criar cues, mas devem ser revisados. NÃO são timestamps por contagem de palavras.

Outro adapter local:

```json
{"provider":"command","command":["/path/local-tts","--text-file","{text_file}","--output","{output}"],"revision":"local-v1","commercial_reviewed":true,"free_local":true}
```

ARGV é executado sem shell. Não insira chaves nele ou no manifesto. Adapter deve retornar WAV de fala; normalização passa por FFmpeg. Credenciais futuras ficam em variáveis de ambiente/Keychain, não no chat, scripts ou logs. Não existe adapter pago implementado nem chamado. Alterações na implementação exigem aumentar revision.

## Renderers

Padrão: `expansion`, `observers`, `horizon`, `comparison`, `bullets`, `bars`, `timeline`. `points`, `values`, `labels`, `diagram_label` são dados opcionais. Para uma cena própria: `template=custom`, `renderer=scenes/diagrama.js`. Ela define `window.customDraw({ctx,t,progress,width,height,scene,colors,helpers})`. Progresso usa easing, t é tempo local em segundos. O canvas é recortado na área do diagrama.

Para carregar imagens/SVG/fontes locais num renderer, defina `window.ready` com Promise que só resolve quando carregadas/decodificadas. Não deixe requestAnimationFrame alterar a cena. Reprodução deve ser função do tempo, inclusive quando renderAt recebe tempos fora de ordem. Recursos observacionais exigem origem/licença no manifesto e renderer que os mostre de verdade.

## Cache e retomada

Locks impedem duas escritas simultâneas no mesmo run. Quadros temporários são renomeados só após captura. Falha/interrupção preserva frames existentes; execute run para retomar. O diretório do cache contém SHA256 das entradas da cena e template. `--scene` exige que as outras cenas permaneçam atuais. Novo texto exige nova voz; novo renderer daquela cena preserva os demais quadros. Mudança de fonte compartilhada/template invalida todos que dependem dela.

O MP4 é reencodado após alteração visual, mas quadros/voz das outras cenas são reaproveitados. As aprovações são declaradas no manifesto e atreladas ao hash; encodificar outro MP4 marca review pending. Não apague work até terminar a revisão.
