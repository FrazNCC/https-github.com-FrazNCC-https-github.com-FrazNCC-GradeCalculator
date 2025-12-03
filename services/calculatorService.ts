import { POINT_TABLES, GRADE_BOUNDARIES } from '../constants';
import { Unit, UnitType, QualificationType, CalculationResult, Grade, UnitTemplate } from '../types';

export const calculatePointsForUnit = (unit: Unit): number => {
  const { glh, type, grade } = unit;
  
  // Direct lookup
  if (POINT_TABLES[glh] && POINT_TABLES[glh][type] && POINT_TABLES[glh][type][grade] !== undefined) {
    return POINT_TABLES[glh][type][grade];
  }

  // Fallback calculation for non-standard GLH
  // Base ratios per 10 GLH derived from spec
  let multiplier = 0;
  if (type === UnitType.INTERNAL) {
      if (grade === Grade.P) multiplier = 1;      // 6 pts / 60 GLH * 10 = 1
      if (grade === Grade.M) multiplier = 1.666;  // 10 pts / 60 GLH * 10 = 1.66
      if (grade === Grade.D) multiplier = 2.666;  // 16 pts / 60 GLH * 10 = 2.66
  } else {
      if (grade === Grade.NP) multiplier = 1;     // 12 pts / 120 GLH * 10 = 1
      if (grade === Grade.P) multiplier = 1.666;  // 20 pts / 120 GLH * 10 = 1.66
      if (grade === Grade.M) multiplier = 2.666;  // 32 pts / 120 GLH * 10 = 2.66
      if (grade === Grade.D) multiplier = 4.0;    // 48 pts / 120 GLH * 10 = 4.0
  }

  return Math.round((glh / 10) * multiplier);
};

export const calculateQualification = (units: Unit[], qualType: QualificationType): CalculationResult => {
  const totalPoints = units.reduce((sum, unit) => sum + calculatePointsForUnit(unit), 0);
  
  const boundaries = GRADE_BOUNDARIES[qualType];
  
  // Find highest grade achieved
  let achievedGrade = "U";
  let achievedUcas = 0;
  
  let nextBoundary = undefined;

  // Iterate to find where we land
  for (let i = 0; i < boundaries.length; i++) {
    const b = boundaries[i];
    if (totalPoints >= b.minPoints) {
      achievedGrade = b.grade;
      achievedUcas = b.ucas;
    } else {
      // This is the next boundary
      nextBoundary = {
        grade: b.grade,
        pointsNeeded: b.minPoints - totalPoints
      };
      break; // Stop looking after finding the first un-achieved boundary
    }
  }

  return {
    totalPoints,
    grade: achievedGrade,
    ucasPoints: achievedUcas,
    nextGradeBoundary: nextBoundary
  };
};

// Helper: Merges the static course unit templates with a specific student's grades
export const mergeUnitsAndGrades = (
  templates: UnitTemplate[], 
  studentGrades: Record<string, Grade>,
  lockedGrades?: Record<string, boolean>
): Unit[] => {
  return templates.map(template => ({
    ...template,
    grade: studentGrades[template.id] || Grade.U, // Default to U if no grade recorded
    isLocked: lockedGrades ? !!lockedGrades[template.id] : false
  }));
};