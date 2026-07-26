<div align="center">
  <img src="public/images/logo.svg" alt="Vincode Logo" width="120" />
  
  # HỆ THỐNG TRÍ TUỆ NHÂN TẠO HƯỚNG NGHIỆP HỌC SINH THPT
  *Giải pháp công nghệ giáo dục toàn diện được phát triển bởi **[Vincode](https://vincode.xyz/)***
</div>

---

## 🎯 Giới thiệu dự án

**Hệ thống Trí tuệ Nhân tạo Hướng nghiệp** là một nền tảng Web Application hiện đại được thiết kế độc quyền nhằm giúp các bạn học sinh khối THPT khám phá năng lực bản thân, định vị tính cách và tìm ra con đường sự nghiệp phù hợp nhất trong tương lai.

Thay vì những bài kiểm tra khô khan truyền thống, hệ thống là sự kết hợp đột phá giữa **Lý thuyết đa trí tuệ RIASEC (Holland Code)** và **Trí tuệ nhân tạo (Generative AI)**. Mọi quyết định đều được cá nhân hóa dựa trên học lực thực tế, kỹ năng mềm và sở thích cá nhân của từng học sinh.

## ✨ Tính năng nổi bật

### 🎓 Dành cho Học sinh (Người dùng)
- **Kiểm tra tính cách RIASEC**: Bài test tiêu chuẩn gồm 42 câu hỏi giúp phân tích 6 nhóm tính cách (Thực tế, Nghiên cứu, Nghệ thuật, Xã hội, Khởi nghiệp, Truyền thống).
- **Phân tích AI Chuyên sâu**: Trí tuệ nhân tạo (Google Gemini) sẽ đọc toàn bộ phổ điểm học tập, kỹ năng mềm và điểm RIASEC để đưa ra 5 ngành nghề tiềm năng nhất kèm tỷ lệ phù hợp (%).
- **Lộ trình phát triển**: Trí tuệ nhân tạo sẽ chỉ ra điểm mạnh cần phát huy và những hạn chế cần khắc phục để theo đuổi ngành nghề ước mơ.
- **Bảo mật Quyền riêng tư**: Lịch sử làm bài được mã hóa và lưu trữ cục bộ, đảm bảo 100% không lộ thông tin cá nhân.

### 🛡 Dành cho Ban Giám hiệu (Quản trị viên)
- **Dashboard Thống kê Thời gian thực**: Giao diện Quản trị "SaaS-like" theo dõi lưu lượng truy cập và phân bổ các nhóm tính cách của toàn trường.
- **Hệ thống Biểu đồ Động**: Trực quan hóa dữ liệu bằng các biểu đồ tương tác cao.
- **Xuất Báo cáo Siêu cấp**:
  - **Excel**: Báo cáo đa sheet (Nhiều trang) tích hợp toàn bộ phổ điểm, AI gợi ý và dữ liệu thô để Ban Giám hiệu dễ dàng lọc dữ liệu.
  - **PDF Tiếng Việt Chuẩn hóa**: Tích hợp thuật toán tự động nhúng Base64 Font (Roboto) để xuất file PDF sắc nét, giữ vẹn nguyên Tiếng Việt có dấu.
- **Bảo mật Proxy Edge**: Toàn bộ luồng dữ liệu Admin được bảo vệ bằng JWT và hệ thống Proxy (Middleware) khắt khe của Next.js 16.

## 🛠 Công nghệ sử dụng

Hệ thống được phát triển trên hệ sinh thái hiện đại và tối ưu nhất của năm 2026:
- **Framework Frontend**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Ngôn ngữ**: TypeScript 100% Type-safe
- **Giao diện & UI**: [Ant Design v5](https://ant.design/), Tailwind CSS (Glassmorphism Design)
- **Cơ sở dữ liệu**: MongoDB & Mongoose ORM
- **Trí tuệ nhân tạo**: Google Gemini AI (`@google/generative-ai`)
- **Xử lý tài liệu**: `jspdf`, `jspdf-autotable`, `xlsx`
- **Iconography**: `lucide-react`

## 🚀 Hướng dẫn Cài đặt & Vận hành

### 1. Yêu cầu hệ thống
- Node.js (phiên bản v18 trở lên)
- MongoDB Database URI
- Khóa API của Google Gemini (API Key)

### 2. Cài đặt mã nguồn

```bash
# Clone dự án về máy
git clone https://github.com/your-username/ai-career-compass.git

# Di chuyển vào thư mục dự án
cd ai-career-compass

# Cài đặt các gói thư viện phụ thuộc
npm install
```

### 3. Cấu hình Môi trường
Tạo file `.env.local` tại thư mục gốc của dự án và điền các thông tin sau:
```env
MONGODB_URI=chuoi_ket_noi_mongodb_cua_ban
GEMINI_API_KEY=khoa_api_google_gemini_cua_ban
JWT_SECRET=chuoi_khoa_bao_mat_jwt_cua_ban
```

### 4. Khởi chạy
```bash
# Chạy môi trường phát triển (Development)
npm run dev

# Hoặc Build để đưa lên máy chủ thực tế (Production)
npm run build
npm start
```
Truy cập hệ thống tại: [http://localhost:3000](http://localhost:3000)

## 🏢 Về đơn vị phát triển

Dự án được tư vấn thiết kế, kiến trúc mã nguồn và phát triển độc quyền bởi **Vincode**.

Tại Vincode, chúng tôi không chỉ viết mã, chúng tôi kiến tạo các giải pháp chuyển đổi số thông minh, tối ưu trải nghiệm người dùng và áp dụng các công nghệ dẫn đầu xu hướng (AI, Next.js, Cloud) để mang lại giá trị thực tiễn cao nhất cho doanh nghiệp và nền giáo dục Việt Nam.

🌐 **Website**: [https://vincode.xyz/](https://vincode.xyz/)  
📅 **Năm phát hành**: 2026  

---
*Mọi bản quyền mã nguồn và ý tưởng thuật toán thuộc về Vincode. Vui lòng liên hệ trực tiếp để được hỗ trợ triển khai và mở rộng quy mô hệ thống.*
