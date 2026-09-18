export interface MbtiQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
}

export const mbtiQuestions: MbtiQuestion[] = [
  // ===== E/I: Câu 1-4 (Hướng ngoại / Hướng nội) =====
  { id: 1, question: 'Tại một buổi tiệc, bạn sẽ:', optionA: 'Giao tiếp với nhiều người, kể cả người lạ', optionB: 'Chỉ trò chuyện với một số ít người quen' },
  { id: 2, question: 'Sau một tuần làm việc/học tập mệt mỏi, bạn nạp lại năng lượng bằng cách:', optionA: 'Ra ngoài đi chơi, gặp gỡ bạn bè', optionB: 'Dành thời gian một mình ở không gian riêng' },
  { id: 3, question: 'Trong các cuộc trò chuyện, bạn thường:', optionA: 'Là người chủ động bắt chuyện và khởi xướng chủ đề', optionB: 'Đợi người khác bắt chuyện trước rồi mới trả lời' },
  { id: 4, question: 'Khi làm việc nhóm hay tham gia hoạt động đông người, bạn cảm thấy:', optionA: 'Phấn chấn, hào hứng và dễ hòa nhập', optionB: 'Nhanh bị tiêu tốn năng lượng và thấy mệt mỏi' },

  // ===== S/N: Câu 5-8 (Thực tế / Trực giác) =====
  { id: 5, question: 'Bạn thấy mình nghiêng về kiểu người nào hơn?', optionA: 'Thực tế, bám sát hiện thực', optionB: 'Sáng tạo, giàu trí tưởng tượng' },
  { id: 6, question: 'Khi tiếp cận một công việc hoặc đề tài mới, bạn chú ý đến:', optionA: 'Chi tiết, số liệu và các bước thực hành cụ thể', optionB: 'Bức tranh toàn cảnh, ý tưởng và ý nghĩa đằng sau' },
  { id: 7, question: 'Trong cuộc sống hàng ngày, bạn thường tin tưởng vào:', optionA: 'Trải nghiệm thực tế và kinh nghiệm bản thân', optionB: 'Trực giác, cảm giác linh tính của mình' },
  { id: 8, question: 'Khi suy nghĩ về tương lai, bạn thường:', optionA: 'Tập trung vào những mục tiêu thực tế trước mắt', optionB: 'Lo xa, tưởng tượng về nhiều kịch bản và khả năng có thể xảy ra' },

  // ===== T/F: Câu 9-12 (Lý trí / Cảm xúc) =====
  { id: 9, question: 'Khi đưa ra một quyết định quan trọng, bạn dựa vào:', optionA: 'Logic, sự phân tích đúng - sai khách quan (Cái đầu)', optionB: 'Cảm xúc, sự đồng cảm và ảnh hưởng đến người khác (Trái tim)' },
  { id: 10, question: 'Khi đánh giá một vụ tranh chấp hay mâu thuẫn, bạn xem trọng:', optionA: 'Nguyên tắc, luật lệ và sự công bằng', optionB: 'Hoàn cảnh cá nhân và sự hòa giải' },
  { id: 11, question: 'Lời khen nào khiến bạn cảm thấy tự hào hơn?', optionA: '"Bạn là người suy nghĩ vô cùng sắc bén và logic"', optionB: '"Bạn là người rất tinh tế, chân thành và ấm áp"' },
  { id: 12, question: 'Khi thấy bạn bè gặp khó khăn, phản ứng đầu tiên của bạn là:', optionA: 'Đưa ra giải pháp, phân tích nguyên nhân để giải quyết', optionB: 'Lắng nghe, lắng đọng và chia sẻ cảm xúc với họ' },

  // ===== J/P: Câu 13-16 (Kế hoạch / Linh hoạt) =====
  { id: 13, question: 'Phong cách sống và làm việc của bạn là:', optionA: 'Đúng giờ, có kế hoạch rõ ràng từ trước', optionB: 'Nhàn nhã, tùy hứng và nước đến chân mới nhảy' },
  { id: 14, question: 'Không gian sống và bàn học/làm việc của bạn thường:', optionA: 'Ngăn nắp, gọn gàng, đồ nào ra đồ đó', optionB: 'Hơi bừa bộn một chút nhưng bạn vẫn tìm thấy đồ' },
  { id: 15, question: 'Khi chuẩn bị đi du lịch hay thực hiện một dự án, bạn sẽ:', optionA: 'Lên lịch trình chi tiết từng ngày, từng mục', optionB: 'Chỉ lên ý chính, đến đâu tính đến đó' },
  { id: 16, question: 'Bạn thuộc tuýp người:', optionA: 'Luôn đặt ra mục tiêu và danh sách việc cần làm (To-do list)', optionB: 'Tùy thuộc vào tâm trạng và hoàn cảnh thực tế lúc đó' },
];
