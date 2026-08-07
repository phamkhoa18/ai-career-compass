'use client';

import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Spin, message, Typography, Space, Input, Drawer, Descriptions, Progress, Divider, Row, Col } from 'antd';
import { DownloadOutlined, FilePdfOutlined, SearchOutlined, EyeOutlined, ExportOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RIASEC_GROUP_INFO } from '@/data/riasec-questions';
import { MAX_MBTI_SCORES } from '@/utils/mbti';
import { interestOptions, softSkillsList, careerValuesList } from '@/data/subjects';

const softSkillNames: Record<string, string> = {
  communication: 'Giao tiếp', teamwork: 'Làm việc nhóm', problemSolving: 'Giải quyết vấn đề',
  leadership: 'Lãnh đạo', timeManagement: 'Quản lý thời gian', creativity: 'Sáng tạo',
  criticalThinking: 'Tư duy phản biện', adaptability: 'Thích ứng',
};

const careerValueNames: Record<string, string> = {
  income: 'Thu nhập cao', stability: 'Ổn định công việc', creativity: 'Tính sáng tạo',
  socialImpact: 'Đóng góp xã hội', workLifeBalance: 'Cân bằng cuộc sống', advancement: 'Cơ hội thăng tiến',
};

const { Title, Text, Paragraph } = Typography;

interface Student {
  _id: string;
  fullName: string;
  className: string;
  createdAt: string;
  topCode: string;
  topCareer: string;
  riasecScores?: Record<string, number>;
  academicScores?: { subject: string; subjectKey: string; score: number }[];
  topCareers?: { name: string; matchPercent: number; reason: string }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  
  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
      } else {
        messageApi.error('Không thể tải dữ liệu');
      }
    } catch (e) {
      messageApi.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (id: string) => {
    setSelectedStudentId(id);
    setDrawerVisible(true);
    setDetailsLoading(true);
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentDetails(data.student);
      } else {
        messageApi.error('Không thể lấy thông tin học sinh');
      }
    } catch (e) {
      messageApi.error('Lỗi kết nối');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => {
      setStudentDetails(null);
      setSelectedStudentId(null);
    }, 300);
  };

  const handleExportExcel = () => {
    if (!students.length) return messageApi.warning('Không có dữ liệu để xuất!');
    
    const exportData = students.map((s, i) => {
      const row: any = {
        'STT': i + 1,
        'Họ và Tên': s.fullName,
        'Lớp': s.className,
        'Ngày làm bài': new Date(s.createdAt).toLocaleString('vi-VN'),
        'Điểm Học Tập': s.academicScores?.map(a => `${a.subject}: ${a.score}`).join(', ') || 'Chưa có',
        'Điểm R': s.riasecScores?.['R'] || 0,
        'Điểm I': s.riasecScores?.['I'] || 0,
        'Điểm A': s.riasecScores?.['A'] || 0,
        'Điểm S': s.riasecScores?.['S'] || 0,
        'Điểm E': s.riasecScores?.['E'] || 0,
        'Điểm C': s.riasecScores?.['C'] || 0,
        'Mã RIASEC': s.topCode,
      };

      // Thêm 5 Ngành
      for (let j = 0; j < 5; j++) {
        row[`Ngành Top ${j + 1}`] = s.topCareers?.[j] ? `${s.topCareers[j].name} (${s.topCareers[j].matchPercent}%)` : '';
      }

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-width
    const cols = [
      { wch: 5 },   // STT
      { wch: 25 },  // Họ và Tên
      { wch: 12 },  // Lớp
      { wch: 22 },  // Ngày
      { wch: 40 },  // Điểm Học Tập
      { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, // R I A S E C
      { wch: 15 },  // Mã RIASEC
      { wch: 45 }, { wch: 45 }, { wch: 45 }, { wch: 45 }, { wch: 45 } // Top 1 -> 5
    ];

    ws['!cols'] = cols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachHocSinh");
    XLSX.writeFile(wb, `DanhSachHocSinh_ChiTiet_${new Date().getTime()}.xlsx`);
  };

  const handleExportPDF = async () => {
    if (!students.length) return messageApi.warning('Không có dữ liệu để xuất!');
    
    const hideLoading = messageApi.loading('Đang khởi tạo PDF...', 0);
    
    try {
      const doc = new jsPDF();
      
      // Fetch Unicode Font (Roboto) from Google Fonts
      const fontUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf';
      const fontResponse = await fetch(fontUrl);
      const fontBuffer = await fontResponse.arrayBuffer();
      
      // Convert buffer to base64
      let binary = '';
      const bytes = new Uint8Array(fontBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const fontBase64 = window.btoa(binary);

      doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      doc.setFont('Roboto');

      doc.setFontSize(14);
      doc.text("DANH SÁCH HỌC SINH HƯỚNG NGHIỆP", 14, 20);
      
      const tableColumn = ["STT", "HỌ VÀ TÊN", "LỚP", "NGÀY LÀM BÀI", "RIASEC", "NGÀNH PHÙ HỢP NHẤT"];
      const tableRows = students.map((s, i) => {
        const topCareersText = s.topCareers?.slice(0,3).map(c => `${c.name} (${c.matchPercent}%)`).join('\n') || '';
        return [
          i + 1,
          s.fullName, // Giữ nguyên tiếng Việt có dấu
          s.className,
          new Date(s.createdAt).toLocaleDateString('vi-VN'),
          s.topCode,
          topCareersText
        ];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        styles: { font: 'Roboto', fontStyle: 'normal', fontSize: 9, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: { 5: { cellWidth: 70 } },
        headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [22, 119, 255] }
      });
      
      doc.save(`DanhSachHocSinh_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Lỗi xuất PDF', error);
      messageApi.error('Đã xảy ra lỗi khi tạo file PDF');
    } finally {
      hideLoading();
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    s.className.toLowerCase().includes(searchText.toLowerCase()) ||
    s.topCode.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
      sorter: (a: Student, b: Student) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
      filters: Array.from(new Set(students.map(s => s.className))).map(c => ({ text: c, value: c })),
      onFilter: (value: boolean | React.Key, record: Student) => record.className === value,
    },
    {
      title: 'Ngày làm',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
      sorter: (a: Student, b: Student) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Mã RIASEC',
      dataIndex: 'topCode',
      key: 'topCode',
      render: (code: string) => <Tag color="geekblue" style={{ fontWeight: 'bold', letterSpacing: 1 }}>{code}</Tag>,
    },
    {
      title: 'Ngành phù hợp nhất',
      dataIndex: 'topCareers',
      key: 'topCareers',
      render: (careers: any[]) => {
        if (!careers || careers.length === 0) return <Text type="secondary">Chưa có</Text>;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {careers.slice(0, 3).map((c, idx) => (
              <Tag key={idx} color={idx === 0 ? 'green' : 'blue'} style={{ margin: 0, whiteSpace: 'normal', height: 'auto', padding: '2px 8px' }}>
                {c.name} ({c.matchPercent}%)
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: Student) => (
        <Button 
          type="text" 
          icon={<EyeOutlined style={{ color: '#1677ff' }} />} 
          onClick={() => fetchStudentDetails(record._id)}
          title="Xem chi tiết"
        />
      ),
    },
  ];

  const renderRiasecProgress = (scores: Record<string, number>) => {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const maxScore = sorted[0]?.[1] || 1; // Prevent division by zero
    
    return sorted.map(([key, val]) => {
      const info = RIASEC_GROUP_INFO[key as keyof typeof RIASEC_GROUP_INFO];
      const percent = Math.round((val / maxScore) * 100);
      return (
        <div key={key} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text strong>{info.nameVi} ({key})</Text>
            <Text type="secondary">{val} điểm</Text>
          </div>
          <Progress percent={percent} showInfo={false} strokeColor={info.color} />
        </div>
      );
    });
  };

  const renderMbtiProgress = (scores: Record<string, number>, resultCode?: string) => {
    if (!scores || Object.keys(scores).length === 0) return null;
    const pairs = [
      { left: 'E', right: 'I', leftName: 'Hướng ngoại', rightName: 'Hướng nội', total: MAX_MBTI_SCORES.E, color: '#3b82f6' },
      { left: 'S', right: 'N', leftName: 'Cảm giác', rightName: 'Trực giác', total: MAX_MBTI_SCORES.S, color: '#10b981' },
      { left: 'T', right: 'F', leftName: 'Lý trí', rightName: 'Cảm xúc', total: MAX_MBTI_SCORES.T, color: '#8b5cf6' },
      { left: 'J', right: 'P', leftName: 'Nguyên tắc', rightName: 'Linh hoạt', total: MAX_MBTI_SCORES.J, color: '#f59e0b' },
    ];

    return (
      <div style={{ marginTop: 24, padding: '16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0 }}>Chỉ số MBTI</Title>
          <Tag color="purple" style={{ margin: 0, fontSize: 14, fontWeight: 'bold' }}>{resultCode || 'Chưa có'}</Tag>
        </div>
        {pairs.map(pair => {
          const leftScore = scores[pair.left] || 0;
          const rightScore = scores[pair.right] || 0;
          const percent = Math.round((leftScore / pair.total) * 100);
          
          return (
            <div key={pair.left} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text strong style={{ fontSize: 12, color: leftScore >= rightScore ? pair.color : '#94a3b8' }}>
                  {pair.leftName} ({pair.left}): {leftScore}
                </Text>
                <Text strong style={{ fontSize: 12, color: rightScore > leftScore ? pair.color : '#94a3b8' }}>
                  {rightScore} :{pair.rightName} ({pair.right})
                </Text>
              </div>
              <Progress 
                percent={percent} 
                showInfo={false} 
                strokeColor={pair.color}
                trailColor="#cbd5e1"
                size="small"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up">
      {contextHolder}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Danh Sách Học Sinh</Title>
          <Text type="secondary">Quản lý chi tiết toàn bộ hồ sơ hướng nghiệp, tìm kiếm và phân trang.</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
            Xuất Excel
          </Button>
          <Button type="primary" icon={<FilePdfOutlined />} onClick={handleExportPDF}>
            Xuất PDF
          </Button>
        </Space>
      </div>

      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ marginBottom: 16 }}>
          <Input 
            placeholder="Tìm kiếm theo tên, lớp, mã RIASEC..." 
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />} 
            style={{ width: '100%', maxWidth: 320, borderRadius: 12, padding: '8px 12px' }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        <Table 
          dataSource={filteredStudents} 
          columns={columns} 
          rowKey="_id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} học sinh`
          }}
          scroll={{ x: 'max-content' }}
          loading={loading}
          bordered={false}
          size="middle"
        />
      </Card>

      {/* Drawer Chi tiết học sinh */}
      <Drawer
        title={<span style={{ fontSize: 18, fontWeight: 700 }}>Hồ Sơ Hướng Nghiệp Chi Tiết</span>}
        size="large"
        onClose={closeDrawer}
        open={drawerVisible}
        extra={
          <Button 
            type="primary" 
            icon={<ExportOutlined />} 
            onClick={() => window.open(`/result/${selectedStudentId}`, '_blank')}
            disabled={!studentDetails}
          >
            Mở trang kết quả
          </Button>
        }
      >
        {detailsLoading ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        ) : studentDetails ? (
          <div style={{ paddingBottom: 48 }}>
            <Title level={4} style={{ marginTop: 0 }}>1. Thông tin cá nhân</Title>
            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Họ và tên">{studentDetails.fullName}</Descriptions.Item>
              <Descriptions.Item label="Lớp">{studentDetails.className}</Descriptions.Item>
              <Descriptions.Item label="Thời gian test" span={2}>{new Date(studentDetails.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>2. Điểm học tập nổi bật</Title>
            <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {studentDetails.academicScores?.map((subject: any) => (
                <Tag 
                  key={subject.subjectKey} 
                  color={subject.score >= 8 ? 'success' : subject.score >= 6.5 ? 'processing' : 'error'}
                  style={{ fontSize: 14, padding: '4px 12px', borderRadius: 16 }}
                  icon={subject.score >= 8 ? <CheckCircleFilled /> : (subject.score < 6.5 ? <CloseCircleFilled /> : undefined)}
                >
                  {subject.subject}: {subject.score}
                </Tag>
              ))}
              <Tag 
                color="purple"
                style={{ fontSize: 14, padding: '4px 12px', borderRadius: 16 }}
              >
                MBTI: {studentDetails.mbtiResult ? studentDetails.mbtiResult : `${studentDetails.mbtiAnswers?.filter((a: string) => a).length || 0}/70 câu`}
              </Tag>
            </div>

            {/* Tài chính gia đình */}
            {studentDetails.familyFinance && (
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Điều kiện tài chính:</Text>
                <Tag color="gold" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 12 }}>
                  {studentDetails.familyFinance}
                </Tag>
              </div>
            )}

            {/* Môn yêu thích */}
            {studentDetails.favoriteSubjects?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Môn yêu thích:</Text>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {studentDetails.favoriteSubjects.map((sub: string) => (
                    <Tag key={sub} color="magenta" style={{ margin: 0, borderRadius: 12 }}>{sub}</Tag>
                  ))}
                </div>
              </div>
            )}

            {/* Môn năng khiếu */}
            {studentDetails.aptitudeSubjects?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>Môn năng khiếu / Thể chất:</Text>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {studentDetails.aptitudeSubjects.map((sub: any) => (
                    <Tag key={sub.subjectKey} color={sub.isLiked ? 'green' : 'default'} style={{ margin: 0, borderRadius: 12 }}>
                      {sub.subject}: {sub.isLiked ? '👍 Thích' : '👎 Không thích'}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <Divider />

            <Row gutter={32}>
              <Col xs={24} md={12}>
                <Title level={4}>3. Bản đồ tính cách RIASEC</Title>
                <div style={{ paddingRight: 16 }}>
                  {renderRiasecProgress(studentDetails.riasecScores || {})}
                  {renderMbtiProgress(studentDetails.mbtiScores || {}, studentDetails.mbtiResult)}
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <Title level={4}>4. Gợi ý Ngành nghề từ AI</Title>
                {studentDetails.aiResult?.topCareers?.map((career: any, index: number) => (
                  <Card key={index} size="small" style={{ marginBottom: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 16, color: '#0f172a' }}>{career.name}</Text>
                      <Tag color="blue" style={{ borderRadius: 12, margin: 0 }}>{career.matchPercent}% Phù hợp</Tag>
                    </div>
                    <Paragraph type="secondary" style={{ marginBottom: 12, fontSize: 13 }}>
                      {career.reason}
                    </Paragraph>
                    {career.requiredSkills?.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 4 }}>Kỹ năng cần có:</Text>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {career.requiredSkills.map((s: string, i: number) => (
                            <Tag key={i} color="purple" style={{ margin: 0, borderRadius: 12 }}>{s}</Tag>
                          ))}
                        </div>
                      </div>
                    )}
                    {career.educationPath?.topUniversities?.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: 13, color: '#475569', display: 'block', marginBottom: 4 }}>Trường tham khảo:</Text>
                        <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, color: '#64748b' }}>
                          {career.educationPath.topUniversities.map((uni: string, i: number) => (
                            <li key={i}>{uni}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {career.educationPath?.admissionScoreTrend && (
                      <div style={{ marginTop: 4 }}>
                        <Text style={{ fontSize: 13, color: '#059669' }}>
                          <span style={{ fontWeight: 600 }}>Điểm chuẩn:</span> {career.educationPath.admissionScoreTrend}
                        </Text>
                      </div>
                    )}
                  </Card>
                ))}

                {/* Sở thích */}
                {studentDetails.interests?.length > 0 && (
                  <div style={{ marginTop: 24, padding: '16px', background: '#fdf2f8', borderRadius: 12, border: '1px solid #fce7f3' }}>
                    <Title level={5} style={{ margin: '0 0 8px 0', color: '#be185d' }}>💖 Sở thích</Title>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {studentDetails.interests.map((key: string) => {
                        const opt = interestOptions.find(o => o.key === key);
                        return (
                          <Tag key={key} color="pink" style={{ margin: 0, borderRadius: 12, fontSize: 12 }}>
                            {opt ? opt.label : key}
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Kỹ năng mềm */}
                {studentDetails.softSkills && (
                  <div style={{ marginTop: 16, padding: '16px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #dcfce7' }}>
                    <Title level={5} style={{ margin: '0 0 8px 0', color: '#15803d' }}>⚡ Kỹ năng mềm</Title>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {Object.entries(studentDetails.softSkills).map(([key, val]) => (
                        <Tag key={key} color={Number(val) >= 4 ? 'green' : Number(val) >= 3 ? 'blue' : 'orange'} style={{ margin: 0, borderRadius: 12, fontSize: 12 }}>
                          {softSkillNames[key] || key}: {String(val)}/5
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                {/* Giá trị nghề nghiệp */}
                {studentDetails.careerValues && (
                  <div style={{ marginTop: 16, padding: '16px', background: '#fffbeb', borderRadius: 12, border: '1px solid #fef3c7' }}>
                    <Title level={5} style={{ margin: '0 0 8px 0', color: '#b45309' }}>🎯 Giá trị nghề nghiệp</Title>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {Object.entries(studentDetails.careerValues).map(([key, val]) => (
                        <Tag key={key} color={Number(val) >= 4 ? 'gold' : Number(val) >= 3 ? 'cyan' : 'default'} style={{ margin: 0, borderRadius: 12, fontSize: 12 }}>
                          {careerValueNames[key] || key}: {'⭐'.repeat(Number(val))}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text type="danger">Dữ liệu bị lỗi</Text>
          </div>
        )}
      </Drawer>
    </div>
  );
}
