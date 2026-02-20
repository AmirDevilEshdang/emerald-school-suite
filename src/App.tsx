import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";

// Pages
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminHomework from "./pages/admin/AdminHomework";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminSettings from "./pages/admin/AdminSettings";

// Assistant pages
import AssistantDashboard from "./pages/assistant/AssistantDashboard";
import AssistantStudents from "./pages/assistant/AssistantStudents";
import AssistantHomework from "./pages/assistant/AssistantHomework";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherHomework from "./pages/teacher/TeacherHomework";
import TeacherGrades from "./pages/teacher/TeacherGrades";

// Student pages
import StudentHome from "./pages/student/StudentHome";
import StudentHomework from "./pages/student/StudentHomework";
import StudentGrades from "./pages/student/StudentGrades";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";

const queryClient = new QueryClient();

const RootRedirect = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" replace />;
  const routes: Record<string, string> = { admin: '/admin', assistant: '/assistant', teacher: '/teacher', student: '/student' };
  return <Navigate to={routes[currentUser.role] || '/auth'} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/auth" element={<Auth />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminStudents /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/accounts" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminAccounts /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/homework" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminHomework /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminAnnouncements /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminSettings /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/chat" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><Profile /></AppLayout></ProtectedRoute>} />

            {/* Assistant routes */}
            <Route path="/assistant" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><AssistantDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/assistant/students" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><AssistantStudents /></AppLayout></ProtectedRoute>} />
            <Route path="/assistant/homework" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><AssistantHomework /></AppLayout></ProtectedRoute>} />
            <Route path="/assistant/chat" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/assistant/profile" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><Profile /></AppLayout></ProtectedRoute>} />

            {/* Teacher routes */}
            <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><TeacherDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/teacher/homework" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><TeacherHomework /></AppLayout></ProtectedRoute>} />
            <Route path="/teacher/grades" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><TeacherGrades /></AppLayout></ProtectedRoute>} />
            <Route path="/teacher/chat" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><Profile /></AppLayout></ProtectedRoute>} />

            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentHome /></AppLayout></ProtectedRoute>} />
            <Route path="/student/homework" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentHomework /></AppLayout></ProtectedRoute>} />
            <Route path="/student/grades" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentGrades /></AppLayout></ProtectedRoute>} />
            <Route path="/student/announcements" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentAnnouncements /></AppLayout></ProtectedRoute>} />
            <Route path="/student/chat" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><Profile /></AppLayout></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
