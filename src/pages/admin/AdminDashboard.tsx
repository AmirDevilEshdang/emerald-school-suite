import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getStudents, getHomework, getAccounts, getGrades } from '@/lib/data';
import { GraduationCap, UserCheck, User, BookOpen, Star, Clock, CheckCircle, XCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }: {
  title: string; value: number | string; icon: React.ElementType; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="stat-card card-hover"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-primary-foreground" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const students = getStudents();
  const homework = getHomework();
  const accounts = getAccounts();
  const grades = getGrades();

  const teachers = accounts.filter(a => a.role === 'teacher');
  const assistants = accounts.filter(a => a.role === 'assistant');
  const pendingHomework = homework.filter(h => h.status === 'pending');
  const pendingGrades = grades.filter(g => g.status === 'pending');

  const stats = [
    { title: 'دانش‌آموزان', value: students.length, icon: GraduationCap, color: 'bg-primary', delay: 0.1 },
    { title: 'معلمان', value: teachers.length, icon: UserCheck, color: 'bg-blue-500', delay: 0.15 },
    { title: 'معاونان', value: assistants.length, icon: User, color: 'bg-purple-500', delay: 0.2 },
    { title: 'تکالیف در انتظار', value: pendingHomework.length, icon: BookOpen, color: 'bg-orange-500', delay: 0.25 },
    { title: 'نمرات در انتظار', value: pendingGrades.length, icon: Star, color: 'bg-yellow-500', delay: 0.3 },
    { title: 'کل حساب‌ها', value: accounts.length, icon: User, color: 'bg-teal-500', delay: 0.35 },
  ];

  const recentHomework = homework.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">داشبورد مدیریت</h1>
        <p className="text-muted-foreground text-sm mt-1">خوش آمدید، {currentUser?.name}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent homework */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border shadow-card p-5"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            آخرین تکالیف
          </h2>
          <div className="space-y-3">
            {recentHomework.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">تکلیفی ثبت نشده است</p>
            ) : recentHomework.map((hw) => (
              <div key={hw.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">{hw.subject} - پایه {hw.grade}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  hw.status === 'pending' ? 'status-pending' :
                  hw.status === 'approved_admin' ? 'status-approved' : 'status-rejected'
                }`}>
                  {hw.status === 'pending' ? 'در انتظار' :
                   hw.status === 'approved_assistant' ? 'تایید معاون' :
                   hw.status === 'approved_admin' ? 'تایید نهایی' : 'رد شده'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border shadow-card p-5"
        >
          <h2 className="font-semibold text-foreground mb-4">خلاصه وضعیت</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">تکالیف در انتظار تایید</span>
              </div>
              <span className="text-lg font-bold text-yellow-700">{pendingHomework.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">تکالیف تایید شده</span>
              </div>
              <span className="text-lg font-bold text-green-700">{homework.filter(h => h.status === 'approved_admin').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red-600" />
                <span className="text-sm font-medium text-red-800">تکالیف رد شده</span>
              </div>
              <span className="text-lg font-bold text-red-700">{homework.filter(h => h.status === 'rejected').length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
