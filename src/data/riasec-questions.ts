export interface RiasecQuestion {
  id: number;
  group: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  question: string;
}

export const RIASEC_GROUP_INFO = {
  R: {
    name: 'Realistic',
    nameVi: 'Kỹ thuật',
    color: '#FF6B6B',
    description: 'Thích làm việc với máy móc, công cụ, động vật, hoạt động ngoài trời. Ưa thích các hoạt động thể chất và thực hành.',
  },
  I: {
    name: 'Investigative',
    nameVi: 'Nghiên cứu',
    color: '#4ECDC4',
    description: 'Thích tìm hiểu, nghiên cứu, phân tích dữ liệu, giải quyết vấn đề phức tạp. Tư duy logic và khoa học.',
  },
  A: {
    name: 'Artistic',
    nameVi: 'Nghệ thuật',
    color: '#FFE66D',
    description: 'Thích sáng tạo, thiết kế, nghệ thuật, âm nhạc, viết lách. Tự do biểu đạt và tưởng tượng.',
  },
  S: {
    name: 'Social',
    nameVi: 'Xã hội',
    color: '#FF8FA3',
    description: 'Thích giúp đỡ, dạy học, tư vấn, chăm sóc người khác. Kỹ năng giao tiếp và đồng cảm tốt.',
  },
  E: {
    name: 'Enterprising',
    nameVi: 'Quản lý',
    color: '#FFA07A',
    description: 'Thích lãnh đạo, thuyết phục, kinh doanh, quản lý dự án. Tham vọng và năng động.',
  },
  C: {
    name: 'Conventional',
    nameVi: 'Nghiệp vụ',
    color: '#87CEEB',
    description: 'Thích làm việc có tổ chức, xử lý dữ liệu, tuân thủ quy trình. Cẩn thận và chính xác.',
  },
};

export const riasecQuestions: RiasecQuestion[] = [
  // ===== REALISTIC (R) - Kỹ thuật =====
  { id: 1, group: 'R', question: 'Tôi thích làm các công việc thủ công như cắt may, xếp giấy, đan, móc, khắc chữ...' },
  { id: 2, group: 'R', question: 'Tôi thích trang điểm; chăm chút, làm đẹp cho bản thân và người khác.' },
  { id: 3, group: 'R', question: 'Tôi thích chăm sóc, cắt tỉa cây cảnh.' },
  { id: 4, group: 'R', question: 'Tôi thích mày mò, sửa chữa các đồ vật bị hư hỏng.' },
  { id: 5, group: 'R', question: 'Tôi thích khám phá cấu tạo bên trong của các đồ vật, máy móc, thiết bị.' },
  { id: 6, group: 'R', question: 'Tôi thích làm việc ngoài trời với không gian mở hơn là bên trong phòng học kín.' },
  { id: 7, group: 'R', question: 'Tôi là người độc lập và thích làm việc một mình.' },
  { id: 8, group: 'R', question: 'Tôi thích làm những việc có thể hoàn thành bằng tay chân (cho dù yêu cầu tỉ mỉ) hơn là những công việc phải suy nghĩ nhiều.' },
  { id: 9, group: 'R', question: 'Tôi hay tò mò về bất cứ thứ gì xung quanh mình (Thiên nhiên, khoa học kỹ thuật, không gian;...)' },
  { id: 10, group: 'R', question: 'Tôi không phải người hoạt ngôn, dễ hòa nhập với môi trường mới.' },

  // ===== INVESTIGATIVE (I) - Nghiên cứu =====
  { id: 11, group: 'I', question: 'Tôi tò mò và thích tìm hiểu về mọi thứ xung quanh (Thiên nhiên, khoa học kỹ thuật, không gian;...)' },
  { id: 12, group: 'I', question: 'Tôi thích học Văn nghị luận, phân tích và lập luận các vấn đề.' },
  { id: 13, group: 'I', question: 'Tôi thích suy nghĩ về những vấn đề phức tạp, làm công việc phức tạp.' },
  { id: 14, group: 'I', question: 'Tôi thích thực hành thí nghiệm và nghiên cứu.' },
  { id: 15, group: 'I', question: 'Tôi thích đọc những thể loại sách về khoa học, lịch sử, văn hoá.' },
  { id: 16, group: 'I', question: 'Tôi thích giải những đề toán phức tạp, có độ khó cao.' },
  { id: 17, group: 'I', question: 'Tôi thích các hoạt động liên quan đến điều tra, truy tìm manh mối.' },
  { id: 18, group: 'I', question: 'Tôi thích đọc sách và xem phim chủ đề trinh thám, thám tử,...' },
  { id: 19, group: 'I', question: 'Tôi thích sưu tập một thứ gì đó (Tem, tiền xu, đá,...)' },
  { id: 20, group: 'I', question: 'Tôi thích các trò chơi ô chữ, giải đố;...' },

  // ===== ARTISTIC (A) - Nghệ thuật =====
  { id: 21, group: 'A', question: 'Tôi là người đa sầu đa cảm, dễ xúc động và không giỏi kiềm chế cảm xúc.' },
  { id: 22, group: 'A', question: 'Tôi có trí tưởng tượng vô cùng phong phú.' },
  { id: 23, group: 'A', question: 'Tôi thích cuộc sống tự do, không bị bó buộc và khuôn khổ hay quy tắc nào.' },
  { id: 24, group: 'A', question: 'Tôi thích các hoạt động văn nghệ như ca hát, diễn xuất, MC,...' },
  { id: 25, group: 'A', question: 'Tôi thích chụp hình, vẽ tranh, trang trí, điêu khắc;...' },
  { id: 26, group: 'A', question: 'Tôi thích tự thiết kế hoặc tự chọn; phối quần áo cho mình và người khác.' },
  { id: 27, group: 'A', question: 'Tôi không thích làm những công việc rập khuôn, lập đi lập lại nhiều lần, không có sự sáng tạo.' },
  { id: 28, group: 'A', question: 'Tôi thích âm nhạc và không thể sống nếu thiếu chúng.' },
  { id: 29, group: 'A', question: 'Tôi dễ bị hấp dẫn bởi cái đẹp (Một gương mặt đẹp, một bức tranh đẹp, một bài hát hay,...)' },
  { id: 30, group: 'A', question: 'Tôi có một tâm hồn khá mơ mộng và tôi thích thế.' },

  // ===== SOCIAL (S) - Xã hội =====
  { id: 31, group: 'S', question: 'Tôi là người khá thân thiện và thoải mái trong việc giúp đỡ mọi người xung quanh.' },
  { id: 32, group: 'S', question: 'Tôi thích gặp gỡ và làm quen nhiều bạn mới.' },
  { id: 33, group: 'S', question: 'Tôi thích khuyên bảo hay trở thành người hoà giải khi có mâu thuẫn xảy ra trong nhóm bạn của mình.' },
  { id: 34, group: 'S', question: 'Tôi tự thấy mình luôn biết cách cư xử lịch thiệp và tử tế.' },
  { id: 35, group: 'S', question: 'Tôi thích tham gia các hoạt động thiện nguyện vì cộng đồng.' },
  { id: 36, group: 'S', question: 'Tôi thích kể chuyện; pha trò làm cho mọi người xung quanh cảm thấy thoải mái và vui vẻ.' },
  { id: 37, group: 'S', question: 'Tôi thích lắng nghe bạn bè chia sẻ về những vấn đề cá nhân của họ.' },
  { id: 38, group: 'S', question: 'Tôi thích hoạt động nhóm, thích chơi những môn thể thao mang tính chất đồng đội.' },
  { id: 39, group: 'S', question: 'Tôi thoải mái khi tham gia các hoạt động đông người, dễ dàng hoà nhập với đám đông.' },
  { id: 40, group: 'S', question: 'Tôi có nhiều bạn bè và tôi thích việc thường xuyên liên lạc hay tương tác với họ qua mạng xã hội.' },

  // ===== ENTERPRISING (E) - Quản lý =====
  { id: 41, group: 'E', question: 'Tôi thích được trở thành người lãnh đạo trong nhóm; trong lớp hoặc trong các tổ chức.' },
  { id: 42, group: 'E', question: 'Tôi có tính háu thắng, thích cạnh tranh và thích mình phải giỏi hơn người khác.' },
  { id: 43, group: 'E', question: 'Tôi thích tham gia vào các cuộc tranh luận và thuyết phục người khác.' },
  { id: 44, group: 'E', question: 'Tôi thường xuyên đặt ra các mục tiêu, kế hoạch trong cuộc sống.' },
  { id: 45, group: 'E', question: 'Tôi là người rất quyết đoán, khó mà thay đổi được suy nghĩ của tôi.' },
  { id: 46, group: 'E', question: 'Tôi có suy nghĩ sau này sẽ trở thành chủ một doanh nghiệp nhỏ.' },
  { id: 47, group: 'E', question: 'Tôi thích mạo hiểm và hào hứng khi được tham gia các cuộc phiêu mới.' },
  { id: 48, group: 'E', question: 'Tôi cầu toàn và muốn làm công việc cho đến khi hoàn tất, không thích bỏ dở giữa chừng.' },
  { id: 49, group: 'E', question: 'Tôi thích tiết kiệm và quản lý tốt tiền bạc của mình.' },
  { id: 50, group: 'E', question: 'Tôi thích việc lên kế hoạch, tổ chức, quản lý hay tổng hợp công việc của những thành viên khác trong nhóm.' },

  // ===== CONVENTIONAL (C) - Nghiệp vụ =====
  { id: 51, group: 'C', question: 'Tôi thích mọi thứ được sắp xếp gọn gàng và ngăn nắp.' },
  { id: 52, group: 'C', question: 'Tôi thường xuyên lập danh sách chi tiết các công việc cần làm trong ngày hoặc trong một thời gian ngắn.' },
  { id: 53, group: 'C', question: 'Tôi thích đánh máy các tài liệu hơn là viết tay.' },
  { id: 54, group: 'C', question: 'Tôi rất thực tế, luôn cân nhắc kỹ về chi phí trước khi mua một thứ gì đó.' },
  { id: 55, group: 'C', question: 'Tôi thích đảm nhiệm vị trí thư ký trong các buổi họp hay họp nhóm.' },
  { id: 56, group: 'C', question: 'Tôi yêu thích việc sắp xếp, tổ chức công việc cho bản thân hoặc nhóm.' },
  { id: 57, group: 'C', question: 'Tôi tự thấy mình là người tỉ mỉ, chu đáo và cẩn thận.' },
  { id: 58, group: 'C', question: 'Tôi thích công việc tính toán sổ sách, ghi chép số liệu.' },
  { id: 59, group: 'C', question: 'Tôi thích các công việc lưu trữ, phân loại và cập nhật thông tin.' },
  { id: 60, group: 'C', question: 'Tôi thực sự bị cuốn hút bởi các hàm tính toán trong excel.' },
];
