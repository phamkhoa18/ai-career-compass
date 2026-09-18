export interface RiasecQuestion {
  id: number;
  group: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  question: string;
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
    nameVi: 'Quản trị',
    color: '#FFA07A',
    description: 'Thích lãnh đạo, thuyết phục, kinh doanh, quản lý dự án. Tham vọng và năng động.',
  },
  C: {
    name: 'Conventional',
    nameVi: 'Quy chuẩn',
    color: '#87CEEB',
    description: 'Thích làm việc có tổ chức, xử lý dữ liệu, tuân thủ quy trình. Cẩn thận và chính xác.',
  },
};

export const riasecQuestions: RiasecQuestion[] = [
  // ===== R - Nhóm Thực tế (Realistic) =====
  { id: 1, group: 'R', question: 'Tôi suy nghĩ thực tế và có tính tự lập.' },
  { id: 2, group: 'R', question: 'Tôi có thể vận hành, điều khiển hoặc sửa chữa máy móc, thiết bị.' },
  { id: 3, group: 'R', question: 'Tôi thích làm các công việc thủ công như gấp giấy, dán, may mặc hoặc làm đồ dùng.' },
  { id: 4, group: 'R', question: 'Tôi thích đọc các sách về kỹ thuật, máy móc.' },
  { id: 5, group: 'R', question: 'Tôi thích làm việc ngoài trời hơn là trong phòng làm việc.' },
  { id: 6, group: 'R', question: 'Tôi là người thích nghi tốt với môi trường mới.' },

  // ===== I - Nhóm Nghiên cứu (Investigative) =====
  { id: 7, group: 'I', question: 'Tôi thích học các môn khoa học tự nhiên và làm thí nghiệm.' },
  { id: 8, group: 'I', question: 'Tôi thích tìm hiểu bản chất của vấn đề và nghiên cứu cái mới.' },
  { id: 9, group: 'I', question: 'Tôi có khả năng giải quyết các bài toán khó và ẩn số phức tạp.' },
  { id: 10, group: 'I', question: 'Tôi có tính tò mò, thích khám phá và đọc báo khoa học.' },
  { id: 11, group: 'I', question: 'Tôi là người suy nghĩ logic, chặt chẽ.' },
  { id: 12, group: 'I', question: 'Tôi thích quan sát, phân tích mọi việc xung quanh.' },

  // ===== A - Nhóm Nghệ thuật (Artistic) =====
  { id: 13, group: 'A', question: 'Tôi thích tham gia các hoạt động nghệ thuật như ca hát, nhảy múa, vẽ tranh, chơi nhạc cụ.' },
  { id: 14, group: 'A', question: 'Tôi thích tự do sáng tạo, không thích bị gò bó.' },
  { id: 15, group: 'A', question: 'Tôi có trí tưởng tượng phong phú và nhạy cảm với cái đẹp.' },
  { id: 16, group: 'A', question: 'Tôi thích viết lách, sáng tác văn thơ, kịch bản.' },
  { id: 17, group: 'A', question: 'Tôi thích thiết kế, trang trí không gian sống hoặc không gian làm việc.' },
  { id: 18, group: 'A', question: 'Tôi thích thưởng thức nghệ thuật và có phong cách thời trang riêng biệt.' },

  // ===== S - Nhóm Xã hội (Social) =====
  { id: 19, group: 'S', question: 'Tôi dễ lắng nghe, chia sẻ và thích giúp đỡ, chăm sóc người khác.' },
  { id: 20, group: 'S', question: 'Tôi thích làm việc theo nhóm, giao lưu và kết bạn với nhiều người.' },
  { id: 21, group: 'S', question: 'Tôi thích tham gia các hoạt động thiện nguyện, từ thiện hoặc công tác xã hội.' },
  { id: 22, group: 'S', question: 'Tôi có khả năng truyền đạt, giảng dạy cho người khác.' },
  { id: 23, group: 'S', question: 'Tôi thích tư vấn, giải đáp thắc mắc cho người khác.' },
  { id: 24, group: 'S', question: 'Tôi có khả năng tư vấn tâm lý hoặc lắng nghe khó khăn của cộng đồng.' },

  // ===== E - Nhóm Quản trị (Enterprising) =====
  { id: 25, group: 'E', question: 'Tôi thích lãnh đạo, dẫn dắt và đứng ra tổ chức các sự kiện.' },
  { id: 26, group: 'E', question: 'Tôi thích thuyết phục người khác đồng ý với ý kiến của mình.' },
  { id: 27, group: 'E', question: 'Tôi là người tự tin, thích thể hiện bản thân và mạo hiểm thử thách.' },
  { id: 28, group: 'E', question: 'Tôi thích kinh doanh, buôn bán hoặc thương lượng đàm phán.' },
  { id: 29, group: 'E', question: 'Tôi có khả năng ra quyết định nhanh chóng.' },
  { id: 30, group: 'E', question: 'Tôi thích đặt ra mục tiêu cao và tìm cách đạt được.' },

  // ===== C - Nhóm Quy chuẩn (Conventional) =====
  { id: 31, group: 'C', question: 'Tôi thích làm việc theo quy trình, hướng dẫn có sẵn và tuân thủ thời gian biểu.' },
  { id: 32, group: 'C', question: 'Tôi là người cẩn thận, tỉ mỉ trong công việc.' },
  { id: 33, group: 'C', question: 'Tôi thích công việc sắp xếp, lưu trữ hồ sơ, dữ liệu ngăn nắp.' },
  { id: 34, group: 'C', question: 'Tôi thích làm việc với các con số, tính toán.' },
  { id: 35, group: 'C', question: 'Tôi thích lập kế hoạch chi tiết trước khi làm việc và thích sự ổn định.' },
  { id: 36, group: 'C', question: 'Tôi thích kiểm tra độ chính xác của tài liệu, báo cáo.' },
];
