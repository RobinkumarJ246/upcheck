import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import ta from "./locales/ta.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import kn from "./locales/kn.json";
import ml from "./locales/ml.json";

const resources = { en, ta, hi, te, kn, ml };

const getSavedLanguage = async () => {
  const storedLang = await AsyncStorage.getItem("language");
  if (storedLang) return storedLang;
  
  const deviceLang = RNLocalize.getLocales()[0]?.languageCode || "en";
  return resources[deviceLang] ? deviceLang : "en"; // Default to English if not supported
};

getSavedLanguage().then((lang) => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: lang, // Set the retrieved language
      fallbackLng: "en",
      compatibilityJSON: "v3",
      interpolation: { escapeValue: false },
    });
});

export default i18n;
