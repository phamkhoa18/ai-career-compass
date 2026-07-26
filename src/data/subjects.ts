export interface Subject {
  key: string;
  name: string;
  category: 'natural' | 'social' | 'language' | 'other';
}

export const subjects: Subject[] = [
  { key: 'toan', name: 'Toán', category: 'natural' },
  { key: 'nguVan', name: 'Ngữ văn', category: 'social' },
  { key: 'tiengAnh', name: 'Tiếng Anh', category: 'language' },
  { key: 'vatLy', name: 'Vật lý', category: 'natural' },
  { key: 'hoaHoc', name: 'Hóa học', category: 'natural' },
  { key: 'sinhHoc', name: 'Sinh học', category: 'natural' },
  { key: 'lichSu', name: 'Lịch sử', category: 'social' },
  { key: 'diaLy', name: 'Địa lý', category: 'social' },
  { key: 'gdcd', name: 'GDCD', category: 'social' },
  { key: 'tinHoc', name: 'Tin học', category: 'natural' },
  { key: 'congNghe', name: 'Công nghệ', category: 'other' },
  { key: 'gdtc', name: 'Thể dục', category: 'other' },
  { key: 'gdqp', name: 'GDQP-AN', category: 'other' },
];

export const interestOptions = [
  { key: 'computer', label: 'Máy tính & Công nghệ' },
  { key: 'space', label: 'Khoa học vũ trụ' },
  { key: 'language', label: 'Ngôn ngữ & Dịch thuật' },
  { key: 'art', label: 'Sáng tạo & Nghệ thuật' },
  { key: 'business', label: 'Kinh doanh & Tài chính' },
  { key: 'health', label: 'Y tế & Sức khỏe' },
  { key: 'education', label: 'Giáo dục & Đào tạo' },
  { key: 'sport', label: 'Thể thao & Fitness' },
  { key: 'music', label: 'Âm nhạc & Biểu diễn' },
  { key: 'travel', label: 'Du lịch & Khám phá' },
  { key: 'cooking', label: 'Ẩm thực & Nấu ăn' },
  { key: 'environment', label: 'Môi trường & Thiên nhiên' },
  { key: 'media', label: 'Truyền thông & MXH' },
  { key: 'law', label: 'Pháp luật & Công lý' },
  { key: 'psychology', label: 'Tâm lý học' },
  { key: 'architecture', label: 'Kiến trúc & Xây dựng' },
  { key: 'gaming', label: 'Game & Giải trí' },
  { key: 'science', label: 'Nghiên cứu khoa học' },
  { key: 'military', label: 'Quân sự & An ninh' },
  { key: 'social', label: 'Công tác xã hội' },
];

export const softSkillsList = [
  { key: 'communication', name: 'Giao tiếp', description: 'Khả năng trình bày, thuyết trình và trao đổi thông tin' },
  { key: 'teamwork', name: 'Làm việc nhóm', description: 'Phối hợp và cộng tác hiệu quả với người khác' },
  { key: 'problemSolving', name: 'Giải quyết vấn đề', description: 'Tìm ra giải pháp cho các tình huống khó khăn' },
  { key: 'leadership', name: 'Lãnh đạo', description: 'Dẫn dắt, truyền cảm hứng và quản lý đội nhóm' },
  { key: 'timeManagement', name: 'Quản lý thời gian', description: 'Sắp xếp công việc và hoàn thành đúng hạn' },
  { key: 'creativity', name: 'Sáng tạo', description: 'Nghĩ ra ý tưởng mới và cách tiếp cận độc đáo' },
  { key: 'criticalThinking', name: 'Tư duy phản biện', description: 'Phân tích thông tin một cách logic và khách quan' },
  { key: 'adaptability', name: 'Thích ứng', description: 'Linh hoạt thay đổi khi hoàn cảnh thay đổi' },
];

export const careerValuesList = [
  { key: 'income', name: 'Thu nhập cao', description: 'Mức lương và thu nhập hấp dẫn' },
  { key: 'stability', name: 'Ổn định công việc', description: 'Công việc bền vững, không lo mất việc' },
  { key: 'creativity', name: 'Tính sáng tạo', description: 'Được tự do sáng tạo và đổi mới' },
  { key: 'socialImpact', name: 'Đóng góp xã hội', description: 'Tạo ra giá trị tích cực cho cộng đồng' },
  { key: 'workLifeBalance', name: 'Cân bằng cuộc sống', description: 'Có thời gian cho gia đình và bản thân' },
  { key: 'advancement', name: 'Cơ hội thăng tiến', description: 'Phát triển sự nghiệp và vị trí cao hơn' },
];
