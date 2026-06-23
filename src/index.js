import React, { useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { I18nextProvider } from 'react-i18next'; // 1. Importa il Provider

import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./Home";
import Profile from "./components/Profile";
import Repositories from "./components/Repositories";
import Languages from "./components/Languages";
import Lessons from "./components/Lessons";
import Consulting from "./components/Consulting";
import CookieBanner from "./components/CookieBanner";

import i18n from './components/i18n'; // 2. Importa l'istanza configurata
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';


function Layout() {
  const location = useLocation();
  useEffect(() => {
    const manageScripts = () => {
      const status = localStorage.getItem('user-consent');
      
      if (status === 'all') {
        console.log("Tracking abilitato");
        // ESEMPIO: injectGoogleAnalytics();
      } else {
        console.log("Tracking disabilitato");
        // ESEMPIO: removeScripts();
      }
    };

    // Esegui al caricamento iniziale
    manageScripts();

    // Ascolta l'evento che parte quando l'utente clicca nel banner
    window.addEventListener('consent-updated', manageScripts);
    
    // Cleanup per evitare conflitti
    return () => window.removeEventListener('consent-updated', manageScripts);
  }, []); // Array vuoto: si esegue solo al montaggio

  let currentPageName = "Home";

  switch (location.pathname) {
    case "/":
      currentPageName = "Home";
      break;
    case "/profile":
      currentPageName = "Profile";
      break;
    case "/repositories":
      currentPageName = "Repositories";
      break;
    case "/languages":
      currentPageName = "Languages";
      break;
    case "/lessons":
      currentPageName = "Lessons";
      break;
    case "/consulting":
      currentPageName = "Consulting";
      break;
    default:
      currentPageName = "Unknown";
  }

  return (
    <>
      <Header currentPageName={currentPageName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/consulting" element={<Consulting />} />
      </Routes>
      <CookieBanner />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <MantineProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter basename="/unix69_webpage_frontend">
          <Layout />
        </BrowserRouter>
      </I18nextProvider>
    </MantineProvider>
  </React.StrictMode>
);