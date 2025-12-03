import React, { useState } from 'react';
import { Users, UserPlus, ChevronLeft, Trash2, Search, Book, GraduationCap, Lock } from 'lucide-react';
import { Student, Grade, UnitType, Course, User, UserRole } from '../types';
import { mergeUnitsAndGrades, calculateQualification, calculatePointsForUnit } from '../services/calculatorService';
import ResultsPanel from './ResultsPanel';

interface StudentManagerProps {
  course: Course;
  onUpdateCourse: (course: Course) => void;
  onBack: () => void;
  currentUser: User;
}

const StudentManager: React.FC<StudentManagerProps> = ({
  course,
  onUpdateCourse,
  onBack,
  currentUser
}) => {
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { students, units, qualification, subject } = course;
  const isEditor = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERUSER;
  const isTeacher = currentUser.role === UserRole.TEACHER;

  // Helper to add a new student
  const addStudent = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newStudent: Student = {
      id: newId,
      name: `Student ${students.length + 1}`,
      grades: {},
      lockedGrades: {}
    };
    onUpdateCourse({
        ...course,
        students: [...students, newStudent]
    });
    setEditingStudentId(newId); // Immediately open for editing
  };

  const deleteStudent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(!window.confirm("Are you sure you want to delete this student and their grades?")) return;
    
    onUpdateCourse({
        ...course,
        students: students.filter(s => s.id !== id)
    });
    
    if (editingStudentId === id) setEditingStudentId(null);
  };

  const updateStudentName = (id: string, name: string) => {
    onUpdateCourse({
        ...course,
        students: students.map(s => s.id === id ? { ...s, name } : s)
    });
  };

  const updateStudentGrade = (studentId: string, unitId: string, grade: Grade) => {
    onUpdateCourse({
        ...course,
        students: students.map(s => {
            if (s.id === studentId) {
                return {
                ...s,
                grades: {
                    ...s.grades,
                    [unitId]: grade
                }
                };
            }
            return s;
        })
    });
  };

  const updateStudentLock = (studentId: string, unitId: string, locked: boolean) => {
    onUpdateCourse({
        ...course,
        students: students.map(s => {
            if (s.id === studentId) {
                return {
                ...s,
                lockedGrades: {
                    ...(s.lockedGrades || {}),
                    [unitId]: locked
                }
                };
            }
            return s;
        })
    });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Views ---

  // 1. Student Editor View
  if (editingStudentId) {
    const student = students.find(s => s.id === editingStudentId);
    if (!student) return null;

    // Combine templates with student grades to get full unit objects
    const calculatedUnits = mergeUnitsAndGrades(units, student.grades, student.lockedGrades);
    const results = calculateQualification(calculatedUnits, qualification);

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setEditingStudentId(null)}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Student List
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-160px)]">
           
           {/* Fixed Header Section (Name + Results) */}
           <div className="bg-white p-6 border-b border-slate-200 shrink-0 z-10 shadow-sm relative">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Name Input */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <label className="text-[10px] text-slate-500 uppercase font-semibold block mb-0.5">Student Name</label>
                            <input 
                                type="text" 
                                value={student.name}
                                disabled={!isEditor}
                                onChange={(e) => updateStudentName(student.id, e.target.value)}
                                className={`block w-full text-2xl font-bold bg-transparent text-slate-900 border-none p-0 focus:ring-0 placeholder-slate-400 truncate ${!isEditor ? 'opacity-80' : ''}`}
                                placeholder="Enter Name..."
                                title={!isEditor ? "Only Admin can edit names" : ""}
                            />
                        </div>
                    </div>

                    {/* Right: Compact Results Panel */}
                    <div className="shrink-0">
                        <ResultsPanel results={results} variant="compact" />
                    </div>
                </div>
           </div>

           {/* Scrollable Content: Grades Table */}
           <div className="overflow-y-auto grow bg-slate-50/50 p-6">
                 <div className="max-w-4xl mx-auto">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
                        <Book className="w-4 h-4 mr-2 text-brand-500" />
                        Unit Grades Entry
                    </h3>
                    
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600">Unit Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 w-32">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 w-56">Grade</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-right w-24">Points</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                            {calculatedUnits.map((unit) => (
                                <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center">
                                            {unit.name}
                                            {unit.isLocked && <Lock className="w-3 h-3 text-slate-400 ml-2" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${unit.type === UnitType.EXTERNAL ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                            {unit.type}
                                            <span className="mx-1.5 opacity-30">|</span>
                                            {unit.glh} GLH
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <select 
                                                value={unit.grade} 
                                                disabled={unit.isLocked}
                                                onChange={(e) => updateStudentGrade(student.id, unit.id, e.target.value as Grade)}
                                                className={`flex-1 border text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2 font-bold cursor-pointer transition-colors shadow-sm
                                                    ${unit.isLocked ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200' : 
                                                    unit.grade === Grade.D ? 'text-purple-700 bg-purple-50 border-purple-200' : 
                                                    unit.grade === Grade.M ? 'text-blue-700 bg-blue-50 border-blue-200' : 
                                                    unit.grade === Grade.P ? 'text-green-700 bg-green-50 border-green-200' : 
                                                    unit.grade === Grade.NP ? 'text-amber-700 bg-amber-50 border-amber-200' :
                                                    'text-slate-500 bg-slate-50 border-slate-200'}`}
                                            >
                                                <option value={Grade.U} className="text-slate-900 bg-white">U - Unclassified</option>
                                                {unit.type === UnitType.EXTERNAL && <option value={Grade.NP} className="text-slate-900 bg-white">NP - Near Pass</option>}
                                                <option value={Grade.P} className="text-slate-900 bg-white">P - Pass</option>
                                                <option value={Grade.M} className="text-slate-900 bg-white">M - Merit</option>
                                                <option value={Grade.D} className="text-slate-900 bg-white">D - Distinction</option>
                                            </select>
                                            
                                            <div className="relative group">
                                                <input 
                                                    type="checkbox"
                                                    checked={unit.isLocked || false}
                                                    disabled={unit.isLocked && isTeacher}
                                                    onChange={(e) => updateStudentLock(student.id, unit.id, e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={unit.isLocked && isTeacher ? "Locked: Only Admin/Superuser can unlock" : (unit.isLocked ? "Unlock grade" : "Lock grade")}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-600 font-bold bg-slate-50/50">
                                        {calculatePointsForUnit(unit)}
                                    </td>
                                </tr>
                            ))}
                            {units.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-slate-500 bg-slate-50">
                                        <Book className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        <p>No units configured.</p>
                                        <p className="text-xs mt-1">Please go to the Course tab to add units.</p>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                 </div>
           </div>
        </div>
      </div>
    );
  }

  // 2. Student List View
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
       
       <button 
          onClick={onBack}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-4 transition-colors"
       >
          <ChevronLeft className="w-4 h-4 mr-1" /> Choose Different Course
       </button>

       {/* List Header */}
       <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-brand-600" />
                {course.title} 
            </h2>
            <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                <span className="font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{course.subject}</span>
                <span>•</span>
                <span>{course.academicYear}</span>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <input 
                    type="text" 
                    placeholder="Search students..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border-slate-300 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-brand-500 focus:border-brand-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
             </div>
             {isEditor && (
                <button 
                    onClick={addStudent}
                    className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Student</span>
                    <span className="sm:hidden">Add</span>
                </button>
             )}
          </div>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStudents.map(student => {
             // Calculate quick stats for the card
             const calculatedUnits = mergeUnitsAndGrades(units, student.grades);
             const result = calculateQualification(calculatedUnits, qualification);
             
             return (
               <div 
                  key={student.id} 
                  onClick={() => setEditingStudentId(student.id)}
                  className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-brand-500 shadow-sm cursor-pointer transition-all group relative animate-in fade-in duration-300 hover:shadow-md hover:translate-y-[-2px]"
               >
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors font-bold text-lg border border-slate-200">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                             <h3 className="font-bold text-slate-900 truncate w-32 sm:w-40 group-hover:text-brand-600 transition-colors">{student.name}</h3>
                             <div className="text-xs text-slate-500">{Object.keys(student.grades).length} / {units.length} Units</div>
                        </div>
                     </div>
                     {isEditor && (
                        <button 
                            onClick={(e) => deleteStudent(student.id, e)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-md"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                     )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                     <div className="text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Grade</div>
                        <div className="text-lg font-bold text-brand-600">{result.grade}</div>
                     </div>
                     <div className="text-center border-l border-slate-100 pl-4">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">UCAS</div>
                        <div className="text-lg font-bold text-slate-700">{result.ucasPoints}</div>
                     </div>
                     <div className="text-center border-l border-slate-100 pl-4">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Points</div>
                        <div className="text-lg font-bold text-slate-700">{result.totalPoints}</div>
                     </div>
                  </div>
               </div>
             );
          })}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
               <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-slate-800">No students found</h3>
               <p className="text-slate-500 mb-6">
                 {searchTerm ? "Try adjusting your search terms." : (isEditor ? "Add a student to this course to start tracking." : "Ask an administrator to add students.")}
               </p>
               {!searchTerm && isEditor && (
                   <button 
                    onClick={addStudent}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors shadow-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Create First Student</span>
                </button>
               )}
            </div>
          )}
       </div>
    </div>
  );
};

export default StudentManager;