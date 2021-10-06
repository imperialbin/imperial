import React from 'react';
import { useTranslation } from 'react-i18next';
import en from './en';
import { languages, useSetLanguage } from './LocalesProvider';
import { ILanguage } from "./BaseLanguage";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLang = useSetLanguage();

  const handleLanguageChanged = ({ target: { value } }: any) => {
    changeLang(languages.find((val: ILanguage) => val.langCode === value) ?? en);
  };

  return (
    <select
      className="language-selector"
      value={i18n.language}
      onChange={handleLanguageChanged}
    >
      {languages.map((lang: ILanguage) => (
        <option key={lang.langCode} value={lang.langCode}>
          {lang.langName}
        </option>
      ))}
    </select>
  );
};
