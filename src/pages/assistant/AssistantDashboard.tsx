import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getStudents, getHomework, getGrades } from '@/lib/data';
import { GraduationCap, BookOpen, Star, Clock } from 'lucide-react';

const AssistantDashboard = () => {
  const { currentUser } = useAuth();
  const grade = currentUser?.grade || '';
  const students = getStudents().filter(s => s.grade === grade);
  const homework = getHomework().filter(h => h.grade === grade);
  const grades = getGrades().filter(g => g.grade === grade);
  const pendingHomework = homework.filter(h => h.status === 'pending');

  const stats = [
    { title: `دانش‌آموزان پایه ${grade}`, value: students.length, icon: GraduationCap, color: 'bg-primary', delay: 0.1 },
    { title: 'تکالیف در انتظار تایید', value: pendingHomework.length, icon: Clock, color: 'bg-orange-500', delay: 0.15 },
    { title: 'کل تکالیف', value: homework.length, icon: BookOpen, color: 'bg-blue-500', delay: 0.2 },
    { title: 'نمرات ثبت شده', value: grades.length, icon: Star, color: 'bg-yellow-500', delay: 0.25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">داشبورد معاون</h1>
        <p className="text-muted-foreground text-sm">خوش آمدید، {currentUser?.name} - پایه {grade}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
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
          <GraduationCap size={18} className="text-primary" />
          دانش‌آموزان پایه {grade}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {students.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">{s.nationalId}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AssistantDashboard;
