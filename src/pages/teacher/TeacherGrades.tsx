import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getGrades, setGrades, getStudents, Grade, generateId, SUBJECTS, GRADES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Star } from 'lucide-react';
import { toast } from 'sonner';

const TeacherGrades = () => {
  const { currentUser } = useAuth();
  const [grades, setGradesState] = useState<Grade[]>(getGrades().filter(g => g.teacherId === currentUser?.id));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [form, setForm] = useState({ studentId: '', subject: '', score: '', description: '' });

  const students = getStudents().filter(s => selectedGrade ? s.grade === selectedGrade : true);

  const handleSave = () => {
    if (!form.studentId || !form.subject || !form.score) { toast.error('فیلدهای اجباری را پر کنید'); return; }
    const score = parseFloat(form.score);
    if (isNaN(score) || score < 0 || score > 20) { toast.error('نمره باید بین ۰ و ۲۰ باشد'); return; }
    const student = getStudents().find(s => s.id === form.studentId);
    const newGrade: Grade = {
      id: generateId(),
      studentId: form.studentId,
      studentName: student?.name || '',
      subject: form.subject,
      grade: student?.grade || '',
      score,
      teacherId: currentUser?.id || '',
      teacherName: currentUser?.name || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      description: form.description,
    };
    const all = getGrades();
    const updated = [...all, newGrade];
    setGrades(updated);
    setGradesState(updated.filter(g => g.teacherId === currentUser?.id));
    setForm({ studentId: '', subject: '', score: '', description: '' });
    setDialogOpen(false);
    toast.success('نمره ثبت شد');
  };

  const statusClass = (s: string) => s === 'pending' ? 'status-pending' : s === 'approved' ? 'status-approved' : 'status-rejected';
  const statusLabel = (s: string) => ({ pending: 'در انتظار', approved: 'تایید', rejected: 'رد' }[s] || s);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">نمرات</h1>
          <p className="text-muted-foreground text-sm">{grades.length} نمره ثبت شده</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2"><Plus size={16} />ثبت نمره</Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">دانش‌آموز</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">پایه</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">درس</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">نمره</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{g.studentName}</td>
                <td className="px-4 py-3"><span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full">{g.grade}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{g.subject}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold text-base ${g.score >= 10 ? 'text-success' : 'text-destructive'}`}>{g.score}</span>
                  <span className="text-muted-foreground text-xs">/۲۰</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusClass(g.status)}`}>{statusLabel(g.status)}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {grades.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Star size={40} className="mx-auto mb-2 opacity-30" />
            <p>نمره‌ای ثبت نشده</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>ثبت نمره جدید</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label>پایه (برای فیلتر دانش‌آموز)</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger><SelectValue placeholder="همه پایه‌ها" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>دانش‌آموز *</Label>
              <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}>
                <SelectTrigger><SelectValue placeholder="انتخاب دانش‌آموز" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.grade}</SelectItem>)}</SelectContent>
              </Select>
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
                <Label>نمره (۰-۲۰) *</Label>
                <Input value={form.score} onChange={e => setForm(f => ({ ...f, score: e.target.value }))} type="number" min={0} max={20} step={0.25} dir="ltr" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>توضیحات</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="مثال: امتحان میان‌ترم" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>انصراف</Button>
              <Button onClick={handleSave}>ثبت نمره</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherGrades;
