import { SearchIcon } from "@web/components/Icons";
import Input from "@web/components/Input";
import { setLanguage } from "@web/state/actions";
import { styled } from "@web/stitches.config";
import { SupportedLanguagesID, supportedLanguages } from "@web/utils/Constants";
import { useEffect, useMemo, useState } from "react";
import Header from "./base/Header";
import { Content, Wrapper } from "./base/Styles";
import { ModalProps } from "./base/modals";
import { LanguageIcon } from "../../utils/Languages";

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
  textTransform: "capitalize",
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

export default function LanguageSelector({ closeModal, dispatch }: ModalProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const changeLanguage = (language: SupportedLanguagesID) => {
    dispatch(setLanguage(language));
    closeModal();
  };

  const enterHandler = ({ key }: KeyboardEvent) => {
    if (key === "Enter" && searchQuery.length > 0) {
      changeLanguage(filteredLanguages[0].id);
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
        language.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [supportedLanguages, searchQuery],
  );

  return (
    <StyledWrapper>
      <Header>Select Language</Header>
      <StyledContent>
        <Input
          autoFocus
          style={{ width: "100%" }}
          icon={<SearchIcon />}
          placeholder="Search Language"
          value={searchQuery}
          onChange={({ target: { value } }) => setSearchQuery(value)}
        />
        <Languages>
          {filteredLanguages.map((language) => (
            <Language
              key={language.id}
              onClick={() => {
                dispatch(setLanguage(language.id));
                closeModal();
              }}
            >
              {language.icon ? <LanguageIcon language={language.id} /> : null}
              {language.name}
            </Language>
          ))}
        </Languages>
      </StyledContent>
    </StyledWrapper>
  );
}
