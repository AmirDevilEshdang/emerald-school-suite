import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getAnnouncements } from '@/lib/data';
import { Bell, AlertTriangle, Info } from 'lucide-react';

const priorityConfig = {
  high: { label: 'مهم', class: 'border-red-200 bg-red-50', icon: AlertTriangle, iconClass: 'text-red-500' },
  medium: { label: 'متوسط', class: 'border-yellow-200 bg-yellow-50', icon: Bell, iconClass: 'text-yellow-500' },
  low: { label: 'اطلاع‌رسانی', class: 'border-blue-200 bg-blue-50', icon: Info, iconClass: 'text-blue-500' },
};

const StudentAnnouncements = () => {
  const { currentUser } = useAuth();
  const grade = currentUser?.grade || '';
  const announcements = getAnnouncements().filter(a => a.targetGrade === 'all' || a.targetGrade === grade);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">اطلاعیه‌ها</h1>
        <p className="text-muted-foreground text-sm">{announcements.length} اطلاعیه</p>
      </div>
      <div className="space-y-3">
        {announcements.map((ann, i) => {
          const cfg = priorityConfig[ann.priority];
          const Icon = cfg.icon;
          return (
            <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-xl border p-5 ${cfg.class}`}>
              <div className="flex items-start gap-3">
                <Icon size={18} className={`mt-0.5 shrink-0 ${cfg.iconClass}`} />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{ann.title}</h3>
                  <p className="text-sm text-muted-foreground">{ann.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">توسط: {ann.createdBy}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
        {announcements.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Bell size={40} className="mx-auto mb-2 opacity-30" />
            <p>اطلاعیه‌ای وجود ندارد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
