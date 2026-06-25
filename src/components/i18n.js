import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "tagline": "Infrastructure & Open Source Community",
          "last_sync": "LAST SYNC",
          "build": "BUILD",
          "download_logo": "Download Logo",
          "github_profile": "GitHub Profile",
          "Home": "Home", "home": "home",
          "Profile": "Profile", "profile": "profile",
          "Activities": "Activities", "activities": "activities",
          "Resources": "Resources", "resources": "resources",
          "Learning": "Learning", "learning": "learning",
          "Downloads": "Downloads", "downloads": "downloads",
          "References": "References", "references": "references",
          "Contacts": "Contacts", "contacts": "contacts",

          "home_page": {
            "cta_consulting": "Explore consulting services",  
            "hub_badge": "PORTFOLIO & PROFESSIONAL HUB",
            "hero_title": "Software Development, Training & Technical Consulting",
            "hero_subtitle": "Explore my open-source projects, book personalized tutoring sessions, request advanced architectural consulting, or access interactive technical guides.",
            "cta_profile": "Discover my Profile",
            "cta_materials": "Explore Materials & Lessons",
            "pillars_title": "The Hub Pillars",
            
            "card_github_title": "Open-Source & GitHub Ecosystem",
            "card_github_subtitle": "Active repositories, CI/CD metrics, and automation",
            "card_github_desc": "Analyze the state of my public repositories, real-time contribution graphs, language distributions, and clone projects directly from the advanced dashboard.",
            "card_github_btn": "Explore Projects & Stats",
            
            "card_lessons_title": "Private Tutoring & Materials Explorer",
            "card_lessons_subtitle": "Subjects, pinned topics, and calendar booking",
            "card_lessons_desc": "Find, filter, and download multimedia files, PDFs, and code snippets. Check real-time availability synchronized via Cal.com and book your customized lesson.",
            "card_lessons_btn": "Search Materials & Book Lesson",
            
            "card_consulting_title": "Enterprise Technical Consulting",
            "card_consulting_subtitle": "Business Domains, Technical Models, and Job Descriptions",
            "card_consulting_desc": "Dedicated sections for application domains, architectural workflows, and custom B2B parameters. Explore operational models and schedule targeted business consulting.",
            "card_consulting_btn": "Request B2B Consulting",
            
            "card_learning_title": "Interactive Learning Hub",
            "card_learning_subtitle": "Operating Systems, Languages, Guides, and Setup",
            "card_learning_desc": "A structured collection of programming languages, step-by-step installation guides, interactive tutorials, and practical code examples ready to be deployed.",
            "card_learning_btn": "Start Learning",
            
            "stats_cicd": "CI/CD Pipeline Integrity",
            "stats_subjects": "Study Subjects & Topics",
            "stats_booking": "Live Cal.com Bookings",
            
            "footer_title": "Need an urgent appointment?",
            "footer_desc": "Automated scheduling systems handle time zones and eliminate asynchronous emails. Gain immediate access to dedicated calendars.",
            "footer_btn_tutoring": "Book Tutoring",
            "footer_btn_consulting": "Book B2B Consulting"
          },

          "lessons": {
            "configure_session": "Configure your session",
            "full_name": "Full Name",
            "email": "Email",
            "lesson_title": "Lesson Title",
            "subject": "Subject",
            "duration": "Duration",
            "lesson_type": "Lesson Type",
            "payment_pref": "Payment Preference",
            "pay_on_booking": "Pay on booking",
            "pay_later": "Pay Later",
            "confirm_book": "Confirm & Book Session",
            "private_lessons": "Private Lessons",
            "hands_on_projects": "Hands-on Projects",
            "exam_tutoring": "Exam Tutoring",
            "live_pair_programming": "Live Pair Programming",
            "thesis_support": "Thesis Support",
            "homework_tasks": "Homework & Tasks",
            "ongoing_mentorship": "Ongoing Mentorship",
            "browse": "Browse",
            "collapse": "Collapse",
            "book_it": "Book it",
            "updated": "Updated"
          }
        }
      },

      it: {
        translation: {
          "tagline": "Infrastruttura e Comunita' Open Source",
          "last_sync": "ultimo agg.",
          "build": "BUILD",
          "download_logo": "Scarica Logo",
          "github_profile": "Profilo GitHub",
          "Home": "Home", "home": "home",
          "Profile": "Profilo", "profile": "profilo",
          "Activities": "Attività", "activities": "attività",
          "Resources": "Risorse", "resources": "risorse",
          "Learning": "Formazione", "learning": "formazione",
          "Downloads": "Downloads", "downloads": "downloads",
          "References": "Riferimenti", "references": "riferimenti",
          "Contacts": "Contatti", "contacts": "contatti",

          "home_page": {
            "hub_badge": "PORTFOLIO & HUB PROFESSIONALE",
            "hero_title": "Sviluppo Software, Formazione & Consulenza Tecnica",
            "hero_subtitle": "Esplora i miei progetti open-source, prenota sessioni di tutoring personalizzate, richiedi consulenze architetturali avanzate o accedi a guide e documentazione tecnica.",
            "cta_profile": "Scopri il mio Profilo",
            "cta_materials": "Esplora Materiali & Lezioni",
            "cta_consulting": "Esplora i servizi di consulenza",
            "pillars_title": "I Pilastri dell'Hub",
            
            "card_github_title": "Open-Source & GitHub Ecosystem",
            "card_github_subtitle": "Repository attive, metriche CI/CD e automazione",
            "card_github_desc": "Analizza lo stato delle mie repository pubbliche, i grafici di contribuzione in tempo reale, i linguaggi utilizzati e clona i progetti direttamente dalla dashboard avanzata.",
            "card_github_btn": "Esplora i Progetti & Statistiche",
            
            "card_lessons_title": "Private Tutoring & Materials Explorer",
            "card_lessons_subtitle": "Materie, argomenti fissati e prenotazione calendario",
            "card_lessons_desc": "Trova, filtra e scarica file multimediali, PDF e snippet di codice. Controlla la disponibilità in tempo reale sincronizzata con Cal.com e prenota direttamente una lezione personalizzata dal calendario.",
            "card_lessons_btn": "Cerca Materiale & Prenota Lezione",
            
            "card_consulting_title": "Enterprise Technical Consulting",
            "card_consulting_subtitle": "Business Domain, Modelli Tecnici e Job Descriptions",
            "card_consulting_desc": "Sezioni dedicate ad Application domains, flussi architetturali e parametri B2B custom. Esplora i modelli operativi e richiedi un appuntamento consulenziale mirato per il tuo business.",
            "card_consulting_btn": "Richiedi una Consulenza B2B",
            
            "card_learning_title": "Interactive Learning Hub",
            "card_learning_subtitle": "Sistemi Operativi, Linguaggi, Guide e Setup",
            "card_learning_desc": "Una raccolta strutturata di linguaggi di programmazione, guide all'installazione passo-passo, tutorial interattivi ed esempi pratici di codice pronti per essere eseguiti.",
            "card_learning_btn": "Inizia a Imparare",
            
            "stats_cicd": "Integrità Pipeline CI/CD",
            "stats_subjects": "Materie & Argomenti di Studio",
            "stats_booking": "Prenotazioni Live via Cal.com",
            
            "footer_title": "Hai bisogno di un appuntamento urgente?",
            "footer_desc": "I sistemi di pianificazione automatica gestiscono fusi orari ed eliminano lo scambio asincrono di email. Accedi al volo ai calendari dedicati.",
            "footer_btn_tutoring": "Prenota Tutoring",
            "footer_btn_consulting": "Prenota Consulenza B2B"
          },

          "lessons": {
            "configure_session": "Configura la tua sessione",
            "full_name": "Nome Completo",
            "email": "Email",
            "lesson_title": "Titolo Lezione",
            "subject": "Materia",
            "duration": "Durata",
            "lesson_type": "Tipo di Lezione",
            "payment_pref": "Metodo di Pagamento",
            "pay_on_booking": "Paga alla prenotazione",
            "pay_later": "Paga dopo",
            "confirm_book": "Conferma e Prenota",
            "private_lessons": "Lezioni Private",
            "hands_on_projects": "Progetti Pratici",
            "exam_tutoring": "Preparazione Esami",
            "live_pair_programming": "Live Pair Programming",
            "thesis_support": "Supporto Tesi",
            "homework_tasks": "Aiuto Compiti",
            "ongoing_mentorship": "Mentorship Continua",
            "browse": "Esplora",
            "collapse": "Chiudi",
            "book_it": "Prenota",
            "updated": "Aggiornato il"
          }
        }
      }
    },

    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;