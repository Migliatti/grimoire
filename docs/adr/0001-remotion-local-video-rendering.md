---
status: accepted
date: 2026-10-12
---

# Renderização local com Remotion

O protótipo Canvas tinha composição fixa e pouco movimento dirigido; o novo conjunto precisa de cenas reutilizáveis, prévias animadas e coreografia por frame. Adotamos Remotion com React/TypeScript e renderização local, em vez de expandir o motor Canvas próprio, para compor essas cenas e manter a timeline determinística sem gravação manual de tela. Aceitamos dependências de Node/Chromium e a licença específica do Remotion; o manifesto de produção e os adaptadores de áudio permanecem independentes do motor, e não manteremos dois renderizadores sem necessidade demonstrada.

A escolha foi confirmada pelo usuário em 2026-10-12. A implementação deverá fixar versões, conferir os termos aplicáveis e validar render fora de ordem, carregamento de recursos e invalidação por cena; esta decisão não afirma que esses comportamentos já foram implementados.
