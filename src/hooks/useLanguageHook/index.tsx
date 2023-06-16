import { useTranslation } from "next-i18next";

import LANGUAGES from "@/utils/languages";

const useLanguageHook = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = LANGUAGES.find(
    (language) => i18n.language === language.code
  );

  const langsArray = Object.entries(currentLanguage.languages);
  // example return [ '0', 'Arts' ]
  const categoriesArray = Object.entries(currentLanguage.categories);
  return [langsArray, categoriesArray];
};

export default useLanguageHook;