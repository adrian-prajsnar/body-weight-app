import type { SiteMessages } from './en';

const pl: SiteMessages = {
  meta: {
    title: 'Body Weight Tracker',
    description:
      'Spokojna aplikacja na Androida do codziennego ważenia, obliczania BMI na podstawie historii wzrostu oraz przejrzystego porównywania wyników w czasie. Bezpłatna, z synchronizacją w chmurze, dostępna po polsku i angielsku.',
    releasesTitle: 'Aktualizacje — Body Weight Tracker',
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
    releases: 'Aktualizacje',
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
        body: 'Zapisz dzisiejszą wagę w wybranej jednostce. Pomyliłeś się? Nic nie szkodzi — po prostu edytuj istniejący wpis. Bez duplikatów, bez zbędnego bałaganu.',
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
      'Stworzona z myślą o regularnym ważeniu — bez przeładowanego panelu i zbędnych informacji.',
    features: [
      {
        title: 'Średnie i rekordy',
        body: 'Porównuj wyniki na podstawie dni, tygodni, miesięcy i lat. Sprawdź swoją najniższą i najwyższą wagę w historii, a także porównuj wagę z różnych okresów w swoim życiu.',
      },
      {
        title: 'Porównuj okresy',
        body: 'Porównuj dni, tygodnie, miesiące, lata. Sprawdzaj niestandardowe okresy, które Cię interesują i sprawdzaj, jak zmieniała się Twoja waga.',
      },
      {
        title: 'Twoje dane, Twoje konto',
        body: 'Po zalogowaniu każdy ma dostęp wyłącznie do własnych wpisów, a swoje konto możesz w każdej chwili usunąć w Profilu.',
      },
      {
        title: 'Dwa języki, dwa motywy',
        body: 'Korzystaj z domyślnych opcji systemu lub wybierz na stałe język i motyw w Profilu. Aplikacja dostępna w języku polskim lub angielskim, z jasnym lub ciemnym motywem.',
      },
    ],
    audienceTitle: 'Twój nawyk, bez presji',
    audienceSubtitle:
      'Bez zbędnych powiadomień, rywalizacji i presji — po prostu zapisuj swoje wyniki.',
    audience: [
      {
        title: 'Tylko dla Ciebie',
        body: 'To Twój prywatny dziennik wagi — bez udostępniania, rankingów i społeczności. Tylko Twoje pomiary.',
      },
      {
        title: 'Maraton, nie sprint',
        body: 'Trendy, średnie i porównania okresów pomagają dostrzec zmiany bez skupiania się na wyniku każdego pojedynczego ważenia.',
      },
      {
        title: 'Ty decydujesz',
        body: 'Edytuj lub usuwaj swoje pomiary, zmieniaj historię wzrostu i zarządzaj kontem tak, jak chcesz. Kiedy zechcesz, możesz też usunąć wszystkie swoje dane.',
      },
    ],
    screensTitle: 'W środku aplikacji',
    screensSubtitle:
      'Cztery zakładki, wszystko czego potrzebujesz — od dzisiejszego ważenia po historię, porównania i profil.',
    screens: [
      {
        id: 'home',
        title: 'Strona główna',
        body: 'Zapisz wagę, sprawdź ostatni wynik, trend i najważniejsze statystyki.',
      },
      {
        id: 'history',
        title: 'Historia',
        body: 'Przeglądaj poprzednie dni, filtruj wyniki po dacie i edytuj wpisy.',
      },
      {
        id: 'compare',
        title: 'Porównaj',
        body: 'Porównuj dni, tygodnie, miesiące lub lata i sprawdzaj, jak zmieniała się Twoja waga.',
      },
      {
        id: 'profile',
        title: 'Profil',
        body: 'Wzrostu, jednostki wagi i wzrostu, motyw, język i ustawienia konta.',
      },
    ],
    howTitle: 'Jak to działa',
    howSubtitle:
      'Trzy kroki. Potem wszystko dzieje się samo — regularnie zapisujesz wyniki, a obraz Twoich postępów stopniowo się uzupełnia.',
    steps: [
      {
        title: 'Utwórz konto',
        body: 'Zarejestruj się za pomocą adresu e-mail, potwierdź link i gotowe. Od tego momentu masz własny, prywatny dziennik swoich pomiarów.',
      },
      {
        title: 'Zapisz swoją wagę',
        body: 'Wybierz datę, wpisz wagę i zapisz. Jeśli uzupełnisz swój wzrost, aplikacja obliczy i wyświetli Twoje BMI dla konkretnego dnia.',
      },
      {
        title: 'Obserwuj zmiany',
        body: 'Obserwuj postępy korzystając z aplikacji na dowolnym urządzeniu z Androidem. Twoje dane są zapisywane w chmurze.',
      },
    ],
    faqTitle: 'Najczęściej zadawane pytania',
    faqSubtitle: 'Krótkie odpowiedzi, przed instalacją.',
    faq: [
      {
        question: 'Czy aplikacja jest bezpłatna?',
        answer:
          'Tak. Aplikacja Body Weight Tracker jest bezpłatna — nie ma reklam ani płatnego planu.',
      },
      {
        question: 'Czy potrzebuję konta?',
        answer:
          'Tak. Konto pozwala zachować prywatność Twoich pomiarów i synchronizować je między urządzeniami, a Twoje wpisy są dostępne tylko dla Ciebie.',
      },
      {
        question: 'Czy mogę używać funtów?',
        answer:
          'Tak. W Profilu wybierz jednostki metryczne lub imperialne. Jednostki wagi i wzrostu zostaną automatycznie dopasowane do wybranego ustawienia.',
      },
      {
        question: 'Jak obliczane jest BMI?',
        answer:
          'BMI obliczane jest na podstawie wzrostu obowiązującego w dniu ważenia. Jeśli dla danej daty nie ma odpowiedniego wpisu wzrostu, BMI wyświetla się jako niedostępne. Wyświetlanie BMI możesz wyłączyć w Profilu.',
      },
      {
        question: 'Czy mogę usunąć swoje dane?',
        answer:
          'Tak. Możesz edytować lub usuwać pojedyncze pomiary i wpisy dotyczące wzrostu. Usunięcie konta w Profilu spowoduje usunięcie Twoich danych na stałe. Przed każdym usunięciem pojawia się prośba o potwierdzenie, aby uniknąć przypadkowych usunięć.',
      },
      {
        question: 'Gdzie mogę pobrać aplikację?',
        answer:
          'Aplikację na Androida możesz pobrać jako plik APK z tej strony. Dla bezpieczeństwa korzystaj wyłącznie z oficjalnych źródeł podanych na tej stronie.',
      },
    ],
    ctaTitle: 'Gotowy na pierwsze wRażenie?',
    ctaTitlePlayLetter: 'R',
    ctaBody:
      'Pobierz bezpłatną aplikację na Androida, utwórz konto i zacznij monitorować swoje postępy!',
  },
  releases: {
    title: 'Aktualizacje',
    subtitle:
      'Zobacz, co zmieniło się w kolejnych wersjach aplikacji. Najnowsza wersja aplikacji powinna być dostępna do pobrania zaraz po opublikowaniu.',
    latest: 'Najnowsza',
    download: 'Pobierz APK',
    empty: 'Nie opublikowano jeszcze żadnych wydań.',
    noApk: 'APK nie został opublikowany dla tej wersji',
  },
  privacy: {
    title: 'Prywatność',
    updated:
      'Ta strona opisuje, w jaki sposób aplikacja przetwarza Twoje dane oraz jakie dane są przechowywane.',
    sections: [
      {
        title: 'Co przechowujemy',
        body:
          'Przechowujemy adres e-mail konta, hasło (obsługiwane przez dostawcę uwierzytelniania), codzienne pomiary wagi, historię wzrostu oraz opcjonalne dane profilu, takie jak data urodzenia i płeć. Ustawienia, takie jak motyw, język i jednostki, są przechowywane na urządzeniu.',
      },
      {
        title: 'Gdzie przechowujemy dane',
        body:
          'Dane dotyczące wagi, wzrostu i profilu są przechowywane w bazie danych w chmurze. Każdy wpis jest powiązany z konkretnym kontem użytkownika, a inne osoby nie mogą uzyskać dostępu do Twoich danych za pośrednictwem aplikacji.',
      },
      {
        title: 'Czego nie robimy',
        body:
          'Nie sprzedajemy Twoich danych, nie wyświetlamy reklam ani nie udostępniamy Twoich pomiarów innym kontom. Aplikacja nie ma funkcji społecznościowych — Twoje dane pozostają tylko Twoje.',
      },
      {
        title: 'Masz kontrolę',
        body:
          'Możesz w każdej chwili edytować lub usuwać pojedyncze pomiary wagi i wpisy dotyczące wzrostu. Możesz również usunąć konto w Profilu, co spowoduje całkowite usunięcie Twoich danych z aplikacji.',
      },
      {
        title: 'Dystrybucja',
        body:
          'Aplikacja na Androida jest obecnie dostępna jako plik APK na tej stronie. Ze względów bezpieczeństwa korzystaj wyłącznie z oficjalnego linku pobierania.',
      },
    ],
  },
  footer: {
    tagline: 'Prosta aplikacja na Androida do codziennego ważenia.',
    home: 'Strona główna',
    privacy: 'Prywatność',
    copyrightName: 'Adrian Prajsnar DEV',
  },
};

export default pl;
