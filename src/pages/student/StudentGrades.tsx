import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getGrades } from '@/lib/data';
import { Star } from 'lucide-react';

const StudentGrades = () => {
  const { currentUser } = useAuth();
  const allStudents = JSON.parse(localStorage.getItem('students') || '[]');
  const myStudent = allStudents.find((s: any) => s.accountId === currentUser?.id);
  const grades = getGrades().filter(g => g.studentId === myStudent?.id && g.status === 'approved');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">نمرات</h1>
        <p className="text-muted-foreground text-sm">{grades.length} نمره ثبت شده</p>
      </div>

      {grades.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Star size={40} className="mx-auto mb-2 opacity-30" />
          <p>نمره‌ای وجود ندارد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {grades.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              className="bg-card rounded-xl border border-border shadow-card p-5 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{g.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">{g.description || 'امتحان'}</p>
                  <p className="text-xs text-muted-foreground">معلم: {g.teacherName}</p>
                </div>
                <div className="text-center">
                  <p className={`text-3xl font-bold ${g.score >= 10 ? 'text-success' : 'text-destructive'}`}>{g.score}</p>
                  <p className="text-xs text-muted-foreground">از ۲۰</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentGrades;
