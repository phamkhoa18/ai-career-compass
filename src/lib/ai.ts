import OpenAI from 'openai';
import { UNIVERSITIES, TuitionLevel, ScoreLevel } from '@/data/universities';
import { mbtiQuestions } from '@/data/mbti-questions';
import { interestOptions } from '@/data/subjects';
import { MAX_MBTI_SCORES } from '@/utils/mbti';

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
  mbtiAnswers: string[];
  mbtiResult?: string;
  mbtiScores?: Record<string, number>;
  softSkills: Record<string, number>;
  interests: string[];
  careerValues: Record<string, number>;
  familyFinance: string;
}

export async function analyzeCareer(data: AnalysisInput) {
  const riasecEntries = Object.entries(data.riasecScores) as [string, number][];
  const sortedRiasec = riasecEntries.sort((a, b) => b[1] - a[1]);
  const topCode = sortedRiasec.slice(0, 3).map(([k]) => k).join('');
  const mbtiCode = data.mbtiResult || 'Chưa xác định';

  const validScores = data.academicScores.filter(s => s.score > 0);
  const avgScore = validScores.length > 0 
    ? validScores.reduce((acc, curr) => acc + curr.score, 0) / validScores.length 
    : 0;
  
  let studentScoreLevel: ScoreLevel = 'Khó';
  if (avgScore < 6.5) studentScoreLevel = 'Dễ';
  else if (avgScore < 7.5) studentScoreLevel = 'Trung bình';
  else if (avgScore < 8.5) studentScoreLevel = 'Khó';
  else studentScoreLevel = 'Rất khó';

  const financeStr = data.familyFinance.toLowerCase();
  let allowedTuitions: TuitionLevel[] = ['Thấp', 'Trung bình', 'Cao'];
  if (financeStr.includes('khó khăn') || financeStr.includes('thấp') || financeStr.includes('< 20')) {
    allowedTuitions = ['Thấp'];
  } else if (financeStr.includes('trung bình') || financeStr.includes('20-40')) {
    allowedTuitions = ['Thấp', 'Trung bình'];
  } else if (financeStr.includes('khá giả') || financeStr.includes('cao') || financeStr.includes('> 40')) {
    allowedTuitions = ['Thấp', 'Trung bình', 'Cao'];
  }

  const filteredUniversities = UNIVERSITIES.filter(u => {
    if (!allowedTuitions.includes(u.tuitionLevel)) return false;
    const scoreRank: Record<ScoreLevel, number> = { 'Dễ': 1, 'Trung bình': 2, 'Khó': 3, 'Rất khó': 4 };
    const studentRank = scoreRank[studentScoreLevel];
    const schoolRank = scoreRank[u.scoreLevel];
    if (Math.abs(schoolRank - studentRank) > 1) return false;
    return true;
  });

  const universitiesContext = filteredUniversities.map(u => 
    `- [${u.region}] ${u.name} (Học phí: ${u.tuitionLevel}, Đầu vào: ${u.scoreLevel})`
  ).slice(0, 15).join('\n');

  const softSkillNames: Record<string, string> = {
    communication: 'Giao tiếp', teamwork: 'Làm việc nhóm', problemSolving: 'Giải quyết vấn đề',
    leadership: 'Lãnh đạo', timeManagement: 'Quản lý thời gian', creativity: 'Sáng tạo',
    criticalThinking: 'Tư duy phản biện', adaptability: 'Thích ứng',
  };

  const careerValueNames: Record<string, string> = {
    income: 'Thu nhập cao', stability: 'Ổn định công việc', creativity: 'Tính sáng tạo',
    socialImpact: 'Đóng góp xã hội', workLifeBalance: 'Cân bằng cuộc sống', advancement: 'Cơ hội thăng tiến',
  };

  // Convert internal score values to grade labels for AI
  const scoreToGrade = (score: number): string => {
    if (score >= 9.0) return 'Xuất sắc';
    if (score >= 8.0) return 'Giỏi';
    if (score >= 7.0) return 'Khá';
    if (score >= 6.5) return 'Trung bình';
    if (score >= 3.5) return 'Yếu';
    if (score > 0) return 'Kém';
    return 'Chưa chọn';
  };

  // Format soft skills for prompt
  const softSkillsStr = Object.entries(data.softSkills)
    .map(([key, val]) => `${softSkillNames[key] || key}: ${val}/5`)
    .join(', ');

  // Format career values for prompt
  const careerValuesStr = Object.entries(data.careerValues)
    .map(([key, val]) => `${careerValueNames[key] || key}: ${val}/5`)
    .join(', ');

  // Format interests
  const interestNames: Record<string, string> = {
    computer: 'Công nghệ', space: 'Vũ trụ', language: 'Ngôn ngữ', art: 'Nghệ thuật',
    business: 'Kinh doanh', health: 'Y tế', education: 'Giáo dục', sport: 'Thể thao',
    music: 'Âm nhạc', travel: 'Du lịch', cooking: 'Ẩm thực', environment: 'Môi trường',
    media: 'Truyền thông', law: 'Pháp luật', psychology: 'Tâm lý', architecture: 'Kiến trúc',
    gaming: 'Game', science: 'Khoa học', military: 'Quân sự', social: 'Xã hội',
  };
  const interestsStr = data.interests.map(k => interestNames[k] || k).join(', ') || 'Chưa chọn';

  // Format aptitude subjects
  const aptitudeStr = data.aptitudeSubjects.length > 0
    ? data.aptitudeSubjects.map(s => `${s.subject}: ${s.isLiked ? 'Thích' : 'Không thích'}`).join(', ')
    : 'Chưa đánh giá';

  // Format favorite subjects
  const favoriteStr = data.favoriteSubjects.length > 0
    ? data.favoriteSubjects.join(', ')
    : 'Chưa chọn';

  // Format RIASEC detailed scores
  const riasecDetailStr = sortedRiasec.map(([k, v]) => `${k}:${v}`).join(', ');

  const prompt = `Bạn là hệ thống AI tư vấn hướng nghiệp (Decision Support System) cho học sinh THPT Việt Nam.
Nhiệm vụ: Phân tích và gợi ý ĐÚNG 5 NGHỀ NGHIỆP PHÙ HỢP NHẤT dưới dạng JSON.

HỌC SINH:
- Họ tên: ${data.fullName} | Lớp: ${data.className} | Tài chính: ${data.familyFinance}
- Học lực: ${data.academicScores.map(s => `${s.subject}: ${scoreToGrade(s.score)}`).join(', ')}
- Môn yêu thích: ${favoriteStr}
- Năng khiếu/Thể chất: ${aptitudeStr}
- Mã RIASEC: ${topCode} (Chi tiết: ${riasecDetailStr}) | MBTI: ${mbtiCode}
- Kỹ năng mềm: ${softSkillsStr}
- Sở thích: ${interestsStr}
- Giá trị nghề nghiệp: ${careerValuesStr}
- Trường phù hợp tài chính & học lực:
${universitiesContext}

LƯU Ý QUAN TRỌNG:
1. Trả về mảng "topCareers" BẮT BUỘC ĐÚNG 5 phần tử.
2. Viết ngắn gọn súc tích để JSON không bị tràn token.
3. CHỈ trả về JSON thuần túy (KHÔNG dùng markdown code block).

JSON MẪU:
{
  "topCareers": [
    {
      "name": "Tên nghề 1",
      "cfi": 92,
      "feasibility": 88,
      "matchPercent": 92,
      "scoreBreakdown": { "academic": 90, "riasec": 92, "skills": 85, "careerValues": 88, "interests": 90, "marketDemand": 85 },
      "fitReasons": { "strengths": ["🟢 Strengths 1", "🟢 Strengths 2"], "considerations": ["🟡 Consideration 1"] },
      "reason": "Lý do phù hợp súc tích...",
      "jobDescription": "Mô tả công việc súc tích...",
      "requiredSkills": ["Skill 1", "Skill 2"],
      "careerIntelligence": {
        "recruitmentDemandTrend": [{ "year": "2024", "level": 75 }, { "year": "2025", "level": 82 }, { "year": "2026", "level": 90 }],
        "marketStatus": "Thiếu hụt",
        "salary": { "entryLevel": "12-18 triệu", "midLevel": "22-35 triệu", "seniorLevel": "40-70 triệu" },
        "regionDemand": "Thành phố lớn",
        "keySkillsTrending": ["Skill 1"]
      },
      "aiImpact": { "score": 60, "automationRisk": "Thấp", "aiAugmentation": "Tốt", "criticalSkillsInAiEra": ["Tư duy hệ thống"] },
      "riskScore": { "level": "Trung bình", "description": "Cần học liên tục" },
      "trendAnalysis": { "futurePotential": "Tích cực", "recruitmentDemand": "Cao" },
      "financialInsights": { "averageSalary": "15-35 triệu", "tuitionCompatibility": "Phù hợp" },
      "universityStrategy": {
        "dream": [{ "name": "Trường A", "targetScore": "27+" }],
        "match": [{ "name": "Trường B", "targetScore": "25-27" }],
        "safe": [{ "name": "Trường C", "targetScore": "22-24" }],
        "admissionNote": "Tham khảo"
      },
      "educationPath": { "relatedMajors": ["Ngành A"], "topUniversities": ["Trường A"], "admissionScoreTrend": "A00, A01" },
      "actionableRoadmap": {
        "m0_3": ["Học Tiếng Anh"], "m3_6": ["Học chuyên môn"], "m6_12": ["Dự án nhỏ"], "y1_3": ["Thi ĐH"], "y3_5": ["Thực tập"]
      },
      "developmentRoadmap": "Lộ trình ngắn gọn...",
      "weaknessSolutions": ["Giải pháp 1"],
      "gapResources": [{ "gap": "Tiếng Anh", "solution": "Rèn luyện", "resources": [{ "title": "Khoá học", "url": "https://coursera.org" }] }],
      "usefulLinks": ["https://coursera.org"],
      "improvements": ["Cải thiện Tiếng Anh"]
    },
    { "name": "Tên nghề 2", "cfi": 89, "feasibility": 86, "matchPercent": 89, "scoreBreakdown": { "academic": 88, "riasec": 90, "skills": 82, "careerValues": 85, "interests": 88, "marketDemand": 84 }, "fitReasons": { "strengths": ["🟢 Lý do..."], "considerations": ["🟡 Yếu tố..."] }, "reason": "...", "jobDescription": "...", "requiredSkills": ["..."], "careerIntelligence": { "recruitmentDemandTrend": [{ "year": "2024", "level": 70 }, { "year": "2025", "level": 80 }, { "year": "2026", "level": 88 }], "marketStatus": "Thiếu hụt", "salary": { "entryLevel": "10-15 triệu", "midLevel": "18-28 triệu", "seniorLevel": "35-50 triệu" }, "regionDemand": "Toàn quốc", "keySkillsTrending": ["..."] }, "aiImpact": { "score": 55, "automationRisk": "...", "aiAugmentation": "...", "criticalSkillsInAiEra": ["..."] }, "riskScore": { "level": "Trung bình", "description": "..." }, "trendAnalysis": { "futurePotential": "...", "recruitmentDemand": "..." }, "financialInsights": { "averageSalary": "...", "tuitionCompatibility": "..." }, "universityStrategy": { "dream": [{ "name": "...", "targetScore": "..." }], "match": [{ "name": "...", "targetScore": "..." }], "safe": [{ "name": "...", "targetScore": "..." }], "admissionNote": "..." }, "educationPath": { "relatedMajors": ["..."], "topUniversities": ["..."], "admissionScoreTrend": "..." }, "actionableRoadmap": { "m0_3": ["..."], "m3_6": ["..."], "m6_12": ["..."], "y1_3": ["..."], "y3_5": ["..."] }, "developmentRoadmap": "...", "weaknessSolutions": ["..."], "gapResources": [], "usefulLinks": [], "improvements": [] },
    { "name": "Tên nghề 3", "cfi": 86, "feasibility": 84, "matchPercent": 86, "scoreBreakdown": { "academic": 85, "riasec": 87, "skills": 80, "careerValues": 84, "interests": 85, "marketDemand": 82 }, "fitReasons": { "strengths": ["🟢 Lý do..."], "considerations": ["🟡 Yếu tố..."] }, "reason": "...", "jobDescription": "...", "requiredSkills": ["..."], "careerIntelligence": { "recruitmentDemandTrend": [{ "year": "2024", "level": 65 }, { "year": "2025", "level": 75 }, { "year": "2026", "level": 82 }], "marketStatus": "Cân bằng", "salary": { "entryLevel": "9-14 triệu", "midLevel": "16-24 triệu", "seniorLevel": "30-45 triệu" }, "regionDemand": "Toàn quốc", "keySkillsTrending": ["..."] }, "aiImpact": { "score": 50, "automationRisk": "...", "aiAugmentation": "...", "criticalSkillsInAiEra": ["..."] }, "riskScore": { "level": "Thấp", "description": "..." }, "trendAnalysis": { "futurePotential": "...", "recruitmentDemand": "..." }, "financialInsights": { "averageSalary": "...", "tuitionCompatibility": "..." }, "universityStrategy": { "dream": [{ "name": "...", "targetScore": "..." }], "match": [{ "name": "...", "targetScore": "..." }], "safe": [{ "name": "...", "targetScore": "..." }], "admissionNote": "..." }, "educationPath": { "relatedMajors": ["..."], "topUniversities": ["..."], "admissionScoreTrend": "..." }, "actionableRoadmap": { "m0_3": ["..."], "m3_6": ["..."], "m6_12": ["..."], "y1_3": ["..."], "y3_5": ["..."] }, "developmentRoadmap": "...", "weaknessSolutions": ["..."], "gapResources": [], "usefulLinks": [], "improvements": [] },
    { "name": "Tên nghề 4", "cfi": 83, "feasibility": 82, "matchPercent": 83, "scoreBreakdown": { "academic": 82, "riasec": 84, "skills": 78, "careerValues": 82, "interests": 83, "marketDemand": 80 }, "fitReasons": { "strengths": ["🟢 Lý do..."], "considerations": ["🟡 Yếu tố..."] }, "reason": "...", "jobDescription": "...", "requiredSkills": ["..."], "careerIntelligence": { "recruitmentDemandTrend": [{ "year": "2024", "level": 60 }, { "year": "2025", "level": 70 }, { "year": "2026", "level": 78 }], "marketStatus": "Cân bằng", "salary": { "entryLevel": "8-12 triệu", "midLevel": "14-20 triệu", "seniorLevel": "25-35 triệu" }, "regionDemand": "Toàn quốc", "keySkillsTrending": ["..."] }, "aiImpact": { "score": 45, "automationRisk": "...", "aiAugmentation": "...", "criticalSkillsInAiEra": ["..."] }, "riskScore": { "level": "Thấp", "description": "..." }, "trendAnalysis": { "futurePotential": "...", "recruitmentDemand": "..." }, "financialInsights": { "averageSalary": "...", "tuitionCompatibility": "..." }, "universityStrategy": { "dream": [{ "name": "...", "targetScore": "..." }], "match": [{ "name": "...", "targetScore": "..." }], "safe": [{ "name": "...", "targetScore": "..." }], "admissionNote": "..." }, "educationPath": { "relatedMajors": ["..."], "topUniversities": ["..."], "admissionScoreTrend": "..." }, "actionableRoadmap": { "m0_3": ["..."], "m3_6": ["..."], "m6_12": ["..."], "y1_3": ["..."], "y3_5": ["..."] }, "developmentRoadmap": "...", "weaknessSolutions": ["..."], "gapResources": [], "usefulLinks": [], "improvements": [] },
    { "name": "Tên nghề 5", "cfi": 80, "feasibility": 80, "matchPercent": 80, "scoreBreakdown": { "academic": 80, "riasec": 80, "skills": 75, "careerValues": 80, "interests": 80, "marketDemand": 75 }, "fitReasons": { "strengths": ["🟢 Lý do..."], "considerations": ["🟡 Yếu tố..."] }, "reason": "...", "jobDescription": "...", "requiredSkills": ["..."], "careerIntelligence": { "recruitmentDemandTrend": [{ "year": "2024", "level": 55 }, { "year": "2025", "level": 65 }, { "year": "2026", "level": 75 }], "marketStatus": "Cân bằng", "salary": { "entryLevel": "7-11 triệu", "midLevel": "12-18 triệu", "seniorLevel": "20-30 triệu" }, "regionDemand": "Toàn quốc", "keySkillsTrending": ["..."] }, "aiImpact": { "score": 40, "automationRisk": "...", "aiAugmentation": "...", "criticalSkillsInAiEra": ["..."] }, "riskScore": { "level": "Thấp", "description": "..." }, "trendAnalysis": { "futurePotential": "...", "recruitmentDemand": "..." }, "financialInsights": { "averageSalary": "...", "tuitionCompatibility": "..." }, "universityStrategy": { "dream": [{ "name": "...", "targetScore": "..." }], "match": [{ "name": "...", "targetScore": "..." }], "safe": [{ "name": "...", "targetScore": "..." }], "admissionNote": "..." }, "educationPath": { "relatedMajors": ["..."], "topUniversities": ["..."], "admissionScoreTrend": "..." }, "actionableRoadmap": { "m0_3": ["..."], "m3_6": ["..."], "m6_12": ["..."], "y1_3": ["..."], "y3_5": ["..."] }, "developmentRoadmap": "...", "weaknessSolutions": ["..."], "gapResources": [], "usefulLinks": [], "improvements": [] }
  ],
  "riasecProfile": "Mô tả RIASEC...",
  "overallAnalysis": "Lời khuyên tổng quan...",
  "disclaimer": "Dự báo dựa trên xu hướng dữ liệu, không phải dự đoán chắc chắn."
}`;

  console.log(`[AI] Calling FPT AI (${MODEL}) for ${data.fullName}...`);

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: 'Bạn là hệ thống AI tư vấn hướng nghiệp. Trả về JSON thuần túy súc tích, KHÔNG bao giờ dùng markdown ```.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.4,
    max_tokens: 8000,
  });

  const responseText = completion.choices[0]?.message?.content || '{}';
  console.log(`[AI] Response received (${responseText.length} chars)`);

  try {
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }
    cleaned = cleaned.trim();

    let result: any;
    try {
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('[AI] Initial JSON parse failed, attempting auto-repair...');
      let repaired = cleaned;
      if (!repaired.endsWith('}')) {
        const quotesCount = (repaired.match(/"/g) || []).length;
        if (quotesCount % 2 !== 0) repaired += '"';
        const openBraces = (repaired.match(/\{/g) || []).length;
        const closeBraces = (repaired.match(/\}/g) || []).length;
        const openBrackets = (repaired.match(/\[/g) || []).length;
        const closeBrackets = (repaired.match(/\]/g) || []).length;

        for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
        for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';
      }
      result = JSON.parse(repaired);
    }

    if (!result.topCareers || !Array.isArray(result.topCareers) || result.topCareers.length === 0) {
      throw new Error('Invalid response structure: missing topCareers');
    }

    const topCareers = result.topCareers.map((c: any) => ({
      ...c,
      cfi: c.cfi || c.matchPercent || 85,
      feasibility: c.feasibility || 80,
      matchPercent: c.matchPercent || c.cfi || 85,
      scoreBreakdown: c.scoreBreakdown || {
        academic: 85, riasec: 90, skills: 80, careerValues: 85, interests: 88, marketDemand: 82,
      },
      fitReasons: c.fitReasons || {
        strengths: [`🟢 Phù hợp với mã RIASEC ${topCode}`, `🟢 Học lực và kỹ năng hỗ trợ tốt`],
        considerations: [`🟡 Cần nâng cao thêm ngoại ngữ và kỹ năng chuyên môn`],
      },
      careerIntelligence: c.careerIntelligence || {
        recruitmentDemandTrend: [{ year: '2024', level: 75 }, { year: '2025', level: 82 }, { year: '2026', level: 88 }],
        marketStatus: 'Thiếu hụt',
        salary: { entryLevel: '10 - 15 triệu', midLevel: '18 - 30 triệu', seniorLevel: '35 - 60+ triệu' },
        regionDemand: 'Toàn quốc, tập trung tại các thành phố lớn',
        keySkillsTrending: c.requiredSkills || ['Kỹ năng chuyên môn', 'Giải quyết vấn đề'],
      },
      aiImpact: c.aiImpact || {
        score: 55, automationRisk: 'Rủi ro tự động hóa thấp', aiAugmentation: 'AI hỗ trợ tự động hóa các tác vụ lặp lại', criticalSkillsInAiEra: ['Tư duy phản biện', 'Sáng tạo'],
      },
      riskScore: c.riskScore || { level: 'Trung bình', description: 'Đòi hỏi tích lũy kinh nghiệm và cập nhật xu hướng.' },
      universityStrategy: c.universityStrategy || {
        dream: c.educationPath?.topUniversities?.slice(0, 1).map((u: string) => ({ name: u, targetScore: 'Cạnh tranh cao' })) || [],
        match: c.educationPath?.topUniversities?.slice(1, 3).map((u: string) => ({ name: u, targetScore: 'Phù hợp' })) || [],
        safe: [{ name: 'Trường đào tạo địa phương / Cao đẳng trọng điểm', targetScore: 'An toàn' }],
        admissionNote: 'Điểm chuẩn chỉ mang tính tham khảo và thay đổi theo từng năm.',
      },
      actionableRoadmap: c.actionableRoadmap || {
        m0_3: ['Nâng cao điểm số các môn cốt lõi', 'Rèn luyện ngoại ngữ 30p/ngày'],
        m3_6: ['Tìm hiểu sâu về công việc thực tế', 'Học kỹ năng mềm'],
        m6_12: ['Thực hiện dự án cá nhân'],
        y1_3: ['Tập trung ôn thi ĐH và trúng tuyển'],
        y3_5: ['Thực tập và chuẩn bị hành trang'],
      },
      gapResources: c.gapResources || [],
    }));

    return {
      topCareers,
      riasecProfile: result.riasecProfile || '',
      overallAnalysis: result.overallAnalysis || '',
      disclaimer: result.disclaimer || 'Dự báo dựa trên xu hướng dữ liệu, không phải dự đoán chắc chắn.',
      generatedAt: new Date(),
    };
  } catch (parseError) {
    console.error('[AI] Failed to parse response:', responseText.substring(0, 500));
    throw new Error('Failed to parse AI response');
  }
}
