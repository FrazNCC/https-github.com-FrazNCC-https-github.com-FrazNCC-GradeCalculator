export enum QualificationType {
  EXTENDED_CERTIFICATE = "Extended Certificate (360 GLH)",
  FOUNDATION_DIPLOMA = "Foundation Diploma (510/540 GLH)",
  DIPLOMA = "Diploma (720 GLH)",
  EXTENDED_DIPLOMA = "Extended Diploma (1080 GLH)"
}

export enum Subject {
  ESPORTS = "Esports",
  IT = "Information Technology",
  COMPUTING = "Computing"
}

export enum UnitType {
  INTERNAL = "Internal",
  EXTERNAL = "External"
}

export enum Grade {
  U = "U",
  NP = "NP", // Near Pass (External only)
  P = "P",
  M = "M",
  D = "D"
}

export enum UserRole {
  SUPERUSER = "Superuser",
  ADMIN = "Admin",
  TEACHER = "Teacher"
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: UserRole;
}

// Defines the structure of a unit (without a specific grade)
export interface UnitTemplate {
  id: string;
  name: string;
  glh: number;
  type: UnitType;
}

// The combination of a template and a grade, used for calculation
export interface Unit extends UnitTemplate {
  grade: Grade;
  isLocked?: boolean;
}

export interface Student {
  id: string;
  name: string;
  grades: Record<string, Grade>; // Maps UnitTemplate.id to Grade
  lockedGrades?: Record<string, boolean>; // Maps UnitTemplate.id to boolean
}

export interface Course {
  id: string;
  title: string;
  academicYear: string; // New field
  subject: Subject;
  qualification: QualificationType;
  units: UnitTemplate[];
  students: Student[];
}

export interface CalculationResult {
  totalPoints: number;
  grade: string;
  ucasPoints: number;
  nextGradeBoundary?: {
    grade: string;
    pointsNeeded: number;
  };
}

export interface GradeBoundary {
  minPoints: number;
  grade: string;
  ucas: number;
}