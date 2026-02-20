import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getHomework, setHomework, Homework, generateId, GRADES, SUBJECTS } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const TeacherHomework = () => {
  const { currentUser } = useAuth();
  const [homework, setHomeworkState] = useState<Homework[]>(
    getHomework().filter(h => h.teacherId === currentUser?.id)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', subject: '', grade: '', dueDate: '' });

  const handleSave = () => {
    if (!form.title || !form.subject || !form.grade || !form.dueDate) {
      toast.error('فیلدهای اجباری را پر کنید');
      return;
    }
    const newHw: Homework = {
      id: generateId(),
      ...form,
      teacherId: currentUser?.id || '',
      teacherName: currentUser?.name || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const all = getHomework();
    const updated = [...all, newHw];
    setHomework(updated);
    setHomeworkState(updated.filter(h => h.teacherId === currentUser?.id));
    setForm({ title: '', description: '', subject: '', grade: '', dueDate: '' });
    setDialogOpen(false);
    toast.success('تکلیف ثبت شد');
  };

  const statusLabel = (s: string) => ({ pending: 'در انتظار', approved_assistant: 'تایید معاون', approved_admin: 'تایید نهایی', rejected: 'رد شده' }[s] || s);
  const statusClass = (s: string) => s === 'pending' ? 'status-pending' : s.includes('approved') ? 'status-approved' : 'status-rejected';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">تکالیف من</h1>
          <p className="text-muted-foreground text-sm">{homework.length} تکلیف</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2"><Plus size={16} />تکلیف جدید</Button>
      </div>

      <div className="space-y-3">
        {homework.map((hw, i) => (
          <motion.div key={hw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={16} className="text-primary" />
                  <h3 className="font-semibold">{hw.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusClass(hw.status)}`}>{statusLabel(hw.status)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{hw.description}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>درس: <strong className="text-foreground">{hw.subject}</strong></span>
                  <span>پایه: <strong className="text-foreground">{hw.grade}</strong></span>
                  <span>مهلت: <strong className="text-foreground">{hw.dueDate}</strong></span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {homework.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen size={40} className="mx-auto mb-2 opacity-30" />
            <p>تکلیفی ثبت نشده است</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>تکلیف جدید</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label>عنوان تکلیف *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>توضیحات</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>درس *</Label>
                <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
                  <SelectTrigger><SelectValue placeholder="انتخاب درس" /></SelectTrigger>
                  <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>پایه *</Label>
                <Select value={form.grade} onValueChange={v => setForm(f => ({ ...f, grade: v }))}>
                  <SelectTrigger><SelectValue placeholder="انتخاب پایه" /></SelectTrigger>
                  <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>مهلت تحویل *</Label>
              <Input value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} placeholder="مثال: ۱۴۰۳/۰۹/۲۰" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>انصراف</Button>
              <Button onClick={handleSave}>ثبت تکلیف</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherHomework;
