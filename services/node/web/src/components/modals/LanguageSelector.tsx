import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { SearchIcon } from "../Icons";
import { Content, Wrapper } from "./base/Styles";
import { styled } from "../../stitches";
import { supportedLanguages, SupportedLanguages } from "../../utils/Constants";
import { setLanguage } from "../../state/actions";
import Input from "../Input";

const StyledWrapper = styled(Wrapper, {
  gap: 10,
  maxWidth: 600,
  width: "100%",
});

const StyledContent = styled(Content, {
  maxHeight: 300,
});

const Languages = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 15,
});

const Language = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "5px 10px",
  color: "$text-secondary",
  background: "unset",
  minWidth: 150,
  border: "none",
  cursor: "pointer",
  fontSize: "1em",
  flex: 1,
  borderRadius: "$tiny",
  transition: "background 0.15s ease-in-out",

  "&:hover": {
    background: "$tertiary",
  },

  "> svg": {
    width: 25,
    height: 25,
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
    <StyledWrapper>
      <Header>Select Language</Header>
      <StyledContent>
        <Input
          style={{ width: "100%" }}
          icon={<SearchIcon />}
          placeholder="Search Language"
          onChange={({ target: { value } }) => setSearchQuery(value)}
          autoFocus
        />
        <Languages>
          {filteredLanguages.map((language) => (
            <Language
              onClick={() => {
                dispatch(setLanguage(language.name));
                closeModal();
              }}
            >
              {language.icon ? <language.icon /> : null}
              {language.name}
            </Language>
          ))}
        </Languages>
      </StyledContent>
    </StyledWrapper>
  );
};
