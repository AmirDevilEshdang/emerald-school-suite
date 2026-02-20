import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getHomework } from '@/lib/data';
import { BookOpen } from 'lucide-react';

const StudentHomework = () => {
  const { currentUser } = useAuth();
  const grade = currentUser?.grade || '';
  const homework = getHomework().filter(h => h.grade === grade && h.status === 'approved_admin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تکالیف</h1>
        <p className="text-muted-foreground text-sm">{homework.length} تکلیف</p>
      </div>
      <div className="space-y-3">
        {homework.map((hw, i) => (
          <motion.div key={hw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-start gap-3">
              <BookOpen size={18} className="text-primary mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{hw.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{hw.description}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>درس: <strong className="text-foreground">{hw.subject}</strong></span>
                  <span>معلم: <strong className="text-foreground">{hw.teacherName}</strong></span>
                  <span>مهلت: <strong className="text-destructive">{hw.dueDate}</strong></span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {homework.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-2 opacity-30" />
            <p>تکلیفی وجود ندارد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHomework;
