"use client";

import { useState } from "react";

const LanguageSwitcher = () => {
  const [currentLocale, setCurrentLocale] = useState("en");

  const handleLocaleChange = (locale) => {
    setCurrentLocale(locale);
    localStorage.setItem("locale", locale);
    window.location.reload(); // Reload to apply the new locale
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-4">
      <button
        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${
          currentLocale === "en"
            ? "bg-blue-500 text-white border-blue-600"
            : "bg-white text-blue-500 border-blue-500 hover:bg-blue-100"
        }`}
        onClick={() => handleLocaleChange("en")}
      >
        English
      </button>
      <button
        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${
          currentLocale === "hi"
            ? "bg-blue-500 text-white border-blue-600"
            : "bg-white text-blue-500 border-blue-500 hover:bg-blue-100"
        }`}
        onClick={() => handleLocaleChange("hi")}
      >
        हिन्दी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
