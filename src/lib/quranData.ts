// Static Quran verses for daily rotation - no internet needed
export interface QuranVerse {
  ayah: string;
  translation: string;
  surah: string;
  ayahNumber: number;
  audioUrl: string;
}

export const dailyVerses: QuranVerse[] = [
  {
    ayah: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: 'به نام خداوند بخشنده مهربان. ستایش مخصوص خداوند، پروردگار جهانیان است.',
    surah: 'الفاتحه',
    ayahNumber: 1,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
  },
  {
    ayah: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    translation: 'و بگو: پروردگارا! بر دانش من بیفزای.',
    surah: 'طه',
    ayahNumber: 114,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2166.mp3',
  },
  {
    ayah: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'بی‌تردید با سختی آسانی است.',
    surah: 'الشرح',
    ayahNumber: 6,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3',
  },
  {
    ayah: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'و هر کس بر خدا توکل کند، او برایش کافی است.',
    surah: 'الطلاق',
    ayahNumber: 3,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5234.mp3',
  },
  {
    ayah: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    translation: 'پروردگارا! به ما در دنیا نیکی و در آخرت نیکی عطا فرما و ما را از عذاب آتش نگاه‌دار.',
    surah: 'البقره',
    ayahNumber: 201,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/208.mp3',
  },
  {
    ayah: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'پس مرا یاد کنید تا شما را یاد کنم، و شکرگزاری کنید و کفران نعمت نکنید.',
    surah: 'البقره',
    ayahNumber: 152,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/159.mp3',
  },
  {
    ayah: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    translation: 'و به زودی پروردگارت آنقدر به تو عطا کند که خشنود شوی.',
    surah: 'الضحی',
    ayahNumber: 5,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3',
  },
];

export const dailyPrayers: string[] = [
  'اللّهمَّ اجعَل أوَّلَ هذَا النَّهارِ صَلاحاً و أوسَطَهُ فَلاحاً و آخِرَهُ نَجاحاً',
  'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
  'اللّهمَّ إنّي أسألُکَ عِلماً نافِعاً و رِزقاً واسِعاً و عَمَلاً مُتَقَبَّلاً',
  'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
  'اللّهمَّ اهدِنا فيمَن هَدَيتَ و عافِنا فيمَن عافَيتَ',
  'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ',
  'اللّهمَّ إنّي أعوذُ بِکَ مِنَ الهَمِّ وَالحَزَنِ',
];

export const getTodayVerse = (): QuranVerse => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyVerses[dayOfYear % dailyVerses.length];
};

export const getTodayPrayer = (): string => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return dailyPrayers[dayOfYear % dailyPrayers.length];
};
