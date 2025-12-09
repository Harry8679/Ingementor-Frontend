import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/auth/Home';
import HomePage from './pages/auth/Home';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import ParentDashboard from './pages/parent/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/teacher/*" element={<TeacherDashboard />} />
        <Route path="/dashboard/student/*" element={<StudentDashboard />} />
        <Route path="/dashboard/parent/*" element={<ParentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
