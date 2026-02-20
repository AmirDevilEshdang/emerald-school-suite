import { useState } from 'react';
import { motion } from 'framer-motion';
import { getAnnouncements, setAnnouncements, Announcement, generateId, GRADES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Bell, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const priorityConfig = {
  high: { label: 'بالا', class: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  medium: { label: 'متوسط', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Bell },
  low: { label: 'پایین', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Info },
};

const AdminAnnouncements = () => {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(getAnnouncements());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: '', content: '', priority: 'medium' as 'low' | 'medium' | 'high', targetGrade: 'all' });

  const openAdd = () => {
    setEditingItem(null);
    setForm({ title: '', content: '', priority: 'medium', targetGrade: 'all' });
    setDialogOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingItem(a);
    setForm({ title: a.title, content: a.content, priority: a.priority, targetGrade: a.targetGrade });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.content) { toast.error('فیلدهای اجباری را پر کنید'); return; }
    let updated: Announcement[];
    if (editingItem) {
      updated = announcements.map(a => a.id === editingItem.id ? { ...a, ...form } : a);
      toast.success('اطلاعیه ویرایش شد');
    } else {
      const newItem: Announcement = { id: generateId(), ...form, createdBy: currentUser?.name || '', createdAt: new Date().toISOString() };
      updated = [...announcements, newItem];
      toast.success('اطلاعیه افزوده شد');
    }
    setAnnouncements(updated);
    setAnnouncementsState(updated);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    setAnnouncementsState(updated);
    toast.success('اطلاعیه حذف شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت اطلاعیه‌ها</h1>
          <p className="text-muted-foreground text-sm">{announcements.length} اطلاعیه</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={16} />اطلاعیه جدید</Button>
      </div>

      <div className="space-y-3">
        {announcements.map((ann, i) => {
          const pConfig = priorityConfig[ann.priority];
          const PIcon = pConfig.icon;
          return (
            <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-card rounded-xl border border-border shadow-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <PIcon size={16} className="text-primary shrink-0" />
                    <h3 className="font-semibold">{ann.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${pConfig.class}`}>{pConfig.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {ann.targetGrade === 'all' ? 'همه پایه‌ها' : `پایه ${ann.targetGrade}`}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{ann.content}</p>
                  <p className="text-xs text-muted-foreground">توسط: {ann.createdBy}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => openEdit(ann)} className="h-7 w-7 p-0"><Pencil size={13} /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(ann.id)} className="h-7 w-7 p-0"><Trash2 size={13} /></Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingItem ? 'ویرایش اطلاعیه' : 'اطلاعیه جدید'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label>عنوان *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>متن اطلاعیه *</Label>
              <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>اولویت</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v as 'low' | 'medium' | 'high' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">بالا</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">پایین</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>پایه</Label>
                <Select value={form.targetGrade} onValueChange={v => setForm(f => ({ ...f, targetGrade: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>انصراف</Button>
              <Button onClick={handleSave}>{editingItem ? 'ذخیره' : 'افزودن'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnnouncements;
