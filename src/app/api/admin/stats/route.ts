import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // 1. Total students
    const totalStudents = await Assessment.countDocuments();

    // 2. Today's students
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStudents = await Assessment.countDocuments({ createdAt: { $gte: today } });

    // 3. Top RIASEC Distribution (Count the highest RIASEC group for each student)
    // We can aggregate this from riasecScores
    const riasecDistribution = await Assessment.aggregate([
      {
        $project: {
          topGroup: {
            $let: {
              vars: {
                scores: {
                  $objectToArray: "$riasecScores"
                }
              },
              in: {
                $arrayElemAt: [
                  {
                    $sortArray: { input: "$$scores", sortBy: { v: -1 } }
                  }, 0
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$topGroup.k",
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedRiasecDistribution = riasecDistribution.reduce((acc, curr) => {
      if (curr._id) {
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {} as Record<string, number>);

    // Ensure all 6 groups exist
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach(group => {
      if (!formattedRiasecDistribution[group]) formattedRiasecDistribution[group] = 0;
    });

    // 4. Trend Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trendDataRaw = await Assessment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Fill missing days
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`;
      const found = trendDataRaw.find(x => x._id === dateStr);
      trendData.push({
        date: dateStr,
        students: found ? found.count : 0
      });
    }

    // 5. Top Careers
    const topCareersRaw = await Assessment.aggregate([
      { $unwind: "$aiResult.topCareers" },
      {
        $group: {
          _id: "$aiResult.topCareers.name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const topCareers = topCareersRaw.map(c => ({ name: c._id, count: c.count }));

    // 4. Fetch recent students for the table (limit to 500 for now to prevent heavy payload)
    const recentStudents = await Assessment.find({}, {
      fullName: 1,
      className: 1,
      createdAt: 1,
      'aiResult.topCareers': 1,
      riasecScores: 1,
      academicScores: 1
    }).sort({ createdAt: -1 }).limit(500);

    const formattedStudents = recentStudents.map(student => {
      // Calculate top code (e.g. IAS)
      const scores = Object.entries(student.riasecScores as Record<string, number>);
      scores.sort((a, b) => b[1] - a[1]);
      const topCode = scores.slice(0, 3).map(([k]) => k).join('');

      return {
        _id: student._id.toString(),
        fullName: student.fullName,
        className: student.className,
        createdAt: student.createdAt,
        topCode,
        topCareer: student.aiResult?.topCareers?.[0]?.name || 'Đang xử lý',
        // Additional fields for Excel Export
        riasecScores: student.riasecScores,
        academicScores: student.academicScores,
        topCareers: student.aiResult?.topCareers || []
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        todayStudents,
        riasecDistribution: formattedRiasecDistribution,
        trendData,
        topCareers,
      },
      students: formattedStudents,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}
