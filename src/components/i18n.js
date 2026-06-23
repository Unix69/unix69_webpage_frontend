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