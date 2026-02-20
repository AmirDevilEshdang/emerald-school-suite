import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getAccounts, setAccounts, Account } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    username: currentUser?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    if (!form.name || !form.username) {
      toast.error('نام و نام کاربری اجباری است');
      return;
    }

    const accounts = getAccounts();
    const userAccount = accounts.find(a => a.id === currentUser?.id);
    if (!userAccount) return;

    // Check if changing password
    if (form.currentPassword || form.newPassword) {
      if (form.currentPassword !== userAccount.password) {
        toast.error('رمز عبور فعلی اشتباه است');
        return;
      }
      if (form.newPassword.length < 6) {
        toast.error('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        toast.error('تکرار رمز عبور مطابقت ندارد');
        return;
      }
    }

    const updatedAccount: Account = {
      ...userAccount,
      name: form.name,
      username: form.username,
      password: form.newPassword || userAccount.password,
    };

    const updatedAccounts = accounts.map(a => a.id === currentUser?.id ? updatedAccount : a);
    setAccounts(updatedAccounts);
    updateCurrentUser(updatedAccount);
    setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    toast.success('پروفایل ذخیره شد');
  };

  const roleLabels: Record<string, string> = {
    admin: 'مدیر سیستم', teacher: 'معلم', assistant: 'معاون', student: 'دانش‌آموز'
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">حساب کاربری</h1>
        <p className="text-muted-foreground text-sm">ویرایش اطلاعات شخصی</p>
      </div>

      {/* User info card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {currentUser?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-lg">{currentUser?.name}</h2>
            <p className="text-sm text-muted-foreground">{roleLabels[currentUser?.role || '']}</p>
            {currentUser?.grade && <p className="text-sm text-muted-foreground">پایه {currentUser.grade}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-primary" />
            <h3 className="font-semibold text-sm">اطلاعات شخصی</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>نام و نام خانوادگی</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>نام کاربری</Label>
              <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} dir="ltr" />
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={16} className="text-primary" />
              <h3 className="font-semibold text-sm">تغییر رمز عبور</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>رمز عبور فعلی</Label>
                <Input type="password" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} dir="ltr" placeholder="برای تغییر رمز، رمز فعلی را وارد کنید" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>رمز جدید</Label>
                  <Input type="password" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} dir="ltr" />
                </div>
                <div className="space-y-1">
                  <Label>تکرار رمز جدید</Label>
                  <Input type="password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} dir="ltr" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save size={16} />
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
