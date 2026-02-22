import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSliderImages, setSliderImages, SliderImage, generateId } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image, Plus, Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

const AdminSlider = () => {
  const [sliders, setSliders] = useState<SliderImage[]>(getSliderImages());
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', imageUrl: '', link: '', active: true });

  const save = (data: SliderImage[]) => { setSliderImages(data); setSliders(data); };

  const handleSubmit = () => {
    if (!form.title || !form.imageUrl) { toast.error('عنوان و آدرس تصویر الزامی است'); return; }
    if (editId) {
      save(sliders.map(s => s.id === editId ? { ...s, ...form } : s));
      toast.success('اسلایدر ویرایش شد');
    } else {
      save([...sliders, { id: generateId(), ...form, order: sliders.length + 1 }]);
      toast.success('اسلایدر اضافه شد');
    }
    setOpen(false); setEditId(null); setForm({ title: '', imageUrl: '', link: '', active: true });
  };

  const handleEdit = (s: SliderImage) => {
    setEditId(s.id); setForm({ title: s.title, imageUrl: s.imageUrl, link: s.link || '', active: s.active }); setOpen(true);
  };

  const handleDelete = (id: string) => { save(sliders.filter(s => s.id !== id)); toast.success('حذف شد'); };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...sliders]; [arr[i], arr[i-1]] = [arr[i-1], arr[i]]; save(arr);
  };
  const moveDown = (i: number) => {
    if (i === sliders.length - 1) return;
    const arr = [...sliders]; [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; save(arr);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت اسلایدر</h1>
          <p className="text-muted-foreground text-sm">{sliders.length} اسلایدر</p>
        </div>
        <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditId(null); setForm({ title: '', imageUrl: '', link: '', active: true }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> اسلایدر جدید</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{editId ? 'ویرایش' : 'افزودن'} اسلایدر</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>عنوان</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><Label>آدرس تصویر (URL)</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} dir="ltr" placeholder="https://..." /></div>
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-full h-32 object-cover rounded-lg" />}
              <div><Label>لینک (اختیاری)</Label><Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} dir="ltr" /></div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={c => setForm(f => ({ ...f, active: c }))} /><Label>فعال</Label></div>
              <Button onClick={handleSubmit} className="w-full">{editId ? 'ذخیره' : 'افزودن'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {sliders.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border shadow-card p-4 flex items-center gap-4">
            <img src={s.imageUrl} alt={s.title} className="w-24 h-16 object-cover rounded-lg shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.active ? '✅ فعال' : '❌ غیرفعال'}</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => moveUp(i)}><ArrowUp size={14} /></Button>
              <Button size="sm" variant="ghost" onClick={() => moveDown(i)}><ArrowDown size={14} /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleEdit(s)}><Edit size={14} /></Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminSlider;
