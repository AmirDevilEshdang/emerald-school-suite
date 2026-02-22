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
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSlider from "./pages/admin/AdminSlider";
import AdminCustomPages from "./pages/admin/AdminCustomPages";
import AdminAIMessages from "./pages/admin/AdminAIMessages";

// Assistant pages
import AssistantDashboard from "./pages/assistant/AssistantDashboard";
import AssistantStudents from "./pages/assistant/AssistantStudents";

// Student pages
import StudentHome from "./pages/student/StudentHome";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentAI from "./pages/student/StudentAI";
import StudentCustomPage from "./pages/student/StudentCustomPage";

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
            <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminAnnouncements /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminSettings /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/slider" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminSlider /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/custom-pages" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminCustomPages /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/ai-messages" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><AdminAIMessages /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/chat" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout role="admin"><Profile /></AppLayout></ProtectedRoute>} />

            {/* Assistant routes */}
            <Route path="/assistant" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><AssistantDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/assistant/students" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><AssistantStudents /></AppLayout></ProtectedRoute>} />
            <Route path="/assistant/chat" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/assistant/profile" element={<ProtectedRoute allowedRoles={['assistant']}><AppLayout role="assistant"><Profile /></AppLayout></ProtectedRoute>} />

            {/* Teacher routes - minimal */}
            <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><div className="text-center py-20 text-muted-foreground">پنل معلم</div></AppLayout></ProtectedRoute>} />
            <Route path="/teacher/chat" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher']}><AppLayout role="teacher"><Profile /></AppLayout></ProtectedRoute>} />

            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentHome /></AppLayout></ProtectedRoute>} />
            <Route path="/student/announcements" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentAnnouncements /></AppLayout></ProtectedRoute>} />
            <Route path="/student/chat" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/student/ai" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentAI /></AppLayout></ProtectedRoute>} />
            <Route path="/student/page/:pageId" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><StudentCustomPage /></AppLayout></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><AppLayout role="student"><Profile /></AppLayout></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
