# my-skills

Skills pessoais reutilizáveis para Claude Code, versionadas aqui e instaladas localmente em `~/.claude/skills/`.

## business-direction (cadeia "CEO virtual")

Sete skills que, juntas, funcionam como um "CEO virtual": você aponta uma direção de negócio e o processo pensa nela departamento por departamento, perguntando antes de assumir respostas, e persistindo o progresso para retomar depois sem reprocessar a conversa inteira.

- [`business-direction`](skills/business-direction/SKILL.md) — orquestradora, ponto de entrada único.
- [`product-scope`](skills/product-scope/SKILL.md), [`market-positioning`](skills/market-positioning/SKILL.md), [`sales-pipeline`](skills/sales-pipeline/SKILL.md), [`financial-planning`](skills/financial-planning/SKILL.md), [`operations-planning`](skills/operations-planning/SKILL.md) — subskills de departamento, também usáveis isoladamente.
- [`strategy-synthesis`](skills/strategy-synthesis/SKILL.md) — síntese final, sempre executada por último.

Estado de cada linha de planejamento fica em `docs/business-direction/<slug>/state.md` (se o projeto atual for um repositório git) ou `~/.claude/business-direction/<slug>/state.md` (caso contrário).

Ver `docs/superpowers/specs/2026-08-28-ceo-planning-skills-design.md` (no Lazarus) para o design original desta cadeia.
