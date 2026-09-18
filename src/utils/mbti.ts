// Bản đồ chấm điểm cho 16 câu hỏi MBTI (phiên bản Việt hóa)
// Câu 1-4: E/I, Câu 5-8: S/N, Câu 9-12: T/F, Câu 13-16: J/P
// Cột A luôn = chiều thuận (E, S, T, J), Cột B = chiều ngược (I, N, F, P)
const MBTI_KEY: { a: string; b: string }[] = [
  // ===== E/I: Câu 1-4 =====
  { a: 'E', b: 'I' }, // 1. Giao tiếp nhiều / Ít người quen
  { a: 'E', b: 'I' }, // 2. Ra ngoài / Ở một mình
  { a: 'E', b: 'I' }, // 3. Chủ động bắt chuyện / Đợi người khác
  { a: 'E', b: 'I' }, // 4. Phấn chấn / Mệt mỏi

  // ===== S/N: Câu 5-8 =====
  { a: 'S', b: 'N' }, // 5. Thực tế / Sáng tạo
  { a: 'S', b: 'N' }, // 6. Chi tiết / Bức tranh toàn cảnh
  { a: 'S', b: 'N' }, // 7. Kinh nghiệm / Trực giác
  { a: 'S', b: 'N' }, // 8. Mục tiêu trước mắt / Lo xa

  // ===== T/F: Câu 9-12 =====
  { a: 'T', b: 'F' }, // 9. Logic / Cảm xúc
  { a: 'T', b: 'F' }, // 10. Nguyên tắc / Hoàn cảnh
  { a: 'T', b: 'F' }, // 11. Sắc bén logic / Tinh tế ấm áp
  { a: 'T', b: 'F' }, // 12. Giải pháp / Lắng nghe

  // ===== J/P: Câu 13-16 =====
  { a: 'J', b: 'P' }, // 13. Kế hoạch / Tùy hứng
  { a: 'J', b: 'P' }, // 14. Ngăn nắp / Bừa bộn
  { a: 'J', b: 'P' }, // 15. Lịch trình chi tiết / Ý chính
  { a: 'J', b: 'P' }, // 16. To-do list / Tùy tâm trạng
];

export interface MbtiCalculationResult {
  code: string;
  scores: Record<string, number>;
}

// Tính điểm tối đa tự động dựa trên mảng câu hỏi
export const MAX_MBTI_SCORES = (() => {
  const maxScores = { E: 0, S: 0, T: 0, J: 0 };
  MBTI_KEY.forEach(mapping => {
    if (mapping.a === 'E' || mapping.b === 'E') maxScores.E++;
    if (mapping.a === 'S' || mapping.b === 'S') maxScores.S++;
    if (mapping.a === 'T' || mapping.b === 'T') maxScores.T++;
    if (mapping.a === 'J' || mapping.b === 'J') maxScores.J++;
  });
  return maxScores;
})();

export function calculateMBTI(answers: string[]): MbtiCalculationResult {
  const scores: Record<string, number> = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  answers.forEach((ans, idx) => {
    if (!ans) return;
    const mapping = MBTI_KEY[idx];
    if (!mapping) return;
    
    if (ans === 'A') {
      scores[mapping.a]++;
    } else if (ans === 'B') {
      scores[mapping.b]++;
    }
  });

  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P'
  ].join('');

  return {
    code: type,
    scores
  };
}
