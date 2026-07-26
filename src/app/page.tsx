'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'antd';
import Navbar from '@/components/ui/Navbar';
import {
  ArrowRight, ClipboardList, Star, GraduationCap,
  Microscope, Sparkles, Target, BookOpen, Lightbulb, Diamond,
  BarChart3,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden has-bottom-nav">
      <Navbar />

      {/* Background blobs */}
      <div className="blob w-72 h-72 bg-primary-light top-20 -left-20" />
      <div className="blob w-96 h-96 bg-secondary-light top-40 -right-32" />
      <div className="blob w-64 h-64 bg-accent-light bottom-20 left-1/3" />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 md:pt-28 pb-10 md:pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left animate-fade-in-up">
            {/* Logo + Brand */}
            <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold text-primary-dark mb-4 md:mb-6 shadow-sm">
              <Image src="/images/logo.svg" alt="Logo" width={24} height={24} className="rounded-md" />
              Hướng Nghiệp Tương Lai
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
              <span className="text-text-main">Khám Phá Bản Thân &</span><br />
              <span className="gradient-text">Định Hướng Tương Lai</span>
            </h1>

            <p className="text-base md:text-lg text-text-secondary mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Hệ thống AI thông minh giúp bạn tìm ra ngành nghề phù hợp nhất
              dựa trên học lực, tính cách RIASEC, sở thích và kỹ năng.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/assessment">
                <Button type="primary" size="large" block className="h-12 md:h-14 px-6 md:px-8 text-sm md:text-base sm:w-auto">
                  <ArrowRight size={18} /> Bắt đầu khám phá
                </Button>
              </Link>
              <Link href="/history">
                <Button size="large" block className="h-12 md:h-14 px-6 md:px-8 text-sm md:text-base sm:w-auto">
                  <ClipboardList size={18} /> Xem lịch sử
                </Button>
              </Link>
            </div>

            <div className="flex gap-6 md:gap-8 mt-8 md:mt-10 justify-center lg:justify-start">
              {[
                { val: '42', label: 'Câu hỏi RIASEC', color: 'text-primary-dark' },
                { val: '6', label: 'Nhóm tính cách', color: 'text-secondary-dark' },
                { val: 'Top 5', label: 'Ngành nghề gợi ý', color: 'text-accent-dark' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.val}</div>
                  <div className="text-[10px] md:text-xs text-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mascot - Owl */}
          <div className="flex-1 flex justify-center animate-float mt-4 lg:mt-0">
            <div className="relative">
              <div className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-primary-light via-secondary-light to-accent-light flex items-center justify-center shadow-xl p-4">
                <Image src="/images/owl-mascot-v2.png" alt="Ú - Trợ lý hướng nghiệp" width={280} height={280}
                  className="object-contain drop-shadow-lg" priority />
              </div>
              {/* Speech bubble */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-md border border-white/50 whitespace-nowrap">
                <p className="text-xs md:text-sm font-semibold text-text-main m-0">Chào bạn! Mình là <span className="text-primary">Ú</span> 🦉</p>
                <p className="text-[10px] md:text-xs text-text-secondary m-0">Trợ lý hướng nghiệp AI của bạn</p>
              </div>
              {/* Floating decorations */}
              <div className="absolute -top-3 -right-3 text-primary animate-pulse-soft">
                <Star size={22} fill="currentColor" />
              </div>
              <div className="absolute top-8 -left-6 text-secondary-dark animate-pulse-soft" style={{ animationDelay: '0.5s' }}>
                <BookOpen size={22} />
              </div>
              <div className="absolute -bottom-1 right-3 text-accent-dark animate-pulse-soft" style={{ animationDelay: '1s' }}>
                <Target size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-10 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-2">Quy Trình Đơn Giản</h2>
            <p className="text-text-secondary text-sm md:text-lg">Chỉ mất khoảng 15 phút để khám phá con đường nghề nghiệp phù hợp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 stagger-children">
            {[
              { Icon: Microscope, title: 'Trắc nghiệm RIASEC', desc: '42 câu hỏi khoa học giúp xác định nhóm tính cách nghề nghiệp của bạn.', gradient: 'bg-gradient-primary' },
              { Icon: Sparkles, title: 'Phân tích AI', desc: 'AI phân tích toàn diện: học lực, sở thích, kỹ năng mềm, giá trị nghề nghiệp.', gradient: 'bg-gradient-cool' },
              { Icon: Target, title: 'Top 5 Ngành Nghề', desc: 'Gợi ý 5 ngành nghề phù hợp nhất kèm lý do chi tiết và điểm cần cải thiện.', gradient: 'bg-gradient-purple' },
            ].map((card, i) => (
              <div key={i} className="glass-card p-6 md:p-8 hover-lift text-center">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${card.gradient} flex items-center justify-center mx-auto mb-3 md:mb-4 text-white shadow-lg`}>
                  <card.Icon size={28} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-text-main mb-2">{card.title}</h3>
                <p className="text-text-secondary text-xs md:text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Preview */}
      <section className="relative z-10 py-10 md:py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-center text-text-main mb-6 md:mb-8">Các Bước Đánh Giá</h2>
            <div className="grid grid-cols-5 gap-2 md:gap-4">
              {[
                { Icon: ClipboardList, title: 'Thông tin', desc: 'Họ tên, lớp' },
                { Icon: BarChart3, title: 'Học lực', desc: 'Điểm các môn' },
                { Icon: Microscope, title: 'RIASEC', desc: '42 câu hỏi' },
                { Icon: Lightbulb, title: 'Sở thích', desc: 'Kỹ năng mềm' },
                { Icon: Diamond, title: 'Giá trị', desc: 'Nghề nghiệp' },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center mx-auto mb-1.5 md:mb-2 shadow-sm">
                    <step.Icon size={18} className="text-primary-dark" strokeWidth={2} />
                  </div>
                  <div className="text-[10px] md:text-sm font-bold text-text-main">{step.title}</div>
                  <div className="text-[9px] md:text-xs text-text-secondary hidden sm:block">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-6 md:py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src="/images/logo.svg" alt="Logo" width={20} height={20} className="rounded-sm" />
          <span className="text-sm font-bold text-text-main">Hướng Nghiệp Tương Lai</span>
        </div>
        <p className="text-xs md:text-sm text-text-secondary mb-1">© 2026 Hướng Nghiệp Tương Lai — Đồng hành cùng học sinh Việt Nam</p>
        <p className="text-xs md:text-sm text-text-secondary">
          Thực hiện và phát triển bởi <a href="https://vincode.xyz/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Vincode</a>
        </p>
      </footer>
    </div>
  );
}
