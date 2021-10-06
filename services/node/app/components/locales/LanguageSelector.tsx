import React from "react";
import { useTranslation } from "react-i18next";
import en from "./en";
import { languages, useSetLanguage } from "./LocalesProvider";
import { ILanguage } from "./BaseLanguage";
import styled from "styled-components";

const Label = styled.label`
  color: ${({ theme }) => theme.textDarker};
`;

const Selector = styled.select`
  display: block;
  width: 80%;
  max-width: 230px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 5px 0 10px;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  padding: 13px 40px 13px 12px;
  background: ${({ theme }) => theme.layoutDark};
  box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.25);
  outline: none;
  color: ${({ theme }) => theme.textLight}5d;
  transition: all 0.1s ease-in-out;

  &:focus,
  &:focus::placeholder {
    color: ${({ theme }) => theme.textLight}9d;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textDarker}7d;
    transition: all 0.1s ease-in-out;
  }
`;

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLang = useSetLanguage();

  const handleLanguageChanged = ({ target: { value } }: any) => {
    changeLang(
      languages.find((val: ILanguage) => val.langCode === value) ?? en,
    );
  };

  return (
    <>
      <Label>Language</Label>
      <Selector value={i18n.language} onChange={handleLanguageChanged}>
        {languages.map((lang: ILanguage) => (
          <option key={lang.langCode} value={lang.langCode}>
            {lang.langName}
          </option>
        ))}
      </Selector>
    </>
  );
};
