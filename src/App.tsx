import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/auth/Home';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import ParentDashboard from './pages/parent/Dashboard';

// Student Pages
import StudentProfile from './pages/student/Student_Profile';
import StudentTeachers from './pages/student/Student_Teachers';
import StudentSubjects from './pages/student/Student_Subjects';
import StudentGrades from './pages/student/Student_Grades';
import StudentProgress from './pages/student/Student_Progress';
import StudentLessons from './pages/student/Student_Lessons';
import StudentMessages from './pages/student/Student_Messages';
import StudentSettings from './pages/student/Student_Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard/teacher/*" element={<TeacherDashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/parent/*" element={<ParentDashboard />} />
        
        {/* Student Specific Routes */}
        <Route path="/dashboard/student/profile" element={<StudentProfile />} />
        <Route path="/dashboard/student/teachers" element={<StudentTeachers />} />
        <Route path="/dashboard/student/subjects" element={<StudentSubjects />} />
        <Route path="/dashboard/student/grades" element={<StudentGrades />} />
        <Route path="/dashboard/student/progress" element={<StudentProgress />} />
        <Route path="/dashboard/student/lessons" element={<StudentLessons />} />
        <Route path="/dashboard/student/messages" element={<StudentMessages />} />
        <Route path="/dashboard/student/settings" element={<StudentSettings />} />

        {/* Teacher Routes */}
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard/teacher/profile" element={<TeacherProfile />} />
        <Route path="/dashboard/teacher/students" element={<TeacherStudents />} />
        <Route path="/dashboard/teacher/subjects" element={<TeacherSubjects />} />
        <Route path="/dashboard/teacher/lessons" element={<TeacherLessons />} />
        <Route path="/dashboard/teacher/availability" element={<TeacherAvailability />} />
        <Route path="/dashboard/teacher/messages" element={<TeacherMessages />} />
        <Route path="/dashboard/teacher/statistics" element={<TeacherStatistics />} />
        <Route path="/dashboard/teacher/settings" element={<TeacherSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;