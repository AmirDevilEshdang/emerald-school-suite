import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getStudents, getAccounts } from '@/lib/data';
import { getCustomPages } from '@/pages/student/StudentCustomPage';
import { GraduationCap, UserCheck, User, Blocks, Image, Bot } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }: {
  title: string; value: number | string; icon: React.ElementType; color: string; delay: number;
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} className="stat-card card-hover">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const students = getStudents();
  const accounts = getAccounts();
  const customPages = getCustomPages();
  const aiLogs = JSON.parse(localStorage.getItem('ai_chat_logs') || '[]');

  const stats = [
    { title: 'دانش‌آموزان', value: students.length, icon: GraduationCap, color: 'bg-emerald-500', delay: 0.1 },
    { title: 'کل حساب‌ها', value: accounts.length, icon: User, color: 'bg-blue-500', delay: 0.15 },
    { title: 'صفحات سفارشی', value: customPages.length, icon: Blocks, color: 'bg-purple-500', delay: 0.2 },
    { title: 'مکالمات AI', value: aiLogs.length, icon: Bot, color: 'bg-violet-500', delay: 0.25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">داشبورد مدیریت</h1>
        <p className="text-muted-foreground text-sm mt-1">خوش آمدید، {currentUser?.name}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (<StatCard key={stat.title} {...stat} />))}
      </div>
    </div>
  );
};

export default AdminDashboard;
