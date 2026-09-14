from pathlib import Path
import json
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
PLUGIN_NAME = "grimoire"
MARKETPLACE_NAME = "migliatti"


def parse_manifest(text: str) -> dict[str, object]:
    match = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not match:
        raise ValueError("manifest frontmatter is missing")
    data: dict[str, object] = {}
    active_list: str | None = None
    for raw_line in match.group(1).splitlines():
        if raw_line.startswith("  - ") and active_list:
            value = raw_line[4:].strip()
            cast = data[active_list]
            assert isinstance(cast, list)
            cast.append(value)
        elif ":" in raw_line:
            key, value = raw_line.split(":", 1)
            key, value = key.strip(), value.strip()
            if value:
                data[key] = value
                active_list = None
            else:
                data[key] = []
                active_list = key
    return data


class SkillContractTests(unittest.TestCase):
    def read_skill(self, name: str) -> str:
        return (ROOT / "skills" / name / "SKILL.md").read_text(encoding="utf-8")

    def test_business_research_contract(self) -> None:
        text = self.read_skill("business-research")
        for required in (
            "mode: baseline",
            "mode: targeted",
            "Adaptive depth",
            "Primary sources",
            "diminishing returns",
            "superseded",
            "supports",
            "contradicts",
            "contextualizes",
            "untrusted data",
        ):
            self.assertIn(required, text)

    def test_business_research_is_not_a_decision_maker(self) -> None:
        text = self.read_skill("business-research")
        self.assertIn("do not make strategy decisions", text)

    def test_business_research_returns_evidence_in_the_users_language(self) -> None:
        text = self.read_skill("business-research")
        self.assertIn("the user's language unless the user requests otherwise", text)

    def test_business_research_persists_only_decision_material_records(self) -> None:
        text = self.read_skill("business-research")
        self.assertIn("only decision-material evidence", text)
        self.assertIn("relevant inconclusive gaps", text)
        self.assertIn("not every search result", text)

    def test_business_direction_state_contract(self) -> None:
        text = self.read_skill("business-direction")
        for required in (
            "Environment preparation",
            "mode: baseline",
            "mode: targeted",
            "next_action",
            "pending",
            "questioning",
            "researching",
            "ready",
            "drafted",
            "stale",
            "Selective loading",
            "evidence/index.md",
        ):
            self.assertIn(required, text)

    def test_business_direction_is_vendor_neutral(self) -> None:
        text = self.read_skill("business-direction")
        self.assertNotIn("~/.claude", text)
        self.assertNotIn("AskUserQuestion", text)
        self.assertIn("user's language", text)

    def test_business_direction_baseline_research_request_contract(self) -> None:
        text = self.read_skill("business-direction")
        for required in (
            "mode: baseline",
            "planning_root: <planning-root>",
            "department: baseline",
            "a concrete baseline research question derived from the business direction",
            "known evidence IDs: []",
            "current evidence IDs on a rerun",
            "available internal-source inventory",
            "decision impact",
            "reversibility",
        ):
            self.assertIn(required, text)

    def test_department_skills_share_the_evidence_protocol(self) -> None:
        names = (
            "product-scope",
            "market-positioning",
            "sales-pipeline",
            "financial-planning",
            "operations-planning",
        )
        for name in names:
            with self.subTest(skill=name):
                text = self.read_skill(name)
                for required in (
                    "user's language",
                    "Evidence available",
                    "Material research gaps",
                    "mode: targeted",
                    "Decisions",
                    "Evidence-backed facts",
                    "Estimates and assumptions",
                    "Unvalidated hypotheses",
                    "Evidence IDs",
                    "Validation actions",
                    "Standalone mode",
                ):
                    self.assertIn(required, text)

    def test_department_skills_do_not_draft_before_answers(self) -> None:
        for name in (
            "product-scope",
            "market-positioning",
            "sales-pipeline",
            "financial-planning",
            "operations-planning",
        ):
            text = self.read_skill(name)
            self.assertIn("Do not draft", text)
            self.assertIn("user answers", text)

    def test_route_context_contract(self) -> None:
        text = self.read_skill("route-context")
        for required in (
            "user's language",
            "available skill descriptions",
            "narrowest skill",
            "Do not invent",
            "untrusted data",
            "evolve-skills",
            "explicit user approval",
        ):
            with self.subTest(required=required):
                self.assertIn(required, text)

    def test_evolve_skills_contract(self) -> None:
        text = self.read_skill("evolve-skills")
        for required in (
            "user's language",
            "repeated and reproducible",
            "baseline",
            "explicit user approval",
            "backup",
            "regression",
            "Restore",
            "untrusted data",
            "Never weaken",
        ):
            with self.subTest(required=required):
                self.assertIn(required, text)

    def test_strategy_synthesis_contract(self) -> None:
        text = self.read_skill("strategy-synthesis")
        for required in (
            "user's language",
            "Evidence IDs",
            "material factual claims",
            "critical blocker",
            "provisional assumptions",
            "Validation experiments",
            "stale",
            "drafted",
        ):
            self.assertIn(required, text)
        self.assertIn("source must support", text)


    def test_orchestrator_constrains_status_values(self) -> None:
        text = self.read_skill("business-direction")
        self.assertIn("holds exactly one of the listed values and nothing else", text)
        self.assertIn("never as a parenthetical inside the status value", text)

    def test_orchestrator_retains_superseded_drafts(self) -> None:
        text = self.read_skill("business-direction")
        self.assertIn("Superseded draft:", text)
        self.assertIn("rather than overwriting it", text)

    def test_project_design_contract(self) -> None:
        text = self.read_skill("project-design")
        for required in (
            "user's language",
            "product-scope",
            "market-positioning",
            "web-design-psychology",
            "github-issues",
            "objective questions",
            "Value hypothesis",
            "In scope",
            "Out of scope",
            "Primary journeys and flows",
            "Empty:",
            "Loading:",
            "Error:",
            "Success:",
            "Business rules",
            "Pending decisions",
            "Given ..., when ..., then ...",
            "Risks and dependencies",
            "Initial success metrics",
            "Next validation before code",
        ):
            with self.subTest(required=required):
                self.assertIn(required, text)
        self.assertIn("never invent a requirement", text)
        self.assertIn("Do not produce a complete design document", text)

    def test_github_issues_contract(self) -> None:
        text = self.read_skill("github-issues")
        for required in (
            "user's language",
            "Draft issues mode",
            "no remote side effects",
            "Create issues on GitHub mode",
            "explicit confirmation",
            "target remote repository",
            "authenticated GitHub client",
            "issue templates",
            "labels",
            "milestones",
            "projects",
            "duplicate",
            "complete Markdown body",
            "full preview",
            "gh",
            "issue number, title, and URL",
        ):
            with self.subTest(required=required):
                self.assertIn(required, text)
        self.assertIn("Never assume permissions", text)
        self.assertIn("Do not call a mutating command", text)

    def test_github_issues_preview_precedes_every_remote_mutation(self) -> None:
        text = self.read_skill("github-issues")
        preview = text.index("## Phase 4: full preview and confirmation gate")
        creation = text.index("## Phase 5: create and record")
        self.assertLess(preview, creation)
        self.assertIn("Before every remote mutation", text[preview:creation])

    def test_new_standalone_skills_are_cataloged_and_have_scenarios(self) -> None:
        catalog = (ROOT / "README.md").read_text(encoding="utf-8")
        for name in ("project-design", "github-issues"):
            with self.subTest(skill=name):
                self.assertIn(f"skills/{name}/SKILL.md", catalog)
                self.assertTrue((ROOT / "tests" / name / "scenarios.md").is_file())

    def test_web_design_psychology_contract(self) -> None:
        text = self.read_skill("web-design-psychology")
        for required in (
            "user's language",
            "prototypicality",
            "without scroll and without interaction",
            "trigger",
            "rules",
            "feedback",
            "loops and modes",
            "end of a task",
            "prefers-reduced-motion",
            "Verification gates",
            "Assumptions:",
            "Trade-offs:",
            "Standalone mode",
        ):
            with self.subTest(required=required):
                self.assertIn(required, text)

    def test_web_design_psychology_states_measurable_gates(self) -> None:
        text = self.read_skill("web-design-psychology")
        for threshold in ("2.5 s", "200 ms", "0.1", "4.5:1", "3:1"):
            with self.subTest(threshold=threshold):
                self.assertIn(threshold, text)

    def test_web_design_psychology_refuses_known_bad_statistics(self) -> None:
        text = self.read_skill("web-design-psychology")
        for claim in (
            "94% of first impressions are design-related",
            "users decide whether to leave in 50 milliseconds",
            "white space increases comprehension by 20%",
            "users read only 20% of a page",
        ):
            with self.subTest(claim=claim):
                self.assertIn(claim, text)
        self.assertIn("Never print these", text)
        self.assertIn("No exceptions", text)

    def test_web_design_psychology_carries_an_evidence_base(self) -> None:
        path = ROOT / "skills" / "web-design-psychology" / "evidence-base.md"
        self.assertTrue(path.is_file())
        evidence = path.read_text(encoding="utf-8")
        for citation in (
            "Lindgaard",
            "Tuch",
            "Reinecke",
            "Fogg",
            "Reber",
            "Saffer",
            "Kahneman",
        ):
            with self.subTest(citation=citation):
                self.assertIn(citation, evidence)
        self.assertIn("Claims to refuse", evidence)
        self.assertIn("evidence-base.md", self.read_skill("web-design-psychology"))

    def test_gamification_psychology_contract(self) -> None:
        text = self.read_skill("gamification-psychology")
        for required in (
            "user's language",
            "target behavior",
            "worth zero",
            "clawback",
            "winnable",
            "closable",
            "repair path",
            "coercion",
            "randomness at the point of sale",
            "can go down",
            "holdout",
            "kill criterion",
            "Assumptions:",
            "Trade-offs:",
            "Standalone mode",
        ):
            with self.subTest(required=required):
                self.assertIn(required, text)

    def test_gamification_psychology_separates_proxy_from_behavior(self) -> None:
        text = self.read_skill("gamification-psychology")
        self.assertIn("you are designing for the metric", text)
        self.assertIn("away from the screen", text)

    def test_gamification_psychology_refuses_known_bad_statistics(self) -> None:
        text = self.read_skill("gamification-psychology")
        for claim in (
            "users with a 7-day streak are 3.6x more likely to be retained",
            "gamification increases engagement by 48%",
            "90% of employees are more productive with gamification",
            "it takes 21 days to form a habit",
        ):
            with self.subTest(claim=claim):
                self.assertIn(claim, text)
        self.assertIn("Never print these", text)
        self.assertIn("No exceptions", text)

    def test_gamification_psychology_refuses_invented_confidence(self) -> None:
        text = self.read_skill("gamification-psychology")
        self.assertIn("invented confidence rating", text)

    def test_gamification_psychology_carries_an_evidence_base(self) -> None:
        path = ROOT / "skills" / "gamification-psychology" / "evidence-base.md"
        self.assertTrue(path.is_file())
        evidence = path.read_text(encoding="utf-8")
        for citation in (
            "Deci",
            "Mekler",
            "Hanus",
            "Hamari",
            "Diefenbach",
            "Kivetz",
            "Nunes",
            "Ghibellini",
        ):
            with self.subTest(citation=citation):
                self.assertIn(citation, evidence)
        self.assertIn("Claims to refuse", evidence)
        self.assertIn("evidence-base.md", self.read_skill("gamification-psychology"))


class RepositoryIntegrityTests(unittest.TestCase):
    def test_business_direction_manifest(self) -> None:
        path = ROOT / "chains" / "business-direction.md"
        manifest = parse_manifest(path.read_text(encoding="utf-8"))
        self.assertEqual(manifest["name"], "business-direction")
        skills = manifest["skills"]
        self.assertIsInstance(skills, list)
        self.assertEqual(len(skills), len(set(skills)))
        self.assertIn(manifest["entrypoint"], skills)
        for name in skills:
            self.assertTrue((ROOT / "skills" / name / "SKILL.md").is_file())

    def test_catalog_links_exist(self) -> None:
        for relative in (
            "LICENSE",
            "chains/business-direction.md",
            "docs/authoring.md",
            "docs/installation/pi.md",
            "docs/installation/claude-code.md",
            "docs/installation/codex.md",
            "docs/installation/pi.md",
            "docs/installation/hermes-agent.md",
        ):
            self.assertTrue((ROOT / relative).is_file(), relative)

    def test_claude_code_guide_distinguishes_plugin_invocation(self) -> None:
        path = ROOT / "docs" / "installation" / "claude-code.md"
        text = path.read_text(encoding="utf-8")
        self.assertRegex(
            text,
            r"Personal or project skills: `/business-direction`",
        )
        self.assertRegex(
            text,
            r"Plugin skill: `/%s:business-direction`" % PLUGIN_NAME,
        )

    def test_pi_guide_documents_settings_and_commands(self) -> None:
        text = (ROOT / "docs" / "installation" / "pi.md").read_text(encoding="utf-8")
        for required in (
            '"skills"',
            "~/.pi/agent/skills/",
            "/skill:route-context",
            '"enableSkillCommands": true',
        ):
            self.assertIn(required, text)

    def test_hermes_guide_documents_safe_install_options(self) -> None:
        text = (ROOT / "docs" / "installation" / "hermes-agent.md").read_text(encoding="utf-8")
        for required in (
            "~/.hermes/skills/",
            "external_dirs",
            "not write-protection boundaries",
            "hermes skills tap add Migliatti/grimoire",
            "hermes skills install Migliatti/grimoire/skills/route-context",
        ):
            self.assertIn(required, text)

    def test_canonical_skills_are_vendor_neutral(self) -> None:
        banned = ("~/.claude", ".codex/skills", "AskUserQuestion")
        for path in (ROOT / "skills").glob("*/SKILL.md"):
            text = path.read_text(encoding="utf-8")
            for token in banned:
                self.assertNotIn(token, text, f"{token} in {path}")

    def test_model_routing_policy_contract(self) -> None:
        text = (ROOT / "skills" / "model-routing-policy" / "SKILL.md").read_text(
            encoding="utf-8"
        )
        for required in (
            "economy",
            "standard",
            "advanced",
            "specialist",
            "Manual preference",
            "Hard output gate",
            "The entire response must begin with `### Routing decision`",
            "Automatic routing is prohibited",
            "medium, high, or restricted risk",
            "Safe fallback",
            "Audit record",
            "the user's language",
        ):
            with self.subTest(required=required):
                self.assertIn(required, text)
        self.assertTrue(
            (ROOT / "skills" / "model-routing-policy" / "routing-record-template.md").is_file()
        )
        self.assertTrue((ROOT / "tests" / "model-routing-policy" / "scenarios.md").is_file())

    def test_pi_project_settings_expose_canonical_skills(self) -> None:
        settings = json.loads((ROOT / ".pi" / "settings.json").read_text(encoding="utf-8"))
        self.assertEqual(settings["skills"], ["../skills"])

    def test_pi_model_routing_output_gate_exists(self) -> None:
        path = ROOT / ".pi" / "extensions" / "model-routing-output-gate.ts"
        self.assertTrue(path.is_file())
        text = path.read_text(encoding="utf-8")
        self.assertIn("model-routing-policy", text)
        self.assertIn("agent_settled", text)
        self.assertIn("sendUserMessage", text)


class PackagingManifestTests(unittest.TestCase):
    def load(self, relative: str) -> dict[str, object]:
        path = ROOT / relative
        self.assertTrue(path.is_file(), relative)
        return json.loads(path.read_text(encoding="utf-8"))

    def test_claude_plugin_manifest(self) -> None:
        manifest = self.load(".claude-plugin/plugin.json")
        self.assertEqual(manifest["name"], PLUGIN_NAME)
        for field in ("description", "version", "license", "repository"):
            self.assertTrue(manifest.get(field), field)

    def test_marketplace_lists_this_plugin(self) -> None:
        marketplace = self.load(".claude-plugin/marketplace.json")
        self.assertEqual(marketplace["name"], MARKETPLACE_NAME)
        plugins = marketplace["plugins"]
        self.assertIsInstance(plugins, list)
        entries = [entry for entry in plugins if entry["name"] == PLUGIN_NAME]
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0]["source"], "./")

    def test_codex_plugin_manifest_points_at_canonical_skills(self) -> None:
        manifest = self.load(".codex-plugin/plugin.json")
        self.assertEqual(manifest["name"], PLUGIN_NAME)
        skills_dir = ROOT / str(manifest["skills"])
        self.assertTrue(skills_dir.is_dir())
        self.assertEqual(skills_dir.resolve(), (ROOT / "skills").resolve())

    def test_packaged_version_is_consistent(self) -> None:
        claude = self.load(".claude-plugin/plugin.json")
        codex = self.load(".codex-plugin/plugin.json")
        marketplace = self.load(".claude-plugin/marketplace.json")
        entry = next(
            item for item in marketplace["plugins"] if item["name"] == PLUGIN_NAME
        )
        self.assertEqual(claude["version"], codex["version"])
        self.assertEqual(claude["version"], entry["version"])

    def test_packaged_plugin_exposes_every_chain_skill(self) -> None:
        manifest = parse_manifest(
            (ROOT / "chains" / "business-direction.md").read_text(encoding="utf-8")
        )
        skills_dir = ROOT / str(self.load(".codex-plugin/plugin.json")["skills"])
        for name in manifest["skills"]:
            self.assertTrue((skills_dir / name / "SKILL.md").is_file(), name)


if __name__ == "__main__":
    unittest.main()
