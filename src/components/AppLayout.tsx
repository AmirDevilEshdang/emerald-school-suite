import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, BookOpen, Star, FileText, Bell, Image, Blocks,
  MessageSquare, Settings, LogOut, Menu, X, GraduationCap, User,
  ClipboardList, UserCheck, ChevronRight, School
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: Record<Role, NavItem[]> = {
  admin: [
    { label: 'داشبورد', href: '/admin', icon: LayoutDashboard },
    { label: 'دانش‌آموزان', href: '/admin/students', icon: GraduationCap },
    { label: 'حساب‌های کاربری', href: '/admin/accounts', icon: Users },
    { label: 'معلمان', href: '/admin/teachers', icon: UserCheck },
    { label: 'معاونان', href: '/admin/assistants', icon: User },
    { label: 'تکالیف', href: '/admin/homework', icon: BookOpen },
    { label: 'کارنامه‌ها', href: '/admin/report-cards', icon: FileText },
    { label: 'اطلاعیه‌ها', href: '/admin/announcements', icon: Bell },
    { label: 'اسلایدر', href: '/admin/slider', icon: Image },
    { label: 'بلوک‌های سفارشی', href: '/admin/custom-blocks', icon: Blocks },
    { label: 'چت', href: '/admin/chat', icon: MessageSquare },
    { label: 'تنظیمات', href: '/admin/settings', icon: Settings },
  ],
  assistant: [
    { label: 'داشبورد', href: '/assistant', icon: LayoutDashboard },
    { label: 'دانش‌آموزان', href: '/assistant/students', icon: GraduationCap },
    { label: 'تکالیف', href: '/assistant/homework', icon: BookOpen },
    { label: 'کارنامه‌ها', href: '/assistant/report-cards', icon: FileText },
    { label: 'چت', href: '/assistant/chat', icon: MessageSquare },
    { label: 'حساب کاربری', href: '/assistant/profile', icon: User },
  ],
  teacher: [
    { label: 'داشبورد', href: '/teacher', icon: LayoutDashboard },
    { label: 'تکالیف', href: '/teacher/homework', icon: BookOpen },
    { label: 'نمرات', href: '/teacher/grades', icon: Star },
    { label: 'چت', href: '/teacher/chat', icon: MessageSquare },
    { label: 'حساب کاربری', href: '/teacher/profile', icon: User },
  ],
  student: [
    { label: 'خانه', href: '/student', icon: LayoutDashboard },
    { label: 'تکالیف', href: '/student/homework', icon: BookOpen },
    { label: 'نمرات و کارنامه', href: '/student/grades', icon: Star },
    { label: 'اطلاعیه‌ها', href: '/student/announcements', icon: Bell },
    { label: 'چت', href: '/student/chat', icon: MessageSquare },
    { label: 'حساب کاربری', href: '/student/profile', icon: User },
  ],
};

const roleTitles: Record<Role, string> = {
  admin: 'پنل مدیریت',
  assistant: 'پنل معاون',
  teacher: 'پنل معلم',
  student: 'پنل دانش‌آموز',
};

interface SidebarProps {
  role: Role;
}

const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[role];
  const settings = JSON.parse(localStorage.getItem('systemSettings') || '{}');

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="h-full flex flex-col sidebar-gradient text-sidebar-foreground">
      {/* Header */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <School className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-sidebar-foreground/60 font-medium">{roleTitles[role]}</p>
            <p className="text-sm font-bold text-sidebar-foreground leading-tight truncate max-w-[140px]">
              {settings.schoolName || 'سیستم مدرسه'}
            </p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">{currentUser?.name}</p>
            <p className="text-xs text-sidebar-foreground/60">@{currentUser?.username}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className={cn('w-4.5 h-4.5 shrink-0', isActive ? 'text-primary-foreground' : 'text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground')} size={18} />
              <span className="text-sm">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 mr-auto rotate-180" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-sidebar-foreground/70 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm">خروج از سیستم</span>
        </button>
      </div>
    </div>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
  role: Role;
}

const AppLayout = ({ children, role }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-sidebar-border">
        <Sidebar role={role} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              <Sidebar role={role} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-card border-b border-border shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
