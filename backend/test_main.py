import unittest
from unittest.mock import AsyncMock, patch

from backend.main import (
    TutorRequest,
    build_slide_context,
    local_answer,
    looks_vietnamese,
    select_relevant_pages,
    tutor,
)


def request(message: str, current_page: int = 1) -> TutorRequest:
    return TutorRequest(
        message=message,
        currentPage=current_page,
        pdfTextMap={
            1: "Introduction to AI product thinking and user problems.",
            2: "Customer interviews and market research.",
            8: "Product requirements, measurable evidence, risks and validation.",
            20: "Deployment monitoring and model evaluation.",
        },
        pdfName="course.pdf",
        history=[],
    )


class RetrievalTests(unittest.TestCase):
    def test_current_page_is_first(self) -> None:
        pages = select_relevant_pages(request("Tóm tắt trang này", current_page=8))
        self.assertEqual(pages[0], 8)

    def test_keyword_retrieval_finds_relevant_page(self) -> None:
        pages = select_relevant_pages(request("Giải thích validation và measurable evidence"))
        self.assertIn(8, pages[:3])

    def test_context_is_bounded_and_reports_pages(self) -> None:
        context, pages = build_slide_context(request("Tóm tắt product requirements"))
        self.assertLessEqual(len(context), 32_000)
        self.assertTrue(pages)
        self.assertIn("[Trang 1]", context)

    def test_vietnamese_quality_gate(self) -> None:
        self.assertTrue(
            looks_vietnamese(
                "Trang này giải thích các nhóm cần xác định vấn đề của người dùng."
            )
        )
        self.assertFalse(
            looks_vietnamese(
                "This slide explains product requirements and measurable evidence."
            )
        )


class LocalGuardrailTests(unittest.TestCase):
    def test_navigation_still_works_without_ai(self) -> None:
        result = local_answer(request("Trang số 8 ở đâu?"))
        self.assertEqual(result.intent, "NAVIGATION")
        self.assertEqual(result.targetPage, 8)
        self.assertEqual(result.source, "local")

    def test_slide_query_never_copies_english_fallback(self) -> None:
        result = local_answer(
            request("Tóm tắt trang này"),
            ai_unavailable_reason="test outage",
        )
        self.assertEqual(result.source, "error")
        self.assertNotIn("Introduction to AI product", result.text)
        self.assertIn("không", result.text)


class EndpointFallbackTests(unittest.IsolatedAsyncioTestCase):
    async def test_model_failure_is_visible(self) -> None:
        with (
            patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}),
            patch(
                "backend.main.ask_gemini",
                new=AsyncMock(side_effect=RuntimeError("model unavailable")),
            ),
        ):
            result = await tutor(request("Tóm tắt trang này"))
        self.assertEqual(result.source, "error")
        self.assertIn("model unavailable", result.warning or "")


if __name__ == "__main__":
    unittest.main()
