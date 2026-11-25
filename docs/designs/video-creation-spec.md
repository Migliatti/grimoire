# Skills de criação de vídeo

Estado: spec aprovada pelo usuário em 2026-10-12, após confirmação das quatro skills e do motor Remotion. Implementação não iniciada nesta fase; não representa integração validada. Spec canônica publicada: [Migliatti/grimoire #3](https://github.com/Migliatti/grimoire/issues/3), com `ready-for-agent`. O [corpo da issue](video-creation-issue.md) segue o formato da skill to-spec e inclui o ponto principal de teste confirmado pelo usuário. Este documento preserva os detalhes locais da especificação.

## 1. Resultado e escopo confirmado

Transformar um pedido em vídeo com direção criativa, animação, som, legendas e projeto editável. Atender vídeos de canal e divulgação; assunto livre, sem limitar o conjunto a educação ou cosmologia. Operação local no macOS, baixo custo, português brasileiro por padrão e inglês opcional.

Validar inicialmente 1080×1920, 30 fps: canal com aproximadamente 60 s; divulgação com 15–30 s. Duração e proporção configuráveis, sem afirmar que formatos não testados estão validados.

Motion graphics por código é a base. Aceitar SVG, Canvas, texto, imagens, logos, screenshots e demonstrações. Narração é padrão no canal e opcional em divulgação. Trilha e efeitos devem servir ao ritmo e à compreensão. Vídeo generativo, publicação automática, compras e serviços de renderização em nuvem ficam fora do MVP.

Perfis reutilizáveis de canal/marca guardam identidade visual, voz e linguagem de movimento. Cada peça pode variar. Não impor fundo escuro, clips de espaço ou uma composição universal.

Pedidos curtos podem receber briefing proposto pelo agente, com público, gancho, roteiro e estilo explicitados. Perguntar apenas sobre lacunas essenciais; não inventar características, benefícios, preços ou resultados de produtos reais.

## 2. Conjunto mínimo aprovado

| Skill | Entrada | Responsabilidade e saída | Gatilho típico |
|---|---|---|---|
| `video-brief` | Pedido, perfil e materiais opcionais | Briefing, evidências, roteiro, direção visual, storyboard e plano de som | Criar roteiro/direção de um vídeo |
| `video-audio` | Roteiro, direção de voz ou áudio existente | Prévia, narração, timestamps, legendas e mixagem | Gerar/corrigir voz ou sincronizar áudio existente |
| `video-motion` | Storyboard, áudio real e materiais | Prévia animada, cenas, montagem e render | Animar/renderizar ou corrigir uma cena |
| `video-produce` | Pedido ou manifesto existente | Coordenar etapas, revisões, cache, retomada e validação | Criar vídeo completo ou retomar produção |

O orquestrador coordena contratos; as outras skills podem trabalhar separadamente. Pesquisa factual integra `video-brief`, evitando uma quinta skill que só se justificaria com demanda independente.

Cada skill terá SKILL.md em inglês conforme o catálogo, respostas no idioma do usuário, gatilhos discriminantes, entradas/saídas, comandos reais, exemplos e recuperação de erros. Scripts executáveis, templates e referências ficarão próximos de quem os possui. Não duplicar lógica do manifesto em quatro implementações.

## 3. Fluxo e pontos de revisão

1. Criar run e briefing proposto; resolver materiais essenciais ausentes.
2. Produzir pesquisa pertinente, roteiro, direção e storyboard; revisar roteiro e direção.
3. Gerar uma prévia de voz. Revisar sotaque, interpretação, ritmo e pronúncia. Depois produzir áudio completo e medir sua duração.
4. Vincular cenas e legendas à fala real; gerar prévia animada de 5–10 s com voz e som. Revisar composição, movimento, legibilidade, ritmo e sincronização.
5. Produzir cenas restantes, montar, mixar e exportar. Executar verificações técnicas e revisão audiovisual.
6. Entregar MP4, legendas, fontes/licenças, manifesto e relatório de validação/custos.

Nos testes iniciais, as três revisões intermediárias são obrigatórias. O usuário pode autorizar avanço explícito em uma revisão; ausência de resposta não é aprovação. Aprovações são registradas por versão/hash. Uma prévia de voz aprovada não aprova automaticamente uma geração completa diferente.

Uma invocação inicia todo o fluxo, mas não contorna revisões ou limites de custo. Exemplo de pedido futuro: “Use video-produce para criar um vídeo vertical de 60 s sobre se o universo tem um centro, usando o perfil do meu canal”.

## 4. Pesquisa, roteiro e direção criativa

Separar texto falado de instruções visuais, citações e anotações editoriais. Manter segmentos de roteiro com IDs estáveis e texto de narração limpo. Só parâmetros de interpretação suportados pelo modelo poderão ser adicionados pelo adaptador; anotações nunca serão lidas como narração.

Afirmações factuais exigem fonte pertinente e verificável, data de consulta e vínculo com os segmentos. Em ciência, distinguir resultado estabelecido, hipótese, analogia e ilustração. Em divulgação fictícia, identificar o produto e as características como fictícios; em divulgação real, não tratar material de marketing como comprovação científica de uma promessa.

Cada cena declara objetivo, trecho falado relacionado, hierarquia visual, composição, ações de movimento, transição, som e critério de revisão. Eventos são vinculados a palavras/trechos ou a tempos explícitos. Preferir movimentos que revelem relações, progressão ou contraste; elementos decorativos não substituem conteúdo.

Templates iniciais: hook tipográfico, comparação/diagrama, visualização de dados, apresentação de produto e fechamento/CTA. São componentes adaptáveis, não vídeos prontos preenchidos com qualquer tema. Diagramas científicos não podem sugerir conclusões falsas; imagens observacionais, simulações e ilustrações terão proveniência e distinção visível quando relevante.

## 5. Voz e áudio

ElevenLabs é a preferência confirmada. Modelo e voz serão fixados somente após prévias reais em português brasileiro. Adaptador expõe síntese, medição e alinhamento para o contrato comum. Importação de áudio é alternativa de primeira classe; não substituir silenciosamente a voz escolhida por uma voz local inferior.

A API documenta [TTS com timestamps por caractere](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps). Converter para palavras e unidades de legenda, preservando o texto falado normalizado. Conferir a capacidade do modelo selecionado. Alinhamento ausente ou ruim deve acionar alinhamento real de áudio/texto ou revisão, nunca timestamps inventados apresentados como medidos.

A [documentação de modelos](https://elevenlabs.io/docs/overview/models) inclui português brasileiro. Direção de interpretação, pronúncia e sotaque ainda dependem da voz e do teste. Evitar frases isoladas com pausas uniformes: preferir tomada contínua para peças curtas ou blocos com contexto. Correções de áudio podem alterar duração e invalidar a timeline dependente.

Guardar original do provedor e versão de trabalho. Medir duração e volume reais. Mixagem com voz inteligível, trilha/efeitos controlados e fades deliberados; sem clipping e sem comprimir ou acelerar a voz automaticamente para caber. Se a duração exceder o alvo, propor ajuste de roteiro ou interpretação e preservar a tomada anterior.

Proposta de parâmetros configuráveis: pico verdadeiro máximo de −1 dBTP, alvo de mixagem −16 LUFS ±2, tolerância de alinhamento revisado de 150 ms e duração de canal 55–65 s. São critérios internos de aceitação, não regras universais das plataformas.

## 6. Motor e renderização

Decisão aprovada: [ADR 0001](../adr/0001-remotion-local-video-rendering.md).

Remotion + React/TypeScript para composição e renderização local, permitindo HTML/CSS/SVG/Canvas. Movimento é função do frame e dos parâmetros: nada de relógio de parede, CSS animation independente, requestAnimationFrame para avançar o tempo ou aleatoriedade sem seed. Canvas recalcula o estado para qualquer frame, sem exigir reprodução desde o início.

A [documentação](https://www.remotion.dev/docs/flickering) exige sincronização das animações com os frames e atenção ao carregamento. Esperar fontes, imagens e outros recursos com mecanismos do renderizador e falhar com timeout explícito se faltarem. Após resolver recursos, render não dependerá de downloads incidentais.

Exportação programática e montagem/encode com FFmpeg: MP4 H.264, yuv420p, AAC quando houver áudio, 30 fps, faststart. Guardar quadros/intermediários por cena; uma cena alterada não obriga recapturar as demais. Exportação final e verificações do conjunto são refeitas quando houver alteração.

Transições podem depender das duas cenas adjacentes: cache inclui essas dependências e os frames de sobreposição. Quando a duração mudar, retimar cenas/legendas afetadas e invalidar os artefatos necessários. Não prometer reaproveitamento de quadros quando o estado renderizado mudou.

Margens configuráveis por perfil; ponto de partida vertical: 90 px laterais, 180 px superiores e 260 px inferiores. Testar composição em prévia de celular. Verificar overflow de títulos e legendas, contraste, sobreposição e tempo de leitura; limites de linhas/tamanho são adaptáveis ao conteúdo e à fonte.

Por que Remotion: componentes reutilizáveis, tempo por frame e proximidade das referências. Tradeoff: React/Node/Chromium e licença própria, diferente de MIT. A [licença atual](https://www.remotion.dev/docs/license/faq) permite uso comercial individual e prevê regras distintas conforme organização/uso. Fixar versão e registrar termos antes de adotar. Sem cloud ou compra no MVP. O Canvas anterior não será mantido como segundo motor de produção sem uma necessidade comprovada.

## 7. Manifesto, artefatos e estados

JSON compartilhado com `schema_version`, `run_id`, `revision`, `topic`, `purpose`, `language`, `profile`, `format`, `brief`, `script`, `sources`, `storyboard`, `voice`, `audio`, `captions`, `scenes`, `assets`, `budget`, `approvals`, `artifacts`, `validation` e `status`.

Entradas/saídas usam caminhos relativos à run, IDs estáveis e hashes. Tempos de áudio em segundos; montagem em frames inteiros, conversão explícita por fps. Intervalos de cena usam início inclusivo e fim exclusivo. Timestamps distinguem origem `provider`, `forced_alignment` e `manual_review`; estimativa de planejamento nunca passa como medição.

Manifesto terá schema JSON validável, restrições de integridade entre IDs e artefatos e migração explícita de versão. Não inclui credenciais. Estados por etapa: `pending`, `running`, `awaiting_review`, `approved`, `failed`, `blocked` e `stale`. Estado global distingue `rendered`, `validated` e `accepted`.

Checkpoint atômico, lock por run, logs sem segredos e registro de erro/correção. Aprovação identifica pessoa/ação, artefato e hash; mudança invalida a aprovação dependente. Não sobrescrever resultados anteriores aprovados.

```text
skills/video-brief/                SKILL.md, referências, helpers
skills/video-audio/                SKILL.md, adaptadores, helpers
skills/video-motion/               SKILL.md, templates, helpers
skills/video-produce/              SKILL.md, runtime/contratos comuns
chains/video-production.md         composição e instalação do fluxo
video-workspace/profiles/          perfis locais de canal/marca
video-workspace/runs/<id>/
  manifest.json
  inputs/                         materiais e briefing
  work/                           roteiro, áudio, alinhamento, cenas
  previews/                       amostras reproduzíveis
  cache/                          quadros e hashes
  reviews/                        decisões e evidências
  final/                          vídeo, SRT, fontes e relatório
```

Runtime comum terá um proprietário e uma versão; instalação do conjunto copia os recursos necessários, sem depender de caminhos absolutos deste checkout. Artefatos de produção e segredos ficam fora do versionamento. Canonical skills ficam em `skills/`; descoberta específica do Codex fica no guia de instalação.

## 8. Interface executável prevista

Os comandos abaixo especificam a interface desejada; ainda não existem e não foram executados:

```sh
video init --prompt "O universo tem um centro?" --purpose channel
video brief --run <id>
video audio preview --run <id>
video audio build --run <id>
video audio import --run <id> --file <audio>
video motion preview --run <id> --scene <id>
video render --run <id>
video review --run <id> --artifact <id> --decision approve
video produce --run <id> --resume
video rerender --run <id> --scene <id>
video validate --run <id>
```

A interface deve funcionar fora da conversa para operações determinísticas. CLI de briefing pode preparar contratos e importar conteúdo; não prometer geração criativa autônoma sem agente/provedor configurado. Conteúdo criativo é responsabilidade das skills; render, medição, estado e validação são scripts reais.

## 9. Custos, licenças e recuperação

Separar narração e recursos visuais. Orçamento numérico e assinatura do usuário permanecem desconhecidos: `paid_calls_enabled=false`, tetos pagos zero até autorização explícita. Autorizar teto não significa comprar assinatura. Mostrar estimativa e registrar consumo real; impedir novas chamadas se o teto for excedido ou o custo não puder ser limitado com segurança.

Uma prévia também pode consumir créditos. Evitar retentar automaticamente síntese após timeout ambíguo: registrar estado incerto e conferir resultado/histórico quando possível antes de nova chamada. Falhas locais reversíveis podem ter até duas novas tentativas com diagnóstico; demais erros preservam checkpoint e informam causa e próximo comando.

A [política comercial da ElevenLabs](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform) exclui plano gratuito e serviços Beta do uso comercial. Registrar condições do plano, modelo e geração. Usar `ELEVENLABS_API_KEY` configurada localmente, sem exibir valor ou solicitar no chat. Sem credencial/autorização, continuar briefing e animação com áudio importado quando disponível, registrando síntese como bloqueada.

Materiais externos guardam origem, licença e atribuição. Referências visuais não autorizam copiar código, música ou imagens; verificar cada recurso. Não replicar uma marca real em anúncio fictício. Gravação manual de tela não será o método principal de exportação.

## 10. Validação e critérios de aceitação

Separar validação técnica de aprovação criativa. Relatório identifica o que foi automatizado, assistido, ouvido pelo usuário, medido ou permanece bloqueado.

Técnica: schema/IDs, recursos presentes, duração, resolução, fps, codecs, pixel format, decode completo do MP4, áudio presente quando esperado, clipping/volume, timestamps monotônicos dentro do áudio, cobertura coerente das legendas, cenas sem gaps não intencionais e fontes carregadas. Vídeo sem voz não exige legendas de fala fictícias.

Perceptiva: ouvir prévia e mixagem; assistir trecho de movimento; inspecionar início/meio/fim, transições e momentos vinculados à fala. Voz compreensível e com intenção; composição legível no celular; movimento serve à mensagem; trilha não mascara voz; não confundir analogia/ilustração com observação. Métricas de diferença de pixels não comprovam qualidade.

Reprodutibilidade: renderizar frames selecionados fora de ordem e duas vezes no mesmo runtime fixado; comparar pixels. Sem prometer igualdade de bytes de MP4 entre máquinas ou síntese remota determinística.

Resiliência: interromper uma run e retomar sem repetir síntese aprovada; alterar uma cena e comprovar reutilização das outras por hashes; mudar áudio/duração e comprovar invalidação correta. Testar fonte ausente, arquivo corrompido, timestamps inválidos, ausência de chave, limite de gasto e aprovação obsoleta.

Dois vídeos reais de aceitação:

1. **Canal:** “O universo tem um centro?”, 55–65 s, voz real em pt-BR, explicação com fontes científicas verificadas e animação que evite sugerir centro físico da expansão.
2. **Divulgação:** produto fictício, 20 s ±2, identidade própria, apresentação de benefício fictício claramente contextualizado, demonstração e CTA. Narração opcional, conforme briefing aprovado.

Ambos: MP4 final, projeto, manifesto, fontes/licenças, custos, prévias e relatório. Sem geração paga autorizada, preservar os demais resultados e dizer exatamente o que falta. Importação de áudio pode validar esse caminho, mas não comprova integração de síntese com ElevenLabs.

## 11. Migração e plano de implementação

Preservar `educational-video-kit/` e seu demo como evidência do protótipo, sem alterar MoneyPrinterTurbo. Auditar e portar somente mecanismos úteis de medição, alinhamento, cache, checkpoint e validação. Substituir template fixo e síntese fragmentada; não colocar cosmologia no nome/gatilho de toda skill.

Sequência prevista de implementação:

1. Usar a issue #3, esta spec e a ADR aprovada como referência.
2. Implementar contratos/runtime e empacotamento autocontido; adicionar quatro skills com skill-creator e seguir regras de autoria do catálogo.
3. Implementar importação/adapter de áudio, perfis, templates e render por cena; fixar dependências locais.
4. Implementar prévias, revisões, retomada, invalidação e validação; executar testes de comportamento e contratos do repositório.
5. Produzir os dois demos com revisões e autorização necessária para créditos; registrar limitações reais.
6. Entregar pedido/comando único, guia de instalação no Codex e evidências de validação. Instalação global não ocorrerá automaticamente.

## 12. Decisões fechadas e pendências operacionais

Entendimento confirmado pelo usuário: vídeos de canal e divulgação, quatro skills, Remotion local, ElevenLabs como preferência inicial e revisões de roteiro/voz/cena. Custos pagos seguem desabilitados até autorização e teto explícitos. Nenhuma pergunta de produto ou arquitetura permanece aberta nesta entrevista.

Na execução, ainda será necessário configurar credencial local, escolher voz/modelo por prévias e definir orçamento/autorização antes de consumir créditos. Essas configurações não bloqueiam a spec nem o trabalho local. Não foram consultadas credenciais nem executadas gerações novas nesta fase. A aprovação da spec não autoriza compra, publicação, instalação global ou consumo pago.
