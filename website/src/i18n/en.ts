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
    privacyNote: string;
    faqTitle: string;
    faqSubtitle: string;
    faq: { question: string; answer: string }[];
    ctaTitle: string;
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
    github: string;
    copyrightName: string;
  };
};

const en: SiteMessages = {
  meta: {
    title: 'Body Weight Tracker',
    description:
      'A calm Android app for daily weigh-ins, BMI from your height history, and clear comparisons over time. Free, with cloud sync, in English and Polish.',
    releasesTitle: 'Releases — Body Weight Tracker',
    releasesDescription: 'Latest versions, user-facing release notes, and Android APK downloads.',
    privacyTitle: 'Privacy — Body Weight Tracker',
    privacyDescription: 'How Body Weight Tracker stores weight, height, and account data.',
  },
  brand: 'Body Weight Tracker',
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
    eyebrow: 'Personal weight tracking',
    headline: 'Log your weight.\nSee the trend.\nStay consistent.',
    subhead:
      'A calm Android app for daily weigh-ins, BMI tracking based on your height history, and clear comparisons across weeks, months, and years. Free for everyone — no ads, no feed, no noise.',
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
      latestValue: '72.4 kg',
      bmi: 'BMI',
      bmiValue: '22.1',
      thisWeek: 'This week',
      thisWeekValue: '−0.3 kg',
      days30: '30 days',
      days30Value: '−1.2 kg',
    },
    highlightsTitle: 'The essentials',
    highlights: [
      {
        title: 'One weigh-in a day',
        body: 'Save today’s number in kg or lb. Logging the same date updates that entry — no duplicate rows.',
      },
      {
        title: 'BMI that follows height',
        body: 'Height can change. Each weigh-in uses the height that applied on that date, or shows “—” if none exists yet.',
      },
      {
        title: 'Cloud, not a local vault',
        body: 'Home, History, and Compare stay in sync. Install the app on another Android phone and pick up where you left off.',
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
        title: 'English and Polish',
        body: 'Follow the phone language, or pin English or Polski in Profile. Light and dark themes work the same way.',
      },
    ],
    audienceTitle: 'Made for a quiet habit',
    audienceSubtitle: 'No public feed, no streaks shouting at you — just the numbers you logged.',
    audience: [
      {
        title: 'Personal, not social',
        body: 'This is a private journal. There is no sharing, no leaderboard, and no one else in your weigh-ins.',
      },
      {
        title: 'Honest over time',
        body: 'Trends, averages, and period comparisons help you see movement without turning every day into a verdict.',
      },
      {
        title: 'Yours to delete',
        body: 'Edit or remove a single day, manage height history, or delete the whole account. The app should not outlive your consent.',
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
        body: 'Stack weeks, months, or years and see how the average moved.',
      },
      {
        id: 'profile',
        title: 'Profile',
        body: 'Height history, units, theme, language, and account settings.',
      },
    ],
    howTitle: 'How it works',
    howSubtitle: 'Three steps. Then the picture fills in as you keep logging.',
    steps: [
      {
        title: 'Create an account',
        body: 'Sign up with email, confirm the link, and you are in. It is a personal journal — not a shared family vault.',
      },
      {
        title: 'Log a weigh-in',
        body: 'Pick the date, enter the weight, save. Optional height history unlocks BMI for that date.',
      },
      {
        title: 'Watch the picture form',
        body: 'Home, History, and Compare stay in sync through the cloud. Use it from any Android install of the app.',
      },
    ],
    privacyNote: 'Weight and height stay in your account. They are not shared with other users.',
    faqTitle: 'Common questions',
    faqSubtitle: 'Short answers before you install.',
    faq: [
      {
        question: 'Is the app free?',
        answer:
          'Yes. Body Weight Tracker is free to use. There are no ads and no paid plan on this site.',
      },
      {
        question: 'Do I need an account?',
        answer:
          'Yes. Sign-in keeps weigh-ins private to you and lets them sync across Android installs. Other people cannot read your entries in the app.',
      },
      {
        question: 'Can I use pounds?',
        answer:
          'Yes. Choose metric or imperial in Profile. Weight and height units follow that preference.',
      },
      {
        question: 'How is BMI calculated?',
        answer:
          'BMI uses the height that applied on that weigh-in date. If no height covers the date, BMI shows as “—”. You can turn BMI off in Profile.',
      },
      {
        question: 'Can I delete my data?',
        answer:
          'Yes. Edit or delete individual weigh-ins and height records. Deleting the account from Profile removes your app data.',
      },
      {
        question: 'Where do I download it?',
        answer:
          'The Android app is distributed as an APK from this website and GitHub Releases. Install only from the official download on this site.',
      },
    ],
    ctaTitle: 'Ready for the first weigh-in?',
    ctaBody: 'Download the free Android APK, create an account, and start with today’s number.',
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
        title: 'Where it lives',
        body: 'Weight, height, and profile rows are stored in a cloud database. Each row is tied to your user id. Other people cannot read your entries through the app.',
      },
      {
        title: 'What we do not do',
        body: 'We do not sell your data, show ads, or share weigh-ins with other accounts. There is no public feed.',
      },
      {
        title: 'Your control',
        body: 'You can edit or delete individual weigh-ins and height records. You can delete your account from Profile, which removes your app data.',
      },
      {
        title: 'Distribution',
        body: 'The Android app is currently distributed as an APK from this website and GitHub Releases. Install only from this official download link.',
      },
    ],
  },
  footer: {
    tagline: 'A calm Android app for daily weigh-ins.',
    home: 'Home',
    privacy: 'Privacy',
    github: 'GitHub',
    copyrightName: 'Adrian Prajsnar DEV',
  },
};

export default en;
