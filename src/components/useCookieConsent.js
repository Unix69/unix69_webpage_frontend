import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
  // Leggiamo subito lo stato iniziale dal localStorage
  const [consent, setConsent] = useState(() => localStorage.getItem('user-consent'));

  const acceptConsent = (type) => {
    // 1. Salviamo la scelta
    localStorage.setItem('user-consent', type);
    setConsent(type);

    // 2. Lanciamo un evento personalizzato che il Layout/App può ascoltare
    // Questo permette a tutto il sito di "sapere" immediatamente che la scelta è cambiata
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: type }));
  };

  return { consent, acceptConsent };
};