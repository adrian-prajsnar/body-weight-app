import type { SiteMessages } from './en';

const pl: SiteMessages = {
  meta: {
    title: 'Body Weight Tracker',
    description:
      'Spokojna aplikacja na Androida do codziennego ważenia, obliczania BMI na podstawie historii wzrostu oraz przejrzystego porównywania wyników w czasie. Bezpłatna, z synchronizacją w chmurze, dostępna po polsku i angielsku.',
    releasesTitle: 'Wydania — Body Weight Tracker',
    releasesDescription:
      'Najnowsze wersje, informacje o zmianach widoczne dla użytkownika oraz pliki APK na Androida.',
    privacyTitle: 'Prywatność — Body Weight Tracker',
    privacyDescription:
      'Informacje o tym, jak aplikacja przechowuje dane dotyczące masy ciała, wzrostu i konta.',
  },
  brand: 'Body Weight Tracker',
  skip: 'Przejdź do treści',
  nav: {
    home: 'Strona główna',
    releases: 'Wydania',
    privacy: 'Prywatność',
    menu: 'Otwórz menu',
    close: 'Zamknij menu',
  },
  language: {
    label: 'Język',
    system: 'Systemowy',
    english: 'English',
    polish: 'Polski',
  },
  theme: {
    label: 'Wygląd',
    system: 'Systemowy',
    light: 'Jasny',
    dark: 'Ciemny',
  },
  home: {
    eyebrow: 'Osobisty dziennik wagi',
    headline: 'Zapisuj swoją wagę.\nObserwuj trend.\nTrzymaj się planu.',
    subhead:
      'Prosta i przejrzysta aplikacja na Androida do codziennego zapisywania wagi, śledzenia BMI na podstawie historii wzrostu oraz porównywania wyników na przestrzeni dni, tygodni, miesięcy i lat.\nBezpłatna dla każdego — bez reklam, bez rozpraszaczy, bez zbędnych dodatków.',
    download: 'Pobierz na Androida',
    downloadUnavailable: 'APK pojawi się w kolejnym wydaniu',
    versionLabel: 'Najnowsza wersja',
    freeBadge: 'Bezpłatna',
    androidBadge: 'Android APK',
    privateBadge: 'Prywatna z założenia',
    heroSliderNext: 'Pokaż podgląd aplikacji',
    heroSliderPrev: 'Wróć do opisu',
    preview: {
      latest: 'Ostatnia waga',
      latestValue: '72,4 kg',
      bmi: 'BMI',
      bmiValue: '22,1',
      thisWeek: 'Ten tydzień',
      thisWeekValue: '−0,3 kg',
      days30: '30 dni',
      days30Value: '−1,2 kg',
    },
    highlightsTitle: 'To, co najważniejsze',
    highlights: [
      {
        title: 'Jedno ważenie dziennie',
        body: 'Zapisz dzisiejszą wagę w kg lub lbs. Pomyliłeś się? Nic nie szkodzi — po prostu edytuj istniejący wpis. Bez duplikatów, bez zbędnego bałaganu.',
      },
      {
        title: 'BMI na podstawie wzrostu',
        body: 'Wzrost może się zmieniać w czasie. Każde ważenie korzysta ze wzrostu obowiązującego w danym dniu. Jeśli dla danego dnia nie ma wpisu wzrostu, BMI nie jest wyświetlane.',
      },
      {
        title: 'Twoje dane w chmurze',
        body: 'Wszystkie dane pozostają zsynchronizowane z Twoim kontem. Zainstaluj aplikację na innym telefonie z Androidem i kontynuuj tam, gdzie skończyłeś.',
      },
    ],
    featuresTitle: 'Co otrzymujesz',
    featuresSubtitle:
      'Stworzona z myślą o regularnym ważeniu — a nie o przeładowanym informacjami panelu.',
    features: [
      {
        title: 'Średnie i rekordy',
        body: 'Porównuj wyniki na podstawie dni, tygodni, miesięcy i lat. Sprawdź swoją najniższą i najwyższą wagę w historii, a także porównuj wagę z różnych okresów w swoim życiu.',
      },
      {
        title: 'Porównuj okresy',
        body: 'Porównuj tygodnie, miesiące, lata lub własne zakresy dat i sprawdzaj, jak zmieniała się średnia.',
      },
      {
        title: 'Twoje dane, Twoje konto',
        body: 'Logowanie jest wymagane. Każda osoba widzi wyłącznie własne wpisy. Konto możesz w każdej chwili usunąć w Profilu.',
      },
      {
        title: 'Polski i angielski',
        body: 'Korzystaj z języka telefonu albo wybierz na stałe English lub Polski w Profilu. Jasny i ciemny motyw działają w ten sam sposób.',
      },
    ],
    audienceTitle: 'Dla spokojnego nawyku',
    audienceSubtitle:
      'Bez publicznego feedu, bez serii, które domagają się uwagi — tylko liczby, które zapisujesz.',
    audience: [
      {
        title: 'Prywatnie, nie społecznościowo',
        body: 'To Twój prywatny dziennik. Nie ma udostępniania, rankingu ani innych osób w Twoich pomiarach.',
      },
      {
        title: 'Bez oceniania w czasie',
        body: 'Trendy, średnie i porównania okresów pomagają zobaczyć zmiany bez zamieniania każdego dnia w ocenę Twoich postępów.',
      },
      {
        title: 'To Ty decydujesz o swoich danych',
        body: 'Edytuj lub usuń pojedynczy dzień, zarządzaj historią wzrostu albo usuń całe konto. Aplikacja nie powinna przechowywać Twoich danych dłużej, niż tego chcesz.',
      },
    ],
    screensTitle: 'W środku aplikacji',
    screensSubtitle:
      'Cztery zakładki, jeden spokojny przepływ — od dzisiejszego ważenia po historię, porównania i profil.',
    screens: [
      {
        id: 'home',
        title: 'Strona główna',
        body: 'Zapisz ważenie, sprawdź ostatni wynik, trend i najważniejsze statystyki.',
      },
      {
        id: 'history',
        title: 'Historia',
        body: 'Przeglądaj poprzednie dni, filtruj wyniki po dacie i edytuj wpisy.',
      },
      {
        id: 'compare',
        title: 'Porównaj',
        body: 'Porównuj tygodnie, miesiące lub lata i sprawdzaj, jak zmieniała się średnia.',
      },
      {
        id: 'profile',
        title: 'Profil',
        body: 'Historia wzrostu, jednostki, motyw, język i ustawienia konta.',
      },
    ],
    howTitle: 'Jak to działa',
    howSubtitle:
      'Trzy kroki. Potem obraz stopniowo się uzupełnia, gdy regularnie zapisujesz wyniki.',
    steps: [
      {
        title: 'Utwórz konto',
        body: 'Zarejestruj się za pomocą adresu e-mail, potwierdź link i gotowe. To Twój osobisty dziennik — nie wspólny rodzinny skarbiec danych.',
      },
      {
        title: 'Zapisz ważenie',
        body: 'Wybierz datę, wpisz wagę i zapisz. Opcjonalna historia wzrostu umożliwia obliczanie BMI dla danego dnia.',
      },
      {
        title: 'Obserwuj zmiany',
        body: 'Strony Główna, Historia i Porównaj są synchronizowane przez chmurę. Możesz korzystać z aplikacji na dowolnym urządzeniu z Androidem, na którym ją zainstalujesz.',
      },
    ],
    privacyNote:
      'Waga i wzrost są przechowywane na Twoim koncie. Nie są udostępniane innym użytkownikom.',
    faqTitle: 'Najczęstsze pytania',
    faqSubtitle: 'Krótkie odpowiedzi przed instalacją.',
    faq: [
      {
        question: 'Czy aplikacja jest bezpłatna?',
        answer:
          'Tak. Monitorowanie masy ciała jest bezpłatne. Na tej stronie nie ma reklam ani płatnego planu.',
      },
      {
        question: 'Czy potrzebuję konta?',
        answer:
          'Tak. Logowanie sprawia, że Twoje pomiary są prywatne i pozwala synchronizować je między urządzeniami z Androidem. Inne osoby nie mogą odczytać Twoich wpisów w aplikacji.',
      },
      {
        question: 'Czy mogę używać funtów?',
        answer:
          'Tak. W Profilu wybierz jednostki metryczne lub imperialne. Jednostki wagi i wzrostu będą zgodne z tym ustawieniem.',
      },
      {
        question: 'Jak obliczane jest BMI?',
        answer:
          'BMI korzysta ze wzrostu obowiązującego w dniu ważenia. Jeśli dla danej daty nie ma odpowiedniego wpisu wzrostu, BMI jest wyświetlane jako „—”. BMI możesz wyłączyć w Profilu.',
      },
      {
        question: 'Czy mogę usunąć swoje dane?',
        answer:
          'Tak. Możesz edytować lub usuwać pojedyncze pomiary i wpisy dotyczące wzrostu. Usunięcie konta w Profilu usuwa dane aplikacji.',
      },
      {
        question: 'Gdzie mogę pobrać aplikację?',
        answer:
          'Aplikacja na Androida jest udostępniana jako plik APK na tej stronie oraz w GitHub Releases. Instaluj aplikację wyłącznie z oficjalnego źródła dostępnego na tej stronie.',
      },
    ],
    ctaTitle: 'Gotowy na pierwsze ważenie?',
    ctaBody:
      'Pobierz bezpłatny plik APK na Androida, utwórz konto i zacznij od dzisiejszego wyniku.',
  },
  releases: {
    title: 'Wydania',
    subtitle:
      'Co zmieniło się w każdej wersji. Najnowsza wersja aplikacji na Androida jest dostępna do pobrania, gdy opublikowano produkcyjny plik APK.',
    latest: 'Najnowsza',
    download: 'Pobierz APK',
    empty: 'Nie opublikowano jeszcze żadnych wydań.',
    noApk: 'APK nie został opublikowany dla tej wersji',
  },
  privacy: {
    title: 'Prywatność',
    updated:
      'Ta strona opisuje, jak aplikacja obecnie przetwarza Twoje dane.',
    sections: [
      {
        title: 'Co przechowujemy',
        body:
          'Adres e-mail konta, hasło (obsługiwane przez dostawcę uwierzytelniania), codzienne pomiary wagi, historię wzrostu oraz opcjonalne dane profilu, takie jak data urodzenia i płeć. Ustawienia takie jak motyw, język i jednostki są przechowywane na urządzeniu.',
      },
      {
        title: 'Gdzie są przechowywane',
        body:
          'Dane dotyczące wagi, wzrostu i profilu są przechowywane w bazie danych w chmurze. Każdy wpis jest powiązany z identyfikatorem użytkownika. Inne osoby nie mogą odczytać Twoich danych za pośrednictwem aplikacji.',
      },
      {
        title: 'Czego nie robimy',
        body:
          'Nie sprzedajemy Twoich danych, nie wyświetlamy reklam i nie udostępniamy pomiarów innym kontom. Nie ma też publicznego feedu.',
      },
      {
        title: 'Masz kontrolę',
        body:
          'Możesz edytować lub usuwać pojedyncze pomiary wagi i wpisy dotyczące wzrostu. Możesz również usunąć konto w Profilu, co spowoduje usunięcie danych aplikacji.',
      },
      {
        title: 'Dystrybucja',
        body:
          'Aplikacja na Androida jest obecnie udostępniana jako plik APK na tej stronie oraz w GitHub Releases. Instaluj ją wyłącznie z oficjalnego linku pobierania.',
      },
    ],
  },
  footer: {
    tagline: 'Spokojna aplikacja na Androida do codziennego ważenia.',
    home: 'Strona główna',
    privacy: 'Prywatność',
    github: 'GitHub',
    copyrightName: 'Adrian Prajsnar DEV',
  },
};

export default pl;
