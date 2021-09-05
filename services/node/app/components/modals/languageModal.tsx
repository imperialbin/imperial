import { useState } from "react";
import { useAtom } from "jotai";
import { languageState } from "../../state/editor";
import { activeModal } from "../../state/modal";
import { supportedLanguages } from "../../utils/consts";

export const LanguageModal = (): JSX.Element => {
  const [language, setLanguage] = useAtom(languageState);
  const [searchInput, setSearchInput] = useState<string>("");
  const [, setActiveModal] = useAtom(activeModal);

  console.log(searchInput);
  return (
    <>
      Selected language: {language}
      <input
        placeholder="Search languages"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <ul>
        {supportedLanguages
          .filter((language) => language.name.startsWith(searchInput))
          .map((language, key) => {
            return (
              <button
                style={{ display: "block" }}
                onClick={() => {
                  setLanguage(language.name);
                  setActiveModal([null, null]);
                }}
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
