import React from "react";
import AceEditor from "imperial-editor";

interface EditorProps {
  language?: string;
  theme?: string;
  autoFocus?: boolean;
}

export const Editor = ({
  language = "plain_text",
  theme = "imperial",
  autoFocus = false,
}: EditorProps): JSX.Element => {
  return <AceEditor mode={language} theme={theme} autoFocus={autoFocus} />;
};
