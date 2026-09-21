export type SiteLocale = 'en' | 'pl';

export type SiteMessages = {
  meta: {
    title: string;
    description: string;
    releasesTitle: string;
    releasesDescription: string;
    privacyTitle: string;
    privacyDescription: string;
  };
  brand: string;
  skip: string;
  nav: {
    home: string;
    releases: string;
    privacy: string;
    menu: string;
    close: string;
  };
  language: {
    label: string;
    system: string;
    english: string;
    polish: string;
  };
  theme: {
    label: string;
    system: string;
    light: string;
    dark: string;
  };
  home: {
    eyebrow: string;
    headline: string;
    subhead: string;
    download: string;
    downloadUnavailable: string;
    versionLabel: string;
    freeBadge: string;
    androidBadge: string;
    privateBadge: string;
    heroSliderNext: string;
    heroSliderPrev: string;
    preview: {
      latest: string;
      latestValue: string;
      bmi: string;
      bmiValue: string;
      thisWeek: string;
      thisWeekValue: string;
      days30: string;
      days30Value: string;
    };
    highlightsTitle: string;
    highlights: { title: string; body: string }[];
    featuresTitle: string;
    featuresSubtitle: string;
    features: { title: string; body: string }[];
    audienceTitle: string;
    audienceSubtitle: string;
    audience: { title: string; body: string }[];
    screensTitle: string;
    screensSubtitle: string;
    screens: { id: string; title: string; body: string }[];
    howTitle: string;
    howSubtitle: string;
    steps: { title: string; body: string }[];
    faqTitle: string;
    faqSubtitle: string;
    faq: { question: string; answer: string }[];
    ctaTitle: string;
    ctaTitlePlayLetter?: string;
    ctaBody: string;
  };
  releases: {
    title: string;
    subtitle: string;
    latest: string;
    download: string;
    empty: string;
    noApk: string;
  };
  privacy: {
    title: string;
    updated: string;
    sections: { title: string; body: string }[];
  };
  footer: {
    tagline: string;
    home: string;
    privacy: string;
    copyrightName: string;
  };
};

const en: SiteMessages = {
  meta: {
    title: 'WeighWay',
    description:
      'Your weight, your progress. A free Android app for daily weigh-ins, BMI from your height history, and clear comparisons over time — with cloud sync in English and Polish.',
    releasesTitle: 'Releases — WeighWay',
    releasesDescription: 'Latest versions, user-facing release notes, and Android APK downloads.',
    privacyTitle: 'Privacy — WeighWay',
    privacyDescription: 'How WeighWay stores weight, height, and account data.',
  },
  brand: 'WeighWay',
  skip: 'Skip to content',
  nav: {
    home: 'Home',
    releases: 'Releases',
    privacy: 'Privacy',
    menu: 'Open menu',
    close: 'Close menu',
  },
  language: {
    label: 'Language',
    system: 'System',
    english: 'English',
    polish: 'Polski',
  },
  theme: {
    label: 'Appearance',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
  home: {
    eyebrow: 'Your weight, your progress.',
    headline: 'Log your weight.\nSee the trend.\nStay consistent.',
    subhead:
      'A simple Android app for daily weigh-ins, BMI tracking based on your height history, and clear comparisons across weeks, months, and years. Free for everyone — no ads, no feed, no noise.',
    download: 'Download for Android',
    downloadUnavailable: 'APK coming with the next release',
    versionLabel: 'Latest',
    freeBadge: 'Free',
    androidBadge: 'Android APK',
    privateBadge: 'Private by design',
    heroSliderNext: 'Show app preview',
    heroSliderPrev: 'Back to intro',
    preview: {
      latest: 'Latest weight',
      latestValue: '78.25 kg',
      bmi: 'BMI',
      bmiValue: '23.6',
      thisWeek: 'This week',
      thisWeekValue: '+0.35 kg',
      days30: '30 days',
      days30Value: '−1.2 kg',
    },
    highlightsTitle: 'The essentials',
    highlights: [
      {
        title: 'One weigh-in a day',
        body: 'Save today’s number in the selected unit. Logging the same date updates that entry — no duplicate rows.',
      },
      {
        title: 'BMI that follows height',
        body: 'Height can change over time. Each weigh-in uses the height that applied on that date, or is not displayed if none exists yet.',
      },
      {
        title: 'Your data in the cloud',
        body: 'All your data stays in sync. Install the app on another Android phone and pick up where you left off.',
      },
    ],
    featuresTitle: 'What you get',
    featuresSubtitle: 'Built for the habit of stepping on the scale — not for a dashboard full of noise.',
    features: [
      {
        title: 'Averages and highlights',
        body: 'See this week, last week, this month, and more — plus your heaviest and lightest points.',
      },
      {
        title: 'Compare periods',
        body: 'Stack weeks, months, years, or custom ranges next to each other and see how the average moved.',
      },
      {
        title: 'Your data, your account',
        body: 'Sign-in is required. Each person only sees their own entries. You can delete the account from Profile at any time.',
      },
      {
        title: 'Two languages, two themes',
        body: 'Use your system settings by default, or choose your preferred language and theme in Profile. The app is available in English and Polish, with both light and dark themes.',
      },
    ],
    audienceTitle: 'A habit without the pressure',
    audienceSubtitle: 'No social features, no streaks, no pressure — just the numbers you logged.',
    audience: [
      {
        title: 'Personal, not social',
        body: 'This is a private journal. There is no sharing, no leaderboard, and no one else in your weigh-ins.',
      },
      {
        title: 'Look at the bigger picture',
        body: 'Trends, averages, and period comparisons help you see movement without turning every day into a verdict.',
      },
      {
        title: 'You’re in control',
        body: 'Edit or remove a single day, manage height history, or delete the whole account. You decide how long your data stays in the app.',
      },
    ],
    screensTitle: 'Inside the app',
    screensSubtitle:
      'Four tabs, one calm flow — from today’s weigh-in to history, comparisons, and your profile.',
    screens: [
      {
        id: 'home',
        title: 'Home',
        body: 'Log a weigh-in, see the latest number, trend, and quick stats.',
      },
      {
        id: 'history',
        title: 'History',
        body: 'Scroll through past days, filter by date, and edit entries.',
      },
      {
        id: 'compare',
        title: 'Compare',
        body: 'Stack days, weeks, months, or years and see how the average moved.',
      },
      {
        id: 'profile',
        title: 'Profile',
        body: 'Height history, units, theme, language, and account settings.',
      },
    ],
    howTitle: 'How it works',
    howSubtitle: 'Three steps. Then your progress starts to take shape as you keep logging.',
    steps: [
      {
        title: 'Create an account',
        body: 'Sign up with email, confirm the link, and you are in. It’s your personal journal — your data is private to you.',
      },
      {
        title: 'Log a weigh-in',
        body: 'Pick the date, enter the weight, save. Optional height history unlocks BMI for that date.',
      },
      {
        title: 'See your progress take shape',
        body: 'Your data stays in sync across all screens. Install the app on another Android device and pick up where you left off.',
      },
    ],
    faqTitle: 'Common questions',
    faqSubtitle: 'Short answers before you install.',
    faq: [
      {
        question: 'Is the app free?',
        answer:
          'Yes. WeighWay is free to use. There are no ads and no paid plan on this site.',
      },
      {
        question: 'Do I need an account?',
        answer:
          'Yes. Sign-in keeps weigh-ins private to you and lets them sync across various devices. Other people cannot access your entries.',
      },
      {
        question: 'Can I use pounds?',
        answer:
          'Yes. Choose metric or imperial in Profile. Weight and height units follow that preference.',
      },
      {
        question: 'How is BMI calculated?',
        answer:
          'BMI uses the height that applied on that weigh-in date. If no height covers the date, BMI is not displayed. You can turn BMI off in Profile.',
      },
      {
        question: 'Can I delete my data?',
        answer:
          'Yes. Edit or delete individual weigh-ins and height records. Deleting the account from Profile removes your app data permanently.',
      },
      {
        question: 'Where do I download it?',
        answer:
          'The Android app is distributed as an APK from this website. Install only from the official download on this site.',
      },
    ],
    ctaTitle: 'Ready for the first weigh-in?',
    ctaBody: 'Download the free Android APK, create an account, and log your first weigh-in.',
  },
  releases: {
    title: 'Releases',
    subtitle:
      'What changed in each version. The latest Android build is attached when a production APK is available.',
    latest: 'Latest',
    download: 'Download APK',
    empty: 'No releases published yet.',
    noApk: 'APK not published for this version',
  },
  privacy: {
    title: 'Privacy',
    updated: 'This page describes how the app handles your data today.',
    sections: [
      {
        title: 'What we store',
        body: 'Your account email, password (handled by the auth provider), daily weight entries, height history, and optional profile details such as birth date and sex. Preferences like theme, language, and units stay on the device.',
      },
      {
        title: 'Where your data is stored',
        body: 'Weight, height, and profile rows are stored in a cloud database. Each row is tied to your user id. Other people cannot read your entries through the app.',
      },
      {
        title: 'What we don\'t do',
        body: 'We do not sell your data, show ads, or share weigh-ins with other accounts. There are no social features, and your measurements are never public.',
      },
      {
        title: 'You’re in control',
        body: 'You can edit or delete individual weigh-ins and height records. You can delete your account from Profile, which removes your app data.',
      },
      {
        title: 'Distribution',
        body: 'The Android app is currently distributed as an APK from this website. Install only from this official download link.',
      },
    ],
  },
  footer: {
    tagline: 'Your weight, your progress.',
    home: 'Home',
    privacy: 'Privacy',
    copyrightName: 'Adrian Prajsnar DEV',
  },
};

export default en;
