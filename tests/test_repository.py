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
            "docs/installation/claude-code.md",
            "docs/installation/codex.md",
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

    def test_canonical_skills_are_vendor_neutral(self) -> None:
        banned = ("~/.claude", ".codex/skills", "AskUserQuestion")
        for path in (ROOT / "skills").glob("*/SKILL.md"):
            text = path.read_text(encoding="utf-8")
            for token in banned:
                self.assertNotIn(token, text, f"{token} in {path}")


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
