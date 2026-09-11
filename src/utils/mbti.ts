// Bản đồ chấm điểm cho 30 câu hỏi MBTI mới (phiên bản Việt hóa)
// Câu 1-7: E/I, Câu 8-14: S/N, Câu 15-21: T/F, Câu 22-30: J/P
// Cột A luôn = chiều thuận (E, S, T, J), Cột B = chiều ngược (I, N, F, P)
const MBTI_KEY: { a: string; b: string }[] = [
  // ===== E/I: Câu 1-7 =====
  { a: 'E', b: 'I' }, // 1. Giao tiếp nhiều / Ít người quen
  { a: 'E', b: 'I' }, // 2. Ra ngoài / Ở một mình
  { a: 'E', b: 'I' }, // 3. Chủ động bắt chuyện / Đợi người khác
  { a: 'E', b: 'I' }, // 4. Nắm bắt nhanh / Biết sau
  { a: 'E', b: 'I' }, // 5. Sẵn sàng nghe / Ngập ngừng
  { a: 'E', b: 'I' }, // 6. Phấn chấn / Mệt mỏi
  { a: 'E', b: 'I' }, // 7. Cởi mở / Kín đáo

  // ===== S/N: Câu 8-14 =====
  { a: 'S', b: 'N' }, // 8. Thực tế / Sáng tạo
  { a: 'S', b: 'N' }, // 9. Chi tiết / Bức tranh toàn cảnh
  { a: 'S', b: 'N' }, // 10. Đời thực / Viễn tưởng
  { a: 'S', b: 'N' }, // 11. Kinh nghiệm / Trực giác
  { a: 'S', b: 'N' }, // 12. Bay bổng (S) / Nhàm chán (N)
  { a: 'S', b: 'N' }, // 13. Quy trình / Cách mới
  { a: 'S', b: 'N' }, // 14. Mục tiêu trước mắt / Lo xa

  // ===== T/F: Câu 15-21 =====
  { a: 'T', b: 'F' }, // 15. Logic / Cảm xúc
  { a: 'T', b: 'F' }, // 16. Nguyên tắc / Hoàn cảnh
  { a: 'T', b: 'F' }, // 17. Nhất quán tư duy / Hòa hợp cảm xúc
  { a: 'T', b: 'F' }, // 18. Sắc bén logic / Tinh tế ấm áp
  { a: 'T', b: 'F' }, // 19. Giải pháp / Lắng nghe
  { a: 'F', b: 'T' }, // 20. Tàn nhẫn (F) / Bất công (T) — Flipped!
  { a: 'T', b: 'F' }, // 21. Cứng rắn / Nhẹ nhàng

  // ===== J/P: Câu 22-30 =====
  { a: 'J', b: 'P' }, // 22. Kế hoạch / Tùy hứng
  { a: 'J', b: 'P' }, // 23. Sắp xếp xong / Để ngỏ
  { a: 'J', b: 'P' }, // 24. Ngăn nắp / Bừa bộn
  { a: 'J', b: 'P' }, // 25. Lịch trình chi tiết / Ý chính
  { a: 'J', b: 'P' }, // 26. Làm sớm / Sát giờ
  { a: 'J', b: 'P' }, // 27. Khó chịu khi thay đổi / Linh hoạt
  { a: 'J', b: 'P' }, // 28. To-do list / Tùy tâm trạng
  { a: 'J', b: 'P' }, // 29. Chắc chắn / Dự kiến
  { a: 'J', b: 'P' }, // 30. Trật tự / Tự nhiên
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
