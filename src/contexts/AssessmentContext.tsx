'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { IRiasecScores, ISoftSkills, ICareerValues } from '@/models/Assessment';

const STORAGE_KEY = 'assessment_draft';

export interface AcademicScore {
  subject: string;
  subjectKey: string;
  score: number;
}

export interface AssessmentData {
  // Step 1: Personal Info
  fullName: string;
  className: string;

  // Step 2: Academic
  academicScores: AcademicScore[];
  favoriteSubjects: string[];

  // Step 3: RIASEC
  riasecAnswers: number[];
  riasecScores: IRiasecScores;

  // Step 4: Interests & Soft Skills
  interests: string[];
  softSkills: ISoftSkills;

  // Step 5: Career Values
  careerValues: ICareerValues;
}

interface AssessmentState {
  currentStep: number;
  data: AssessmentData;
  isSubmitting: boolean;
  resultId: string | null;
  isHydrated: boolean;
}

type AssessmentAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_DATA'; payload: Partial<AssessmentData> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_RESULT_ID'; payload: string }
  | { type: 'HYDRATE'; payload: { currentStep: number; data: AssessmentData } }
  | { type: 'RESET' };

const initialData: AssessmentData = {
  fullName: '',
  className: '',
  academicScores: [],
  favoriteSubjects: [],
  riasecAnswers: new Array(42).fill(0),
  riasecScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
  interests: [],
  softSkills: {
    communication: 3,
    teamwork: 3,
    problemSolving: 3,
    leadership: 3,
    timeManagement: 3,
    creativity: 3,
    criticalThinking: 3,
    adaptability: 3,
  },
  careerValues: {
    income: 3,
    stability: 3,
    creativity: 3,
    socialImpact: 3,
    workLifeBalance: 3,
    advancement: 3,
  },
};

const initialState: AssessmentState = {
  currentStep: 0,
  data: initialData,
  isSubmitting: false,
  resultId: null,
  isHydrated: false,
};

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_RESULT_ID':
      return { ...state, resultId: action.payload };
    case 'HYDRATE':
      return { ...state, currentStep: action.payload.currentStep, data: { ...initialData, ...action.payload.data }, isHydrated: true };
    case 'RESET':
      return { ...initialState, isHydrated: true };
    default:
      return state;
  }
}

interface AssessmentContextType {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<AssessmentData>) => void;
  clearDraft: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  // ===== Load from localStorage on mount =====
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.data && parsed.data.fullName) {
          dispatch({
            type: 'HYDRATE',
            payload: {
              currentStep: parsed.currentStep || 0,
              data: parsed.data,
            },
          });
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }
    // No saved data, mark as hydrated
    dispatch({ type: 'HYDRATE', payload: { currentStep: 0, data: initialData } });
  }, []);

  // ===== Save to localStorage on every change =====
  useEffect(() => {
    if (!state.isHydrated) return;
    try {
      const toSave = {
        currentStep: state.currentStep,
        data: state.data,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage full or unavailable
    }
  }, [state.currentStep, state.data, state.isHydrated]);

  const nextStep = useCallback(() => {
    if (state.currentStep < 4) dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 0) dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
  }, [state.currentStep]);

  const updateData = useCallback((data: Partial<AssessmentData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  }, []);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <AssessmentContext.Provider value={{ state, dispatch, nextStep, prevStep, updateData, clearDraft }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
