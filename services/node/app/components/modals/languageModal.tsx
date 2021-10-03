import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
import { languageState } from "../../state/editor";
import { activeModal } from "../../state/modal";
import { supportedLanguages } from "../../lib/constants";
import { MdFindInPage } from "react-icons/md";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import {
  FadeAnimation,
  FadeSlideUpAnimation,
  HeaderSecondary,
  Search,
} from "./styles";

const SearchContainer = styled.div`
  color: ${({ theme }) => theme.textDarker};
`;

const LanguageBtn = styled(motion.button)`
  display: block;
  width: 100%;
  text-align: left;
  font-size: 1.1em;
  padding: 10px 15px;
  background: transparent;
  cursor: pointer;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.textDarkest};
  color: ${({ theme }) => theme.textLight};
  transition: background-color 0.12s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.layoutLittleLessDark};
  }
`;

const UnsupportedLanguage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.textDarker};
`;

const Tip = styled.span`
  position: absolute;
  left: 15px;
  bottom: 10px;
  font-size: 0.9em;
  opacity: 0.8;
`;

const TipAccent = styled.span`
  font-size: 0.9em;
  font-weight: 700;
  padding-right: 8px;
  color: ${({ theme }) => theme.success};
`;

export const LanguageModal = (): JSX.Element => {
  const [language, setLanguage] = useAtom(languageState);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setActiveModal] = useAtom(activeModal);
  const languageFilter = supportedLanguages.filter(language =>
    language.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const changeLanguage = (language: string) => {
    setActiveModal([null, null]);
    setLanguage(language);
  };

  const enterHandler = ({ key }: KeyboardEvent) => {
    if (key === "Enter" && searchQuery.length > 0) {
      const language = supportedLanguages.find(language =>
        language.name.startsWith(searchQuery),
      )?.name;

      if (!language) return;

      changeLanguage(language);
      window.removeEventListener("keydown", enterHandler);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", enterHandler);
  });

  return (
    <>
      <HeaderSecondary>Selected language: {language}</HeaderSecondary>
      <SearchContainer>
        <FaSearch />
        <Search
          placeholder="Search languages"
          onChange={e => setSearchQuery(e.target.value)}
          autoFocus
        />
      </SearchContainer>
      {languageFilter.length === 0 && (
        <UnsupportedLanguage
          transition={{ duration: 0.3 }}
          variants={FadeSlideUpAnimation}
        >
          <MdFindInPage size={50} />
          <p>We don&apos;t support that language</p>
        </UnsupportedLanguage>
      )}
      {languageFilter.map((language, key) => (
        <LanguageBtn
          transition={{ duration: 0.3 }}
          variants={FadeAnimation}
          onClick={() => changeLanguage(language.name)}
          key={key}
          value={language.name}
        >
          {language.name}
        </LanguageBtn>
      ))}
      {searchQuery && (
        <Tip>
          <TipAccent>PROTIP</TipAccent>
          you can press enter to select the first result.
        </Tip>
      )}
    </>
  );
};
// ,
