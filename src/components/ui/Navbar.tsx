'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, PenLine, ClipboardList, Settings } from 'lucide-react';

const links = [
  { href: '/', label: 'Trang chủ', Icon: Home },
  { href: '/assessment', label: 'Làm bài test', Icon: PenLine },
  { href: '/history', label: 'Lịch sử', Icon: ClipboardList },
  { href: '/admin', label: 'Quản trị', Icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <Image src="/images/logo.svg" alt="Logo" width={36} height={36} className="rounded-xl shadow-sm" />
            <div>
              <h1 className="text-base font-bold text-text-main m-0 leading-tight">Hướng Nghiệp</h1>
              <p className="text-[10px] text-text-light m-0 leading-tight font-semibold">Tương Lai</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all duration-300
                    ${isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-secondary hover:bg-primary-light hover:text-primary-dark'
                    }`}
                >
                  <link.Icon size={16} strokeWidth={2.2} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden glass-card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="px-4 py-3 flex items-center justify-center gap-2">
          <Image src="/images/logo.svg" alt="Logo" width={28} height={28} className="rounded-lg shadow-sm" />
          <span className="text-sm font-bold text-text-main">Hướng Nghiệp Tương Lai</span>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="mobile-bottom-nav md:hidden">
        <div className="flex items-center justify-around px-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl no-underline transition-all duration-200 min-w-[56px]
                  ${isActive ? 'text-primary-dark' : 'text-text-light'}`}
              >
                <link.Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-semibold leading-tight whitespace-nowrap max-[400px]:hidden ${isActive ? 'text-primary-dark' : 'text-text-light'}`}>
                  {link.label}
                </span>
                {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
