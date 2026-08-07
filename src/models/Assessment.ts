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

export interface ICareerRecommendation {
  name: string;
  matchPercent: number;
  reason: string;
  jobDescription: string;
  requiredSkills: string[];
  trendAnalysis: {
    futurePotential: string;
    recruitmentDemand: string;
  };
  financialInsights: {
    averageSalary: string;
    tuitionCompatibility: string;
  };
  educationPath: {
    relatedMajors: string[];
    topUniversities: string[];
    admissionScoreTrend: string;
  };
  developmentRoadmap: string;
  weaknessSolutions: string[];
  usefulLinks: string[];
  improvements: string[];
}

export interface IAiResult {
  topCareers: ICareerRecommendation[];
  riasecProfile: string;
  overallAnalysis: string;
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
          matchPercent: { type: Number },
          reason: { type: String },
          jobDescription: { type: String },
          requiredSkills: [{ type: String }],
          trendAnalysis: {
            futurePotential: { type: String },
            recruitmentDemand: { type: String },
          },
          financialInsights: {
            averageSalary: { type: String },
            tuitionCompatibility: { type: String },
          },
          educationPath: {
            relatedMajors: [{ type: String }],
            topUniversities: [{ type: String }],
            admissionScoreTrend: { type: String },
          },
          developmentRoadmap: { type: String },
          weaknessSolutions: [{ type: String }],
          usefulLinks: [{ type: String }],
          improvements: [{ type: String }],
        },
      ],
      riasecProfile: { type: String },
      overallAnalysis: { type: String },
      generatedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Assessment ||
  mongoose.model<IAssessment>('Assessment', AssessmentSchema);
