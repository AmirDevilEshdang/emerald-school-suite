import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getHomework, getGrades } from '@/lib/data';
import { BookOpen, Star, Clock, CheckCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const myHomework = getHomework().filter(h => h.teacherId === currentUser?.id);
  const myGrades = getGrades().filter(g => g.teacherId === currentUser?.id);

  const stats = [
    { title: 'کل تکالیف ثبت شده', value: myHomework.length, icon: BookOpen, color: 'bg-primary', delay: 0.1 },
    { title: 'تکالیف در انتظار', value: myHomework.filter(h => h.status === 'pending').length, icon: Clock, color: 'bg-orange-500', delay: 0.15 },
    { title: 'تکالیف تایید شده', value: myHomework.filter(h => h.status === 'approved_admin').length, icon: CheckCircle, color: 'bg-success', delay: 0.2 },
    { title: 'نمرات ثبت شده', value: myGrades.length, icon: Star, color: 'bg-yellow-500', delay: 0.25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">داشبورد معلم</h1>
        <p className="text-muted-foreground text-sm">خوش آمدید، {currentUser?.name}</p>
        {currentUser?.subjects && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {currentUser.subjects.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">{s}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map(stat => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stat.delay }}
            className="stat-card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={22} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border shadow-card p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary" />
          آخرین تکالیف من
        </h2>
        {myHomework.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">تکلیفی ثبت نشده</p>
        ) : (
          <div className="space-y-2">
            {myHomework.slice(-5).reverse().map(hw => (
              <div key={hw.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">{hw.subject} - پایه {hw.grade}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                  hw.status === 'pending' ? 'status-pending' : hw.status.includes('approved') ? 'status-approved' : 'status-rejected'
                }`}>
                  {hw.status === 'pending' ? 'در انتظار' : hw.status === 'approved_admin' ? 'تایید' : 'رد شده'}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
