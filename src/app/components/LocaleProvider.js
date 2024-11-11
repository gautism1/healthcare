"use client";

import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import en from "../locales/en.json";
import hi from "../locales/hi.json";

const messages = {
  en,
  hi,
};

const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  // Retrieve the preferred language from the browser or other source
  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale) {
      setLocale(storedLocale);
    } else {
      // You can also use `navigator.language` for automatic detection
      const userLang = navigator.language.split("-")[0];
      if (userLang === "hi" || userLang === "en") {
        setLocale(userLang);
      }
    }
  }, []);

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      onError={() => {}}
    >
      {children}
    </IntlProvider>
  );
};

export default LocaleProvider;
