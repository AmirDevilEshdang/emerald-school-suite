import { useState } from 'react';
import { motion } from 'framer-motion';
import { getAccounts, setAccounts, Account, generateId, Role } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels: Record<Role, string> = {
  admin: 'مدیر',
  assistant: 'معاون',
  teacher: 'معلم',
  student: 'دانش‌آموز',
};

const roleBadgeColors: Record<Role, string> = {
  admin: 'bg-red-100 text-red-700 border-red-200',
  assistant: 'bg-purple-100 text-purple-700 border-purple-200',
  teacher: 'bg-blue-100 text-blue-700 border-blue-200',
  student: 'bg-green-100 text-green-700 border-green-200',
};

const AdminAccounts = () => {
  const [accounts, setAccountsState] = useState<Account[]>(getAccounts());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ name: '', username: '', password: '', role: '' as Role, grade: '', subjects: '' });

  const togglePassword = (id: string) => setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد');
  };

  const openAdd = () => {
    setEditingAccount(null);
    setForm({ name: '', username: '', password: '', role: '' as Role, grade: '', subjects: '' });
    setDialogOpen(true);
  };

  const openEdit = (a: Account) => {
    setEditingAccount(a);
    setForm({ name: a.name, username: a.username, password: a.password, role: a.role, grade: a.grade || '', subjects: (a.subjects || []).join(', ') });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.username || !form.password || !form.role) {
      toast.error('لطفاً فیلدهای اجباری را پر کنید');
      return;
    }
    let updated: Account[];
    if (editingAccount) {
      updated = accounts.map(a => a.id === editingAccount.id ? {
        ...a, ...form,
        subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()) : undefined,
        grade: form.grade || undefined,
      } : a);
      toast.success('حساب ویرایش شد');
    } else {
      const newAcc: Account = {
        id: generateId(), ...form,
        subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()) : undefined,
        grade: form.grade || undefined,
        createdAt: new Date().toISOString(),
      };
      updated = [...accounts, newAcc];
      toast.success('حساب افزوده شد');
    }
    setAccounts(updated);
    setAccountsState(updated);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    setAccountsState(updated);
    toast.success('حساب حذف شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت حساب‌های کاربری</h1>
          <p className="text-muted-foreground text-sm">{accounts.length} حساب ثبت شده</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus size={16} />
          افزودن حساب
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">نام</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">نام کاربری</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">رمز عبور</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">نقش</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, i) => (
                <motion.tr
                  key={acc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{acc.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground" dir="ltr">{acc.username}</span>
                      <button onClick={() => copyToClipboard(acc.username)} className="text-muted-foreground hover:text-foreground">
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono" dir="ltr">
                        {showPasswords[acc.id] ? acc.password : '••••••••'}
                      </span>
                      <button onClick={() => togglePassword(acc.id)} className="text-muted-foreground hover:text-foreground">
                        {showPasswords[acc.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button onClick={() => copyToClipboard(acc.password)} className="text-muted-foreground hover:text-foreground">
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${roleBadgeColors[acc.role]}`}>
                      {roleLabels[acc.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(acc)} className="h-7 w-7 p-0">
                        <Pencil size={13} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(acc.id)} className="h-7 w-7 p-0">
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'ویرایش حساب' : 'افزودن حساب جدید'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>نام *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>نقش *</Label>
                <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v as Role }))}>
                  <SelectTrigger><SelectValue placeholder="انتخاب نقش" /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(roleLabels) as Role[]).map(r => (
                      <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>نام کاربری *</Label>
                <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} dir="ltr" />
              </div>
              <div className="space-y-1">
                <Label>رمز عبور *</Label>
                <Input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} dir="ltr" />
              </div>
            </div>
            {(form.role === 'assistant' || form.role === 'student') && (
              <div className="space-y-1">
                <Label>پایه</Label>
                <Select value={form.grade} onValueChange={v => setForm(f => ({ ...f, grade: v }))}>
                  <SelectTrigger><SelectValue placeholder="انتخاب پایه" /></SelectTrigger>
                  <SelectContent>
                    {['هفتم', 'هشتم', 'نهم'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.role === 'teacher' && (
              <div className="space-y-1">
                <Label>درس‌ها (با کاما جدا کنید)</Label>
                <Input value={form.subjects} onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))} placeholder="ریاضی، فیزیک" />
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>انصراف</Button>
              <Button onClick={handleSave}>{editingAccount ? 'ذخیره' : 'افزودن'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAccounts;
