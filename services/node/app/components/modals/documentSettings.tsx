import { useState } from "react";
import { Document } from "../../types";
import { HeaderSecondary } from "./styles";
import { Switch } from "../";

export const DocumentSettings = ({
  document,
}: {
  document: Document;
}): JSX.Element => {
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <HeaderSecondary>
        Change document settings for document {document.id}
      </HeaderSecondary>
      {error && error}
      <br />
      <Switch
        toggled={document.settings.encrypted}
        onToggle={() => console.log("test")}
      />
      <Switch
        toggled={document.settings.imageEmbed}
        onToggle={() => console.log("test")}
      />
    </>
  );
};
