import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { languageState } from "../../state/editor";
import { activeModal } from "../../state/modal";
import { supportedLanguages } from "../../utils/consts";

export const LanguageModal = (): JSX.Element => {
  const [language, setLanguage] = useAtom(languageState);
  const [searchInput, setSearchInput] = useState<string>("");
  const [, setActiveModal] = useAtom(activeModal);

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
      Selected language: {language}
      <input
        placeholder="Search languages"
        onChange={(e) => setSearchInput(e.target.value)}
        autoFocus
      />
      <ul>
        {supportedLanguages
          .filter((language) => language.name.startsWith(searchInput))
          .map((language, key) => {
            return (
              <button
                style={{ display: "block" }}
                onClick={() => changeLanguage(language.name)}
                key={key}
                value={language.name}
              >
                {language.name}
              </button>
            );
          })}
      </ul>
    </>
  );
};
