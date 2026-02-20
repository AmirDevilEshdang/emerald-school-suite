import { useState } from 'react';
import { motion } from 'framer-motion';
import { getHomework, setHomework, Homework } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const AssistantHomework = () => {
  const { currentUser } = useAuth();
  const grade = currentUser?.grade || '';
  const [homework, setHomeworkState] = useState<Homework[]>(
    getHomework().filter(h => h.grade === grade)
  );

  const handleApprove = (id: string) => {
    const all = getHomework();
    const updated = all.map(h => h.id === id ? { ...h, status: 'approved_assistant' as const } : h);
    setHomework(updated);
    setHomeworkState(updated.filter(h => h.grade === grade));
    toast.success('تکلیف تایید شد');
  };

  const handleReject = (id: string) => {
    const all = getHomework();
    const updated = all.map(h => h.id === id ? { ...h, status: 'rejected' as const } : h);
    setHomework(updated);
    setHomeworkState(updated.filter(h => h.grade === grade));
    toast.error('تکلیف رد شد');
  };

  const statusLabel = (s: string) => ({
    pending: 'در انتظار', approved_assistant: 'تایید معاون', approved_admin: 'تایید نهایی', rejected: 'رد شده',
  }[s] || s);

  const statusClass = (s: string) => s === 'pending' ? 'status-pending' : s.includes('approved') ? 'status-approved' : 'status-rejected';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">تکالیف پایه {grade}</h1>
        <p className="text-muted-foreground text-sm">{homework.length} تکلیف</p>
      </div>
      <div className="space-y-3">
        {homework.map((hw, i) => (
          <motion.div key={hw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={16} className="text-primary shrink-0" />
                  <h3 className="font-semibold">{hw.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusClass(hw.status)}`}>{statusLabel(hw.status)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{hw.description}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>درس: <strong className="text-foreground">{hw.subject}</strong></span>
                  <span>معلم: <strong className="text-foreground">{hw.teacherName}</strong></span>
                  <span>مهلت: <strong className="text-foreground">{hw.dueDate}</strong></span>
                </div>
              </div>
              {hw.status === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(hw.id)} className="gap-1 h-8"><CheckCircle size={14} />تایید</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(hw.id)} className="gap-1 h-8"><XCircle size={14} />رد</Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {homework.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-2 opacity-30" />
            <p>تکلیفی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantHomework;
