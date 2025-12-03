import React, { useState, useEffect } from 'react';
import { Calculator, LayoutGrid, Settings, Book, ArrowRight, Calendar, LogOut, ShieldCheck } from 'lucide-react';
import { 
  QualificationType, 
  Subject, 
  Course,
  User,
  UserRole
} from './types';
import { 
  SAMPLE_UNITS_ESPORTS 
} from './constants';
import StudentManager from './components/StudentManager';
import CourseManager from './components/CourseManager';
import LoginScreen from './components/LoginScreen';
import UserManagement from './components/UserManagement';

function App() {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: 'root-admin',
      username: 'Frazadmin',
      password: 'Frazadmin',
      role: UserRole.SUPERUSER
    },
    {
      id: 'default-teacher',
      username: 'teacher',
      password: 'password',
      role: UserRole.TEACHER
    },
     {
      id: 'default-admin',
      username: 'admin',
      password: 'password',
      role: UserRole.ADMIN
    }
  ]);

  // --- App State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder' | 'users'>('dashboard');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // --- Initialization ---
  useEffect(() => {
    if (courses.length === 0) {
        // Create an initial sample course
        const initialCourse: Course = {
            id: Math.random().toString(36).substr(2, 9),
            title: "Year 12 Esports Group A",
            academicYear: "2024-25",
            subject: Subject.ESPORTS,
            qualification: QualificationType.EXTENDED_DIPLOMA,
            units: SAMPLE_UNITS_ESPORTS.map(s => ({
                id: Math.random().toString(36).substr(2, 9),
                name: s.name,
                glh: s.glh,
                type: s.type,
            })),
            students: []
        };
        setCourses([initialCourse]);
    }
  }, []);

  // --- User Actions ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedCourseId(null);
    setActiveTab('dashboard');
  };

  const handleAddUser = (newUser: User) => {
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  // --- Course Actions ---
  const handleCreateCourse = (newCourse: Course) => {
      setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
      setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const handleDeleteCourse = (courseId: string) => {
      setCourses(courses.filter(c => c.id !== courseId));
      if (selectedCourseId === courseId) setSelectedCourseId(null);
  };

  // Helper to get the actual object
  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  // Helper for card colors based on subject
  const getCardColor = (subject: Subject) => {
    switch(subject) {
      case Subject.ESPORTS: return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
      case Subject.IT: return "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400";
      case Subject.COMPUTING: return "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500";
      default: return "bg-gradient-to-br from-slate-500 to-slate-700";
    }
  };

  // --- Render: Login Screen ---
  if (!currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  // --- Render: Main App ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-2 flex-shrink-0 cursor-pointer" onClick={() => { setActiveTab('dashboard'); setSelectedCourseId(null); }}>
            <div className="bg-brand-600 text-white p-2 rounded-lg shadow-md shadow-brand-500/30">
               <Calculator className="w-5 h-5" />
            </div>
            <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800 leading-none">
                GradeMaster
                </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg flex-shrink-0 border border-slate-200">
              <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-bold rounded-md transition-all ${
                      activeTab === 'dashboard' 
                      ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              <button 
                  onClick={() => setActiveTab('builder')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-bold rounded-md transition-all ${
                      activeTab === 'builder' 
                      ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Builder</span>
              </button>

              {currentUser.role === UserRole.SUPERUSER && (
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm font-bold rounded-md transition-all ${
                      activeTab === 'users' 
                      ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Users</span>
                </button>
              )}
            </nav>

            {/* User Profile / Logout */}
            <div className="flex items-center border-l border-slate-200 pl-4 space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">{currentUser.username}</div>
                <div className="text-xs text-slate-500 font-medium">{currentUser.role}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* PAGE 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
            <>
                {!selectedCourse ? (
                    <div className="animate-in fade-in duration-300">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Select a Course</h2>
                            <p className="text-slate-500">Choose a course to manage students and view grades.</p>
                        </div>

                        {courses.length === 0 ? (
                             <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-300 shadow-sm">
                                <Book className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-slate-800">No Courses Available</h3>
                                <p className="text-slate-500 mb-6">Go to the Course Builder to create your first course.</p>
                                <button 
                                    onClick={() => setActiveTab('builder')}
                                    className="px-5 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition-colors shadow-sm"
                                >
                                    Go to Course Builder
                                </button>
                             </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map(course => (
                                    <div 
                                        key={course.id}
                                        onClick={() => setSelectedCourseId(course.id)}
                                        className={`${getCardColor(course.subject)} group cursor-pointer rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden text-white`}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Book className="w-24 h-24 rotate-12" />
                                        </div>
                                        
                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                                                        {course.subject}
                                                    </span>
                                                    <div className="flex items-center text-xs font-medium text-white/80">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {course.academicYear}
                                                    </div>
                                                </div>
                                                
                                                <h3 className="text-xl font-extrabold text-white mb-1 shadow-black/10">
                                                    {course.title}
                                                </h3>
                                                
                                                <p className="text-xs text-white/80 mb-4 truncate font-medium">
                                                    {course.qualification}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-4">
                                                <div className="text-sm text-white font-semibold">
                                                    {course.students.length} Students
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-brand-600 transition-all shadow-sm">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <StudentManager 
                        course={selectedCourse}
                        onUpdateCourse={handleUpdateCourse}
                        onBack={() => setSelectedCourseId(null)}
                        currentUser={currentUser}
                    />
                )}
            </>
        )}

        {/* PAGE 2: COURSE BUILDER */}
        {activeTab === 'builder' && (
            <CourseManager 
                courses={courses}
                onCreateCourse={handleCreateCourse}
                onUpdateCourse={handleUpdateCourse}
                onDeleteCourse={handleDeleteCourse}
                currentUser={currentUser}
            />
        )}

        {/* PAGE 3: USER MANAGEMENT (SUPERUSER ONLY) */}
        {activeTab === 'users' && currentUser.role === UserRole.SUPERUSER && (
            <UserManagement 
              currentUser={currentUser}
              allUsers={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
        )}

      </main>
    </div>
  );
}

export default App;