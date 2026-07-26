import type { Metadata } from "next";
import "./globals.css";
import { AntdProvider } from "@/components/AntdProvider";

export const metadata: Metadata = {
  title: "Hướng Nghiệp Tương Lai - Định Hướng Nghề Nghiệp Cho Học Sinh THPT",
  description: "Hệ thống AI hỗ trợ định hướng nghề nghiệp dựa trên học lực, sở thích và mô hình RIASEC cho học sinh THPT Việt Nam.",
  keywords: ["hướng nghiệp", "định hướng nghề nghiệp", "trắc nghiệm RIASEC", "chọn ngành", "chọn trường", "AI hướng nghiệp"],
  authors: [{ name: "Hệ Thống AI Hướng Nghiệp" }],
  openGraph: {
    title: "Hệ Thống AI Hướng Nghiệp Tương Lai",
    description: "Khám phá ngay lộ trình nghề nghiệp tương lai của bạn với mô hình phân tích RIASEC chuẩn xác.",
    url: "https://huongnghiep-ai.com", // Replace with real URL
    siteName: "Hướng Nghiệp Tương Lai",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hệ Thống AI Hướng Nghiệp Tương Lai",
    description: "Khám phá ngay lộ trình nghề nghiệp tương lai của bạn với mô hình phân tích RIASEC chuẩn xác.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        <AntdProvider>
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
