import OpenAI from 'openai';
import { UNIVERSITIES, TuitionLevel, ScoreLevel } from '@/data/universities';

// FPT AI Marketplace - OpenAI-compatible API
const client = new OpenAI({
  apiKey: process.env.FPT_AI_API_KEY,
  baseURL: process.env.FPT_AI_BASE_URL || 'https://mkp-api.fptcloud.com/v1',
});

const MODEL = process.env.FPT_AI_MODEL || 'gemma-4-31B-it';

interface AnalysisInput {
  fullName: string;
  className: string;
  academicScores: { subject: string; score: number }[];
  aptitudeSubjects: { subject: string; isLiked: boolean }[];
  favoriteSubjects: string[];
  riasecScores: { R: number; I: number; A: number; S: number; E: number; C: number };
  softSkills: Record<string, number>;
  interests: string[];
  careerValues: Record<string, number>;
  familyFinance: string;
}

export async function analyzeCareer(data: AnalysisInput) {
  const riasecEntries = Object.entries(data.riasecScores) as [string, number][];
  const sortedRiasec = riasecEntries.sort((a, b) => b[1] - a[1]);
  const topCode = sortedRiasec.slice(0, 3).map(([k]) => k).join('');

  // 1. Calculate Average Score
  const validScores = data.academicScores.filter(s => s.score > 0);
  const avgScore = validScores.length > 0 
    ? validScores.reduce((acc, curr) => acc + curr.score, 0) / validScores.length 
    : 0;
  
  let studentScoreLevel: ScoreLevel = 'Khó';
  if (avgScore < 6.5) studentScoreLevel = 'Dễ';
  else if (avgScore < 7.5) studentScoreLevel = 'Trung bình';
  else if (avgScore < 8.5) studentScoreLevel = 'Khó';
  else studentScoreLevel = 'Rất khó';

  // 2. Map Family Finance (Fallback to all if unmapped)
  // Matching values from AssessmentContext.tsx/Constants if possible, else substring match
  const financeStr = data.familyFinance.toLowerCase();
  let allowedTuitions: TuitionLevel[] = ['Thấp', 'Trung bình', 'Cao'];
  if (financeStr.includes('khó khăn') || financeStr.includes('thấp')) {
    allowedTuitions = ['Thấp'];
  } else if (financeStr.includes('trung bình')) {
    allowedTuitions = ['Thấp', 'Trung bình'];
  }

  // 3. Filter Universities (Relaxed filtering)
  const filteredUniversities = UNIVERSITIES.filter(u => {
    if (!allowedTuitions.includes(u.tuitionLevel)) return false;
    
    const scoreRank: Record<ScoreLevel, number> = { 'Dễ': 1, 'Trung bình': 2, 'Khó': 3, 'Rất khó': 4 };
    const studentRank = scoreRank[studentScoreLevel];
    const schoolRank = scoreRank[u.scoreLevel];
    
    // Cho phép trường ngang tầm, dễ hơn 1 bậc, hoặc khó hơn 1 bậc (thử thách)
    if (Math.abs(schoolRank - studentRank) > 1) return false;
    
    return true;
  });

  const universitiesContext = filteredUniversities.map(u => 
    `- [${u.region}] [${u.type}] ${u.name} (Học phí: ${u.tuitionLevel}, Đầu vào: ${u.scoreLevel}, Khối thi: ${u.admissionBlocks.join(', ')})`
  ).join('\n');

  const softSkillNames: Record<string, string> = {
    communication: 'Giao tiếp',
    teamwork: 'Làm việc nhóm',
    problemSolving: 'Giải quyết vấn đề',
    leadership: 'Lãnh đạo',
    timeManagement: 'Quản lý thời gian',
    creativity: 'Sáng tạo',
    criticalThinking: 'Tư duy phản biện',
    adaptability: 'Thích ứng',
  };

  const careerValueNames: Record<string, string> = {
    income: 'Thu nhập cao',
    stability: 'Ổn định công việc',
    creativity: 'Tính sáng tạo',
    socialImpact: 'Đóng góp xã hội',
    workLifeBalance: 'Cân bằng cuộc sống',
    advancement: 'Cơ hội thăng tiến',
  };

  const prompt = `Bạn là chuyên gia tư vấn hướng nghiệp xuất sắc cho học sinh THPT Việt Nam. Nhiệm vụ của bạn là định hướng nghề nghiệp đi sâu vào bản chất mỗi người, phân tích cá nhân hóa (không ai giống ai, mỗi người 1 tính, 1 năng lực riêng). Đánh giá tập trung vào sự chủ động đào tạo, phát triển và làm chủ tương lai. Dựa trên dữ liệu chi tiết sau, hãy phân tích và gợi ý TOP 5 ngành nghề phù hợp nhất.

## THÔNG TIN HỌC SINH
- Họ tên: ${data.fullName}
- Lớp: ${data.className}
- Điều kiện tài chính gia đình dự kiến: ${data.familyFinance}

## 1. HỌC LỰC (Điểm trung bình năm, thang 10)
${data.academicScores.map(s => `- ${s.subject}: ${s.score}`).join('\n')}
=> Điểm TB tham khảo: ${avgScore.toFixed(1)}/10 (${studentScoreLevel})

## 2. MÔN NĂNG KHIẾU / THỂ CHẤT
${data.aptitudeSubjects.map(s => `- ${s.subject}: ${s.isLiked ? 'Thích' : 'Không thích'}`).join('\n')}

## 3. MÔN YÊU THÍCH
${data.favoriteSubjects.join(', ')}

## 4. RIASEC PROFILE
${sortedRiasec.map(([k, v]) => `- ${k}: ${v}/35`).join('\n')}
→ Mã RIASEC: ${topCode}

## 5. KỸ NĂNG MỀM (Tự đánh giá 1-5)
${Object.entries(data.softSkills).map(([k, v]) => `- ${softSkillNames[k] || k}: ${v}/5`).join('\n')}

## 6. SỞ THÍCH
${data.interests.join(', ')}

## 7. GIÁ TRỊ NGHỀ NGHIỆP (Mức độ quan trọng 1-5)
${Object.entries(data.careerValues).map(([k, v]) => `- ${careerValueNames[k] || k}: ${v}/5`).join('\n')}

---

## DANH SÁCH TRƯỜNG ĐẠI HỌC THAM KHẢO (Đã lọc theo tài chính và học lực)
${universitiesContext || '(Chưa có dữ liệu, hãy tự suy luận các trường phù hợp nhất)'}

---

Hãy trả về KẾT QUẢ CHÍNH XÁC theo định dạng JSON sau (CHỈ trả về JSON thuần túy, KHÔNG markdown code block, KHÔNG text thừa):

{
  "topCareers": [
    {
      "name": "Tên ngành nghề cụ thể",
      "matchPercent": 95,
      "reason": "Lý do sâu sắc tại sao ngành này hợp với riêng học sinh này (tính cách, năng lực riêng).",
      "jobDescription": "Công việc thực tế là làm gì? Những kỹ năng nào thực sự cần có?",
      "requiredSkills": ["Kỹ năng 1", "Kỹ năng 2"],
      "trendAnalysis": {
        "futurePotential": "Cập nhật dữ liệu từ 2024-nay: Trong 5-10 năm tới nghề này còn tồn tại/phát triển không? (Đặc biệt khối IT, AI).",
        "recruitmentDemand": "Xu hướng hiện nay nhu cầu tuyển dụng có cao không? (Thừa hay thiếu nhân lực)"
      },
      "financialInsights": {
        "averageSalary": "Mức lương tham khảo hiện nay",
        "tuitionCompatibility": "Ngành này có phù hợp với điều kiện tài chính gia đình (${data.familyFinance}) không?"
      },
      "educationPath": {
        "relatedMajors": ["Tên ngành học 1", "Tên ngành học 2"],
        "topUniversities": [
          "📍 Miền Bắc: [Các trường được chọn từ danh sách gợi ý]",
          "📍 Miền Trung: [Các trường được chọn từ danh sách gợi ý]",
          "📍 Miền Nam: [Các trường được chọn từ danh sách gợi ý]"
        ],
        "admissionScoreTrend": "Tổ hợp môn thi phổ biến (VD: A00, A01, D01). Mức điểm chuẩn các năm gần đây."
      },
      "developmentRoadmap": "Lộ trình đường dài (1 năm, 3 năm, 5 năm) để theo đuổi và thăng tiến.",
      "weaknessSolutions": [
        "Môn cần cải thiện: XYZ",
        "Yếu điểm XYZ: Cần khắc phục bằng cách..."
      ],
      "usefulLinks": [
        "Link tham khảo 1 (VD: https://coursera.org/...)",
        "Link tham khảo 2"
      ],
      "improvements": ["Giải pháp ngắn gọn 1", "Giải pháp ngắn gọn 2"]
    }
  ],
  "riasecProfile": "Mô tả tính cách RIASEC, điểm mạnh, môi trường làm việc phù hợp",
  "overallAnalysis": "Đánh giá tổng quan, lời khuyên đào tạo và phát triển tư duy làm chủ."
}

Lưu ý quan trọng:
- Trả về ĐÚNG 5 ngành nghề, viết súc tích nhưng đầy đủ ý.
- Đánh giá sâu, cụ thể, không rập khuôn.
- Dữ liệu xu hướng phải lấy bối cảnh thị trường thực tế.
- JSON trả về phải là một Object hợp lệ, KHÔNG chứa text bên ngoài.`;

  console.log(`[AI] Calling FPT AI (${MODEL}) for ${data.fullName}...`);

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Bạn là AI tư vấn hướng nghiệp chuyên nghiệp cho học sinh THPT Việt Nam. Luôn trả về kết quả dạng JSON hợp lệ. KHÔNG bao giờ bọc JSON trong markdown code block (```). CHỈ trả về JSON thuần túy.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 6000,
  });

  const responseText = completion.choices[0]?.message?.content || '{}';
  console.log(`[AI] Response received (${responseText.length} chars)`);

  try {
    // Clean up response - remove markdown code blocks if present
    let cleaned = responseText.trim();
    // Remove ```json ... ``` wrapper if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();

    const result = JSON.parse(cleaned);

    // Validate structure
    if (!result.topCareers || !Array.isArray(result.topCareers) || result.topCareers.length === 0) {
      throw new Error('Invalid response structure: missing topCareers');
    }

    return {
      ...result,
      generatedAt: new Date(),
    };
  } catch (parseError) {
    console.error('[AI] Failed to parse response:', responseText.substring(0, 500));
    throw new Error('Failed to parse AI response');
  }
}
