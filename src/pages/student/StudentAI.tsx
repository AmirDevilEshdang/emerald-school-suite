import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { generateId } from '@/lib/data';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant'; content: string; id: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const StudentAI = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load saved messages
    const saved = localStorage.getItem(`ai_messages_${currentUser?.id}`);
    if (saved) setMessages(JSON.parse(saved));
  }, [currentUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveMessages = (msgs: Msg[]) => {
    localStorage.setItem(`ai_messages_${currentUser?.id}`, JSON.stringify(msgs));
    // Also save to admin-visible log
    const log = JSON.parse(localStorage.getItem('ai_chat_logs') || '[]');
    log.push({
      studentId: currentUser?.id,
      studentName: currentUser?.name,
      grade: currentUser?.grade,
      messages: msgs,
      updatedAt: new Date().toISOString(),
    });
    // Keep only last entry per student
    const unique = log.reduce((acc: any[], entry: any) => {
      const idx = acc.findIndex((e: any) => e.studentId === entry.studentId);
      if (idx >= 0) acc[idx] = entry;
      else acc.push(entry);
      return acc;
    }, []);
    localStorage.setItem('ai_chat_logs', JSON.stringify(unique));
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: 'user', content: input.trim(), id: generateId() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';
    const assistantId = generateId();

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          studentName: currentUser?.name,
          studentId: currentUser?.id,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'خطا' }));
        toast.error(err.error || 'خطا در ارتباط با هوش مصنوعی');
        setIsLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No reader');
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.id === assistantId) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar, id: assistantId }];
              });
            }
          } catch { textBuffer = line + '\n' + textBuffer; break; }
        }
      }

      // Save final
      setMessages(prev => {
        saveMessages(prev);
        return prev;
      });
    } catch (e) {
      console.error(e);
      toast.error('خطا در ارتباط با هوش مصنوعی');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(`ai_messages_${currentUser?.id}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-l from-violet-600 to-purple-500 bg-clip-text text-transparent">دستیار هوشمند</h1>
            <p className="text-xs text-muted-foreground">هر سوالی داری بپرس!</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-destructive gap-1">
            <Trash2 size={14} /> پاک کردن
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <Sparkles size={32} className="text-violet-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">سلام {currentUser?.name}! 👋</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              من دستیار هوشمند مدرسه‌ات هستم. هر سوالی داری بپرس - درسی، عمومی، یا هر چیز دیگه‌ای!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['ریاضی فصل ۳ رو توضیح بده', 'یه انشا درباره بهار بنویس', 'فیزیک نیرو چیه؟'].map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs hover:bg-violet-200 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted text-foreground rounded-tl-sm prose prose-sm max-w-none'
            }`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : msg.content}
            </div>
          </motion.div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
              <Bot size={14} />
            </div>
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm">
              <Loader2 size={16} className="animate-spin text-violet-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="سوالت رو بنویس..."
          rows={1}
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
        <Button onClick={sendMessage} disabled={isLoading || !input.trim()}
          className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-4">
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default StudentAI;
