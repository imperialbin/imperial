import { useState, useEffect } from "react";
import { ThemeForStupidProps } from "../../types";
import { useAtom } from "jotai";
import styled from "styled-components";
import { languageState } from "../../state/editor";
import { activeModal } from "../../state/modal";
import { supportedLanguages } from "../../utils/consts";
import { MdFindInPage } from "react-icons/md";
import { motion } from "framer-motion";

const Search = styled.input`
  display: block;
  margin: 15px 0 0;
  padding: 10px 0px;
  border: none;
  border-radius: 8px;
  font-size: 1.4em;
  background: ${({ theme }: ThemeForStupidProps) =>
    theme.layoutLightestOfTheBunch};
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};

  &:focus {
    outline: none;
  }

  &:focus::placeholder {
    color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  }
`;

const HeaderSecondary = styled.span`
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
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
  border-top: 1px solid ${({ theme }: ThemeForStupidProps) => theme.textDarkest};
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  transition: background-color 0.12s ease-in-out;

  &:hover {
    background: ${({ theme }: ThemeForStupidProps) =>
      theme.layoutLittleLessDark};
  }
`;

const UnsupportedLanguage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
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
  color: ${({ theme }: ThemeForStupidProps) => theme.success};
`;

const LanguageBtnAnimation = {
  initial: {
    opacity: 0,
  },
  isOpen: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const UnsupportedLanguageAnimation = {
  initial: {
    opacity: 0,
    transform: "translateY(10px)",
  },
  isOpen: {
    opacity: 1,
    transform: "translateY(0px)",
  },
  exit: {
    opacity: 0,
    transform: "translateY(10px)",
  },
};

export const LanguageModal = (): JSX.Element => {
  const [language, setLanguage] = useAtom(languageState);
  const [searchInput, setSearchInput] = useState<string>("");
  const [, setActiveModal] = useAtom(activeModal);

  const languageFilter = supportedLanguages.filter((language) =>
    language.name.startsWith(searchInput)
  );

  const changeLanguage = (language: string) => {
    setActiveModal([null, null]);
    setLanguage(language);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", ({ key }) => {
      if (key === "Enter" && searchInput.length > 0) {
        const language = supportedLanguages.find((language) =>
          language.name.startsWith(searchInput)
        )?.name;

        if (!language) return;

        changeLanguage(language);
      }
    });
  });

  return (
    <>
      <HeaderSecondary>Selected language: {language}</HeaderSecondary>
      <Search
        placeholder="Search languages"
        onChange={(e) => setSearchInput(e.target.value)}
        autoFocus
      />
      {languageFilter.length === 0 && (
        <UnsupportedLanguage
          transition={{ duration: 0.3 }}
          variants={UnsupportedLanguageAnimation}
        >
          <MdFindInPage size={50} />
          <p>We don&apos;t support that language</p>
        </UnsupportedLanguage>
      )}
      {languageFilter.map((language, key) => {
        return (
          <LanguageBtn
            transition={{ duration: 0.3 }}
            variants={LanguageBtnAnimation}
            onClick={() => changeLanguage(language.name)}
            key={key}
            value={language.name}
          >
            {language.name}
          </LanguageBtn>
        );
      })}
      {searchInput && (
        <Tip>
          <TipAccent>PROTIP</TipAccent>
          you can press enter to select the first result.
        </Tip>
      )}
    </>
  );
};
