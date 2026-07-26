import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import { analyzeCareer } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    // Create assessment first
    const assessment = new Assessment({
      fullName: data.fullName,
      className: data.className,
      academicScores: data.academicScores.filter((s: { score: number }) => s.score > 0),
      favoriteSubjects: data.favoriteSubjects,
      familyFinance: data.familyFinance,
      aptitudeSubjects: data.aptitudeSubjects,
      careerValues: data.careerValues,
      riasecScores: data.riasecScores,
      riasecAnswers: data.riasecAnswers,
      softSkills: data.softSkills,
      interests: data.interests,
    });

    await assessment.save();

    // Analyze with AI
    try {
      const aiResult = await analyzeCareer({
        fullName: data.fullName,
        className: data.className,
        academicScores: data.academicScores.filter((s: { score: number }) => s.score > 0),
        favoriteSubjects: data.favoriteSubjects,
        familyFinance: data.familyFinance,
        aptitudeSubjects: data.aptitudeSubjects,
        riasecScores: data.riasecScores,
        softSkills: data.softSkills,
        interests: data.interests,
        careerValues: data.careerValues,
      });

      assessment.aiResult = aiResult;
      await assessment.save();
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Save with fallback result
      assessment.aiResult = {
        topCareers: [
          {
            name: 'Đang xử lý...',
            matchPercent: 0,
            reason: 'AI đang xử lý. Vui lòng thử lại sau.',
            jobDescription: '',
            requiredSkills: [],
            trendAnalysis: { futurePotential: '', recruitmentDemand: '' },
            financialInsights: { averageSalary: '', tuitionCompatibility: '' },
            educationPath: { relatedMajors: [], topUniversities: [], admissionScoreTrend: '' },
            developmentRoadmap: '',
            weaknessSolutions: [],
            usefulLinks: [],
            improvements: [],
          },
        ],
        riasecProfile: 'Đang phân tích...',
        overallAnalysis: 'AI đang xử lý phân tích. Vui lòng thử lại sau.',
        generatedAt: new Date(),
      };
      await assessment.save();
    }

    return NextResponse.json({ id: assessment._id, success: true });
  } catch (error) {
    console.error('Assessment creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      // Vì lý do bảo mật, không trả về toàn bộ dữ liệu hệ thống cho public API.
      return NextResponse.json([]);
    }

    const ids = idsParam.split(',').filter(id => id.length === 24);
    if (ids.length === 0) {
      return NextResponse.json([]);
    }

    await connectDB();
    const assessments = await Assessment.find({ _id: { $in: ids } })
      .sort({ createdAt: -1 })
      .select('fullName className createdAt aiResult.topCareers')
      .limit(100)
      .lean();

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Failed to fetch assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}
