import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Eye, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CustomPageData {
  id: string;
  title: string;
  icon: string;
  color: string;
  active: boolean;
  order: number;
  sections: CustomPageSection[];
}

export interface CustomPageSection {
  id: string;
  title: string;
  type: 'image' | 'pdf' | 'file' | 'text';
  content: string; // URL for image/pdf/file, text for text
  downloadUrl?: string;
  description?: string;
}

// Helper to get custom pages from localStorage
export const getCustomPages = (): CustomPageData[] =>
  JSON.parse(localStorage.getItem('customPages') || '[]');
export const setCustomPages = (data: CustomPageData[]) =>
  localStorage.setItem('customPages', JSON.stringify(data));

const StudentCustomPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const pages = getCustomPages();
  const page = pages.find(p => p.id === pageId);

  if (!page) {
    return (
      <div className="text-center py-20">
        <FileText size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-muted-foreground">صفحه مورد نظر یافت نشد</p>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4 gap-2">
          <ArrowRight size={16} /> بازگشت
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
          <ArrowRight size={16} /> بازگشت
        </Button>
        <h1 className="text-2xl font-bold">{page.title}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {page.sections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
          >
            {/* Image preview */}
            {(section.type === 'image' || section.type === 'pdf') && section.content && (
              <div className="relative h-48 bg-muted">
                {section.type === 'image' ? (
                  <img src={section.content} alt={section.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                    <FileText size={48} className="text-red-400" />
                  </div>
                )}
              </div>
            )}
            
            <div className="p-4">
              <h3 className="font-bold text-foreground mb-1">{section.title}</h3>
              {section.description && (
                <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
              )}
              
              {section.type === 'text' && (
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              )}

              <div className="flex gap-2 mt-3">
                {section.type === 'pdf' && section.content && (
                  <Button size="sm" variant="outline" className="gap-1 text-xs flex-1"
                    onClick={() => window.open(section.content, '_blank')}>
                    <Eye size={14} /> مشاهده
                  </Button>
                )}
                {(section.downloadUrl || (section.type !== 'text' && section.content)) && (
                  <Button size="sm" className="gap-1 text-xs flex-1"
                    onClick={() => {
                      const url = section.downloadUrl || section.content;
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = section.title;
                      a.click();
                    }}>
                    <Download size={14} /> دانلود
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {page.sections.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FileText size={40} className="mx-auto mb-2 opacity-30" />
          <p>محتوایی اضافه نشده است</p>
        </div>
      )}
    </div>
  );
};

export default StudentCustomPage;
