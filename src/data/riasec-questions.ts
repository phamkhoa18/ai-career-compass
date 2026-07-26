export interface RiasecQuestion {
  id: number;
  group: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  question: string;
  description: string;
}

export const RIASEC_GROUP_INFO = {
  R: {
    name: 'Realistic',
    nameVi: 'Thực tế',
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
    nameVi: 'Doanh nghiệp',
    color: '#FFA07A',
    description: 'Thích lãnh đạo, thuyết phục, kinh doanh, quản lý dự án. Tham vọng và năng động.',
  },
  C: {
    name: 'Conventional',
    nameVi: 'Quy tắc',
    color: '#87CEEB',
    description: 'Thích làm việc có tổ chức, xử lý dữ liệu, tuân thủ quy trình. Cẩn thận và chính xác.',
  },
};

export const riasecQuestions: RiasecQuestion[] = [
  // ===== REALISTIC (R) - 7 câu =====
  {
    id: 1,
    group: 'R',
    question: 'Bạn thích sửa chữa đồ điện tử, lắp ráp máy tính hoặc thiết bị cơ khí.',
    description: 'Tháo lắp, sửa chữa các thiết bị kỹ thuật',
  },
  {
    id: 2,
    group: 'R',
    question: 'Bạn thích các hoạt động ngoài trời như trồng cây, chăm sóc vườn hoặc làm việc với động vật.',
    description: 'Hoạt động thể chất ngoài trời',
  },
  {
    id: 3,
    group: 'R',
    question: 'Bạn thích vận hành máy móc, công cụ hoặc phương tiện giao thông.',
    description: 'Sử dụng máy móc và công cụ',
  },
  {
    id: 4,
    group: 'R',
    question: 'Bạn thích tự tay làm các sản phẩm thủ công, mô hình hoặc đồ DIY.',
    description: 'Làm việc tay chân, thủ công',
  },
  {
    id: 5,
    group: 'R',
    question: 'Bạn thích thể thao, rèn luyện thể chất hoặc các hoạt động đòi hỏi sức bền.',
    description: 'Hoạt động thể thao, vận động',
  },
  {
    id: 6,
    group: 'R',
    question: 'Bạn thích đọc bản vẽ kỹ thuật hoặc hướng dẫn lắp ráp.',
    description: 'Đọc hiểu tài liệu kỹ thuật',
  },
  {
    id: 7,
    group: 'R',
    question: 'Bạn thích xây dựng, thi công hoặc sửa chữa nhà cửa.',
    description: 'Xây dựng và sửa chữa',
  },

  // ===== INVESTIGATIVE (I) - 7 câu =====
  {
    id: 8,
    group: 'I',
    question: 'Bạn thích nghiên cứu, tìm hiểu cách hoạt động của các hiện tượng tự nhiên.',
    description: 'Khám phá khoa học tự nhiên',
  },
  {
    id: 9,
    group: 'I',
    question: 'Bạn thích giải các bài toán phức tạp hoặc câu đố logic.',
    description: 'Giải quyết vấn đề logic',
  },
  {
    id: 10,
    group: 'I',
    question: 'Bạn thích đọc sách khoa học, xem phim tài liệu về khoa học và công nghệ.',
    description: 'Tìm hiểu kiến thức khoa học',
  },
  {
    id: 11,
    group: 'I',
    question: 'Bạn thích phân tích dữ liệu, thống kê và tìm ra quy luật.',
    description: 'Phân tích và xử lý dữ liệu',
  },
  {
    id: 12,
    group: 'I',
    question: 'Bạn thích thí nghiệm, quan sát và ghi chép kết quả một cách khoa học.',
    description: 'Thực hiện thí nghiệm khoa học',
  },
  {
    id: 13,
    group: 'I',
    question: 'Bạn thích sử dụng máy tính để lập trình, viết code hoặc phân tích dữ liệu.',
    description: 'Lập trình và công nghệ thông tin',
  },
  {
    id: 14,
    group: 'I',
    question: 'Bạn tò mò về vũ trụ, sinh vật biển sâu hoặc các bí ẩn khoa học.',
    description: 'Khám phá bí ẩn khoa học',
  },

  // ===== ARTISTIC (A) - 7 câu =====
  {
    id: 15,
    group: 'A',
    question: 'Bạn thích vẽ, thiết kế đồ họa, chỉnh sửa ảnh hoặc video.',
    description: 'Sáng tạo hình ảnh và đồ họa',
  },
  {
    id: 16,
    group: 'A',
    question: 'Bạn thích viết truyện, thơ, blog hoặc sáng tác nội dung.',
    description: 'Viết lách và sáng tác',
  },
  {
    id: 17,
    group: 'A',
    question: 'Bạn thích chơi nhạc cụ, hát hoặc sáng tác nhạc.',
    description: 'Âm nhạc và biểu diễn',
  },
  {
    id: 18,
    group: 'A',
    question: 'Bạn thích diễn kịch, làm phim ngắn hoặc tham gia các hoạt động nghệ thuật.',
    description: 'Diễn xuất và điện ảnh',
  },
  {
    id: 19,
    group: 'A',
    question: 'Bạn thích trang trí, sắp xếp không gian hoặc thiết kế thời trang.',
    description: 'Thiết kế và trang trí',
  },
  {
    id: 20,
    group: 'A',
    question: 'Bạn thích sáng tạo ý tưởng mới, nghĩ ra giải pháp độc đáo.',
    description: 'Tư duy sáng tạo',
  },
  {
    id: 21,
    group: 'A',
    question: 'Bạn thích nhiếp ảnh, quay phim hoặc tạo nội dung mạng xã hội.',
    description: 'Nhiếp ảnh và truyền thông',
  },

  // ===== SOCIAL (S) - 7 câu =====
  {
    id: 22,
    group: 'S',
    question: 'Bạn thích giúp đỡ bạn bè giải quyết vấn đề cá nhân hoặc học tập.',
    description: 'Hỗ trợ và giúp đỡ người khác',
  },
  {
    id: 23,
    group: 'S',
    question: 'Bạn thích tham gia hoạt động tình nguyện, thiện nguyện.',
    description: 'Hoạt động cộng đồng',
  },
  {
    id: 24,
    group: 'S',
    question: 'Bạn thích dạy kèm, hướng dẫn hoặc chia sẻ kiến thức cho người khác.',
    description: 'Giảng dạy và mentoring',
  },
  {
    id: 25,
    group: 'S',
    question: 'Bạn quan tâm đến sức khỏe, tâm lý và phúc lợi của mọi người.',
    description: 'Chăm sóc sức khỏe cộng đồng',
  },
  {
    id: 26,
    group: 'S',
    question: 'Bạn thích lắng nghe, tư vấn và động viên người khác.',
    description: 'Tư vấn và lắng nghe',
  },
  {
    id: 27,
    group: 'S',
    question: 'Bạn thích tổ chức sự kiện, hoạt động nhóm hoặc team-building.',
    description: 'Tổ chức hoạt động nhóm',
  },
  {
    id: 28,
    group: 'S',
    question: 'Bạn muốn làm việc có ý nghĩa, đóng góp cho cộng đồng và xã hội.',
    description: 'Đóng góp xã hội',
  },

  // ===== ENTERPRISING (E) - 7 câu =====
  {
    id: 29,
    group: 'E',
    question: 'Bạn thích thuyết phục người khác mua hàng hoặc ủng hộ ý tưởng của mình.',
    description: 'Thuyết phục và bán hàng',
  },
  {
    id: 30,
    group: 'E',
    question: 'Bạn thích làm lãnh đạo, đứng đầu nhóm hoặc tổ chức.',
    description: 'Lãnh đạo và quản lý',
  },
  {
    id: 31,
    group: 'E',
    question: 'Bạn thích kinh doanh, buôn bán online hoặc khởi nghiệp.',
    description: 'Kinh doanh và khởi nghiệp',
  },
  {
    id: 32,
    group: 'E',
    question: 'Bạn thích đàm phán, tranh luận và bảo vệ quan điểm.',
    description: 'Đàm phán và tranh luận',
  },
  {
    id: 33,
    group: 'E',
    question: 'Bạn thích lập kế hoạch, chiến lược để đạt mục tiêu.',
    description: 'Lập kế hoạch chiến lược',
  },
  {
    id: 34,
    group: 'E',
    question: 'Bạn thích phát biểu trước đám đông, thuyết trình hoặc MC sự kiện.',
    description: 'Nói trước đám đông',
  },
  {
    id: 35,
    group: 'E',
    question: 'Bạn mong muốn có thu nhập cao và sẵn sàng chấp nhận rủi ro.',
    description: 'Tham vọng tài chính',
  },

  // ===== CONVENTIONAL (C) - 7 câu =====
  {
    id: 36,
    group: 'C',
    question: 'Bạn thích sắp xếp, phân loại tài liệu, dữ liệu một cách gọn gàng.',
    description: 'Tổ chức và sắp xếp',
  },
  {
    id: 37,
    group: 'C',
    question: 'Bạn thích làm việc theo quy trình, lịch trình rõ ràng.',
    description: 'Tuân thủ quy trình',
  },
  {
    id: 38,
    group: 'C',
    question: 'Bạn thích nhập liệu, tính toán hoặc kiểm tra số liệu chính xác.',
    description: 'Xử lý số liệu chính xác',
  },
  {
    id: 39,
    group: 'C',
    question: 'Bạn thích sử dụng bảng tính Excel, phần mềm kế toán hoặc quản lý.',
    description: 'Sử dụng phần mềm quản lý',
  },
  {
    id: 40,
    group: 'C',
    question: 'Bạn cẩn thận, tỉ mỉ và ghét mắc lỗi trong công việc.',
    description: 'Tính cẩn thận và chính xác',
  },
  {
    id: 41,
    group: 'C',
    question: 'Bạn thích soạn thảo văn bản, biên bản hoặc báo cáo.',
    description: 'Soạn thảo văn bản',
  },
  {
    id: 42,
    group: 'C',
    question: 'Bạn thích công việc ổn định, có giờ giấc rõ ràng và môi trường ngăn nắp.',
    description: 'Môi trường làm việc ổn định',
  },
];
