import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getHomework, getAnnouncements, getSliderImages, getCustomBlocks } from '@/lib/data';
import { Bell, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const StudentHome = () => {
  const { currentUser } = useAuth();
  const grade = currentUser?.grade || '';
  const [sliderIdx, setSliderIdx] = useState(0);
  const sliders = getSliderImages().filter(s => s.active);
  const announcements = getAnnouncements().filter(a => a.targetGrade === 'all' || a.targetGrade === grade).slice(0, 3);
  const homework = getHomework().filter(h => h.grade === grade && h.status === 'approved_admin').slice(0, 3);
  const blocks = getCustomBlocks().filter(b => b.active && (b.targetGrade === 'all' || b.targetGrade === grade));

  useEffect(() => {
    if (sliders.length > 1) {
      const t = setInterval(() => setSliderIdx(i => (i + 1) % sliders.length), 4000);
      return () => clearInterval(t);
    }
  }, [sliders.length]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">خانه</h1>
        <p className="text-muted-foreground text-sm">خوش آمدید، {currentUser?.name}</p>
      </div>

      {/* Slider */}
      {sliders.length > 0 && (
        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-muted shadow-card">
          {sliders.map((s, i) => (
            <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === sliderIdx ? 'opacity-100' : 'opacity-0'}`}>
              <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <p className="text-white font-semibold text-lg">{s.title}</p>
              </div>
            </div>
          ))}
          {sliders.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {sliders.map((_, i) => (
                <button key={i} onClick={() => setSliderIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === sliderIdx ? 'bg-white w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border shadow-card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Bell size={18} className="text-primary" />اطلاعیه‌ها</h2>
          {announcements.length === 0 ? <p className="text-sm text-muted-foreground">اطلاعیه‌ای وجود ندارد</p> : (
            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Homework */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border shadow-card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><BookOpen size={18} className="text-primary" />آخرین تکالیف</h2>
          {homework.length === 0 ? <p className="text-sm text-muted-foreground">تکلیفی وجود ندارد</p> : (
            <div className="space-y-3">
              {homework.map(hw => (
                <div key={hw.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm font-medium">{hw.title}</p>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{hw.subject}</span>
                    <span>مهلت: {hw.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Custom blocks */}
      {blocks.map((block, i) => (
        <motion.div key={block.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
          className="bg-card rounded-xl border border-border shadow-card p-5">
          <h2 className="font-semibold mb-3">{block.title}</h2>
          {block.type === 'text' && <p className="text-sm text-muted-foreground">{block.content}</p>}
          {block.type === 'image' && <img src={block.content} alt={block.title} className="w-full rounded-lg" />}
          {block.type === 'html' && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
        </motion.div>
      ))}
    </div>
  );
};

export default StudentHome;
