// Types
export type Role = 'admin' | 'assistant' | 'teacher' | 'student';

export interface Account {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
  grade?: string; // for assistant and student
  subjects?: string[]; // for teacher
  nationalId?: string; // for student
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  nationalId: string;
  grade: string;
  parentName: string;
  phone: string;
  address: string;
  accountId?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  status: 'pending' | 'approved_assistant' | 'approved_admin' | 'rejected';
  createdAt: string;
  rejectionReason?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  grade: string;
  score: number;
  teacherId: string;
  teacherName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  description?: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  semester: string;
  year: string;
  grades: { subject: string; score: number; teacher: string }[];
  status: 'draft' | 'approved_assistant' | 'approved_admin';
  createdAt: string;
  assistantId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  targetGrade: string; // 'all' or specific grade
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  grade: string;
  members: string[];
  adminIds: string[];
  studentsCanSend: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  content: string;
  type: 'text' | 'image' | 'video' | 'file';
  fileUrl?: string;
  createdAt: string;
  deleted?: boolean;
}

export interface SliderImage {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  order: number;
  active: boolean;
}

export interface CustomBlock {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'html';
  content: string;
  order: number;
  active: boolean;
  targetGrade: string;
}

export interface SystemSettings {
  schoolName: string;
  schoolLogo?: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  currentYear: string;
  currentSemester: string;
}

// Default data initializer
export const initializeData = () => {
  if (!localStorage.getItem('accounts')) {
    const accounts: Account[] = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'مدیر سیستم',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        username: 'teacher1',
        password: '123456',
        role: 'teacher',
        name: 'استاد احمدی',
        subjects: ['ریاضی', 'آمار'],
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        username: 'teacher2',
        password: '123456',
        role: 'teacher',
        name: 'استاد رضایی',
        subjects: ['فیزیک', 'شیمی'],
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        username: 'assistant7',
        password: '123456',
        role: 'assistant',
        name: 'معاون پایه هفتم',
        grade: 'هفتم',
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        username: 'assistant8',
        password: '123456',
        role: 'assistant',
        name: 'معاون پایه هشتم',
        grade: 'هشتم',
        createdAt: new Date().toISOString(),
      },
      {
        id: '6',
        username: '0012345678',
        password: '123456',
        role: 'student',
        name: 'علی محمدی',
        grade: 'هفتم',
        nationalId: '0012345678',
        createdAt: new Date().toISOString(),
      },
      {
        id: '7',
        username: '0098765432',
        password: '123456',
        role: 'student',
        name: 'سارا کریمی',
        grade: 'هفتم',
        nationalId: '0098765432',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }

  if (!localStorage.getItem('students')) {
    const students: Student[] = [
      {
        id: 's1',
        name: 'علی محمدی',
        nationalId: '0012345678',
        grade: 'هفتم',
        parentName: 'حسن محمدی',
        phone: '09121234567',
        address: 'تهران، خیابان ولیعصر',
        accountId: '6',
      },
      {
        id: 's2',
        name: 'سارا کریمی',
        nationalId: '0098765432',
        grade: 'هفتم',
        parentName: 'محمد کریمی',
        phone: '09129876543',
        address: 'تهران، خیابان انقلاب',
        accountId: '7',
      },
      {
        id: 's3',
        name: 'رضا احمدی',
        nationalId: '0011122333',
        grade: 'هشتم',
        parentName: 'علی احمدی',
        phone: '09131112233',
        address: 'تهران، سعادت‌آباد',
      },
      {
        id: 's4',
        name: 'نگار حسینی',
        nationalId: '0044455566',
        grade: 'هشتم',
        parentName: 'مهدی حسینی',
        phone: '09144455566',
        address: 'تهران، تجریش',
      },
    ];
    localStorage.setItem('students', JSON.stringify(students));
  }

  if (!localStorage.getItem('homework')) {
    const homework: Homework[] = [
      {
        id: 'hw1',
        title: 'تمرین جبر فصل ۳',
        description: 'حل مسائل ۱ تا ۲۰ صفحه ۸۵',
        subject: 'ریاضی',
        grade: 'هفتم',
        teacherId: '2',
        teacherName: 'استاد احمدی',
        dueDate: '1403/09/20',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'hw2',
        title: 'گزارش آزمایش نیروی اصطکاک',
        description: 'نوشتن گزارش آزمایش در قالب A4',
        subject: 'فیزیک',
        grade: 'هشتم',
        teacherId: '3',
        teacherName: 'استاد رضایی',
        dueDate: '1403/09/22',
        status: 'approved_assistant',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('homework', JSON.stringify(homework));
  }

  if (!localStorage.getItem('grades')) {
    const grades: Grade[] = [
      {
        id: 'g1',
        studentId: 's1',
        studentName: 'علی محمدی',
        subject: 'ریاضی',
        grade: 'هفتم',
        score: 18.5,
        teacherId: '2',
        teacherName: 'استاد احمدی',
        status: 'approved',
        createdAt: new Date().toISOString(),
        description: 'امتحان میان‌ترم',
      },
      {
        id: 'g2',
        studentId: 's2',
        studentName: 'سارا کریمی',
        subject: 'ریاضی',
        grade: 'هفتم',
        score: 17,
        teacherId: '2',
        teacherName: 'استاد احمدی',
        status: 'pending',
        createdAt: new Date().toISOString(),
        description: 'امتحان میان‌ترم',
      },
    ];
    localStorage.setItem('grades', JSON.stringify(grades));
  }

  if (!localStorage.getItem('announcements')) {
    const announcements: Announcement[] = [
      {
        id: 'a1',
        title: 'برنامه امتحانات نیم‌سال اول',
        content: 'برنامه امتحانات نیم‌سال اول سال تحصیلی ۱۴۰۳-۱۴۰۴ اعلام شد.',
        priority: 'high',
        targetGrade: 'all',
        createdBy: 'مدیر سیستم',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'a2',
        title: 'جلسه اولیا و مربیان',
        content: 'جلسه اولیا و مربیان پنجشنبه ۲۵ آذر ساعت ۱۰ صبح برگزار می‌گردد.',
        priority: 'medium',
        targetGrade: 'هفتم',
        createdBy: 'معاون پایه هفتم',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }

  if (!localStorage.getItem('chatGroups')) {
    const chatGroups: ChatGroup[] = [
      {
        id: 'cg1',
        name: 'گروه پایه هفتم',
        grade: 'هفتم',
        members: ['1', '2', '3', '4', '6', '7'],
        adminIds: ['1', '4'],
        studentsCanSend: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cg2',
        name: 'گروه پایه هشتم',
        grade: 'هشتم',
        members: ['1', '3', '5'],
        adminIds: ['1', '5'],
        studentsCanSend: false,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('chatGroups', JSON.stringify(chatGroups));
  }

  if (!localStorage.getItem('chatMessages')) {
    const chatMessages: ChatMessage[] = [
      {
        id: 'cm1',
        groupId: 'cg1',
        senderId: '4',
        senderName: 'معاون پایه هفتم',
        senderRole: 'assistant',
        content: 'دانش‌آموزان گرامی، فردا امتحان ریاضی برگزار می‌شود. آمادگی لازم را داشته باشید.',
        type: 'text',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'cm2',
        groupId: 'cg1',
        senderId: '6',
        senderName: 'علی محمدی',
        senderRole: 'student',
        content: 'ممنون از اطلاع‌رسانی',
        type: 'text',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }

  if (!localStorage.getItem('systemSettings')) {
    const settings: SystemSettings = {
      schoolName: 'دبیرستان نمونه دولتی شهید رجایی',
      contactPhone: '021-12345678',
      contactEmail: 'info@school.edu.ir',
      address: 'تهران، خیابان آزادی، پلاک ۱۲۳',
      currentYear: '۱۴۰۳-۱۴۰۴',
      currentSemester: 'نیم‌سال اول',
    };
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  }

  if (!localStorage.getItem('sliderImages')) {
    const sliders: SliderImage[] = [
      {
        id: 'sl1',
        title: 'خوش آمدید',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=400&fit=crop',
        order: 1,
        active: true,
      },
      {
        id: 'sl2',
        title: 'سال تحصیلی جدید',
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=400&fit=crop',
        order: 2,
        active: true,
      },
    ];
    localStorage.setItem('sliderImages', JSON.stringify(sliders));
  }

  if (!localStorage.getItem('customBlocks')) {
    const blocks: CustomBlock[] = [
      {
        id: 'cb1',
        title: 'اخبار مدرسه',
        type: 'text',
        content: 'به سیستم مدیریت مدرسه خوش آمدید. برای اطلاع از آخرین اخبار و برنامه‌ها این بخش را دنبال کنید.',
        order: 1,
        active: true,
        targetGrade: 'all',
      },
    ];
    localStorage.setItem('customBlocks', JSON.stringify(blocks));
  }
};

// Generic getters/setters
export const getAccounts = (): Account[] => JSON.parse(localStorage.getItem('accounts') || '[]');
export const setAccounts = (data: Account[]) => localStorage.setItem('accounts', JSON.stringify(data));

export const getStudents = (): Student[] => JSON.parse(localStorage.getItem('students') || '[]');
export const setStudents = (data: Student[]) => localStorage.setItem('students', JSON.stringify(data));

export const getHomework = (): Homework[] => JSON.parse(localStorage.getItem('homework') || '[]');
export const setHomework = (data: Homework[]) => localStorage.setItem('homework', JSON.stringify(data));

export const getGrades = (): Grade[] => JSON.parse(localStorage.getItem('grades') || '[]');
export const setGrades = (data: Grade[]) => localStorage.setItem('grades', JSON.stringify(data));

export const getAnnouncements = (): Announcement[] => JSON.parse(localStorage.getItem('announcements') || '[]');
export const setAnnouncements = (data: Announcement[]) => localStorage.setItem('announcements', JSON.stringify(data));

export const getChatGroups = (): ChatGroup[] => JSON.parse(localStorage.getItem('chatGroups') || '[]');
export const setChatGroups = (data: ChatGroup[]) => localStorage.setItem('chatGroups', JSON.stringify(data));

export const getChatMessages = (): ChatMessage[] => JSON.parse(localStorage.getItem('chatMessages') || '[]');
export const setChatMessages = (data: ChatMessage[]) => localStorage.setItem('chatMessages', JSON.stringify(data));

export const getSliderImages = (): SliderImage[] => JSON.parse(localStorage.getItem('sliderImages') || '[]');
export const setSliderImages = (data: SliderImage[]) => localStorage.setItem('sliderImages', JSON.stringify(data));

export const getCustomBlocks = (): CustomBlock[] => JSON.parse(localStorage.getItem('customBlocks') || '[]');
export const setCustomBlocks = (data: CustomBlock[]) => localStorage.setItem('customBlocks', JSON.stringify(data));

export const getSystemSettings = (): SystemSettings => JSON.parse(localStorage.getItem('systemSettings') || '{}');
export const setSystemSettings = (data: SystemSettings) => localStorage.setItem('systemSettings', JSON.stringify(data));

export const getReportCards = (): ReportCard[] => JSON.parse(localStorage.getItem('reportCards') || '[]');
export const setReportCards = (data: ReportCard[]) => localStorage.setItem('reportCards', JSON.stringify(data));

export const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const GRADES = ['هفتم', 'هشتم', 'نهم'];
export const SUBJECTS = ['ریاضی', 'فیزیک', 'شیمی', 'ادبیات', 'عربی', 'دینی', 'تاریخ', 'جغرافیا', 'علوم', 'انگلیسی', 'تربیت بدنی', 'هنر'];
