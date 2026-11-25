# Validação executada em 12/10/2026

Ambiente: macOS arm64, Python 3.12 do runtime local, Piper 1.8.0, Playwright 1.63.0/Chromium, FFmpeg por imageio-ffmpeg e FFprobe 5.0.1. Nenhuma alteração em MoneyPrinterTurbo; todo o trabalho está neste kit.

## Demonstração real

Tema: O universo tem um centro? Narração neural **real** em pt-BR por Piper Faber; não é silêncio, fixture ou áudio simulado. Duração WAV 59,590658 s; MP4 59,600 s; 1788 quadros, 1080×1920, 30 fps. H.264 High, yuv420p, AAC mono, legendas gravadas nos pixels e stream mov_text, SRT externo. Saída em runs/universe-center/final/video.mp4.

O vídeo contém seis cenas explicativas. Foram examinados quadros extraídos do MP4 no início, meio e fim. Diagramas são explicitamente marcados como ilustração/analogia. Margens configuradas: topo 96 px, lados 90 px, rodapé 220 px. Créditos e legendas foram reposicionados durante a revisão para respeitar a margem inferior.

Validação técnica: ffprobe, decodificação completa FFmpeg com -xerror, resolução/fps/codecs, duração e offset A/V, integridade de cues/SRT, silêncio/clipping e comparação do áudio decodificado do MP4 com o WAV. RMS original ~-14,99 dBFS; fração de clipping ~0,0013%; correlação AAC/WAV ~0,9998. Os valores definitivos e hash estão em review/validation.json.

Sincronização: janelas de cena derivadas das amostras reais de cada frase. Whisper small local transcreveu o áudio extraído do MP4 e as seis janelas contêm as falas esperadas, com similaridade de palavras entre 0,889 e 1,000. Houve divergências de ASR como “escorre” por “escolhe”. Essas métricas não medem expressividade nem equivalem a escuta humana. Não foi realizada revisão auditiva por uma pessoa. Legendas são de trechos, não alinhamento palavra a palavra.

## Scripts e comportamento

- Três SKILL.md passaram pelo quick_validate.py oficial da skill-creator.
- Setup real instalou dependências locais, modelo, Chromium e FFprobe; cartões e hashes preservados. Corrigida incompatibilidade faster-whisper/PyAV com pin av==16.1.0.
- Sete testes executados: rejeição de pesquisa não revisada, fonte inexistente e rubrica na narração; importação de WAV real com cues, rejeição de cue inválido; isolamento do cache; movimento e reprodução determinística após tempos fora de ordem; instalador em CODEX_HOME temporário e proteção contra sobrescrita.
- Fluxo completo foi retomado após falhas reais e executado novamente. Narração/cache de quadros foram reutilizados. Encode reutiliza MP4 idêntico quando as entradas não mudaram.
- Uma correção real no crédito da cena grid recapturou só os seus 340 quadros, preservando as cinco outras cenas e a voz. Evidência em review/cache-check.json. Depois a correção do template comum das margens invalidou todos os quadros, como esperado.
- Nenhuma skill global foi sobrescrita. Instalação foi validada em diretório temporário; o comando para instalar de fato está no README.

## Fontes e custos

Fontes científicas primárias da NASA em sources.md, com ligação entre cenas/afirmações. O roteiro distingue modelo, conhecimento estabelecido, analogia e limites. A entrevista Webb usa linguagem de universo infinito; essa simplificação não foi tratada como prova de infinitude, e a resposta 070320a de Ask an Astrophysicist sustenta o limite explícito no roteiro.

Custo de serviço/API: **R$ 0** nesta execução. Há consumo local de processamento, armazenamento e tráfego de downloads; não incluídos como preço de SaaS. Reutilizar o ambiente evita novos downloads. Nenhum vídeo publicado, assinatura comprada ou credencial necessária. Licenças do motor/modelo revisadas em references/licenses.md.

Não validados ponta a ponta: idioma inglês, outros fornecedores de voz, ativos observacionais ou todos os assuntos possíveis. O comando de adapter é extensão local, não uma integração paga pronta. A pipeline não verifica a verdade automaticamente: Codex lê fontes e escreve o manifesto, scripts validam o contrato e o produto audiovisual.
