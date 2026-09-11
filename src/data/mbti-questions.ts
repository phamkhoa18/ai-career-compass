export interface MbtiQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
}

export const mbtiQuestions: MbtiQuestion[] = [
  // ===== E/I: Câu 1-7 (Hướng ngoại / Hướng nội) =====
  { id: 1, question: 'Tại một buổi tiệc, bạn sẽ:', optionA: 'Giao tiếp với nhiều người, kể cả người lạ', optionB: 'Chỉ trò chuyện với một số ít người quen' },
  { id: 2, question: 'Sau một tuần làm việc/học tập mệt mỏi, bạn nạp lại năng lượng bằng cách:', optionA: 'Ra ngoài đi chơi, gặp gỡ bạn bè', optionB: 'Dành thời gian một mình ở không gian riêng' },
  { id: 3, question: 'Trong các cuộc trò chuyện, bạn thường:', optionA: 'Là người chủ động bắt chuyện và khởi xướng chủ đề', optionB: 'Đợi người khác bắt chuyện trước rồi mới trả lời' },
  { id: 4, question: 'Khi có tin tức hoặc vấn đề mới, bạn thường:', optionA: 'Cập nhật và nắm bắt rất nhanh từ mọi người xung quanh', optionB: 'Thường biết sau người khác hoặc ít để ý' },
  { id: 5, question: 'Khi chuông điện thoại reo hoặc có người gõ cửa, bạn:', optionA: 'Sẵn sàng nghe/mở cửa ngay', optionB: 'Ngập ngừng hoặc hy vọng người khác sẽ làm việc đó' },
  { id: 6, question: 'Khi làm việc nhóm hay tham gia hoạt động đông người, bạn cảm thấy:', optionA: 'Phấn chấn, hào hứng và dễ hòa nhập', optionB: 'Nhanh bị tiêu tốn năng lượng và thấy mệt mỏi' },
  { id: 7, question: 'Mọi người xung quanh thường đánh giá bạn là người:', optionA: 'Bộc bạch, dễ tiếp cận và cởi mở', optionB: 'Kín đáo, thầm lặng và giữ khoảng cách nhất định' },

  // ===== S/N: Câu 8-14 (Thực tế / Trực giác) =====
  { id: 8, question: 'Bạn thấy mình nghiêng về kiểu người nào hơn?', optionA: 'Thực tế, bám sát hiện thực', optionB: 'Sáng tạo, giàu trí tưởng tượng' },
  { id: 9, question: 'Khi tiếp cận một công việc hoặc đề tài mới, bạn chú ý đến:', optionA: 'Chi tiết, số liệu và các bước thực hành cụ thể', optionB: 'Bức tranh toàn cảnh, ý tưởng và ý nghĩa đằng sau' },
  { id: 10, question: 'Bạn thích những cuốn sách, bộ phim thuộc thể loại nào hơn?', optionA: 'Phản ánh đời thực, lịch sử, nhân vật có thật', optionB: 'Viễn tưởng, trinh thám, hư cấu, triết lý' },
  { id: 11, question: 'Trong cuộc sống hàng ngày, bạn thường tin tưởng vào:', optionA: 'Trải nghiệm thực tế và kinh nghiệm bản thân', optionB: 'Trực giác, cảm giác linh tính của mình' },
  { id: 12, question: 'Điều nào khiến bạn cảm thấy tồi tệ hơn?', optionA: 'Đầu óc cứ bay bổng trên mây, không thực tế', optionB: 'Cuộc sống quá nhàm chán, lặp đi lặp lại và thiếu sáng tạo' },
  { id: 13, question: 'Lời mô tả nào đúng với bạn hơn?', optionA: 'Thích làm việc theo những quy trình đã chứng minh hiệu quả', optionB: 'Thích tìm tòi cách làm mới mang dấu ấn riêng' },
  { id: 14, question: 'Khi suy nghĩ về tương lai, bạn thường:', optionA: 'Tập trung vào những mục tiêu thực tế trước mắt', optionB: 'Lo xa, tưởng tượng về nhiều kịch bản và khả năng có thể xảy ra' },

  // ===== T/F: Câu 15-21 (Lý trí / Cảm xúc) =====
  { id: 15, question: 'Khi đưa ra một quyết định quan trọng, bạn dựa vào:', optionA: 'Logic, sự phân tích đúng - sai khách quan (Cái đầu)', optionB: 'Cảm xúc, sự đồng cảm và ảnh hưởng đến người khác (Trái tim)' },
  { id: 16, question: 'Khi đánh giá một vụ tranh chấp hay mâu thuẫn, bạn xem trọng:', optionA: 'Nguyên tắc, luật lệ và sự công bằng', optionB: 'Hoàn cảnh cá nhân và sự hòa giải' },
  { id: 17, question: 'Trong các mối quan hệ, điều gì lôi cuốn bạn hơn?', optionA: 'Sự nhất quán, mạch lạc trong tư duy', optionB: 'Sự thấu hiểu, hòa hợp về mặt cảm xúc' },
  { id: 18, question: 'Lời khen nào khiến bạn cảm thấy tự hào hơn?', optionA: '"Bạn là người suy nghĩ vô cùng sắc bén và logic"', optionB: '"Bạn là người rất tinh tế, chân thành và ấm áp"' },
  { id: 19, question: 'Khi thấy bạn bè gặp khó khăn, phản ứng đầu tiên của bạn là:', optionA: 'Đưa ra giải pháp, phân tích nguyên nhân để giải quyết', optionB: 'Lắng nghe, lắng đọng và chia sẻ cảm xúc với họ' },
  { id: 20, question: 'Điều gì đối với bạn là một lỗi nghiêm trọng hơn?', optionA: 'Tàn nhẫn, thiếu đồng cảm', optionB: 'Bất công, thiếu vô tư' },
  { id: 21, question: 'Bạn tự đánh giá mình là người:', optionA: 'Cứng rắn, quyết đoán và kiên định', optionB: 'Nhẹ nhàng, dễ mủi lòng và bao dung' },

  // ===== J/P: Câu 22-30 (Kế hoạch / Linh hoạt) =====
  { id: 22, question: 'Phong cách sống và làm việc của bạn là:', optionA: 'Đúng giờ, có kế hoạch rõ ràng từ trước', optionB: 'Nhàn nhã, tùy hứng và nước đến chân mới nhảy' },
  { id: 23, question: 'Bạn cảm thấy thoải mái hơn khi:', optionA: 'Mọi việc đã được sắp xếp, quyết định xong xuôi', optionB: 'Mọi việc còn để ngỏ, có nhiều lựa chọn để thay đổi' },
  { id: 24, question: 'Không gian sống và bàn học/làm việc của bạn thường:', optionA: 'Ngăn nắp, gọn gàng, đồ nào ra đồ đó', optionB: 'Hơi bừa bộn một chút nhưng bạn vẫn tìm thấy đồ' },
  { id: 25, question: 'Khi chuẩn bị đi du lịch hay thực hiện một dự án, bạn sẽ:', optionA: 'Lên lịch trình chi tiết từng ngày, từng mục', optionB: 'Chỉ lên ý chính, đến đâu tính đến đó' },
  { id: 26, question: 'Bạn thích xử lý deadline/công việc như thế nào?', optionA: 'Làm xong sớm để yên tâm nghỉ ngơi', optionB: 'Đợi sát giờ mới có hứng khởi và áp lực để hoàn thành' },
  { id: 27, question: 'Khi kế hoạch đột ngột bị thay đổi, bạn sẽ:', optionA: 'Cảm thấy khó chịu, bực bội vì bị lệch quỹ đạo', optionB: 'Thấy bình thường, linh hoạt thích nghi ngay' },
  { id: 28, question: 'Bạn thuộc tuýp người:', optionA: 'Luôn đặt ra mục tiêu và danh sách việc cần làm (To-do list)', optionB: 'Tùy thuộc vào tâm trạng và hoàn cảnh thực tế lúc đó' },
  { id: 29, question: 'Khi đưa ra ý kiến, bạn nghiêng về hướng:', optionA: 'Tuyên bố chắc chắn, rõ ràng, không muốn thay đổi', optionB: 'Tuyên bố dự kiến, sẵn sàng điều chỉnh khi có thông tin mới' },
  { id: 30, question: 'Bạn cảm thấy thoải mái nhất khi:', optionA: 'Mọi thứ trong cuộc sống đều theo trật tự và kiểm soát được', optionB: 'Mọi thứ diễn ra tự nhiên, ngẫu nhiên và tự do' },
];
