import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { SearchIcon } from "../Icons";
import { Content, Wrapper } from "./base/Styles";
import { styled } from "../../stitches";
import { supportedLanguages, SupportedLanguages } from "../../utils/Constants";
import { setLanguage } from "../../state/actions";

const SearchContainer = styled("div", {
  color: "$primary",
});

export const Search = styled("input", {
  display: "inline-block",
  margin: "15px 15px 0",
  padding: "10px 0px",
  border: "none",
  borderRadius: "$medium",
  fontSize: "1.4em",
  background: "$tertiary",
  color: "$text-primary",

  "&:focus": {
    outline: "none",
  },

  "&::placeholder": {
    opacity: 0.4,
    color: "",
  },
});

const LanguageBtn = styled(motion.button, {
  display: "inline-block",
  marginRight: 5,
  textAlign: "left",
  fontSize: "1.1em",
  padding: "10px 15px",
  background: "transparent",
  cursor: "pointer",
  border: "1px solid var(--primary-700)",
  color: "var(--primary-100)",
  transition: "background-color 0.12s ease-in-out",

  "&:hover": {
    background: "light",
  },
});

const UnsupportedLanguage = styled(motion.div, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  fontSize: "1.2em",
  color: "$text-secondary",

  "> svg": {
    height: 30,
  },
});

const Tip = styled("span", {
  position: "absolute",
  left: 15,
  bottom: 10,
  fontSize: "0.9em",
  opacity: 0.8,
});

const TipAccent = styled("span", {
  fontSize: "0.9em",
  fontWeight: 700,
  paddingRight: 8,
  color: "$success",
});

const NOT_FOUND_ANIMATION = {
  initial: {
    opacity: 0,
    scale: 0.98,
    transform: "translateY(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    transform: "translateY(0px)",
  },
};

const ITEM_ANIMATION = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const LanguageSelector = ({ closeModal, dispatch }: ModalProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const changeLanguage = (language: SupportedLanguages) => {
    dispatch(setLanguage(language));
    closeModal();
  };

  const enterHandler = ({ key }: KeyboardEvent) => {
    if (key === "Enter" && searchQuery.length > 0) {
      const language = supportedLanguages.find((language) =>
        language.name.startsWith(searchQuery)
      )?.name;

      if (!language) return;

      changeLanguage(language);
      window.removeEventListener("keydown", enterHandler);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", enterHandler);

    return () => {
      window.removeEventListener("keydown", enterHandler);
    };
  });

  const filteredLanguages = useMemo(
    () =>
      supportedLanguages.filter((language) =>
        language.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [supportedLanguages, searchQuery]
  );

  return (
    <Wrapper>
      <Header>Select Language</Header>
      <Content>
        <SearchContainer>
          <SearchIcon />
          <Search
            placeholder="Search languages"
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </SearchContainer>
        {filteredLanguages.length === 0 ? (
          <UnsupportedLanguage
            transition={{ duration: 0.3 }}
            animate={NOT_FOUND_ANIMATION.animate}
            initial={NOT_FOUND_ANIMATION.initial}
            exit={NOT_FOUND_ANIMATION.initial}
          >
            <SearchIcon />
            <p>We don&apos;t support that language</p>
          </UnsupportedLanguage>
        ) : null}

        <br />
        {filteredLanguages.map((language) => (
          <LanguageBtn
            transition={{ duration: 0.3 }}
            initial={ITEM_ANIMATION.initial}
            animate={ITEM_ANIMATION.animate}
            exit={ITEM_ANIMATION.initial}
            onClick={() => changeLanguage(language.name)}
            key={language.id}
            value={language.name}
          >
            {language.name}
          </LanguageBtn>
        ))}

        {searchQuery ? (
          <Tip>
            <TipAccent>PROTIP</TipAccent>
            you can press enter to select the first result.
          </Tip>
        ) : null}
      </Content>
    </Wrapper>
  );
};
