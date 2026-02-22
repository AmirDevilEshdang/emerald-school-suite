import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getSliderImages, getAnnouncements, getHomework, getCustomBlocks } from '@/lib/data';
import { getTodayVerse, getTodayPrayer } from '@/lib/quranData';
import {
  Clock, Calendar, ChevronLeft, ChevronRight, BookOpen, Volume2, VolumeX,
  MessageSquare, FileText, Sparkles, ArrowLeft
} from 'lucide-react';
import gsap from 'gsap';

// ─── Live Clock ───
const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 bg-gradient-to-l from-emerald-600/20 via-teal-500/10 to-transparent rounded-2xl px-5 py-3 border border-emerald-500/20 backdrop-blur-sm"
    >
      <div className="text-left">
        <div className="flex items-center gap-2 text-emerald-400">
          <Clock size={16} />
          <span className="font-mono text-lg font-bold tracking-wider" dir="ltr">{time}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-0.5">
          <Calendar size={12} />
          <span>{date}</span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Hero Slider ───
const HeroSlider = ({ images }: { images: { id: string; title: string; imageUrl: string }[] }) => {
  const [idx, setIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 1) {
      const t = setInterval(() => setIdx(i => (i + 1) % images.length), 5000);
      return () => clearInterval(t);
    }
  }, [images.length]);

  useEffect(() => {
    if (sliderRef.current) {
      gsap.fromTo(sliderRef.current, { opacity: 0.3, scale: 1.05 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' });
    }
  }, [idx]);

  if (!images.length) return null;

  return (
    <div className="relative h-52 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl group">
      <div ref={sliderRef} className="absolute inset-0">
        <img src={images[idx]?.imageUrl} alt={images[idx]?.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 right-5">
          <p className="text-white font-bold text-xl drop-shadow-lg">{images[idx]?.title}</p>
        </div>
      </div>
      {images.length > 1 && (
        <>
          <button onClick={() => setIdx((idx - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button onClick={() => setIdx((idx + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">
            <ChevronRight size={20} className="text-white" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Quran Section ───
const QuranSection = () => {
  const verse = getTodayVerse();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: 'power3.out' });
    }
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(verse.audioUrl);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div ref={sectionRef} className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/10 p-6 shadow-xl">
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Sparkles size={18} />
            تدبر در قرآن
          </h3>
          <button onClick={toggleAudio}
            className={`p-2.5 rounded-full transition-all ${playing ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 animate-pulse' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200'}`}>
            {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
        
        <p className="text-2xl leading-relaxed text-amber-900 dark:text-amber-100 font-bold text-center mb-3" style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }} dir="rtl">
          {verse.ayah}
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-400 text-center mb-2">{verse.translation}</p>
        <p className="text-xs text-amber-500 dark:text-amber-500 text-center">سوره {verse.surah} - آیه {verse.ayahNumber}</p>
      </div>
    </div>
  );
};

// ─── Daily Prayer ───
const DailyPrayer = () => {
  const prayer = getTodayPrayer();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: 'power3.out' });
    }
  }, []);

  return (
    <div ref={ref} className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/10 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-2 right-2 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl" />
      <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-3">🤲 دعای روز</h3>
      <p className="text-xl leading-relaxed text-emerald-900 dark:text-emerald-100 font-semibold text-center" style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }} dir="rtl">
        {prayer}
      </p>
    </div>
  );
};

// ─── Inspiration Slider (from internet) ───
const InspirationSlider = () => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop', title: 'الهام‌بخش' },
    { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&h=300&fit=crop', title: 'طبیعت' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop', title: 'آرامش' },
    { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=300&fit=crop', title: 'امید' },
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden shadow-xl group">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx].url}
          alt={images[idx].title}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
};

// ─── Quick Box ───
const QuickBox = ({ icon: Icon, title, color, onClick }: { icon: React.ElementType; title: string; color: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.04, y: -4 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-3 p-5 rounded-2xl border shadow-lg transition-all duration-300 cursor-pointer ${color}`}
  >
    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
      <Icon size={24} />
    </div>
    <span className="text-sm font-bold">{title}</span>
  </motion.button>
);

// ─── Main Student Home ───
const StudentHome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const grade = currentUser?.grade || '';
  const sliders = getSliderImages().filter(s => s.active);
  const blocks = getCustomBlocks().filter(b => b.active && (b.targetGrade === 'all' || b.targetGrade === grade));
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(pageRef.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' });
    }
  }, []);

  return (
    <div ref={pageRef} className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Top: Clock + Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-extrabold bg-gradient-to-l from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            سلام {currentUser?.name} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">به پنل دانش‌آموزی خوش آمدید</p>
        </motion.div>
        <LiveClock />
      </div>

      {/* Bismillah */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center py-4"
      >
        <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent" style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
      </motion.div>

      {/* Main Slider */}
      <HeroSlider images={sliders} />

      {/* Daily Prayer */}
      <DailyPrayer />

      {/* Inspiration Slider */}
      <InspirationSlider />

      {/* Quran Section */}
      <QuranSection />

      {/* Bottom Slider (same as hero with different images or admin-managed) */}
      <HeroSlider images={sliders.length > 1 ? sliders.slice().reverse() : sliders} />

      {/* Quick Access Boxes */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          دسترسی سریع
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickBox
            icon={BookOpen}
            title="تکالیف روزانه"
            color="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
            onClick={() => navigate('/student/homework')}
          />
          <QuickBox
            icon={FileText}
            title="نمرات و کارنامه"
            color="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300"
            onClick={() => navigate('/student/grades')}
          />
          <QuickBox
            icon={MessageSquare}
            title="چت"
            color="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
            onClick={() => navigate('/student/chat')}
          />
          <QuickBox
            icon={Sparkles}
            title="اطلاعیه‌ها"
            color="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
            onClick={() => navigate('/student/announcements')}
          />
        </div>
      </div>

      {/* Custom blocks from admin */}
      {blocks.map((block, i) => (
        <motion.div key={block.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
          className="bg-card rounded-2xl border border-border shadow-lg p-5">
          <h2 className="font-bold mb-3 text-foreground">{block.title}</h2>
          {block.type === 'text' && <p className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>}
          {block.type === 'image' && <img src={block.content} alt={block.title} className="w-full rounded-xl" />}
          {block.type === 'html' && <div dangerouslySetInnerHTML={{ __html: block.content }} />}
        </motion.div>
      ))}
    </div>
  );
};

export default StudentHome;
