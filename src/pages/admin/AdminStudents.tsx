import { useState } from 'react';
import { motion } from 'framer-motion';
import { getStudents, setStudents, Student, generateId, GRADES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const AdminStudents = () => {
  const [students, setStudentsState] = useState<Student[]>(getStudents());
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: '', nationalId: '', grade: '', parentName: '', phone: '', address: '' });

  const filtered = students.filter(s => {
    const matchSearch = s.name.includes(search) || s.nationalId.includes(search);
    const matchGrade = gradeFilter === 'all' || s.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  const openAdd = () => {
    setEditingStudent(null);
    setForm({ name: '', nationalId: '', grade: '', parentName: '', phone: '', address: '' });
    setDialogOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setForm({ name: s.name, nationalId: s.nationalId, grade: s.grade, parentName: s.parentName, phone: s.phone, address: s.address });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.nationalId || !form.grade) {
      toast.error('لطفاً فیلدهای اجباری را پر کنید');
      return;
    }
    let updated: Student[];
    if (editingStudent) {
      updated = students.map(s => s.id === editingStudent.id ? { ...s, ...form } : s);
      toast.success('دانش‌آموز ویرایش شد');
    } else {
      const newStudent: Student = { id: generateId(), ...form };
      updated = [...students, newStudent];
      toast.success('دانش‌آموز افزوده شد');
    }
    setStudents(updated);
    setStudentsState(updated);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    setStudentsState(updated);
    toast.success('دانش‌آموز حذف شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت دانش‌آموزان</h1>
          <p className="text-muted-foreground text-sm">{students.length} دانش‌آموز ثبت شده</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus size={16} />
          افزودن دانش‌آموز
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9" />
        </div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="همه پایه‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه پایه‌ها</SelectItem>
            {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">نام</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">کد ملی</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">پایه</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">ولی</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">تلفن</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono" dir="ltr">{student.nationalId}</td>
                  <td className="px-4 py-3">
                    <span className="bg-primary-light text-primary text-xs px-2 py-1 rounded-full font-medium">{student.grade}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{student.parentName}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono" dir="ltr">{student.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(student)} className="h-7 w-7 p-0">
                        <Pencil size={13} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(student.id)} className="h-7 w-7 p-0">
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <GraduationCap size={40} className="mx-auto mb-2 opacity-30" />
              <p>دانش‌آموزی یافت نشد</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'ویرایش دانش‌آموز' : 'افزودن دانش‌آموز'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>نام و نام خانوادگی *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="نام کامل" />
              </div>
              <div className="space-y-1">
                <Label>کد ملی *</Label>
                <Input value={form.nationalId} onChange={e => setForm(f => ({ ...f, nationalId: e.target.value }))} placeholder="کد ملی" dir="ltr" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>پایه *</Label>
              <Select value={form.grade} onValueChange={v => setForm(f => ({ ...f, grade: v }))}>
                <SelectTrigger><SelectValue placeholder="انتخاب پایه" /></SelectTrigger>
                <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>نام ولی</Label>
                <Input value={form.parentName} onChange={e => setForm(f => ({ ...f, parentName: e.target.value }))} placeholder="نام ولی" />
              </div>
              <div className="space-y-1">
                <Label>تلفن</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="شماره تلفن" dir="ltr" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>آدرس</Label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="آدرس" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>انصراف</Button>
              <Button onClick={handleSave}>{editingStudent ? 'ذخیره' : 'افزودن'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudents;
