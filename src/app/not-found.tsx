'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import Navbar from '@/components/ui/Navbar';
import { Compass, Home, ArrowLeft, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex flex-col justify-between font-sans text-slate-800">
      <Navbar />

      {/* Dynamic Ambient Background Elements */}
      <div className="blob w-96 h-96 bg-pink-200/40 top-10 -left-20 blur-3xl pointer-events-none" />
      <div className="blob w-[30rem] h-[30rem] bg-indigo-200/40 top-60 -right-32 blur-3xl pointer-events-none" />

      {/* Main 404 Hero Section */}
      <div className="relative z-10 pt-28 pb-16 px-4 max-w-4xl mx-auto text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold mb-6 animate-pulse">
          <Sparkles size={14} /> 404 - Page Not Found
        </div>

        {/* Big Graphic Badge */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-3xl rotate-6 opacity-20 blur-md animate-pulse"></div>
          <div className="w-full h-full bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center relative z-10">
            <Compass size={56} className="text-indigo-600 mb-2 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="text-3xl font-black text-slate-900 tracking-tight">404</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Trang bạn tìm kiếm không tồn tại
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed mb-8">
          Đường dẫn có thể đã thay đổi hoặc bạn nhập sai địa chỉ. Hãy quay về Trang chủ hoặc làm bài trắc nghiệm hướng nghiệp để tìm ra định hướng tương lai!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button
              type="primary"
              size="large"
              className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Home size={18} /> Quay về Trang Chủ
            </Button>
          </Link>

          <Link href="/assessment">
            <Button
              size="large"
              className="h-12 px-6 rounded-2xl border-slate-300 font-bold text-sm flex items-center gap-2 hover:border-indigo-400"
            >
              <Search size={18} /> Làm Bài Test Hướng Nghiệp
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        © 2026 AI Career Compass &bull; Hệ thống AI hỗ trợ định hướng nghề nghiệp THPT
      </footer>
    </div>
  );
}
