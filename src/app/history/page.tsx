'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Tag, Empty, message, Popconfirm } from 'antd';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import { ClipboardList, Search, Eye, Trash2, ArrowRight, PenLine } from 'lucide-react';

interface AssessmentListItem {
  _id: string; fullName: string; className: string; createdAt: string;
  aiResult?: { topCareers?: { name: string; matchPercent: number }[] };
}

export default function HistoryPage() {
  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => { fetchAssessments(); }, []);

  const fetchAssessments = async () => {
    try { 
      setLoading(true); 
      const storedHistory = JSON.parse(localStorage.getItem('my_assessments') || '[]');
      if (storedHistory.length === 0) {
        setAssessments([]);
        return;
      }
      const res = await fetch(`/api/assessment?ids=${storedHistory.join(',')}`); 
      if (res.ok) setAssessments(await res.json()); 
    }
    catch { messageApi.error('Không thể tải dữ liệu!'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try { 
      const res = await fetch(`/api/assessment/${id}`, { method: 'DELETE' }); 
      if (res.ok) { 
        // Remove from localStorage
        const storedHistory = JSON.parse(localStorage.getItem('my_assessments') || '[]');
        const updated = storedHistory.filter((storedId: string) => storedId !== id);
        localStorage.setItem('my_assessments', JSON.stringify(updated));

        messageApi.success('Đã xóa!'); 
        fetchAssessments(); 
      } 
    }
    catch { messageApi.error('Không thể xóa!'); }
  };

  const filtered = assessments.filter((a) => a.fullName.toLowerCase().includes(searchText.toLowerCase()) || a.className.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName', render: (t: string) => <span className="font-semibold text-xs md:text-sm">{t}</span> },
    { title: 'Lớp', dataIndex: 'className', key: 'className', width: 80, render: (t: string) => <Tag color="pink" className="font-semibold text-[10px]">{t}</Tag> },
    { title: 'Top ngành', key: 'top', responsive: ['md' as const], render: (_: unknown, r: AssessmentListItem) => { const t = r.aiResult?.topCareers?.[0]; return t ? <span className="text-xs font-semibold">{t.name} <span className="text-primary-dark">{t.matchPercent}%</span></span> : <span className="text-text-light text-xs">—</span>; } },
    { title: 'Ngày', dataIndex: 'createdAt', key: 'createdAt', width: 90, render: (t: string) => <span className="text-[10px] md:text-xs text-text-secondary">{new Date(t).toLocaleDateString('vi-VN')}</span> },
    { title: '', key: 'action', width: 120, render: (_: unknown, r: AssessmentListItem) => (
      <div className="flex gap-1.5">
        <Link href={`/result/${r._id}`}><Button type="primary" size="small" className="text-xs px-2"><Eye size={12} /> <span className="hidden sm:inline">Xem</span></Button></Link>
        <Popconfirm title="Xóa kết quả?" onConfirm={() => handleDelete(r._id)} okText="Xóa" cancelText="Hủy"><Button danger size="small" className="text-xs px-2"><Trash2 size={12} /></Button></Popconfirm>
      </div>
    ) },
  ];

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden has-bottom-nav">
      {contextHolder}
      <Navbar />
      <div className="blob w-64 h-64 bg-primary-light top-32 -left-16" />
      <div className="blob w-80 h-80 bg-secondary-light bottom-20 -right-24" />

      <div className="relative z-10 pt-16 md:pt-24 pb-8 px-3 md:px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 animate-fade-in-up">
            <ClipboardList size={36} className="text-primary mx-auto mb-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-1">Lịch sử bài test</h1>
            <p className="text-sm text-text-secondary">Xem lại tất cả kết quả đã thực hiện</p>
          </div>

          <div className="glass-card p-3 md:p-6 mb-4 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <Input placeholder="Tìm kiếm theo tên hoặc lớp..." prefix={<Search size={14} className="text-text-light" />}
                value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full sm:max-w-md" size="large" allowClear />
              <span className="text-xs text-text-secondary font-semibold">Tổng: <span className="text-primary-dark">{filtered.length}</span></span>
            </div>
          </div>

          <div className="glass-card p-2 md:p-4 animate-fade-in-up">
            {filtered.length === 0 && !loading ? (
              <Empty description={<span className="text-text-secondary text-sm">{searchText ? 'Không tìm thấy' : 'Chưa có bài test nào'}</span>}>
                <Link href="/assessment"><Button type="primary"><PenLine size={14} /> Làm bài test</Button></Link>
              </Empty>
            ) : (
              <Table dataSource={filtered} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 500 }} size="small" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
