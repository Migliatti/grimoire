import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const SKILL_COMMAND = "/skill:model-routing-policy";
const REQUIRED_FIELDS = [
  "Task type",
  "Complexity",
  "Risk",
  "Reversibility",
  "Evidence need",
  "Recommended model profile",
  "Recommended effort",
  "Manual preference",
  "Decision",
  "Rationale",
  "Required approval or verification",
  "Safe fallback",
  "Audit record",
] as const;

interface GateState {
  active: boolean;
  retries: number;
  lastAssistantText: string;
}

function assistantText(message: unknown): string | undefined {
  if (!message || typeof message !== "object") return undefined;
  const candidate = message as {
    role?: unknown;
    content?: unknown;
  };
  if (candidate.role !== "assistant" || !Array.isArray(candidate.content)) return undefined;

  return candidate.content
    .filter(
      (part): part is { type: "text"; text: string } =>
        Boolean(part) &&
        typeof part === "object" &&
        (part as { type?: unknown }).type === "text" &&
        typeof (part as { text?: unknown }).text === "string",
    )
    .map((part) => part.text)
    .join("\n");
}

function missingRoutingFields(text: string): string[] {
  const normalized = text.trimStart();
  const missing = REQUIRED_FIELDS.filter(
    (field) => !new RegExp(`^\\s*-\\s*${field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:`, "m").test(text),
  );

  if (!normalized.startsWith("### Routing decision")) {
    missing.unshift("response heading `### Routing decision`");
  }
  return missing;
}

export default function (pi: ExtensionAPI) {
  const state: GateState = { active: false, retries: 0, lastAssistantText: "" };

  pi.on("input", (event) => {
    if (event.source !== "extension" && event.text.trimStart().startsWith(SKILL_COMMAND)) {
      state.active = true;
      state.retries = 0;
      state.lastAssistantText = "";
    }
    return { action: "continue" };
  });

  pi.on("message_end", (event) => {
    const text = assistantText(event.message);
    if (text !== undefined) state.lastAssistantText = text;
  });

  pi.on("agent_settled", async (_event, ctx) => {
    if (!state.active || !state.lastAssistantText) return;

    const missing = missingRoutingFields(state.lastAssistantText);
    if (missing.length === 0) {
      pi.appendEntry("model-routing-output-gate", { status: "passed", retries: state.retries });
      state.active = false;
      return;
    }

    if (state.retries === 0) {
      state.retries = 1;
      pi.appendEntry("model-routing-output-gate", { status: "retrying", missing });
      pi.sendUserMessage(
        `Correct your previous routing response. It is incomplete because it lacks: ${missing.join(
          ", ",
        )}. Return only the mandatory Model Routing Policy block, beginning exactly with ### Routing decision and containing every required field. Do not execute the original task.`,
      );
      return;
    }

    pi.appendEntry("model-routing-output-gate", { status: "failed", missing });
    if (ctx.hasUI) {
      ctx.ui.notify(
        "Model-routing response remains incomplete after one correction attempt.",
        "warning",
      );
    }
    state.active = false;
  });
}
