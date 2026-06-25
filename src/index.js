import React, { useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import { MantineProvider, Box } from '@mantine/core';

// Nota: Verifica che il percorso relativo di i18n sia corretto rispetto alla posizione di questo file
import i18n from './components/i18n';



import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AppShell, Burger, Group, Text } from '@mantine/core'; // <-- AGGIUNTO
import { useDisclosure } from '@mantine/hooks'; // <-- AGGIUNTO

import '@mantine/core/styles.css';

import Footer from "./components/Footer";
import Header from "./components/Header";
import HeaderNavigator from "./components/HeaderNavigator"; // <-- AGGIUNTO per la versione Mobile
import Home from "./Home";
import Profile from "./components/Profile";
import Repositories from "./components/Repositories";
import Languages from "./components/Languages";
import Lessons from "./components/Lessons";
import Consulting from "./components/Consulting";
import CookieBanner from "./components/CookieBanner";
import Contacts from "./components/Contacts";

// Copiamo qui la tua configurazione dei tab per passarla alla Navbar mobile
const header_navigator_tabs = [
  { label: 'Home', path: '/' },
  { label: 'Profile', path: '/profile' },
  { label: 'Activities', href: '#activities', dropdown: [
      { label: 'Lessons', path: '/lessons' },
      { label: 'Consulting', path: '/consulting' }
  ]},
  { label: 'Resources', href: '#resources', dropdown: [
    { label: 'Repositories', path: '/repositories' },
    { label: 'Projects', href: '#projects' },
    { label: 'Tools', path: '/repositories' },
    { label: 'Contents', href: '#contents', dropdown: [
      { label: 'Code Snippets', href: '#snippets' },
      { label: 'Guides', href: '#guides' },
      { label: 'Tutorials', href: '#tutorials' },
      { label: 'How To\'s', href: '#howtos' },
      { label: 'Manuals', href: '#manuals' },
      { label: 'Courses', href: '#courses' }
    ]}
  ]},
  { label: 'Learning', href: '#learning', dropdown: [
      { label: 'Languages', path: '/languages' },
      { label: 'Operating Systems', href: '#os_intro' },
      { label: 'Tools', href: '#tools_intro' },
  ]},
  { label: 'Downloads', href: '#downloads' },
  { label: 'References', href: '#references' },
  { label: 'Contacts', path: '/contacts' }
];



function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}



function Layout() {
  const location = useLocation();
  // Gestisce l'apertura/chiusura del menu laterale mobile
  const [opened, { toggle, close }] = useDisclosure();

  useEffect(() => {
    const manageScripts = () => {
      const status = localStorage.getItem('user-consent');
      if (status === 'all') {
        console.log("Tracking abilitato");
      } else {
        console.log("Tracking disabilitato");
      }
    };
    manageScripts();
    window.addEventListener('consent-updated', manageScripts);
    return () => window.removeEventListener('consent-updated', manageScripts);
  }, []);

  let currentPageName = "Home";
  switch (location.pathname) {
    case "/": currentPageName = "Home"; break;
    case "/profile": currentPageName = "Profile"; break;
    case "/repositories": currentPageName = "Repositories"; break;
    case "/languages": currentPageName = "Languages"; break;
    case "/lessons": currentPageName = "Lessons"; break;
    case "/consulting": currentPageName = "Consulting"; break;
    case "/contacts": currentPageName = "Contacts"; break;
    default: currentPageName = "Unknown";
  }

  return (
    <AppShell
      header={{ height: 110 }} // Regola l'altezza in base a HeaderInfo + HeaderNavigator (~110px)
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { desktop: true, mobile: !opened },
      }}
      styles={{
        // Mantiene lo sfondo blu nativo sul blocco header di Mantine
        header: { background: 'radial-gradient(circle, #1f62ce, #1f76b4)', borderBottom: '2px solid #1f4eb4' }
      }}
    >
      {/* --- HEADER GENERALE --- */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" align="center" wrap="nowrap">
          <Group gap="md">
            {/* Il pulsante Burger compare SOLO su Mobile */}
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="white" />
          </Group>
          
          {/* Iniettiamo il tuo Header Desktop originale (si nasconderà su mobile da solo) */}
          <Box style={{ flex: 1 }}>
            <Header currentPageName={currentPageName} />
          </Box>
        </Group>
      </AppShell.Header>

      {/* --- NAVBAR LATERALE VERTICALE (Solo Mobile) --- */}
      <AppShell.Navbar bg="blue.9" p="md" style={{ overflowY: 'auto' }}>
        <HeaderNavigator tabs={header_navigator_tabs} isMobile={true} onCloseMobileMenu={close} />
      </AppShell.Navbar>

      {/* --- CONTENUTO DELLE PAGINE --- */}
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
        <Footer />
      </AppShell.Main>

      <CookieBanner />
    </AppShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <MantineProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter basename="/unix69_webpage_frontend">
          <ScrollToTop />
          <Layout />
        </BrowserRouter>
      </I18nextProvider>
    </MantineProvider>
  </React.StrictMode>
);