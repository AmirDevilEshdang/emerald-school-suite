import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSystemSettings, setSystemSettings, SystemSettings } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [settings, setSettingsState] = useState<SystemSettings>(getSystemSettings());

  const handleSave = () => {
    setSystemSettings(settings);
    toast.success('تنظیمات ذخیره شد');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">تنظیمات سیستم</h1>
        <p className="text-muted-foreground text-sm">تنظیمات عمومی مدرسه</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border shadow-card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} className="text-primary" />
          <h2 className="font-semibold">اطلاعات مدرسه</h2>
        </div>
        
        <div className="space-y-1">
          <Label>نام مدرسه</Label>
          <Input value={settings.schoolName} onChange={e => setSettingsState(s => ({ ...s, schoolName: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>تلفن تماس</Label>
            <Input value={settings.contactPhone} onChange={e => setSettingsState(s => ({ ...s, contactPhone: e.target.value }))} dir="ltr" />
          </div>
          <div className="space-y-1">
            <Label>ایمیل</Label>
            <Input value={settings.contactEmail} onChange={e => setSettingsState(s => ({ ...s, contactEmail: e.target.value }))} dir="ltr" />
          </div>
        </div>
        <div className="space-y-1">
          <Label>آدرس</Label>
          <Input value={settings.address} onChange={e => setSettingsState(s => ({ ...s, address: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>سال تحصیلی</Label>
            <Input value={settings.currentYear} onChange={e => setSettingsState(s => ({ ...s, currentYear: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>نیم‌سال</Label>
            <Input value={settings.currentSemester} onChange={e => setSettingsState(s => ({ ...s, currentSemester: e.target.value }))} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            ذخیره تنظیمات
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
