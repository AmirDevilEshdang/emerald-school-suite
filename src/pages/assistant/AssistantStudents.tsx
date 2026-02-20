import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getStudents } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { GraduationCap, Search } from 'lucide-react';

const AssistantStudents = () => {
  const { currentUser } = useAuth();
  const grade = currentUser?.grade || '';
  const [search, setSearch] = useState('');
  const students = getStudents().filter(s => s.grade === grade);
  const filtered = students.filter(s => s.name.includes(search) || s.nationalId.includes(search));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">دانش‌آموزان پایه {grade}</h1>
        <p className="text-muted-foreground text-sm">{students.length} دانش‌آموز</p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9" />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">نام</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">کد ملی</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">ولی</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">تلفن</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono" dir="ltr">{s.nationalId}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.parentName}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono" dir="ltr">{s.phone}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap size={40} className="mx-auto mb-2 opacity-30" />
            <p>دانش‌آموزی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantStudents;
