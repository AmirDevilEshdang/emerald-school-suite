import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateId } from '@/lib/data';
import { getCustomPages, setCustomPages, CustomPageData, CustomPageSection } from '@/pages/student/StudentCustomPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit, Settings, FileText, Image, FilePlus, Eye } from 'lucide-react';
import { toast } from 'sonner';

const COLORS = [
  'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-700',
  'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-700',
  'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-700',
  'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-700',
  'from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-700',
  'from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-700',
];

const AdminCustomPages = () => {
  const [pages, setPages] = useState<CustomPageData[]>(getCustomPages());
  const [openPage, setOpenPage] = useState(false);
  const [editPageId, setEditPageId] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState({ title: '', icon: '📄', color: COLORS[0], active: true });
  
  const [openSection, setOpenSection] = useState(false);
  const [editSectionId, setEditSectionId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState<Partial<CustomPageSection>>({
    title: '', type: 'image', content: '', downloadUrl: '', description: '',
  });

  const save = (data: CustomPageData[]) => { setCustomPages(data); setPages(data); };

  // Page CRUD
  const submitPage = () => {
    if (!pageForm.title) { toast.error('عنوان الزامی است'); return; }
    if (editPageId) {
      save(pages.map(p => p.id === editPageId ? { ...p, ...pageForm } : p));
      toast.success('صفحه ویرایش شد');
    } else {
      save([...pages, { id: generateId(), ...pageForm, order: pages.length + 1, sections: [] }]);
      toast.success('صفحه جدید ساخته شد');
    }
    setOpenPage(false); setEditPageId(null); setPageForm({ title: '', icon: '📄', color: COLORS[0], active: true });
  };

  const editPage = (p: CustomPageData) => {
    setEditPageId(p.id); setPageForm({ title: p.title, icon: p.icon, color: p.color, active: p.active }); setOpenPage(true);
  };

  const deletePage = (id: string) => { save(pages.filter(p => p.id !== id)); toast.success('صفحه حذف شد'); };

  // Section CRUD
  const submitSection = () => {
    if (!sectionForm.title || !selectedPageId) { toast.error('عنوان الزامی است'); return; }
    const section: CustomPageSection = {
      id: editSectionId || generateId(),
      title: sectionForm.title!,
      type: (sectionForm.type as any) || 'image',
      content: sectionForm.content || '',
      downloadUrl: sectionForm.downloadUrl || '',
      description: sectionForm.description || '',
    };
    
    save(pages.map(p => {
      if (p.id !== selectedPageId) return p;
      if (editSectionId) {
        return { ...p, sections: p.sections.map(s => s.id === editSectionId ? section : s) };
      }
      return { ...p, sections: [...p.sections, section] };
    }));
    
    toast.success(editSectionId ? 'بخش ویرایش شد' : 'بخش اضافه شد');
    setOpenSection(false); setEditSectionId(null);
    setSectionForm({ title: '', type: 'image', content: '', downloadUrl: '', description: '' });
  };

  const deleteSection = (pageId: string, sectionId: string) => {
    save(pages.map(p => p.id === pageId ? { ...p, sections: p.sections.filter(s => s.id !== sectionId) } : p));
    toast.success('بخش حذف شد');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت صفحات سفارشی</h1>
          <p className="text-muted-foreground text-sm">صفحاتی که روی خانه دانش‌آموز نمایش داده می‌شوند</p>
        </div>
        <Dialog open={openPage} onOpenChange={o => { setOpenPage(o); if (!o) { setEditPageId(null); setPageForm({ title: '', icon: '📄', color: COLORS[0], active: true }); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> صفحه جدید</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editPageId ? 'ویرایش' : 'ساخت'} صفحه</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>عنوان صفحه</Label><Input value={pageForm.title} onChange={e => setPageForm(f => ({ ...f, title: e.target.value }))} placeholder="مثلاً: برگه تکلیف" /></div>
              <div><Label>آیکون (ایموجی)</Label><Input value={pageForm.icon} onChange={e => setPageForm(f => ({ ...f, icon: e.target.value }))} placeholder="📄" className="w-20 text-center text-xl" /></div>
              <div>
                <Label>رنگ</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {COLORS.map((c, i) => (
                    <button key={i} onClick={() => setPageForm(f => ({ ...f, color: c }))}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br border-2 ${c} ${pageForm.color === c ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={pageForm.active} onCheckedChange={c => setPageForm(f => ({ ...f, active: c }))} /><Label>فعال</Label></div>
              <Button onClick={submitPage} className="w-full">{editPageId ? 'ذخیره' : 'ساخت صفحه'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pages.map((page, i) => (
        <motion.div key={page.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{page.icon}</span>
              <div>
                <h2 className="font-bold">{page.title}</h2>
                <p className="text-xs text-muted-foreground">{page.sections.length} بخش • {page.active ? '✅ فعال' : '❌ غیرفعال'}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => editPage(page)}><Edit size={14} /></Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deletePage(page.id)}><Trash2 size={14} /></Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => { setSelectedPageId(page.id); setOpenSection(true); }}>
                <FilePlus size={14} /> بخش جدید
              </Button>
            </div>
          </div>
          
          {page.sections.length > 0 && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {page.sections.map(section => (
                <div key={section.id} className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{section.title}</span>
                    <div className="flex gap-1">
                      <button onClick={() => {
                        setSelectedPageId(page.id); setEditSectionId(section.id);
                        setSectionForm(section); setOpenSection(true);
                      }} className="text-muted-foreground hover:text-foreground"><Edit size={12} /></button>
                      <button onClick={() => deleteSection(page.id, section.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">نوع: {section.type === 'image' ? '🖼️ تصویر' : section.type === 'pdf' ? '📄 PDF' : section.type === 'file' ? '📎 فایل' : '📝 متن'}</p>
                  {section.content && section.type === 'image' && (
                    <img src={section.content} alt="" className="w-full h-20 object-cover rounded mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}

      {pages.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Settings size={40} className="mx-auto mb-2 opacity-30" />
          <p>صفحه سفارشی ایجاد نشده</p>
        </div>
      )}

      {/* Section Dialog */}
      <Dialog open={openSection} onOpenChange={o => { setOpenSection(o); if (!o) { setEditSectionId(null); setSectionForm({ title: '', type: 'image', content: '', downloadUrl: '', description: '' }); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editSectionId ? 'ویرایش' : 'افزودن'} بخش</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>عنوان بخش</Label><Input value={sectionForm.title} onChange={e => setSectionForm(f => ({ ...f, title: e.target.value }))} placeholder="مثلاً: پایه هفتم" /></div>
            <div>
              <Label>نوع محتوا</Label>
              <Select value={sectionForm.type} onValueChange={v => setSectionForm(f => ({ ...f, type: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">🖼️ تصویر</SelectItem>
                  <SelectItem value="pdf">📄 PDF</SelectItem>
                  <SelectItem value="file">📎 فایل</SelectItem>
                  <SelectItem value="text">📝 متن</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{sectionForm.type === 'text' ? 'متن' : 'آدرس فایل (URL)'}</Label>
              {sectionForm.type === 'text' ? (
                <Textarea value={sectionForm.content} onChange={e => setSectionForm(f => ({ ...f, content: e.target.value }))} />
              ) : (
                <Input value={sectionForm.content} onChange={e => setSectionForm(f => ({ ...f, content: e.target.value }))} dir="ltr" placeholder="https://..." />
              )}
            </div>
            {sectionForm.type !== 'text' && (
              <div><Label>لینک دانلود (اختیاری - اگر متفاوت است)</Label><Input value={sectionForm.downloadUrl} onChange={e => setSectionForm(f => ({ ...f, downloadUrl: e.target.value }))} dir="ltr" /></div>
            )}
            <div><Label>توضیحات (اختیاری)</Label><Input value={sectionForm.description} onChange={e => setSectionForm(f => ({ ...f, description: e.target.value }))} /></div>
            {sectionForm.type === 'image' && sectionForm.content && (
              <img src={sectionForm.content} alt="preview" className="w-full h-32 object-cover rounded-lg" />
            )}
            <Button onClick={submitSection} className="w-full">{editSectionId ? 'ذخیره' : 'افزودن'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomPages;
