'use client';

import React, { useEffect, useState, useRef, useCallback, use } from 'react';
import { Button, Spin, message, Progress } from 'antd';
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Navbar from '@/components/ui/Navbar';
import { RIASEC_ICONS } from '@/components/ui/riasec-icons';
import { RIASEC_GROUP_INFO } from '@/data/riasec-questions';
import { IAssessment } from '@/models/Assessment';
import { PartyPopper, PieChart, UserRound, Target, GraduationCap, PenLine, Zap, Lightbulb, Download, RefreshCw, Home, Frown, Rocket, Briefcase, Star, Diamond, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

type AssessmentData = Omit<IAssessment, keyof import('mongoose').Document> & { _id: string };

const careerIcons: LucideIcon[] = [Rocket, Briefcase, Target, Star, Diamond];
const gradientColors = ['from-primary-light to-primary', 'from-secondary-light to-secondary', 'from-accent-light to-accent', 'from-warm-light to-warm', 'from-lavender-light to-lavender'];
const careerBgColors = ['#E8899D', '#7CB8CC', '#7CC9A8', '#E8B88A', '#B896D6'];

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => { fetchResult(); }, [id]);

  const fetchResult = async () => {
    try { setLoading(true); const res = await fetch(`/api/assessment/${id}`); if (!res.ok) throw new Error(); setData(await res.json()); }
    catch { messageApi.error('Không tìm thấy kết quả!'); }
    finally { setLoading(false); }
  };

  // ===== PDF Export using html2canvas =====
  const handleExportPDF = useCallback(async () => {
    if (!data || !data.aiResult || !printRef.current) return;
    setExporting(true);
    messageApi.loading({ content: 'Đang tạo PDF...', key: 'pdf', duration: 0 });

    try {
      const el = printRef.current;
      el.style.display = 'block';
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.top = '0';
      await new Promise((r) => setTimeout(r, 500));

      // Get all sections marked with data-pdf-section
      const sections = el.querySelectorAll('[data-pdf-section]');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 5;
      const usableH = pageH - margin * 2;
      let curY = margin;
      let isFirstPage = true;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const canvas = await html2canvas(section, {
          scale: 1.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
          windowWidth: 800,
        });

        const imgW = pageW - margin * 2;
        const imgH = (canvas.height * imgW) / canvas.width;

        // If this section won't fit on the current page, start a new page
        if (curY + imgH > pageH - margin && !isFirstPage) {
          pdf.addPage();
          curY = margin;
        }

        // If a single section is taller than a full page, split it
        if (imgH > usableH) {
          const fullImgW = pageW - margin * 2;
          const ratio = fullImgW / canvas.width;
          const fullImgH = canvas.height * ratio;
          
          // How many pages does this section need?
          let srcY = 0;
          const pxPerPage = usableH / ratio; // pixels of source per PDF page
          
          while (srcY < canvas.height) {
            if (curY > margin + 1) { pdf.addPage(); curY = margin; }
            const sliceH = Math.min(pxPerPage, canvas.height - srcY);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceH;
            const ctx = sliceCanvas.getContext('2d')!;
            ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
            const sliceImgH = sliceH * ratio;
            pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.85), 'JPEG', margin, curY, fullImgW, sliceImgH);
            curY += sliceImgH;
            srcY += sliceH;
            if (srcY < canvas.height) { pdf.addPage(); curY = margin; }
          }
        } else {
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', margin, curY, imgW, imgH);
          curY += imgH + 2; // 2mm gap between sections
        }
        isFirstPage = false;
      }

      // Add page numbers
      const totalPages = pdf.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(180, 180, 180);
        pdf.text(`Trang ${p}/${totalPages}`, pageW / 2, pageH - 3, { align: 'center' });
      }

      el.style.display = 'none';
      pdf.save(`ket-qua-huong-nghiep-${data.fullName.replace(/\s+/g, '-')}.pdf`);
      messageApi.success({ content: 'Đã tạo PDF thành công!', key: 'pdf' });
    } catch (e) {
      console.error('PDF export error:', e);
      messageApi.error({ content: 'Không thể tạo PDF.', key: 'pdf' });
    } finally {
      setExporting(false);
    }
  }, [data, messageApi]);

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><Spin size="large" /><p className="mt-4 text-text-secondary">Đang tải...</p></div>;

  if (!data || !data.aiResult) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center"><Frown size={48} className="text-text-light mx-auto mb-4" /><h2 className="text-xl font-bold text-text-main mb-2">Không tìm thấy kết quả</h2>
        <Link href="/assessment"><Button type="primary" size="large">Làm bài test mới</Button></Link></div></div>
  );

  const riasecEntries = Object.entries(data.riasecScores) as [string, number][];
  const sortedRiasec = [...riasecEntries].sort((a, b) => b[1] - a[1]);
  const topCode = sortedRiasec.slice(0, 3).map(([k]) => k).join('');
  const radarData = riasecEntries.map(([key, value]) => ({ subject: RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO].nameVi, value, fullMark: 35 }));

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden has-bottom-nav">
      {contextHolder}
      <Navbar />
      <div className="blob w-72 h-72 bg-primary-light top-20 -left-20" />
      <div className="blob w-96 h-96 bg-secondary-light top-60 -right-32" />

      {/* ===== Hidden Print Layout for PDF ===== */}
      <div ref={printRef} style={{ display: 'none', width: 800, fontFamily: "'Quicksand', 'Segoe UI', Roboto, sans-serif" }}>
        {/* Section: Header + Student Info */}
        <div data-pdf-section style={{ background: '#fff' }}>
          <div style={{ background: 'linear-gradient(135deg, #E8899D, #C96B80)', color: '#fff', padding: '32px 40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>KẾT QUẢ HƯỚNG NGHIỆP</h1>
            <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>Hệ thống AI Hướng Nghiệp Tương Lai</p>
          </div>
          <div style={{ padding: '20px 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#FEF7F9', borderRadius: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E' }}>{data.fullName}</div>
                <div style={{ fontSize: 14, color: '#5A5A6A' }}>Lớp {data.className}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#8A8A9A' }}>Ngày làm bài</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{new Date(data.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: RIASEC Scores */}
        <div data-pdf-section style={{ padding: '16px 40px', background: '#fff' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#C96B80', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #FDE8EE' }}>📊 ĐIỂM RIASEC — Mã: {topCode}</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {sortedRiasec.map(([key, value]) => {
              const info = RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO];
              const pct = Math.round((value / 35) * 100);
              return (
                <div key={key} style={{ flex: '1 1 calc(33% - 8px)', background: '#FAFAFA', borderRadius: 12, padding: '12px 16px', border: '1px solid #F0F0F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E' }}>{key} — {info.nameVi}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: info.color }}>{value}/35</span>
                  </div>
                  <div style={{ height: 8, background: '#E8E0E2', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: info.color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: RIASEC Profile */}
        {data.aiResult.riasecProfile && (
          <div data-pdf-section style={{ padding: '0 40px 16px', background: '#fff' }}>
            <div style={{ padding: '16px 20px', background: '#F8F4FF', borderRadius: 12, borderLeft: '4px solid #B896D6' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>🧠 Tính cách RIASEC</h3>
              <p style={{ fontSize: 13, color: '#4A4A5A', lineHeight: 1.7, margin: 0 }}>{data.aiResult.riasecProfile}</p>
            </div>
          </div>
        )}

        {/* Section: Careers Title */}
        <div data-pdf-section style={{ padding: '8px 40px', background: '#fff' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#C96B80', marginBottom: 0, paddingBottom: 8, borderBottom: '2px solid #FDE8EE' }}>🎯 TOP 5 NGÀNH NGHỀ PHÙ HỢP</h2>
        </div>

        {/* Section: Each Career Card (separate section for smart page breaks) */}
        {data.aiResult.topCareers.map((career, i) => (
          <div key={i} data-pdf-section style={{ padding: '8px 40px 8px', background: '#fff' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #F0F0F0' }}>
              <div style={{ background: `linear-gradient(135deg, ${careerBgColors[i]}20, ${careerBgColors[i]}08)`, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: careerBgColors[i], display: 'inline-block', lineHeight: '36px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 900 }}>{i + 1}</div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E' }}>{career.name}</span>
                </div>
                <div style={{ display: 'inline-block', height: 28, lineHeight: '28px', textAlign: 'center', background: careerBgColors[i], color: '#fff', padding: '0 14px', borderRadius: 20, fontSize: 14, fontWeight: 800 }}>{career.matchPercent}%</div>
              </div>
              <div style={{ padding: '14px 20px', background: '#fff' }}>
                <p style={{ fontSize: 13, color: '#4A4A5A', lineHeight: 1.7, marginBottom: 12 }}>{career.reason}</p>
                {career.relatedMajors?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#1A1A2E', marginBottom: 6 }}>🎓 Ngành đại học liên quan:</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {career.relatedMajors.map((m, j) => (
                        <span key={j} style={{ display: 'inline-block', height: 22, lineHeight: '22px', textAlign: 'center', padding: '0 10px', background: '#D4EEFF', color: '#5A9AB5', fontSize: 11, fontWeight: 700, borderRadius: 12 }}>{m}</span>
                      ))}
                    </div>
                  </div>
                )}
                {career.improvements?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#1A1A2E', marginBottom: 6 }}>⚡ Cần cải thiện:</div>
                    {career.improvements.map((imp, j) => (
                      <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: '#E8A838', fontSize: 11 }}>•</span>
                        <span style={{ fontSize: 12, color: '#5A5A6A', lineHeight: 1.5 }}>{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Section: Overall Analysis */}
        {data.aiResult.overallAnalysis && (
          <div data-pdf-section style={{ padding: '8px 40px 16px', background: '#fff' }}>
            <div style={{ padding: '16px 20px', background: '#FFFBF0', borderRadius: 12, borderLeft: '4px solid #E8B88A' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>💡 Phân tích tổng quan</h3>
              <p style={{ fontSize: 13, color: '#4A4A5A', lineHeight: 1.7, margin: 0 }}>{data.aiResult.overallAnalysis}</p>
            </div>
          </div>
        )}

        {/* Section: Footer */}
        <div data-pdf-section style={{ padding: '16px 40px', background: '#fff', textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #E8E0E2', paddingTop: 12 }}>
            <p style={{ fontSize: 11, color: '#8A8A9A', margin: 0 }}>© 2025 Hướng Nghiệp Tương Lai — Hệ thống AI hỗ trợ định hướng nghề nghiệp cho học sinh THPT</p>
          </div>
        </div>
      </div>

      {/* ===== Visible Result Page ===== */}
      <div className="relative z-10 pt-16 md:pt-24 pb-8 md:pb-12 px-3 md:px-4">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-6 animate-fade-in-up">
            <PartyPopper size={36} className="text-primary mx-auto mb-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-1">
              Chúc mừng, <span className="gradient-text">{data.fullName}</span>!
            </h1>
            <p className="text-sm text-text-secondary">Lớp {data.className} &bull; {new Date(data.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Chart */}
            <div className="glass-card p-4 md:p-6 animate-fade-in-up">
              <h2 className="text-base font-bold text-text-main mb-3 text-center flex items-center justify-center gap-2">
                <PieChart size={18} className="text-primary" /> Biểu đồ RIASEC
              </h2>
              <div className="h-56 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E8E0E2" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600, fill: '#1A1A2E' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 35]} tick={{ fontSize: 8, fill: '#8A8A9A' }} />
                    <Radar name="Điểm" dataKey="value" stroke="#E8899D" fill="#E8899D" fillOpacity={0.3} strokeWidth={2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-1">
                <span className="text-xs text-text-secondary">Mã RIASEC: </span>
                <span className="text-xl font-bold gradient-text">{topCode}</span>
              </div>
            </div>

            {/* Profile */}
            <div className="glass-card p-4 md:p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-base font-bold text-text-main mb-3 flex items-center gap-2">
                <UserRound size={18} className="text-primary" /> Tính cách RIASEC
              </h2>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-4">{data.aiResult.riasecProfile}</p>
              <div className="space-y-2.5">
                {sortedRiasec.map(([key, value]) => {
                  const info = RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO];
                  const RIcon = RIASEC_ICONS[key];
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-20 flex items-center gap-1">
                        <RIcon size={12} strokeWidth={2.5} />
                        <span className="text-[10px] md:text-xs font-bold text-text-main">{info.nameVi}</span>
                      </div>
                      <div className="flex-1"><Progress percent={Math.round((value / 35) * 100)} showInfo={false} strokeColor={info.color} railColor="#E8E0E2" size={['100%', 7]} /></div>
                      <span className="text-[10px] font-bold text-text-main w-8 text-right">{value}/35</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top 5 Careers */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-text-main mb-4 text-center flex items-center justify-center gap-2">
              <Target size={22} className="text-primary" /> Top 5 Ngành Nghề Phù Hợp
            </h2>
            <div className="space-y-3 stagger-children">
              {data.aiResult.topCareers.map((career, i) => {
                const CIcon = careerIcons[i];
                return (
                  <div key={i} className="glass-card p-4 md:p-6 hover-lift">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <div className="flex items-start gap-3 md:w-1/3">
                        <div className={`w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${gradientColors[i]} flex items-center justify-center flex-shrink-0 shadow-md text-white`}>
                          <CIcon size={22} strokeWidth={1.8} />
                        </div>
                        <div>
                          <div className="text-[10px] text-text-light font-semibold">#{i + 1}</div>
                          <h3 className="text-sm md:text-lg font-bold text-text-main">{career.name}</h3>
                          <div className="mt-1"><Progress type="circle" percent={career.matchPercent} size={42} strokeColor="#E8899D" format={(p) => <span className="text-[10px] font-bold">{p}%</span>} /></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-2">{career.reason}</p>
                        {career.relatedMajors?.length > 0 && (
                          <div className="mb-2">
                            <p className="text-[10px] md:text-xs font-bold text-text-main mb-1 flex items-center gap-1"><GraduationCap size={12} /> Ngành đại học liên quan:</p>
                            <div className="flex flex-wrap gap-1">{career.relatedMajors.map((m, j) => <span key={j} className="px-2 py-0.5 bg-secondary-light text-secondary-dark text-[10px] md:text-xs font-semibold rounded-full">{m}</span>)}</div>
                          </div>
                        )}
                        {career.improvements?.length > 0 && (
                          <div>
                            <p className="text-[10px] md:text-xs font-bold text-text-main mb-1 flex items-center gap-1"><PenLine size={12} /> Cần cải thiện:</p>
                            <div className="space-y-0.5">{career.improvements.map((imp, j) => (
                              <div key={j} className="flex items-start gap-1.5"><Zap size={10} className="text-warning mt-0.5 flex-shrink-0" /><span className="text-[10px] md:text-xs text-text-secondary">{imp}</span></div>
                            ))}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {data.aiResult.overallAnalysis && (
            <div className="glass-card p-5 md:p-8 mb-6 animate-fade-in-up">
              <h2 className="text-base font-bold text-text-main mb-3 flex items-center gap-2"><Lightbulb size={18} className="text-primary" /> Phân tích tổng quan</h2>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">{data.aiResult.overallAnalysis}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 animate-fade-in-up">
            <Button type="primary" size="large" onClick={handleExportPDF} loading={exporting} className="h-11 px-6 w-full sm:w-auto">
              {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} {exporting ? 'Đang tạo...' : 'Tải xuống PDF'}
            </Button>
            <Link href="/assessment"><Button size="large" className="h-11 px-5 w-full sm:w-auto"><RefreshCw size={16} /> Làm lại bài test</Button></Link>
            <Link href="/"><Button size="large" className="h-11 px-5 w-full sm:w-auto"><Home size={16} /> Trang chủ</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
