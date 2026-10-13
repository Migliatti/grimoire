---
name: video-brief
description: Turn an independent channel or promotional video request into a source-aware briefing, clean narration script, production direction, and reviewable storyboard proposal.
---

# Video brief

Turn a short natural-language request into a reviewable production proposal for the local video workflow. Respond in the user's language. Write the proposal itself as JSON that conforms exactly to the schema and rules below; when an essential fact is missing, ask focused questions first and do not present an import-ready promotion with invented values.

## Establish the request

Identify the purpose as `channel` or `promotion`. These modes work independently. If the purpose is ambiguous, ask whether this is a channel piece or a promotion before drafting.

- Default to Brazilian Portuguese (`pt-BR`). Use `en` only when the user explicitly requests English.
- Preserve an existing production profile when supplied. Its typography, colors, voice preference, and motion language are reusable constraints, not a mandate to repeat the same scene composition. If no profile is supplied, propose a compact profile that suits the audience and request.
- Keep piece-specific hook, tone, visual approach, CTA, composition, and movement tailored to this request.
- Ask only questions whose answers materially affect accuracy, offer terms, or production. Do not re-ask facts already provided.

## Promotional facts

For a real product or service, do not invent its name, features, price, discount, availability, eligibility, comparative superiority, guarantee, customer results, destination, or terms. Ask for essential missing product identity, actual offer, intended audience, substantiation for material product claims, CTA/destination, and price/terms when relevant to the offer. Ask before producing the final promotion proposal if an essential detail is missing. An explicitly unknown optional detail may be `null`; never turn that null into narration or an implied fact. Connect material factual product claims to supplied first-party materials or other sources.

For a fictional demonstration, set `promotion.mode` to `fictional`, write a plain `fictionalDisclosure`, and keep fictional claims visibly identified as fiction in the promotion direction or narration. Never present fictional features, prices, studies, customers, or results as real. Claims classified `fictional_claim` are allowed only for a proposal whose promotion is explicitly fictional.

## Research and claim discipline

Research material factual claims instead of relying on memory. Prefer authoritative primary sources such as original research, institutional data, standards, official product documentation, and first-party offer materials. Use reliable secondary material when the primary source is inaccessible and state that source type. Record the exact public URL and the date you consulted it as `YYYY-MM-DD`; do not invent a source, publisher, date, quotation, result, or evidence relationship. If a claim cannot be supported, remove it, narrow it, or present a clearly attributed hypothesis. Do not make a source appear to support more than it says.

Use `established_result` for a result directly supported by reliable evidence, `supported_fact` for a material factual statement supported by its source, `hypothesis` for a sourced but unsettled interpretation, `analogy` for an illustrative comparison that is not evidence, and `fictional_claim` only for an explicitly fictional promotion. Keep observations, scientific results, hypotheses, and analogies distinct. A scientific analogy must never be phrased as a demonstrated mechanism.

## Write clean narration and direction

- `narration` contains only words intended to be spoken. Keep citations, URLs, source names, scene directions, pronunciation notes, camera/motion notes, and sound cues outside narration.
- Split narration into short, stable segments with unique IDs. Preserve punctuation and exact text; supplied audio alignment later must use these IDs and match the narration text exactly.
- For each material claim, record its claim ID, exact concise claim, classification, narration segment IDs, and supporting source IDs. Claims without narration can be omitted from a spoken script.
- Store source records, visual notes, and sound plan separately. A visual note references the narration segments it supports.
- Each storyboard scene needs its own purpose, ordered narration segment IDs, composition template/headline/supporting text, movement anchored to one of that scene's narration IDs, transition, sound cue, and review criterion. Assign every narration ID to exactly one scene in script order. Use transitions to serve the story; do not force identical layouts across scenes.
- Give movement a supported `style`: `hold` (stationary), `drift` (small horizontal float), `zoom` (slow scale up), `orbit` (gentle rotation), `pulse` (small rhythmic scale), or `rise` (settle upward). Keep the `description` faithful to the selected motion; the renderer applies this deterministic frame-driven style.
- The composition templates are `typography`, `comparison`, `diagram`, `data`, `product`, and `closing`. Do not invent numbers, labels, product assets, or visual evidence. For `data`, include non-negative numeric values with units and one or more supporting source IDs for every value; otherwise choose a non-quantitative composition.
- Write sound cues as direction only. This briefing stage does not synthesize voices, music, or effects; imported audio is rendered separately.

## Proposal JSON contract

Return one JSON object with these exact top-level keys. Do not add markdown keys, comments, or unrecognized fields:

```json
{
  "schemaVersion": 1,
  "id": "briefing-001",
  "title": "Concise piece title",
  "purpose": "channel",
  "language": "pt-BR",
  "request": {
    "subject": "Specific subject or product",
    "audience": "Intended audience",
    "objective": "What the piece should help the audience understand or do",
    "coreMessage": "One supported central message"
  },
  "promotion": null,
  "profile": {
    "id": "profile-editorial",
    "name": "Editorial profile name",
    "typography": {"heading": "Typeface or available family", "body": "Typeface or available family"},
    "colors": {"background": "#f4f0e8", "foreground": "#17202e", "accent": "#245bcc"},
    "voicePreference": "Preference only; synthesis is outside this stage",
    "motionLanguage": "Reusable motion principles, not a fixed layout"
  },
  "direction": {
    "hook": "Opening angle",
    "tone": "Delivery tone",
    "visualApproach": "How imagery supports this story",
    "callToAction": "Clear next step or a suitable channel CTA"
  },
  "narration": [{"id": "line-001", "text": "Only clean spoken narration."}],
  "sources": [],
  "claims": [],
  "visualNotes": [],
  "soundPlan": {"music": "No music planned, or describe the intended role.", "effects": []},
  "storyboard": [{
    "id": "scene-001",
    "purpose": "What this scene contributes",
    "narrationSegmentIds": ["line-001"],
    "composition": {"template": "typography", "headline": "Scene headline", "supportingText": null, "data": []},
    "movement": {"style": "rise", "description": "Frame-driven movement that supports the message", "anchor": "line-001"},
    "transition": {"type": "fade", "description": "Why this transition fits"},
    "sound": {"cue": "No added effect; preserve the imported narration."},
    "reviewCriterion": "What the reviewer should verify in this scene"
  }]
}
```

Replace example values with the real request. For promotion, use either:

```json
{"mode":"real","name":"...","offer":"...","targetAudience":"...","cta":"...","destination":null,"price":null,"terms":null,"sourceIds":[]}
```

or:

```json
{"mode":"fictional","name":"...","fictionalDisclosure":"Fictional demonstration; no real product or offer exists.","offer":"Illustrative concept","targetAudience":"...","cta":"..."}
```

Put the matching object in `promotion` and set `purpose` to `promotion`. For a channel piece, use `promotion: null`. If essential promotion facts are unknown, ask the user instead of returning a final import-ready object.

Each source uses `{ "id", "title", "url", "publisher", "consultedOn", "sourceType" }`; `sourceType` is `primary`, `secondary`, or `product_material`. Each claim uses `{ "id", "text", "classification", "narrationSegmentIds", "sourceIds" }`. Evidence-based claims and hypotheses require at least one source. Each visual note uses `{ "id", "narrationSegmentIds", "text" }`. Data compositions use `{ "id", "label", "value", "unit", "sourceIds" }` for every displayed value; empty data arrays are allowed for other templates only. Every ID must be unique across the proposal, every reference must resolve, and narration IDs across scenes must match the narration array order exactly. Dates and colors must use the formats shown above.

## Review and next step

Present a short human-readable summary of audience, objective, core message, claims needing care, profile, and storyboard arc alongside the JSON. Mark evidence gaps and all unresolved optional fields. Do not record or imply approval. Tell the user to import the JSON with the local `video import-briefing <run> --briefing <file.json>` command, inspect `video status <run>`, and have a human approve the exact current briefing digest before audio preview or rendering. A later edit requires review of the new digest. Paid calls remain disabled; this skill does not synthesize audio or render video by itself.
