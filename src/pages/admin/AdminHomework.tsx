import { useState } from 'react';
import { motion } from 'framer-motion';
import { getHomework, setHomework, Homework } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const AdminHomework = () => {
  const [homework, setHomeworkState] = useState<Homework[]>(getHomework());
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? homework : homework.filter(h => h.status === filter);

  const handleApprove = (id: string) => {
    const updated = homework.map(h => h.id === id ? { ...h, status: 'approved_admin' as const } : h);
    setHomework(updated);
    setHomeworkState(updated);
    toast.success('تکلیف تایید شد');
  };

  const handleReject = (id: string) => {
    const updated = homework.map(h => h.id === id ? { ...h, status: 'rejected' as const } : h);
    setHomework(updated);
    setHomeworkState(updated);
    toast.error('تکلیف رد شد');
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: 'در انتظار',
      approved_assistant: 'تایید معاون',
      approved_admin: 'تایید نهایی',
      rejected: 'رد شده',
    };
    return map[status] || status;
  };

  const statusClass = (status: string) => {
    if (status === 'pending') return 'status-pending';
    if (status.includes('approved')) return 'status-approved';
    return 'status-rejected';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت تکالیف</h1>
          <p className="text-muted-foreground text-sm">{homework.length} تکلیف ثبت شده</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="pending">در انتظار</SelectItem>
            <SelectItem value="approved_assistant">تایید معاون</SelectItem>
            <SelectItem value="approved_admin">تایید نهایی</SelectItem>
            <SelectItem value="rejected">رد شده</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((hw, i) => (
          <motion.div
            key={hw.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-xl border border-border shadow-card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={16} className="text-primary shrink-0" />
                  <h3 className="font-semibold text-foreground">{hw.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusClass(hw.status)}`}>
                    {statusLabel(hw.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{hw.description}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>درس: <strong className="text-foreground">{hw.subject}</strong></span>
                  <span>پایه: <strong className="text-foreground">{hw.grade}</strong></span>
                  <span>معلم: <strong className="text-foreground">{hw.teacherName}</strong></span>
                  <span>مهلت: <strong className="text-foreground">{hw.dueDate}</strong></span>
                </div>
              </div>
              {hw.status !== 'approved_admin' && hw.status !== 'rejected' && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(hw.id)} className="gap-1 h-8">
                    <CheckCircle size={14} />
                    تایید
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(hw.id)} className="gap-1 h-8">
                    <XCircle size={14} />
                    رد
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-2 opacity-30" />
            <p>تکلیفی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomework;
