import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AILog {
  studentId: string;
  studentName: string;
  grade: string;
  messages: { role: string; content: string; id: string }[];
  updatedAt: string;
}

const AdminAIMessages = () => {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<AILog | null>(null);

  const loadLogs = () => {
    const data = JSON.parse(localStorage.getItem('ai_chat_logs') || '[]');
    setLogs(data);
  };

  useEffect(() => { loadLogs(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">پیام‌های هوش مصنوعی</h1>
          <p className="text-muted-foreground text-sm">مشاهده مکالمات دانش‌آموزان با هوش مصنوعی</p>
        </div>
        <Button variant="outline" onClick={loadLogs} className="gap-2"><RefreshCw size={14} /> بروزرسانی</Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Student list */}
        <div className="w-72 shrink-0 bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-semibold text-muted-foreground">دانش‌آموزان ({logs.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {logs.map(log => (
              <button key={log.studentId} onClick={() => setSelectedStudent(log)}
                className={`w-full text-right px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedStudent?.studentId === log.studentId ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}>
                <p className="font-medium">{log.studentName}</p>
                <p className={`text-xs ${selectedStudent?.studentId === log.studentId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  پایه {log.grade} • {log.messages.length} پیام
                </p>
              </button>
            ))}
            {logs.length === 0 && (
              <p className="text-center py-8 text-muted-foreground text-sm">هنوز مکالمه‌ای ثبت نشده</p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-card rounded-xl border border-border shadow-card flex flex-col overflow-hidden">
          {selectedStudent ? (
            <>
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">{selectedStudent.studentName}</h3>
                <p className="text-xs text-muted-foreground">پایه {selectedStudent.grade} • آخرین بروزرسانی: {new Date(selectedStudent.updatedAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedStudent.messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-violet-500 text-white'
                    }`}>
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user' ? 'bg-primary/10 text-foreground' : 'bg-muted text-foreground'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
                <p>دانش‌آموزی را انتخاب کنید</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAIMessages;
