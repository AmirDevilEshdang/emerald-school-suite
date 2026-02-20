import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { School, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Role } from '@/lib/data';

const roleRoutes: Record<Role, string> = {
  admin: '/admin',
  assistant: '/assistant',
  teacher: '/teacher',
  student: '/student',
};

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('لطفاً نام کاربری و رمز عبور را وارد کنید');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const success = login(username.trim(), password.trim());
    setLoading(false);
    if (success) {
      toast.success('ورود موفقیت‌آمیز بود');
      const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
      navigate(roleRoutes[stored.role as Role] || '/auth');
    } else {
      toast.error('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50">
          {/* Header */}
          <div className="bg-gradient-to-l from-primary to-primary-glow p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <School size={40} className="text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-primary-foreground">سامانه مدیریت مدرسه</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">ورود به سیستم</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">نام کاربری</Label>
                <div className="relative">
                  <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="نام کاربری خود را وارد کنید"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="pr-9 text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">رمز عبور</Label>
                <div className="relative">
                  <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="رمز عبور خود را وارد کنید"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pr-9 pl-9 text-sm"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold py-2.5 rounded-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'در حال ورود...' : 'ورود به سیستم'}
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 p-4 bg-muted rounded-xl space-y-2">
              <p className="text-xs font-semibold text-muted-foreground mb-2">حساب‌های آزمایشی:</p>
              {[
                { role: 'مدیر', user: 'admin', pass: 'admin123' },
                { role: 'معلم', user: 'teacher1', pass: '123456' },
                { role: 'معاون', user: 'assistant7', pass: '123456' },
                { role: 'دانش‌آموز', user: '0012345678', pass: '123456' },
              ].map(({ role, user, pass }) => (
                <button
                  key={user}
                  onClick={() => { setUsername(user); setPassword(pass); }}
                  className="w-full text-right text-xs py-1.5 px-3 rounded-lg hover:bg-accent transition-colors flex justify-between items-center"
                >
                  <span className="text-muted-foreground">{role}</span>
                  <span className="font-mono text-foreground/70">{user}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
