import { Interview } from './interview';

export type ScheduleStatus = 'DRAFT' | 'VALIDATING' | 'PUBLISHED' | 'ARCHIVED';
export type SolverStatus = 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE' | 'MODEL_INVALID' | 'UNKNOWN';

export interface ScheduleDiagnostics {
  solverStatus: SolverStatus;
  variablesCount: number;
  constraintsCount: number;
  solveTimeMs: number;
  conflictsCount: number;
  objectiveScore: number;
}

export interface ScheduleVersion {
  id: string;
  versionNumber: number;
  status: ScheduleStatus;
  startDate: string;
  endDate: string;
  interviews: Interview[];
  diagnostics: ScheduleDiagnostics;
  createdAt: string;
  publishedAt?: string;
}
