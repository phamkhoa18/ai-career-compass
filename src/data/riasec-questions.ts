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
  // Câu hỏi mới từ THAY ĐỔI.docx - 50 câu
  // Mapping theo nội dung: mỗi nhóm ~8 câu, phân bổ xen kẽ

  // ===== REALISTIC (R) - Kỹ thuật =====
  { id: 1, group: 'R', question: 'Bạn có thích làm việc với máy móc hoặc công cụ?' },
  { id: 3, group: 'R', question: 'Bạn có thích thử nghiệm công nghệ hoặc công cụ mới?' },
  { id: 9, group: 'R', question: 'Bạn có thích sửa chữa đồ điện hoặc cơ khí?' },
  { id: 15, group: 'R', question: 'Bạn có thích tham gia các hoạt động kỹ thuật?' },
  { id: 21, group: 'R', question: 'Bạn có thích chế tạo hoặc sáng tạo đồ dùng?' },
  { id: 27, group: 'R', question: 'Bạn có thích trồng cây hoặc chăm sóc động vật?' },
  { id: 33, group: 'R', question: 'Bạn có thích vận hành máy móc hoặc thiết bị kỹ thuật?' },
  { id: 39, group: 'R', question: 'Bạn có thích tham gia các hoạt động ngoài trời hoặc thể thao?' },
  { id: 45, group: 'R', question: 'Bạn có thích sửa chữa hoặc lắp ráp đồ vật?' },

  // ===== INVESTIGATIVE (I) - Nghiên cứu =====
  { id: 2, group: 'I', question: 'Bạn có thích nghiên cứu chuyên sâu và học hỏi liên tục?' },
  { id: 8, group: 'I', question: 'Bạn có thích nghiên cứu và phân tích thông tin?' },
  { id: 14, group: 'I', question: 'Bạn có thích tìm hiểu công nghệ mới?' },
  { id: 20, group: 'I', question: 'Bạn có thích nghiên cứu thiên nhiên hoặc môi trường?' },
  { id: 26, group: 'I', question: 'Bạn có thích tìm hiểu nguyên lý hoạt động của sự vật?' },
  { id: 32, group: 'I', question: 'Bạn có thích giải các câu đố hoặc vấn đề logic?' },
  { id: 38, group: 'I', question: 'Bạn có thích phân tích số liệu và tìm ra kết luận?' },
  { id: 44, group: 'I', question: 'Bạn có thích nghiên cứu hoặc đọc sách chuyên môn?' },
  { id: 50, group: 'I', question: 'Bạn có thích giải quyết các vấn đề khoa học?' },

  // ===== ARTISTIC (A) - Nghệ thuật =====
  { id: 7, group: 'A', question: 'Bạn có thích sáng tác nhạc, hội họa hoặc viết văn?' },
  { id: 13, group: 'A', question: 'Bạn có thích viết kịch bản, blog hoặc sáng tạo nội dung?' },
  { id: 19, group: 'A', question: 'Bạn có thích thiết kế trang phục hoặc nội thất?' },
  { id: 25, group: 'A', question: 'Bạn có thích thử nghiệm màu sắc hoặc chất liệu trong nghệ thuật?' },
  { id: 31, group: 'A', question: 'Bạn có thích ca hát, nhảy múa hoặc biểu diễn nghệ thuật?' },
  { id: 37, group: 'A', question: 'Bạn có thích làm đồ thủ công hoặc trang trí?' },
  { id: 43, group: 'A', question: 'Bạn có thích viết truyện, thơ hoặc sáng tác?' },
  { id: 49, group: 'A', question: 'Bạn có thích vẽ, thiết kế hoặc sáng tạo nghệ thuật?' },

  // ===== SOCIAL (S) - Xã hội =====
  { id: 6, group: 'S', question: 'Bạn có thích tham gia các hoạt động tình nguyện?' },
  { id: 12, group: 'S', question: 'Bạn có thích làm việc với cộng đồng?' },
  { id: 18, group: 'S', question: 'Bạn có thích chăm sóc và hướng dẫn người mới?' },
  { id: 24, group: 'S', question: 'Bạn có thích tham gia công tác xã hội?' },
  { id: 30, group: 'S', question: 'Bạn có thích hỗ trợ người khác giải quyết xung đột?' },
  { id: 36, group: 'S', question: 'Bạn có thích tư vấn hoặc dạy người khác?' },
  { id: 42, group: 'S', question: 'Bạn có thích làm việc với trẻ em hoặc người già?' },
  { id: 48, group: 'S', question: 'Bạn có thích giúp đỡ người khác khi gặp khó khăn?' },

  // ===== ENTERPRISING (E) - Quản lý =====
  { id: 5, group: 'E', question: 'Bạn có thích quản lý tài chính hoặc dự án?' },
  { id: 11, group: 'E', question: 'Bạn có thích giới thiệu sản phẩm hoặc ý tưởng?' },
  { id: 17, group: 'E', question: 'Bạn có thích thảo luận và lãnh đạo dự án?' },
  { id: 23, group: 'E', question: 'Bạn có thích quản lý nhóm hoặc tổ chức sự kiện?' },
  { id: 29, group: 'E', question: 'Bạn có thích thuyết trình hoặc quảng bá ý tưởng?' },
  { id: 35, group: 'E', question: 'Bạn có thích lập kế hoạch kinh doanh hoặc dự án?' },
  { id: 41, group: 'E', question: 'Bạn có thích tham gia các hoạt động kinh doanh hoặc bán hàng?' },
  { id: 47, group: 'E', question: 'Bạn có thích lãnh đạo hoặc thuyết phục người khác?' },

  // ===== CONVENTIONAL (C) - Nghiệp vụ =====
  { id: 4, group: 'C', question: 'Bạn có thích làm việc cẩn thận theo hướng dẫn?' },
  { id: 10, group: 'C', question: 'Bạn có thích tổ chức dữ liệu và lưu trữ hồ sơ?' },
  { id: 16, group: 'C', question: 'Bạn có thích sắp xếp lịch làm việc hoặc tài liệu?' },
  { id: 22, group: 'C', question: 'Bạn có thích kiểm tra, đánh giá hồ sơ hoặc số liệu?' },
  { id: 28, group: 'C', question: 'Bạn có thích tuân thủ hướng dẫn và quy trình?' },
  { id: 34, group: 'C', question: 'Bạn có thích ghi chép, lập báo cáo hoặc kế toán?' },
  { id: 40, group: 'C', question: 'Bạn có thích sắp xếp dữ liệu, lưu trữ hồ sơ?' },
  { id: 46, group: 'C', question: 'Bạn có thích làm việc theo quy tắc và kế hoạch?' },
];
