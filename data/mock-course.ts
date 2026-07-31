export type Material = {
  id: string;
  name: string;
  pages: number;
};

export type CourseDay = {
  day: number;
  title: string;
  materials: Material[];
};

export const courseDays: CourseDay[] = [
  {
    day: 1,
    title: "Day01",
    materials: [
      { id: "D01-S01", name: "day01-foundation.pdf", pages: 83 },
      { id: "D01-S02", name: "day01-ai-overview.pdf", pages: 52 },
    ],
  },
  {
    day: 2,
    title: "Day02",
    materials: [{ id: "D02-S01", name: "day02-problem-discovery.pdf", pages: 48 }],
  },
  {
    day: 3,
    title: "Day03",
    materials: [
      { id: "D03-S01", name: "day03-agentic-ai.pdf", pages: 61 },
      { id: "D03-S02", name: "day03-agent-workflow.pdf", pages: 46 },
    ],
  },
  {
    day: 4,
    title: "Day04",
    materials: [
      { id: "D04-S01", name: "day04-prompt-engineering.pdf", pages: 54 },
      { id: "D04-S02", name: "day04-tool-calling.pdf", pages: 42 },
      { id: "D04-S03", name: "day04-evaluation.pdf", pages: 39 },
    ],
  },
  {
    day: 5,
    title: "Day05",
    materials: [
      { id: "D05-S01", name: "day05-ai-product-thinking-requirements.pdf", pages: 44 },
      { id: "D05-S02", name: "day05-product-discovery.pdf", pages: 39 },
      { id: "D05-S03", name: "day05-ai-spec.pdf", pages: 62 },
    ],
  },
  {
    day: 6,
    title: "Day06",
    materials: [{ id: "D06-S01", name: "day06-project-management.pdf", pages: 47 }],
  },
];

const namedSlides: Record<number, { eyebrow: string; title: string; body: string }> = {
  1: {
    eyebrow: "AI PRODUCT THINKING",
    title: "Từ pain point đến sản phẩm AI",
    body: "Bắt đầu từ công việc người học đang cố hoàn thành, không bắt đầu từ một danh sách tính năng.",
  },
  4: {
    eyebrow: "MỤC TIÊU NGÀY 5",
    title: "AI product khác software feature ở đâu?",
    body: "AI tạo ra quyết định dưới bất định. Vì vậy sản phẩm cần có đường lui, confidence và cách đo chất lượng.",
  },
  8: {
    eyebrow: "LÁT CẮT ĐỦ SẮC",
    title: "Một câu, bốn thành phần",
    body: "Một người dùng · một công việc · một quyết định AI · một kết quả có thể quan sát và đo được.",
  },
  18: {
    eyebrow: "THIẾT KẾ TRẢI NGHIỆM",
    title: "Bốn đường đi cần chuẩn bị",
    body: "Happy path · low confidence · không có căn cứ · người dùng sửa kết quả.",
  },
  38: {
    eyebrow: "PRODUCT REQUIREMENTS DOCUMENT",
    title: "8 phần cốt lõi của một PRD",
    body: "Bối cảnh, user, problem, evidence, solution slice, risks, quality bar và kế hoạch validation.",
  },
  44: {
    eyebrow: "SHIP THE PROOF",
    title: "Đo trước khi kể",
    body: "Một prototype đáng tin phải chỉ ra nó đúng ở đâu, sai ở đâu và được cải thiện từ bằng chứng nào.",
  },
};

export function getSlideContent(page: number) {
  return namedSlides[page] ?? {
    eyebrow: `AI THỰC CHIẾN · TRANG ${page}`,
    title: page % 2 === 0 ? "Từ insight đến quyết định sản phẩm" : "Thiết kế AI có trách nhiệm",
    body:
      page % 2 === 0
        ? "Thu hẹp bài toán đến một quyết định có thể kiểm thử trong thời gian ngắn."
        : "Khi thiếu căn cứ, hệ thống cần hỏi lại hoặc từ chối thay vì tự suy đoán.",
  };
}
