import OpenAI from 'openai';

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
  favoriteSubjects: string[];
  riasecScores: { R: number; I: number; A: number; S: number; E: number; C: number };
  softSkills: Record<string, number>;
  interests: string[];
  careerValues: Record<string, number>;
}

export async function analyzeCareer(data: AnalysisInput) {
  const riasecEntries = Object.entries(data.riasecScores) as [string, number][];
  const sortedRiasec = riasecEntries.sort((a, b) => b[1] - a[1]);
  const topCode = sortedRiasec.slice(0, 3).map(([k]) => k).join('');

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

  const prompt = `Bạn là chuyên gia tư vấn hướng nghiệp cho học sinh THPT Việt Nam. Dựa trên dữ liệu chi tiết sau, hãy phân tích và gợi ý TOP 5 ngành nghề phù hợp nhất cho học sinh này.

## THÔNG TIN HỌC SINH
- Họ tên: ${data.fullName}
- Lớp: ${data.className}

## 1. HỌC LỰC (Điểm trung bình năm, thang 10)
${data.academicScores.map(s => `- ${s.subject}: ${s.score}`).join('\n')}

## 2. MÔN YÊU THÍCH
${data.favoriteSubjects.join(', ')}

## 3. RIASEC PROFILE (Điểm tối đa mỗi nhóm: 35)
${sortedRiasec.map(([k, v]) => `- ${k}: ${v}/35`).join('\n')}
→ Mã RIASEC: ${topCode}

## 4. KỸ NĂNG MỀM (Tự đánh giá 1-5)
${Object.entries(data.softSkills).map(([k, v]) => `- ${softSkillNames[k] || k}: ${v}/5`).join('\n')}

## 5. SỞ THÍCH
${data.interests.join(', ')}

## 6. GIÁ TRỊ NGHỀ NGHIỆP (Mức độ quan trọng 1-5)
${Object.entries(data.careerValues).map(([k, v]) => `- ${careerValueNames[k] || k}: ${v}/5`).join('\n')}

---

Hãy phân tích toàn diện và trả về KẾT QUẢ CHÍNH XÁC theo định dạng JSON sau (CHỈ trả về JSON thuần túy, KHÔNG có markdown code block, KHÔNG có text thừa, KHÔNG có \`\`\`json):

{
  "topCareers": [
    {
      "name": "Tên ngành nghề bằng tiếng Việt",
      "matchPercent": 95,
      "reason": "Giải thích chi tiết (3-5 câu) tại sao ngành này phù hợp, dựa trên học lực, RIASEC, sở thích và kỹ năng của học sinh",
      "improvements": ["Điểm cần cải thiện cụ thể 1", "Điểm cần cải thiện 2", "Điểm cần cải thiện 3"],
      "relatedMajors": ["Ngành đại học liên quan 1", "Ngành đại học liên quan 2"]
    }
  ],
  "riasecProfile": "Mô tả chi tiết (4-6 câu) về tính cách RIASEC của học sinh dựa trên mã ${topCode}, bao gồm điểm mạnh, phong cách làm việc, môi trường phù hợp",
  "overallAnalysis": "Phân tích tổng quan (5-7 câu) về tiềm năng của học sinh, kết hợp tất cả yếu tố, đưa ra lời khuyên tổng quát cho con đường sự nghiệp"
}

Lưu ý quan trọng:
- Phải trả về ĐÚNG 5 ngành nghề trong topCareers
- matchPercent phải từ 70-98, hợp lý dựa trên dữ liệu
- Mỗi ngành phải có ÍT NHẤT 3 improvements cụ thể, khả thi
- Mỗi ngành phải có ÍT NHẤT 2 relatedMajors (tên ngành đại học ở VN)
- Phân tích phải CÁ NHÂN HÓA, không chung chung
- Viết bằng tiếng Việt tự nhiên, thân thiện
- CHỈ trả về JSON, KHÔNG có bất kỳ text nào khác`;

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
    temperature: 0.7,
    max_tokens: 4000,
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
