import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicScore {
  subject: string;
  subjectKey: string;
  score: number;
}

export interface IRiasecScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface ISoftSkills {
  communication: number;
  teamwork: number;
  problemSolving: number;
  leadership: number;
  timeManagement: number;
  creativity: number;
  criticalThinking: number;
  adaptability: number;
}

export interface ICareerValues {
  income: number;
  stability: number;
  creativity: number;
  socialImpact: number;
  workLifeBalance: number;
  advancement: number;
}

export interface IScoreBreakdown {
  academic: number;
  riasec: number;
  skills: number;
  careerValues: number;
  interests: number;
  marketDemand: number;
}

export interface IFinancialSalary {
  entryLevel: string;
  midLevel: string;
  seniorLevel: string;
}

export interface ICareerIntelligence {
  recruitmentDemandTrend: { year: string; level: number }[];
  marketStatus: 'Thiếu hụt' | 'Cân bằng' | 'Dư thừa' | string;
  salary: IFinancialSalary;
  regionDemand: string;
  keySkillsTrending: string[];
}

export interface IUniversityStrategy {
  dream: { name: string; targetScore: string; note?: string }[];
  match: { name: string; targetScore: string; note?: string }[];
  safe: { name: string; targetScore: string; note?: string }[];
  admissionNote: string;
}

export interface IActionableRoadmap {
  m0_3: string[];
  m3_6: string[];
  m6_12: string[];
  y1_3: string[];
  y3_5: string[];
}

export interface IGapResource {
  gap: string;
  solution: string;
  resources: { title: string; url: string; type?: string }[];
}

export interface ICareerRecommendation {
  name: string;
  cfi: number; // Career Fit Index (0-100)
  feasibility: number; // Feasibility score (0-100)
  matchPercent: number; // Retained for compatibility
  scoreBreakdown: IScoreBreakdown;
  fitReasons: {
    strengths: string[]; // 🟢
    considerations: string[]; // 🟡/🔴
  };
  reason: string;
  jobDescription: string;
  requiredSkills: string[];
  careerIntelligence: ICareerIntelligence;
  aiImpact: {
    score: number; // 0-100
    automationRisk: string;
    aiAugmentation: string;
    criticalSkillsInAiEra: string[];
  };
  riskScore: {
    level: 'Thấp' | 'Trung bình' | 'Cao' | string;
    description: string;
  };
  trendAnalysis: {
    futurePotential: string;
    recruitmentDemand: string;
  };
  financialInsights: {
    averageSalary: string;
    tuitionCompatibility: string;
  };
  universityStrategy: IUniversityStrategy;
  educationPath: {
    relatedMajors: string[];
    topUniversities: string[];
    admissionScoreTrend: string;
  };
  actionableRoadmap: IActionableRoadmap;
  developmentRoadmap: string;
  weaknessSolutions: string[];
  gapResources: IGapResource[];
  usefulLinks: string[];
  improvements: string[];
}

export interface IAiResult {
  topCareers: ICareerRecommendation[];
  riasecProfile: string;
  overallAnalysis: string;
  disclaimer: string;
  generatedAt: Date;
}

export interface IAssessment extends Document {
  fullName: string;
  className: string;
  academicScores: IAcademicScore[];
  aptitudeSubjects: { subject: string; subjectKey: string; isLiked: boolean }[];
  favoriteSubjects: string[];
  familyFinance: string;
  careerValues: ICareerValues;
  riasecScores: IRiasecScores;
  riasecAnswers: number[];
  mbtiAnswers: string[];
  mbtiResult?: string;
  mbtiScores?: Record<string, number>;
  softSkills: ISoftSkills;
  interests: string[];
  aiResult?: IAiResult;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    fullName: { type: String, required: true },
    className: { type: String, required: true },
    academicScores: [
      {
        subject: { type: String, required: true },
        subjectKey: { type: String, required: true },
        score: { type: Number, required: true, min: 0, max: 10 },
      },
    ],
    aptitudeSubjects: [
      {
        subject: { type: String, required: true },
        subjectKey: { type: String, required: true },
        isLiked: { type: Boolean, required: true },
      },
    ],
    favoriteSubjects: [{ type: String }],
    familyFinance: { type: String, default: 'Trung bình' },
    careerValues: {
      income: { type: Number, min: 1, max: 5, default: 3 },
      stability: { type: Number, min: 1, max: 5, default: 3 },
      creativity: { type: Number, min: 1, max: 5, default: 3 },
      socialImpact: { type: Number, min: 1, max: 5, default: 3 },
      workLifeBalance: { type: Number, min: 1, max: 5, default: 3 },
      advancement: { type: Number, min: 1, max: 5, default: 3 },
    },
    riasecScores: {
      R: { type: Number, default: 0 },
      I: { type: Number, default: 0 },
      A: { type: Number, default: 0 },
      S: { type: Number, default: 0 },
      E: { type: Number, default: 0 },
      C: { type: Number, default: 0 },
    },
    riasecAnswers: [{ type: Number }],
    mbtiAnswers: [{ type: String }],
    mbtiResult: { type: String },
    mbtiScores: { type: Map, of: Number },
    softSkills: {
      communication: { type: Number, min: 1, max: 5, default: 3 },
      teamwork: { type: Number, min: 1, max: 5, default: 3 },
      problemSolving: { type: Number, min: 1, max: 5, default: 3 },
      leadership: { type: Number, min: 1, max: 5, default: 3 },
      timeManagement: { type: Number, min: 1, max: 5, default: 3 },
      creativity: { type: Number, min: 1, max: 5, default: 3 },
      criticalThinking: { type: Number, min: 1, max: 5, default: 3 },
      adaptability: { type: Number, min: 1, max: 5, default: 3 },
    },
    interests: [{ type: String }],
    aiResult: {
      topCareers: [
        {
          name: { type: String },
          cfi: { type: Number, default: 85 },
          feasibility: { type: Number, default: 80 },
          matchPercent: { type: Number },
          scoreBreakdown: {
            academic: { type: Number, default: 80 },
            riasec: { type: Number, default: 85 },
            skills: { type: Number, default: 80 },
            careerValues: { type: Number, default: 85 },
            interests: { type: Number, default: 85 },
            marketDemand: { type: Number, default: 80 },
          },
          fitReasons: {
            strengths: [{ type: String }],
            considerations: [{ type: String }],
          },
          reason: { type: String },
          jobDescription: { type: String },
          requiredSkills: [{ type: String }],
          careerIntelligence: {
            recruitmentDemandTrend: [
              {
                year: { type: String },
                level: { type: Number },
              },
            ],
            marketStatus: { type: String },
            salary: {
              entryLevel: { type: String },
              midLevel: { type: String },
              seniorLevel: { type: String },
            },
            regionDemand: { type: String },
            keySkillsTrending: [{ type: String }],
          },
          aiImpact: {
            score: { type: Number, default: 50 },
            automationRisk: { type: String },
            aiAugmentation: { type: String },
            criticalSkillsInAiEra: [{ type: String }],
          },
          riskScore: {
            level: { type: String, default: 'Trung bình' },
            description: { type: String },
          },
          trendAnalysis: {
            futurePotential: { type: String },
            recruitmentDemand: { type: String },
          },
          financialInsights: {
            averageSalary: { type: String },
            tuitionCompatibility: { type: String },
          },
          universityStrategy: {
            dream: [
              { name: { type: String }, targetScore: { type: String }, note: { type: String } },
            ],
            match: [
              { name: { type: String }, targetScore: { type: String }, note: { type: String } },
            ],
            safe: [
              { name: { type: String }, targetScore: { type: String }, note: { type: String } },
            ],
            admissionNote: { type: String },
          },
          educationPath: {
            relatedMajors: [{ type: String }],
            topUniversities: [{ type: String }],
            admissionScoreTrend: { type: String },
          },
          actionableRoadmap: {
            m0_3: [{ type: String }],
            m3_6: [{ type: String }],
            m6_12: [{ type: String }],
            y1_3: [{ type: String }],
            y3_5: [{ type: String }],
          },
          developmentRoadmap: { type: String },
          weaknessSolutions: [{ type: String }],
          gapResources: [
            {
              gap: { type: String },
              solution: { type: String },
              resources: [
                {
                  title: { type: String },
                  url: { type: String },
                  type: { type: String },
                },
              ],
            },
          ],
          usefulLinks: [{ type: String }],
          improvements: [{ type: String }],
        },
      ],
      riasecProfile: { type: String },
      overallAnalysis: { type: String },
      disclaimer: { type: String, default: 'Dự báo dựa trên xu hướng dữ liệu, không phải dự đoán chắc chắn.' },
      generatedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Assessment ||
  mongoose.model<IAssessment>('Assessment', AssessmentSchema);
