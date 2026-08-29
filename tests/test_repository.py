from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


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


if __name__ == "__main__":
    unittest.main()
