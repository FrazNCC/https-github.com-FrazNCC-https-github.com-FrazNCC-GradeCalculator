import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, Edit2, Calendar, Layout, ArrowLeft, Save, Lock } from 'lucide-react';
import { UnitTemplate, Subject, QualificationType, UnitType, Course, User, UserRole } from '../types';
import { SAMPLE_UNITS_ESPORTS, SAMPLE_UNITS_IT } from '../constants';

interface CourseManagerProps {
  courses: Course[];
  onCreateCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  currentUser: User;
}

const CourseManager: React.FC<CourseManagerProps> = ({
  courses,
  onCreateCourse,
  onUpdateCourse,
  onDeleteCourse,
  currentUser
}) => {
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const isEditor = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPERUSER;

  // --- Actions ---

  const handleStartCreate = () => {
    const newCourse: Course = {
        id: Math.random().toString(36).substr(2, 9),
        title: "New Course",
        academicYear: "2024-25",
        subject: Subject.ESPORTS,
        qualification: QualificationType.EXTENDED_DIPLOMA,
        units: [],
        students: []
    };
    onCreateCourse(newCourse);
    setEditingCourseId(newCourse.id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm("Delete this course? All student data associated with it will be lost.")) {
          onDeleteCourse(id);
          if(editingCourseId === id) setEditingCourseId(null);
      }
  }

  // --- Render Logic ---

  // 1. LIST VIEW
  if (!editingCourseId) {
      return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Course Builder</h2>
                    <p className="text-slate-500">Create and manage your course specifications.</p>
                </div>
                {isEditor && (
                  <button 
                      onClick={handleStartCreate}
                      className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-brand-500/20"
                  >
                      <Plus className="w-5 h-5" />
                      <span>Create New Course</span>
                  </button>
                )}
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Course Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Year</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Subject</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Units</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {courses.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{c.title}</div>
                                    <div className="text-xs text-slate-500">{c.qualification}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{c.academicYear}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {c.subject}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{c.units.length} Units</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        {isEditor ? (
                                          <>
                                            <button 
                                                onClick={() => setEditingCourseId(c.id)}
                                                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                                title="Edit Course"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(c.id, e)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Course"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                          </>
                                        ) : (
                                          <div className="flex items-center text-xs text-slate-400 space-x-1 cursor-not-allowed" title="Read Only">
                                             <Lock className="w-3 h-3" />
                                             <span>Read Only</span>
                                          </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {courses.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No courses found. {isEditor && 'Click "Create New Course" to begin.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
          </div>
      );
  }

  // 2. EDITOR VIEW
  const course = courses.find(c => c.id === editingCourseId);
  if (!course) return null;

  const updateField = (field: keyof Course, value: any) => {
      onUpdateCourse({ ...course, [field]: value });
  };

  const updateUnits = (newUnits: UnitTemplate[]) => {
      onUpdateCourse({ ...course, units: newUnits });
  };

  // Unit Actions
  const addUnit = () => {
    const newUnit: UnitTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New Unit`,
      glh: 60,
      type: UnitType.INTERNAL,
    };
    updateUnits([...course.units, newUnit]);
  };

  const removeUnit = (id: string) => {
    updateUnits(course.units.filter(u => u.id !== id));
  };

  const updateUnit = (id: string, field: keyof UnitTemplate, value: any) => {
    updateUnits(course.units.map(u => {
      if (u.id === id) {
        return { ...u, [field]: value };
      }
      return u;
    }));
  };

  const loadPresets = () => {
      if(course.units.length > 0 && !window.confirm("This will replace all current units. Continue?")) return;
      
      const samples = course.subject === Subject.ESPORTS ? SAMPLE_UNITS_ESPORTS : SAMPLE_UNITS_IT;
      const templates: UnitTemplate[] = samples.map(s => ({
        id: Math.random().toString(36).substr(2, 9),
        name: s.name,
        glh: s.glh,
        type: s.type,
      }));
      updateUnits(templates);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      <div className="flex items-center space-x-4 mb-2">
          <button 
            onClick={() => setEditingCourseId(null)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-500"
          >
              <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Edit Course</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Settings */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center">
                    <Layout className="w-4 h-4 mr-2 text-brand-500" />
                    Basic Details
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Course Name</label>
                        <input 
                            type="text"
                            value={course.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 placeholder-slate-400"
                            placeholder="e.g. Year 12 Esports"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Academic Year</label>
                        <div className="relative">
                            <input 
                                type="text"
                                value={course.academicYear}
                                onChange={(e) => updateField('academicYear', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 pl-9 placeholder-slate-400"
                                placeholder="e.g. 2025-26"
                            />
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Subject Area</label>
                        <select 
                            value={course.subject} 
                            onChange={(e) => updateField('subject', e.target.value as Subject)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
                        >
                            {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Qualification Size</label>
                        <select 
                            value={course.qualification} 
                            onChange={(e) => updateField('qualification', e.target.value as QualificationType)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
                        >
                            {Object.values(QualificationType).map(q => <option key={q} value={q}>{q}</option>)}
                        </select>
                    </div>
                </div>
              </div>
          </div>

          {/* Right Column: Units */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-md font-bold text-slate-800 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-brand-500" />
                            Unit Selection
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Configure the units required for this course.</p>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={loadPresets}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200"
                        >
                            Load Standard Units
                        </button>
                        <button 
                            onClick={addUnit}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Unit</span>
                        </button>
                    </div>
                </div>
                
                <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 w-1/2">Unit Name</th>
                                <th className="px-4 py-3">GLH</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {course.units.map((unit) => (
                                <tr key={unit.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <input 
                                            type="text" 
                                            value={unit.name} 
                                            onChange={(e) => updateUnit(unit.id, 'name', e.target.value)}
                                            className="w-full bg-transparent border-b border-transparent focus:border-brand-500 focus:ring-0 px-0 text-slate-900 text-sm font-medium placeholder-slate-400"
                                            placeholder="Unit Name"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <select 
                                            value={unit.glh} 
                                            onChange={(e) => updateUnit(unit.id, 'glh', Number(e.target.value))}
                                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded focus:ring-brand-500 focus:border-brand-500 block w-full p-1.5"
                                        >
                                            <option value={60}>60</option>
                                            <option value={90}>90</option>
                                            <option value={120}>120</option>
                                            <option value={360}>360</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select 
                                            value={unit.type} 
                                            onChange={(e) => updateUnit(unit.id, 'type', e.target.value)}
                                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded focus:ring-brand-500 focus:border-brand-500 block w-full p-1.5"
                                        >
                                            <option value={UnitType.INTERNAL}>Internal</option>
                                            <option value={UnitType.EXTERNAL}>External</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button 
                                            onClick={() => removeUnit(unit.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {course.units.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No units added yet.
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
};

export default CourseManager;