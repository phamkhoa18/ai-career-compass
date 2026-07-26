// We use node --env-file=.env.local to load env variables
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const URI = process.env.MONGODB_URI;

if (!URI) {
  console.error('❌ Lỗi: Không tìm thấy biến môi trường MONGODB_URI trong file .env.local');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function seedAdmin() {
  try {
    console.log('🔄 Đang kết nối tới MongoDB...');
    await mongoose.connect(URI);
    console.log('✅ Đã kết nối MongoDB thành công!');

    const username = 'admin';
    const password = 'admin123';

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log('⚠️ Tài khoản admin đã tồn tại trên server rồi!');
      process.exit(0);
    }

    // Hash mật khẩu và tạo mới
    console.log('🔐 Đang mã hóa mật khẩu...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await Admin.create({
      username,
      passwordHash,
    });

    console.log(`🎉 Thành công! Tài khoản admin đã được tạo.`);
    console.log(`👉 Username: ${username}`);
    console.log(`👉 Password: ${password}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo tài khoản admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã đóng kết nối cơ sở dữ liệu.');
    process.exit(0);
  }
}

seedAdmin();
