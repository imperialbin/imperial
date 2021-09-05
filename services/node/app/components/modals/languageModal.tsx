import { useAtom } from "jotai";
import { languageState } from "../../state/editor";
import { activeModal } from "../../state/modal";
import { supportedLanguages } from "../../utils/consts";

export const LanguageModal = (): JSX.Element => {
  const [language, setLanguage] = useAtom(languageState);
  const [, setActiveModal] = useAtom(activeModal);

  return (
    <>
      Selected language: {language}
      <ul>
        {supportedLanguages.map((language, key) => {
          <button
            onClick={() => {
              setLanguage(language.name);
              setActiveModal([null, null]);
            }}
            key={key}
            value={language.name}
          >
            {language.name}
          </button>;
        })}
      </ul>
    </>
  );
};
