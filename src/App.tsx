import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/auth/Home';
import HomePage from './pages/auth/Home';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import ParentDashboard from './pages/parent/Dashboard';
import StudentProfile from './pages/student/Student_Profile';
import StudentTeachers from './pages/student/Student_Teachers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />
        <Route path="/dashboard/teacher/*" element={<TeacherDashboard />} />
        <Route path="/dashboard/student/*" element={<StudentDashboard />} />
        <Route path="/dashboard/parent/*" element={<ParentDashboard />} />
        <Route path="/dashboard/student/profile" element={<StudentProfile />} />
        <Route path="/dashboard/student/teachers" element={<StudentTeachers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
