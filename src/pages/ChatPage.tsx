import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getChatGroups, getChatMessages, setChatMessages, ChatGroup, ChatMessage, generateId } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allGroups = getChatGroups();
    // Filter based on role
    let userGroups = allGroups;
    if (currentUser?.role !== 'admin') {
      userGroups = allGroups.filter(g => g.members.includes(currentUser?.id || ''));
    }
    setGroups(userGroups);
    if (userGroups.length > 0) setSelectedGroup(userGroups[0]);
  }, [currentUser]);

  useEffect(() => {
    if (selectedGroup) {
      const msgs = getChatMessages().filter(m => m.groupId === selectedGroup.id && !m.deleted);
      setMessages(msgs);
    }
  }, [selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canSend = () => {
    if (!selectedGroup || !currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.role === 'teacher' || currentUser.role === 'assistant') return true;
    if (currentUser.role === 'student') return selectedGroup.studentsCanSend;
    return false;
  };

  const sendMessage = () => {
    if (!inputText.trim() || !selectedGroup || !currentUser) return;
    const newMsg: ChatMessage = {
      id: generateId(),
      groupId: selectedGroup.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content: inputText.trim(),
      type: 'text',
      createdAt: new Date().toISOString(),
    };
    const all = getChatMessages();
    const updated = [...all, newMsg];
    setChatMessages(updated);
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const isAdmin = selectedGroup?.adminIds.includes(currentUser?.id || '');

  const deleteMessage = (id: string) => {
    const all = getChatMessages();
    const updated = all.map(m => m.id === id ? { ...m, deleted: true } : m);
    setChatMessages(updated);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const roleLabels: Record<string, string> = {
    admin: 'مدیر', teacher: 'معلم', assistant: 'معاون', student: 'دانش‌آموز'
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">چت گروهی</h1>
      
      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Group list */}
        <div className="w-64 shrink-0 bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-semibold text-muted-foreground">گروه‌ها</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g)}
                className={cn(
                  'w-full text-right px-3 py-2.5 rounded-lg text-sm transition-colors',
                  selectedGroup?.id === g.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <p className="font-medium">{g.name}</p>
                <p className={cn('text-xs', selectedGroup?.id === g.id ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                  {g.members.length} عضو
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-card rounded-xl border border-border shadow-card flex flex-col overflow-hidden">
          {selectedGroup ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <MessageSquare size={18} className="text-primary" />
                <div>
                  <h3 className="font-semibold text-sm">{selectedGroup.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedGroup.studentsCanSend ? 'دانش‌آموزان می‌توانند پیام بفرستند' : 'فقط مدیران پیام می‌فرستند'}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex', isMe ? 'justify-start' : 'justify-end')}
                    >
                      <div className={cn('max-w-xs lg:max-w-md', isMe ? 'items-start' : 'items-end')}>
                        {!isMe && (
                          <p className="text-xs text-muted-foreground mb-1 mx-1">
                            {msg.senderName} <span className="text-primary">({roleLabels[msg.senderRole]})</span>
                          </p>
                        )}
                        <div className={cn(
                          'px-4 py-2.5 rounded-2xl text-sm',
                          isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'
                        )}>
                          {msg.content}
                        </div>
                        {isAdmin && !isMe && (
                          <button onClick={() => deleteMessage(msg.id)} className="text-xs text-red-400 hover:text-red-600 mt-1 mx-1">
                            حذف
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {canSend() ? (
                <div className="p-3 border-t border-border flex gap-2">
                  <Input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm" className="gap-1">
                    <Send size={15} />
                  </Button>
                </div>
              ) : (
                <div className="p-3 border-t border-border text-center text-sm text-muted-foreground">
                  ارسال پیام توسط دانش‌آموزان غیرفعال است
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare size={40} className="mx-auto mb-2 opacity-30" />
                <p>گروهی انتخاب کنید</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
