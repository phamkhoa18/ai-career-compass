'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Typography, Button } from 'antd';
import { UserOutlined, ClockCircleOutlined, PieChartOutlined, FireOutlined, DownloadOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import * as XLSX from 'xlsx';
import { RIASEC_GROUP_INFO } from '@/data/riasec-questions';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      } else {
        message.error('Không thể tải dữ liệu');
      }
    } catch (e) {
      message.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>;
  }

  const pieData = stats ? Object.entries(stats.riasecDistribution).map(([name, value]) => ({
    name: `${name} - ${RIASEC_GROUP_INFO[name as keyof typeof RIASEC_GROUP_INFO]?.nameVi || name}`,
    value,
    color: RIASEC_GROUP_INFO[name as keyof typeof RIASEC_GROUP_INFO]?.color || '#ccc'
  })) : [];

  const topRiasec = pieData.sort((a, b) => (b.value as number) - (a.value as number))[0];
  const topCareer = stats?.topCareers?.[0]?.name || 'Chưa có';

  const handleExportDashboard = () => {
    if (!stats) return message.warning('Chưa có dữ liệu để xuất');
    
    const wb = XLSX.utils.book_new();

    // Sheet 1: Tổng quan
    const overviewData = [
      { 'Chỉ số': 'Tổng Học Sinh', 'Giá trị': stats.totalStudents },
      { 'Chỉ số': 'Học Sinh Mới (Hôm Nay)', 'Giá trị': stats.todayStudents },
      { 'Chỉ số': 'Nhóm Nổi Bật (RIASEC)', 'Giá trị': topRiasec?.name?.split(' - ')[0] || 'N/A' },
      { 'Chỉ số': 'Ngành Hot Nhất', 'Giá trị': topCareer }
    ];
    const ws1 = XLSX.utils.json_to_sheet(overviewData);
    ws1['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws1, "TongQuan");

    // Sheet 2: Xu hướng
    const ws2 = XLSX.utils.json_to_sheet(stats.trendData);
    ws2['!cols'] = [{ wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws2, "XuHuong_7Ngay");

    // Sheet 3: Phân bố RIASEC
    const riasecData = Object.entries(stats.riasecDistribution).map(([key, val]) => ({
      'Nhóm Tính Cách': `${key} - ${RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO]?.nameVi || key}`,
      'Số lượng': val
    }));
    const ws3 = XLSX.utils.json_to_sheet(riasecData);
    ws3['!cols'] = [{ wch: 35 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws3, "PhanBo_RIASEC");

    // Sheet 4: Top Ngành Nghề
    const topCareersData = stats.topCareers.map((c: any, i: number) => ({
      'Thứ hạng': i + 1,
      'Ngành nghề': c.name,
      'Số lượt gợi ý': c.count
    }));
    const ws4 = XLSX.utils.json_to_sheet(topCareersData);
    ws4['!cols'] = [{ wch: 10 }, { wch: 50 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws4, "Top_NganhNghe");

    XLSX.writeFile(wb, `BaoCao_ThongKe_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="animate-fade-in-up">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Bảng Thống Kê Chuyên Sâu</Title>
          <Text type="secondary">Cái nhìn toàn cảnh về lưu lượng và xu hướng định hướng nghề nghiệp.</Text>
        </div>
        <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportDashboard} style={{ background: '#10b981', borderColor: '#10b981' }}>
          Xuất Báo Cáo
        </Button>
      </div>

      {/* ROW 1: KPIs */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Tổng Học Sinh</span>} value={stats?.totalStudents} prefix={<UserOutlined />} styles={{ content: { color: '#fff', fontWeight: 800 } }} />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 16, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Hôm Nay</span>} value={stats?.todayStudents} prefix={<ClockCircleOutlined />} styles={{ content: { color: '#fff', fontWeight: 800 } }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 16, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)' }}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Nhóm Nổi Bật</span>} value={topRiasec?.name?.split(' - ')[0] || 'N/A'} prefix={<PieChartOutlined />} styles={{ content: { color: '#fff', fontWeight: 800, fontSize: 24 } }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: 16, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' }}>
            <Statistic title={<span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Ngành Hot Nhất</span>} value={topCareer} prefix={<FireOutlined />} styles={{ content: { color: '#fff', fontWeight: 800, fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }} />
          </Card>
        </Col>
      </Row>

      {/* ROW 2: Traffic Trend */}
      <Card 
        title={<span style={{ fontWeight: 700, fontSize: 16 }}>Lưu lượng làm bài (7 Ngày Qua)</span>}
        variant="borderless" 
        style={{ marginBottom: 24, borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
      >
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.trendData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ROW 3: Distributions */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: 16 }}>Tỷ Lệ Nhóm Tính Cách (RIASEC)</span>}
            variant="borderless" 
            style={{ height: '100%', minHeight: 360, borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ fontWeight: 700, fontSize: 16 }}>Top 5 Ngành Gợi Ý Nhiều Nhất</span>}
            variant="borderless" 
            style={{ height: '100%', minHeight: 360, borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topCareers || []} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" width={110} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
