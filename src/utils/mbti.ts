// Bản đồ chuẩn xác chấm điểm cho 70 câu hỏi MBTI (phiên bản Việt hóa)
// Cột A và B ánh xạ tương ứng vào các đặc điểm E/I, S/N, T/F, J/P
const MBTI_KEY: { a: string; b: string }[] = [
  { a: 'E', b: 'I' }, // 1. Bữa tiệc
  { a: 'S', b: 'N' }, // 2. Thực tế / Sáng tạo
  { a: 'S', b: 'N' }, // 3. Tồi tệ hơn: bay bổng (S) / nhàm chán (N)
  { a: 'T', b: 'F' }, // 4. Nguyên tắc / Cảm xúc
  { a: 'T', b: 'F' }, // 5. Thuyết phục / Đồng cảm
  { a: 'J', b: 'P' }, // 6. Thời hạn / Tùy hứng
  { a: 'J', b: 'P' }, // 7. Cẩn thận / Cảm nhận
  { a: 'E', b: 'I' }, // 8. Tới cùng / Về sớm
  { a: 'S', b: 'N' }, // 9. Thực tế / Tưởng tượng
  { a: 'S', b: 'N' }, // 10. Điều thực tế / Ý tưởng
  { a: 'T', b: 'F' }, // 11. Luật lệ / Hoàn cảnh
  { a: 'T', b: 'F' }, // 12. Khách quan / Cá nhân
  { a: 'J', b: 'P' }, // 13. Đúng giờ / Nhàn nhã
  { a: 'J', b: 'P' }, // 14. Chưa hoàn thiện / Quá hoàn thiện
  { a: 'E', b: 'I' }, // 15. Nắm thông tin nhanh / sau
  { a: 'S', b: 'N' }, // 16. Thông thường / Cách riêng
  { a: 'S', b: 'N' }, // 17. Chân thật / Liên tưởng
  { a: 'T', b: 'F' }, // 18. Nhất quán / Hòa hợp
  { a: 'T', b: 'F' }, // 19. Logic / Ý nghĩa
  { a: 'J', b: 'P' }, // 20. Sắp xếp / Chưa xác định
  { a: 'J', b: 'P' }, // 21. Nghiêm túc / Dễ gần
  { a: 'E', b: 'I' }, // 22. Gọi bình thường / Chuẩn bị
  { a: 'S', b: 'N' }, // 23. Tự giải thích / Bằng chứng
  { a: 'S', b: 'N' }, // 24. Gây khó chịu / Thú vị
  { a: 'T', b: 'F' }, // 25. Đầu lạnh / Tim nóng
  { a: 'T', b: 'F' }, // 26. Không công bằng / Tàn nhẫn
  { a: 'J', b: 'P' }, // 27. Cân nhắc / Ngẫu nhiên
  { a: 'J', b: 'P' }, // 28. Đã mua / Đang lựa chọn
  { a: 'E', b: 'I' }, // 29. Khởi xướng / Đợi
  { a: 'S', b: 'N' }, // 30. Ít nghi ngờ / Xem xét
  { a: 'S', b: 'N' }, // 31. Chưa cố gắng / Chưa vui chơi
  { a: 'T', b: 'F' }, // 32. Tiêu chuẩn / Cảm xúc
  { a: 'T', b: 'F' }, // 33. Cứng rắn / Nhẹ nhàng
  { a: 'J', b: 'P' }, // 34. Phương pháp / Xoay xở
  { a: 'J', b: 'P' }, // 35. Chắc chắn / Cởi mở
  { a: 'E', b: 'I' }, // 36. Hào hứng / Mệt mỏi
  { a: 'S', b: 'N' }, // 37. Thực tế / Tưởng tượng
  { a: 'T', b: 'F' }, // 38. Việc hữu ích / Nghĩ cảm nhận
  { a: 'T', b: 'F' }, // 39. Thảo luận / Thỏa thuận
  { a: 'T', b: 'F' }, // 40. Đầu / Trái tim
  { a: 'P', b: 'J' }, // 41. Trọn gói (P) / Hàng ngày (J) - Flipped!
  { a: 'J', b: 'P' }, // 42. Trật tự / Ngẫu nhiên
  { a: 'E', b: 'I' }, // 43. Nhiều bạn / Ít bạn
  { a: 'S', b: 'N' }, // 44. Sự kiện / Nguyên lý
  { a: 'S', b: 'N' }, // 45. Sản xuất / Thiết kế
  { a: 'T', b: 'F' }, // 46. Logic / Tinh tế
  { a: 'T', b: 'F' }, // 47. Kiên định / Cống hiến
  { a: 'J', b: 'P' }, // 48. Cuối cùng / Dự kiến
  { a: 'P', b: 'J' }, // 49. TRƯỚC quyết định (P) / SAU quyết định (J) - Flipped!
  { a: 'E', b: 'I' }, // 50. Dễ bắt chuyện / Khó
  { a: 'S', b: 'N' }, // 51. Kinh nghiệm / Linh cảm
  { a: 'S', b: 'N' }, // 52. Thực tế / Khôn khéo
  { a: 'T', b: 'F' }, // 53. Lý trí / Cảm xúc
  { a: 'T', b: 'F' }, // 54. Công bằng / Thông cảm
  { a: 'J', b: 'P' }, // 55. Chuẩn bị / Tự nhiên
  { a: 'J', b: 'P' }, // 56. Thảo luận / Ngẫu nhiên
  { a: 'E', b: 'I' }, // 57. Nhấc máy / Đợi
  { a: 'S', b: 'N' }, // 58. Nhận thức / Tưởng tượng
  { a: 'S', b: 'N' }, // 59. Nguyên lý / Ẩn ý
  { a: 'T', b: 'F' }, // 60. Quá nồng nhiệt / Quá khách quan
  { a: 'T', b: 'F' }, // 61. Thiết thực / Đa cảm
  { a: 'J', b: 'P' }, // 62. Kế hoạch / Không xác định
  { a: 'J', b: 'P' }, // 63. Thói quen / Thay đổi
  { a: 'E', b: 'I' }, // 64. Dễ tiếp cận / Kín đáo
  { a: 'N', b: 'S' }, // 65. Văn chương (N) / Số liệu (S) - Flipped!
  { a: 'T', b: 'F' }, // 66. Khó hiểu chia sẻ / Khó điều khiển
  { a: 'T', b: 'F' }, // 67. Lý trí / Trắc ẩn
  { a: 'J', b: 'P' }, // 68. Lỗi bừa bãi / Lỗi phê phán
  { a: 'J', b: 'P' }, // 69. Có kế hoạch / Không kế hoạch
  { a: 'J', b: 'P' }, // 70. Cân nhắc / Tự phát
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
