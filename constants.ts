import { Grade, QualificationType, UnitType } from './types';

// RQF Points Table (2016/2019 Specs)
// Mapping: GLH -> UnitType -> Grade -> Points
export const POINT_TABLES: Record<number, Record<UnitType, Record<Grade, number>>> = {
  60: {
    [UnitType.INTERNAL]: { [Grade.U]: 0, [Grade.NP]: 0, [Grade.P]: 6, [Grade.M]: 10, [Grade.D]: 16 },
    [UnitType.EXTERNAL]: { [Grade.U]: 0, [Grade.NP]: 4, [Grade.P]: 6, [Grade.M]: 10, [Grade.D]: 16 }, // Approx for small ext
  },
  90: {
    [UnitType.INTERNAL]: { [Grade.U]: 0, [Grade.NP]: 0, [Grade.P]: 9, [Grade.M]: 15, [Grade.D]: 24 },
    [UnitType.EXTERNAL]: { [Grade.U]: 0, [Grade.NP]: 6, [Grade.P]: 9, [Grade.M]: 15, [Grade.D]: 24 },
  },
  120: {
    [UnitType.INTERNAL]: { [Grade.U]: 0, [Grade.NP]: 0, [Grade.P]: 12, [Grade.M]: 20, [Grade.D]: 32 }, // Rare internal 120
    [UnitType.EXTERNAL]: { [Grade.U]: 0, [Grade.NP]: 12, [Grade.P]: 20, [Grade.M]: 32, [Grade.D]: 48 }, // Standard External
  }
};

// Fallback multiplier for custom GLH (based on Internal 60GLH ratios: P=1/10, M=1.66/10, D=2.66/10 approx)
// Better simplification: Points = GLH * Multiplier
// Internal: P=0.1, M=0.166, D=0.266
// External: NP=0.1, P=0.166, M=0.266, D=0.4

export const GRADE_BOUNDARIES: Record<QualificationType, Array<{ minPoints: number; grade: string; ucas: number }>> = {
  [QualificationType.EXTENDED_CERTIFICATE]: [
    { minPoints: 36, grade: "P", ucas: 16 },
    { minPoints: 52, grade: "M", ucas: 32 },
    { minPoints: 74, grade: "D", ucas: 48 },
    { minPoints: 90, grade: "D*", ucas: 56 },
  ],
  [QualificationType.FOUNDATION_DIPLOMA]: [
    { minPoints: 51, grade: "P", ucas: 24 }, // Approx points for 510 GLH
    { minPoints: 73, grade: "M", ucas: 48 },
    { minPoints: 104, grade: "D", ucas: 72 },
    { minPoints: 130, grade: "D*", ucas: 84 },
  ],
  [QualificationType.DIPLOMA]: [
    { minPoints: 72, grade: "PP", ucas: 32 },
    { minPoints: 88, grade: "MP", ucas: 48 },
    { minPoints: 104, grade: "MM", ucas: 64 },
    { minPoints: 124, grade: "DM", ucas: 80 },
    { minPoints: 144, grade: "DD", ucas: 96 },
    { minPoints: 162, grade: "D*D", ucas: 104 },
    { minPoints: 180, grade: "D*D*", ucas: 112 },
  ],
  [QualificationType.EXTENDED_DIPLOMA]: [
    { minPoints: 108, grade: "PPP", ucas: 48 },
    { minPoints: 124, grade: "MPP", ucas: 64 },
    { minPoints: 140, grade: "MMP", ucas: 80 },
    { minPoints: 156, grade: "MMM", ucas: 96 },
    { minPoints: 176, grade: "DMM", ucas: 112 },
    { minPoints: 196, grade: "DDM", ucas: 128 },
    { minPoints: 216, grade: "DDD", ucas: 144 },
    { minPoints: 234, grade: "D*DD", ucas: 152 },
    { minPoints: 252, grade: "D*D*D", ucas: 160 },
    { minPoints: 270, grade: "D*D*D*", ucas: 168 },
  ]
};

export const SAMPLE_UNITS_ESPORTS = [
  { name: "Unit 1: Introduction to Esports", glh: 60, type: UnitType.INTERNAL },
  { name: "Unit 2: Esports Skills, Strategies and Analysis", glh: 120, type: UnitType.INTERNAL },
  { name: "Unit 3: Enterprise and Entrepreneurship", glh: 120, type: UnitType.INTERNAL },
  { name: "Unit 4: Health, Wellbeing and Fitness", glh: 60, type: UnitType.INTERNAL }
];

export const SAMPLE_UNITS_IT = [
  { name: "Unit 1: Information Technology Systems", glh: 120, type: UnitType.EXTERNAL },
  { name: "Unit 2: Creating Systems to Manage Information", glh: 90, type: UnitType.EXTERNAL },
  { name: "Unit 3: Using Social Media in Business", glh: 90, type: UnitType.INTERNAL },
  { name: "Unit 6: Website Development", glh: 60, type: UnitType.INTERNAL }
];