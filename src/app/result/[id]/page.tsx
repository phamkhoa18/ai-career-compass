'use client';

import React, { useEffect, useState, useRef, useCallback, use } from 'react';
import { Button, Spin, message, Progress, Slider, Tag, Tooltip as AntTooltip } from 'antd';
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Navbar from '@/components/ui/Navbar';
import { RIASEC_ICONS } from '@/components/ui/riasec-icons';
import { RIASEC_GROUP_INFO } from '@/data/riasec-questions';
import { IAssessment, ICareerRecommendation } from '@/models/Assessment';
import {
  PartyPopper, PieChart, UserRound, Target, GraduationCap, Zap, Lightbulb, Download, RefreshCw,
  Home, Frown, Rocket, Briefcase, Star, Diamond, Loader2, TrendingUp, DollarSign,
  Compass, Flame, ShieldAlert, Cpu, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Sliders, Calendar, ExternalLink, Info, Award, BookOpen
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

type AssessmentData = Omit<IAssessment, keyof import('mongoose').Document> & { _id: string };

const careerIcons: LucideIcon[] = [Rocket, Briefcase, Target, Star, Diamond];
const gradientColors = [
  'from-rose-500 to-pink-600',
  'from-sky-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-violet-600'
];
const careerBgColors = ['#E8899D', '#7CB8CC', '#7CC9A8', '#E8B88A', '#B896D6'];

const RIASEC_MAX_SCORES: Record<string, number> = {
  R: 24,  // 6 questions × max 4
  I: 24,  // 6 questions × max 4
  A: 24,  // 6 questions × max 4
  S: 24,  // 6 questions × max 4
  E: 24,  // 6 questions × max 4
  C: 24,  // 6 questions × max 4
};

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // What-If Simulation State
  const [selectedCareerIndex, setSelectedCareerIndex] = useState<number>(0);
  const [simEnglishBoost, setSimEnglishBoost] = useState<number>(0); // +0 to +2 points
  const [simTechSkillsBoost, setSimTechSkillsBoost] = useState<number>(0); // +0 to +2 points
  const [simSoftSkillsBoost, setSimSoftSkillsBoost] = useState<number>(0); // +0 to +2 points

  useEffect(() => { fetchResult(); }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/assessment/${id}`);
      if (!res.ok) throw new Error();
      const resultData = await res.json();
      setData(resultData);
    } catch {
      messageApi.error('Không tìm thấy kết quả!');
    } finally {
      setLoading(false);
    }
  };

  // PDF Export logic
  const handleExportPDF = useCallback(async () => {
    if (!data || !data.aiResult || !printRef.current) return;
    setExporting(true);
    messageApi.loading({ content: 'Đang tạo báo cáo PDF Decision Support...', key: 'pdf', duration: 0 });

    try {
      const el = printRef.current;
      el.style.display = 'block';
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.top = '0';
      await new Promise((r) => setTimeout(r, 600));

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

        if (curY + imgH > pageH - margin && !isFirstPage) {
          pdf.addPage();
          curY = margin;
        }

        if (imgH > usableH) {
          const fullImgW = pageW - margin * 2;
          const ratio = fullImgW / canvas.width;
          let srcY = 0;
          const pxPerPage = usableH / ratio;

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
          curY += imgH + 2;
        }
        isFirstPage = false;
      }

      const totalPages = pdf.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Báo cáo Hướng nghiệp Decision Support System — Trang ${p}/${totalPages}`, pageW / 2, pageH - 3, { align: 'center' });
      }

      el.style.display = 'none';
      pdf.save(`Decision-Support-Career-${data.fullName.replace(/\s+/g, '-')}.pdf`);
      messageApi.success({ content: 'Tạo PDF báo cáo thành công!', key: 'pdf' });
    } catch (e) {
      console.error('PDF export error:', e);
      messageApi.error({ content: 'Không thể tạo PDF.', key: 'pdf' });
    } finally {
      setExporting(false);
    }
  }, [data, messageApi]);

  if (loading) return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
      <Spin size="large" />
      <p className="mt-4 text-text-secondary font-medium animate-pulse">Đang tổng hợp dữ liệu Decision Support System...</p>
    </div>
  );

  if (!data || !data.aiResult) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
        <Frown size={48} className="text-text-light mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-main mb-2">Không tìm thấy kết quả</h2>
        <p className="text-sm text-text-secondary mb-4">Bài test có thể chưa hoàn thành hoặc xảy ra lỗi lưu trữ.</p>
        <Link href="/assessment"><Button type="primary" size="large">Làm bài test mới</Button></Link>
      </div>
    </div>
  );

  const riasecEntries = Object.entries(data.riasecScores) as [string, number][];
  const sortedRiasec = [...riasecEntries].sort((a, b) => b[1] - a[1]);
  const topCode = sortedRiasec.slice(0, 3).map(([k]) => k).join('');
  const radarData = riasecEntries.map(([key, value]) => ({
    subject: RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO].nameVi,
    value,
    fullMark: RIASEC_MAX_SCORES[key] || 24
  }));

  const activeCareer: ICareerRecommendation = data.aiResult.topCareers[selectedCareerIndex] || data.aiResult.topCareers[0];

  // Calculate What-If Simulated CFI & Feasibility
  const simBoostTotal = simEnglishBoost * 3 + simTechSkillsBoost * 4 + simSoftSkillsBoost * 3;
  const currentCFI = activeCareer.cfi || activeCareer.matchPercent || 85;
  const currentFeasibility = activeCareer.feasibility || 80;
  const simCFI = Math.min(99, Math.round(currentCFI + simBoostTotal * 0.8));
  const simFeasibility = Math.min(99, Math.round(currentFeasibility + simBoostTotal * 0.6));

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden has-bottom-nav font-sans text-slate-800">
      {contextHolder}
      <Navbar />

      {/* Dynamic Ambient Background Elements */}
      <div className="blob w-96 h-96 bg-pink-200/40 top-10 -left-20 blur-3xl pointer-events-none" />
      <div className="blob w-[30rem] h-[30rem] bg-indigo-200/40 top-60 -right-32 blur-3xl pointer-events-none" />

      {/* ===== Hidden Print Layout for PDF (Decision Support Format) ===== */}
      <div ref={printRef} style={{ display: 'none', width: 800, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: '#1E293B', backgroundColor: '#FFFFFF' }}>
        {/* PDF Header */}
        <div data-pdf-section style={{ background: '#fff' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: '#fff', padding: '32px 40px', borderRadius: '0 0 16px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 11, letterSpacing: 1.5, color: '#38BDF8', textTransform: 'uppercase', fontWeight: 700 }}>Decision Support System Report</span>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 0', color: '#F8FAFC' }}>BÁO CÁO PHÂN TÍCH HƯỚNG NGHIỆP</h1>
              </div>
              <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 12 }}>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>Học sinh</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#38BDF8' }}>{data.fullName}</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: '#F1F5F9', borderRadius: 12, fontSize: 12 }}>
              <div><strong>Lớp:</strong> {data.className}</div>
              <div><strong>Mã RIASEC:</strong> <span style={{ color: '#0284C7', fontWeight: 800 }}>{topCode}</span></div>
              {data.mbtiResult && <div><strong>MBTI:</strong> <span style={{ color: '#7C3AED', fontWeight: 800 }}>{data.mbtiResult}</span></div>}
              <div><strong>Tài chính:</strong> {data.familyFinance}</div>
              <div><strong>Ngày thực hiện:</strong> {new Date(data.createdAt).toLocaleDateString('vi-VN')}</div>
            </div>
          </div>
        </div>

        {/* PDF RIASEC Profile */}
        <div data-pdf-section style={{ padding: '16px 40px', background: '#fff' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', borderBottom: '2px solid #E2E8F0', paddingBottom: 6, marginBottom: 12 }}>
            📊 HỒ SƠ TÍNH CÁCH & NĂNG LỰC CỐT LÕI
          </h2>
          <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>{data.aiResult.riasecProfile}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {sortedRiasec.map(([key, value]) => {
              const info = RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO];
              return (
                <div key={key} style={{ flex: '1 1 calc(33% - 8px)', background: '#F8FAFC', borderRadius: 8, padding: '8px 12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                    <span>{key} - {info.nameVi}</span>
                    <span style={{ color: info.color }}>{value}/{RIASEC_MAX_SCORES[key] || 24}</span>
                  </div>
                  <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (value / (RIASEC_MAX_SCORES[key] || 24)) * 100)}%`, background: info.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF Careers Title */}
        <div data-pdf-section style={{ padding: '8px 40px', background: '#fff' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', borderBottom: '2px solid #E2E8F0', paddingBottom: 6, margin: 0 }}>
            🎯 TOP NGÀNH NGHỀ PHÙ HỢP (CFI & KHẢ NĂNG THỰC HIỆN)
          </h2>
        </div>

        {/* PDF Individual Career Cards */}
        {data.aiResult.topCareers.map((career, i) => {
          const cfi = career.cfi || career.matchPercent || 85;
          const feasibility = career.feasibility || 80;
          return (
            <div key={i} data-pdf-section style={{ padding: '8px 40px 12px', background: '#fff' }}>
              <div style={{ border: '1px solid #CBD5E1', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: '#F8FAFC', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>#{i + 1} {career.name}</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 800 }}>
                      Fit (CFI): {cfi}%
                    </span>
                    <span style={{ background: '#ECFDF5', color: '#047857', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 800 }}>
                      Khả năng thực hiện: {feasibility}%
                    </span>
                  </div>
                </div>

                <div style={{ padding: '14px 16px', fontSize: 11, color: '#334155', lineHeight: 1.6 }}>
                  {/* Fit Reasons (Green / Yellow) */}
                  {career.fitReasons && (
                    <div style={{ marginBottom: 10, display: 'flex', gap: 12 }}>
                      <div style={{ flex: 1, background: '#F0FDF4', padding: '8px 12px', borderRadius: 8, border: '1px solid #DCFCE7' }}>
                        <div style={{ fontWeight: 700, color: '#15803D', marginBottom: 4 }}>🟢 Lý do phù hợp (Why Fit):</div>
                        {career.fitReasons.strengths?.map((s, idx) => (
                          <div key={idx} style={{ color: '#166534' }}>• {s}</div>
                        ))}
                      </div>
                      <div style={{ flex: 1, background: '#FEFCE8', padding: '8px 12px', borderRadius: 8, border: '1px solid #FEF08A' }}>
                        <div style={{ fontWeight: 700, color: '#A16207', marginBottom: 4 }}>🟡 Yếu tố cần lưu ý & Cân nhắc:</div>
                        {career.fitReasons.considerations?.map((c, idx) => (
                          <div key={idx} style={{ color: '#854D0E' }}>• {c}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Component Score Breakdown */}
                  {career.scoreBreakdown && (
                    <div style={{ marginBottom: 10, background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>📊 Phân Rã Điểm Thành Phần (CFI Component Breakdown):</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ flex: '1 1 30%', background: '#fff', padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          Học lực: <strong>{career.scoreBreakdown.academic}/100</strong>
                        </div>
                        <div style={{ flex: '1 1 30%', background: '#fff', padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          RIASEC: <strong>{career.scoreBreakdown.riasec}/100</strong>
                        </div>
                        <div style={{ flex: '1 1 30%', background: '#fff', padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          Kỹ năng: <strong>{career.scoreBreakdown.skills}/100</strong>
                        </div>
                        <div style={{ flex: '1 1 30%', background: '#fff', padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          Giá trị: <strong>{career.scoreBreakdown.careerValues}/100</strong>
                        </div>
                        <div style={{ flex: '1 1 30%', background: '#fff', padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          Sở thích: <strong>{career.scoreBreakdown.interests}/100</strong>
                        </div>
                        <div style={{ flex: '1 1 30%', background: '#fff', padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                          Mức độ phù hợp thị trường: <strong>{career.scoreBreakdown.marketDemand}/100</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Career Intelligence & Salary */}
                  {career.careerIntelligence && (
                    <div style={{ marginBottom: 10, background: '#F1F5F9', padding: '10px 12px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>💼 Trí Tuệ Nghề Nghiệp & Mức Lương:</div>
                      <div>• Mức lương Mới vào nghề: <strong>{career.careerIntelligence.salary?.entryLevel || 'N/A'}</strong> | 2–5 năm: <strong>{career.careerIntelligence.salary?.midLevel || 'N/A'}</strong> | Giàu kinh nghiệm: <strong>{career.careerIntelligence.salary?.seniorLevel || 'N/A'}</strong></div>
                      <div>• Nhân lực thị trường: <strong>{career.careerIntelligence.marketStatus || 'Cân bằng'}</strong> | Khu vực tập trung: {career.careerIntelligence.regionDemand || 'Toàn quốc'}</div>
                    </div>
                  )}

                  {/* Future Outlook & AI Impact & Risk Score */}
                  <div style={{ marginBottom: 10, display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, background: '#EFF6FF', padding: '8px 12px', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                      <div style={{ fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>📈 Career Future Outlook (5-10 năm):</div>
                      <div>• Triển vọng: {career.trendAnalysis?.futurePotential}</div>
                      <div>• Xu hướng tuyển dụng: {career.trendAnalysis?.recruitmentDemand}</div>
                    </div>
                    <div style={{ flex: 1, background: '#F5F3FF', padding: '8px 12px', borderRadius: 8, border: '1px solid #DDD6FE' }}>
                      <div style={{ fontWeight: 700, color: '#5B21B6', marginBottom: 4 }}>🤖 Tác động AI & Career Risk Score:</div>
                      <div>• Rủi ro tự động hóa: {career.aiImpact?.automationRisk || 'Trung bình'} (Risk: {career.riskScore?.level || 'Trung bình'})</div>
                      <div>• AI hỗ trợ: {career.aiImpact?.aiAugmentation || 'AI hỗ trợ tự động hóa'}</div>
                      <div>• Kỹ năng cốt lõi thời AI: {career.aiImpact?.criticalSkillsInAiEra?.join(', ')}</div>
                    </div>
                  </div>

                  {/* University Strategy (Dream - Match - Safe) */}
                  {career.universityStrategy && (
                    <div style={{ marginBottom: 10, background: '#FAF5FF', padding: '10px 12px', borderRadius: 8, border: '1px solid #F3E8FF' }}>
                      <div style={{ fontWeight: 700, color: '#6B21A8', marginBottom: 4 }}>🎓 Phương Án Chọn Trường Đại Học:</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#DB2777' }}>🚀 Trường mục tiêu:</strong>
                          {career.universityStrategy.dream?.map((u, uIdx) => (
                            <div key={uIdx}>• {u.name} ({u.targetScore})</div>
                          ))}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#4F46E5' }}>🎯 Trường phù hợp:</strong>
                          {career.universityStrategy.match?.map((u, uIdx) => (
                            <div key={uIdx}>• {u.name} ({u.targetScore})</div>
                          ))}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: '#059669' }}>🛡️ Phương án dự phòng:</strong>
                          {career.universityStrategy.safe?.map((u, uIdx) => (
                            <div key={uIdx}>• {u.name} ({u.targetScore})</div>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: '#7E22CE', marginTop: 4, fontStyle: 'italic' }}>
                        * {career.universityStrategy.admissionNote || 'Điểm chuẩn chỉ mang tính tham khảo và thay đổi theo từng năm.'}
                      </div>
                    </div>
                  )}

                  {/* Actionable Timeline Roadmap (0-3m, 3-6m, 6-12m, 1-3y, 3-5y) */}
                  {career.actionableRoadmap && (
                    <div style={{ marginBottom: 10, background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>🗺️ Lộ Trình Đào Tạo Chủ Động (Actionable Roadmap):</div>
                      <div>• <strong>0-3 tháng:</strong> {career.actionableRoadmap.m0_3?.join('; ')}</div>
                      <div>• <strong>3-6 tháng:</strong> {career.actionableRoadmap.m3_6?.join('; ')}</div>
                      <div>• <strong>6-12 tháng:</strong> {career.actionableRoadmap.m6_12?.join('; ')}</div>
                      <div>• <strong>1-3 năm:</strong> {career.actionableRoadmap.y1_3?.join('; ')}</div>
                      <div>• <strong>3-5 năm:</strong> {career.actionableRoadmap.y3_5?.join('; ')}</div>
                    </div>
                  )}

                  {/* Gap Analysis & Learning Resources */}
                  {career.gapResources?.length > 0 && (
                    <div style={{ background: '#FFFBEB', padding: '8px 12px', borderRadius: 8, border: '1px solid #FDE68A' }}>
                      <div style={{ fontWeight: 700, color: '#92400E', marginBottom: 4 }}>📚 Tài Nguyên Đào Tạo Khắc Phục Gap:</div>
                      {career.gapResources.map((g, gIdx) => (
                        <div key={gIdx} style={{ marginBottom: 2 }}>
                          • <strong style={{ color: '#B45309' }}>{g.gap}:</strong> {g.solution}
                          {g.resources?.map((r, rIdx) => (
                            <span key={rIdx} style={{ color: '#2563EB', marginLeft: 6 }}>[{r.title}]({r.url})</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* PDF Overall Analysis */}
        <div data-pdf-section style={{ padding: '8px 40px 16px', background: '#fff' }}>
          <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 10, borderLeft: '4px solid #0284C7' }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>💡 LỜI KHUYÊN PHÁT TRIỂN & TƯ DUY LÀM CHỦ TƯƠNG LAI</h3>
            <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.6, margin: 0 }}>{data.aiResult.overallAnalysis}</p>
          </div>
          <p style={{ fontSize: 9, color: '#94A3B8', marginTop: 12, textAlign: 'center' }}>
            * {data.aiResult.disclaimer || 'Dự báo dựa trên xu hướng dữ liệu, không phải dự đoán chắc chắn.'}
          </p>
        </div>
      </div>


      {/* ===== Visible Main Dashboard Layout ===== */}
      <div className="relative z-10 pt-16 md:pt-20 pb-16 px-4 max-w-7xl mx-auto">
        {/* Top Header Banner */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles size={14} className="text-indigo-600" />
            Decision Support System &bull; Phân tích dữ liệu đa chiều
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Báo Cáo Định Hướng Hướng Nghiệp <span className="gradient-text">{data.fullName}</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Hệ thống không chỉ phán xét "Bạn hợp nghề nào", mà phân tách chỉ số Phù hợp (CFI), Khả năng thực hiện, Tác động AI và xây dựng Lộ trình làm chủ tương lai.
          </p>
        </div>

        {/* Section 1: Top Overview Cards (RIASEC + Academic Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Radar Chart Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PieChart size={18} className="text-indigo-600" /> Biểu đồ RIASEC
                </h3>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                  Mã: {topCode}
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600, fill: '#475569' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 24]} tick={{ fontSize: 8, fill: '#94A3B8' }} />
                    <Radar name="Điểm" dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.35} strokeWidth={2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-around text-center text-xs">
              {sortedRiasec.slice(0, 3).map(([key, val]) => (
                <div key={key}>
                  <div className="font-bold text-slate-900">{key} ({val}/{RIASEC_MAX_SCORES[key] || 24})</div>
                  <div className="text-[10px] text-slate-500">{RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO].nameVi}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Personality & Strengths Profile */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserRound size={18} className="text-rose-500" /> Phân Tích Tính Cách Cốt Lõi
                </h3>
                <Tag color="purple" className="font-semibold rounded-md">MBTI: {data.mbtiResult || 'N/A'}</Tag>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                {data.aiResult.riasecProfile}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sortedRiasec.map(([key, value]) => {
                  const info = RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO];
                  const RIcon = RIASEC_ICONS[key];
                  return (
                    <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <RIcon size={13} style={{ color: info.color }} /> {key}
                        </span>
                        <span className="font-semibold text-slate-600">{value}/{RIASEC_MAX_SCORES[key] || 24}</span>
                      </div>
                      <Progress percent={Math.min(100, Math.round((value / (RIASEC_MAX_SCORES[key] || 24)) * 100))} showInfo={false} strokeColor={info.color} size="small" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap gap-4 justify-between">
              <span><strong>Học lực:</strong> Điểm TB ~ {(((data.academicScores || []).reduce((acc, curr) => acc + (curr.score || 0), 0)) / (data.academicScores?.length || 1)).toFixed(1)}/10</span>
              <span><strong>Tài chính:</strong> {data.familyFinance || 'Tiêu chuẩn'}</span>
              <span><strong>Định hướng:</strong> {(data.favoriteSubjects || []).slice(0, 3).join(', ') || 'Toàn diện'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Top Careers Selector (Tabs) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target size={22} className="text-indigo-600" /> Bảng Chỉ số Phù hợp Nghề nghiệp
              </h2>
              <p className="text-xs text-slate-500">Chọn từng ngành để xem chi tiết CFI, Khả năng thực hiện, Xu hướng AI và Lộ trình phát triển</p>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Top 5 ngành được AI chọn lựa cho {data.fullName}
            </div>
          </div>

          {/* Career Tabs (Mobile horizontally scrollable / Grid on desktop) */}
          <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {data.aiResult.topCareers.map((c, i) => {
              const isActive = selectedCareerIndex === i;
              const cfi = c.cfi || c.matchPercent || 85;
              const feasibility = c.feasibility || 80;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedCareerIndex(i)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 border flex-shrink-0 w-44 sm:w-auto relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-70 mb-1">NGÀNH #{i + 1}</div>
                  <div className="text-xs font-bold truncate mb-2">{c.name}</div>
                  <div className="flex items-center gap-1.5 text-[10px] md:text-[11px]">
                    <span className={`px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                      CFI {cfi}%
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                      {feasibility}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Career Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
            {/* Header of Active Career */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                  <Award size={14} /> Định hướng chuyên môn: {activeCareer.name}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{activeCareer.name}</h3>
                <p className="text-xs md:text-sm text-slate-500 max-w-3xl leading-relaxed">{activeCareer.jobDescription}</p>
              </div>

              {/* Big CFI & Feasibility Badges */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 self-start md:self-auto">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Career Fit (CFI)</div>
                  <div className="text-2xl font-black text-indigo-600">{activeCareer.cfi || activeCareer.matchPercent || 85}%</div>
                  <div className="text-[9px] text-slate-400">Phù hợp bản thân</div>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Khả năng thực hiện</div>
                  <div className="text-2xl font-black text-emerald-600">{activeCareer.feasibility || 80}%</div>
                  <div className="text-[9px] text-slate-400">Khả năng thực hiện</div>
                </div>
              </div>
            </div>

            {/* Grid Content for Active Career */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              
              {/* Left Column: Fit Breakdown & Green/Yellow Reasons */}
              <div className="space-y-6 lg:col-span-1">
                {/* Green & Yellow Fit Reasons */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Lý Do Phù Hợp & Cân Nhắc
                  </h4>

                  {/* Strengths 🟢 */}
                  <div className="space-y-1.5">
                    {activeCareer.fitReasons?.strengths?.map((str, idx) => (
                      <div key={idx} className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 font-medium leading-relaxed">
                        {str.startsWith('🟢') ? str : `🟢 ${str}`}
                      </div>
                    ))}
                  </div>

                  {/* Considerations 🟡 */}
                  <div className="space-y-1.5">
                    {activeCareer.fitReasons?.considerations?.map((con, idx) => (
                      <div key={idx} className="p-2 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900 font-medium leading-relaxed">
                        {con.startsWith('🟡') || con.startsWith('🔴') ? con : `🟡 ${con}`}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Component Score Breakdown */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                    <Sliders size={14} className="text-indigo-600" /> Phân Rã Điểm Thành Phần
                  </h4>
                  {activeCareer.scoreBreakdown && (
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between mb-1 font-semibold text-slate-700">
                          <span>Học lực phù hợp</span>
                          <span>{activeCareer.scoreBreakdown.academic}%</span>
                        </div>
                        <Progress percent={activeCareer.scoreBreakdown.academic} showInfo={false} strokeColor="#6366F1" size="small" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 font-semibold text-slate-700">
                          <span>Tương thích RIASEC</span>
                          <span>{activeCareer.scoreBreakdown.riasec}%</span>
                        </div>
                        <Progress percent={activeCareer.scoreBreakdown.riasec} showInfo={false} strokeColor="#EC4899" size="small" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 font-semibold text-slate-700">
                          <span>Kỹ năng mềm sẵn có</span>
                          <span>{activeCareer.scoreBreakdown.skills}%</span>
                        </div>
                        <Progress percent={activeCareer.scoreBreakdown.skills} showInfo={false} strokeColor="#10B981" size="small" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 font-semibold text-slate-700">
                          <span>Mức độ phù hợp thị trường</span>
                          <span>{activeCareer.scoreBreakdown.marketDemand}%</span>
                        </div>
                        <Progress percent={activeCareer.scoreBreakdown.marketDemand} showInfo={false} strokeColor="#F59E0B" size="small" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Required Skills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Kỹ năng cốt lõi cần có</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCareer.requiredSkills?.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column: Career Intelligence, Salary & AI Impact */}
              <div className="space-y-6 lg:col-span-1">
                {/* Salary Roadmap */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <DollarSign size={16} /> Thu Nhập Theo Kinh Nghiệm
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                      <span className="text-slate-400">Mới ra trường (Entry):</span>
                      <span className="font-extrabold text-emerald-400">{activeCareer.careerIntelligence?.salary?.entryLevel || '10-15 triệu'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-700/60">
                      <span className="text-slate-400">2 - 5 năm kinh nghiệm:</span>
                      <span className="font-extrabold text-indigo-300">{activeCareer.careerIntelligence?.salary?.midLevel || '20-35 triệu'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Chuyên gia (Senior):</span>
                      <span className="font-extrabold text-pink-400">{activeCareer.careerIntelligence?.salary?.seniorLevel || '40-60+ triệu'}</span>
                    </div>
                  </div>
                </div>

                {/* AI Impact & Risk Score */}
                <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                      <Cpu size={16} className="text-sky-600" /> Tác Động AI & Rủi Ro Nghề
                    </h4>
                    <Tag color={activeCareer.riskScore?.level === 'Thấp' ? 'green' : activeCareer.riskScore?.level === 'Cao' ? 'red' : 'gold'}>
                      Rủi ro: {activeCareer.riskScore?.level || 'Trung bình'}
                    </Tag>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Cảnh báo tự động hóa:</strong> {activeCareer.aiImpact?.automationRisk || 'Một số tác vụ lặp lại có thể bị AI thay thế.'}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Hỗ trợ từ AI:</strong> {activeCareer.aiImpact?.aiAugmentation || 'AI hỗ trợ tăng năng suất công việc.'}
                  </p>
                  {activeCareer.aiImpact?.criticalSkillsInAiEra?.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-sky-900 mb-1">Kỹ năng quan trọng thời đại AI:</div>
                      <div className="flex flex-wrap gap-1">
                        {activeCareer.aiImpact.criticalSkillsInAiEra.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white text-sky-700 text-[10px] font-medium rounded border border-sky-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recruitment Demand Trend */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-emerald-600" /> Nhu Cầu Nhân Lực Thị Trường
                  </h4>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500">Trạng thái:</span>
                    <span className="font-bold text-slate-900">{activeCareer.careerIntelligence?.marketStatus || 'Thiếu hụt'}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {activeCareer.trendAnalysis?.futurePotential}
                  </p>
                  <div className="text-[10px] text-slate-400 italic">
                    * {data.aiResult.disclaimer}
                  </div>
                </div>
              </div>

              {/* Right Column: University Strategy (Dream / Match / Safe) & Actionable Roadmap */}
              <div className="space-y-6 lg:col-span-1">
                {/* University Strategy Strategy (Dream - Match - Safe) */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <GraduationCap size={16} className="text-indigo-600" /> Trường ĐH Chọn Lựa
                  </h4>

                  {/* Dream */}
                  <div>
                    <div className="text-[11px] font-bold text-pink-600 flex items-center gap-1 mb-1">
                      🚀 Trường mục tiêu:
                    </div>
                    {activeCareer.universityStrategy?.dream?.map((u, idx) => (
                      <div key={idx} className="text-xs bg-white p-2 rounded-lg border border-slate-200 mb-1 flex justify-between">
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        <span className="text-pink-600 font-bold">{u.targetScore}</span>
                      </div>
                    ))}
                  </div>

                  {/* Match */}
                  <div>
                    <div className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 mb-1">
                      🎯 Trường phù hợp:
                    </div>
                    {activeCareer.universityStrategy?.match?.map((u, idx) => (
                      <div key={idx} className="text-xs bg-white p-2 rounded-lg border border-slate-200 mb-1 flex justify-between">
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        <span className="text-indigo-600 font-bold">{u.targetScore}</span>
                      </div>
                    ))}
                  </div>

                  {/* Safe */}
                  <div>
                    <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mb-1">
                      🛡️ Phương án dự phòng:
                    </div>
                    {activeCareer.universityStrategy?.safe?.map((u, idx) => (
                      <div key={idx} className="text-xs bg-white p-2 rounded-lg border border-slate-200 mb-1 flex justify-between">
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        <span className="text-emerald-600 font-bold">{u.targetScore}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-1">
                    {activeCareer.universityStrategy?.admissionNote || 'Điểm chuẩn chỉ mang tính tham khảo và thay đổi theo từng năm.'}
                  </p>
                </div>

                {/* Actionable Timeline Roadmap */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <Compass size={16} className="text-indigo-600" /> Lộ Trình Đào Tạo 5 Mốc Thời Gian
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="border-l-2 border-indigo-400 pl-2.5">
                      <div className="font-bold text-indigo-900">0 - 3 tháng ngắn hạn:</div>
                      <div className="text-slate-600">{activeCareer.actionableRoadmap?.m0_3?.join('; ')}</div>
                    </div>
                    <div className="border-l-2 border-indigo-400 pl-2.5">
                      <div className="font-bold text-indigo-900">3 - 6 tháng:</div>
                      <div className="text-slate-600">{activeCareer.actionableRoadmap?.m3_6?.join('; ')}</div>
                    </div>
                    <div className="border-l-2 border-indigo-400 pl-2.5">
                      <div className="font-bold text-indigo-900">6 - 12 tháng:</div>
                      <div className="text-slate-600">{activeCareer.actionableRoadmap?.m6_12?.join('; ')}</div>
                    </div>
                    <div className="border-l-2 border-indigo-400 pl-2.5">
                      <div className="font-bold text-indigo-900">1 - 3 năm (Thi ĐH & Chứng chỉ):</div>
                      <div className="text-slate-600">{activeCareer.actionableRoadmap?.y1_3?.join('; ')}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Targeted Learning Resources (Closing Gap) */}
            {activeCareer.gapResources?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-600" /> Kho Tài Nguyên Đào Tạo Để Khắc Phục Điểm Yếu (Gap Analysis)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCareer.gapResources.map((gapItem, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-xs font-bold text-rose-600">Gap: {gapItem.gap}</div>
                      <div className="text-xs text-slate-700 leading-relaxed font-medium">{gapItem.solution}</div>
                      {gapItem.resources?.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline truncate"
                        >
                          <ExternalLink size={12} /> {res.title}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Interactive What-If Simulation Module */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                <Sliders size={14} /> Giả Lập Phát Triển Năng Lực (What-If Simulator)
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Nếu bạn nỗ lực cải thiện năng lực thì sao?</h3>
              <p className="text-xs text-slate-400">Thử kéo các thanh năng lực bên dưới để mô phỏng sự thay đổi của chỉ số CFI và Khả năng thực hiện!</p>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl text-right border border-slate-700">
              <span className="text-xs text-slate-400 block">Đang giả lập cho ngành:</span>
              <span className="text-sm font-bold text-indigo-300">{activeCareer.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-300">Nâng trình Tiếng Anh (+IELTS/Chuyên ngành):</span>
                  <span className="text-indigo-400 font-bold">+{simEnglishBoost} điểm</span>
                </div>
                <Slider min={0} max={2} step={0.5} value={simEnglishBoost} onChange={(v) => setSimEnglishBoost(v)} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-300">Nâng Kỹ năng Chuyên môn/Công nghệ:</span>
                  <span className="text-emerald-400 font-bold">+{simTechSkillsBoost} điểm</span>
                </div>
                <Slider min={0} max={2} step={0.5} value={simTechSkillsBoost} onChange={(v) => setSimTechSkillsBoost(v)} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-slate-300">Nâng Kỹ năng Giao tiếp & Thuyết trình:</span>
                  <span className="text-pink-400 font-bold">+{simSoftSkillsBoost} điểm</span>
                </div>
                <Slider min={0} max={2} step={0.5} value={simSoftSkillsBoost} onChange={(v) => setSimSoftSkillsBoost(v)} />
              </div>
            </div>

            {/* Simulation Results Display */}
            <div className="md:col-span-2 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-around gap-6">
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Chỉ Số Fit (CFI) Thay Đổi</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl font-bold text-slate-400">{currentCFI}%</span>
                  <ArrowRight size={18} className="text-indigo-400" />
                  <span className="text-3xl font-black text-indigo-400 animate-pulse">{simCFI}%</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mt-1">
                  ↑ Tăng +{simCFI - currentCFI}% điểm phù hợp!
                </div>
              </div>

              <div className="w-px h-12 bg-slate-700 hidden sm:block" />

              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Khả năng thực hiện</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl font-bold text-slate-400">{currentFeasibility}%</span>
                  <ArrowRight size={18} className="text-emerald-400" />
                  <span className="text-3xl font-black text-emerald-400 animate-pulse">{simFeasibility}%</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mt-1">
                  ↑ Tăng +{simFeasibility - currentFeasibility}% cơ hội thành công!
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-center">
            💡 <strong>Thông điệp:</strong> Tương lai không cố định. Khi bạn chủ động rèn luyện thêm kỹ năng, xác suất thành công và mức độ phù hợp với ngành mơ ước sẽ tăng lên đáng kể!
          </div>
        </div>

        {/* Section 4: Overall Advice & Actions */}
        {data.aiResult.overallAnalysis && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80 mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-500" /> Lời Khuyên Phát Triển Từ Hệ Thống AI Hướng Nghiệp
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {data.aiResult.overallAnalysis}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Button
            type="primary"
            size="large"
            onClick={handleExportPDF}
            loading={exporting}
            className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-sm shadow-md"
          >
            {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {exporting ? 'Đang tạo báo cáo...' : 'Tải xuống Báo cáo PDF (Decision Support)'}
          </Button>

          <Link href="/assessment">
            <Button size="large" className="h-12 px-6 rounded-2xl border-slate-300 font-bold text-sm">
              <RefreshCw size={18} /> Làm bài test mới
            </Button>
          </Link>

          <Link href="/">
            <Button size="large" className="h-12 px-6 rounded-2xl border-slate-300 font-bold text-sm">
              <Home size={18} /> Trang chủ
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
