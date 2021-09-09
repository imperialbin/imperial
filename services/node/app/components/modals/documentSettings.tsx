import { useState } from "react";
import { Document } from "../../types";
import { HeaderSecondary } from "./styles";
import { Setting } from "../";
import { updateDocumentSettings } from "../../utils";

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
      <br />
      <Setting
        title="Encrypted"
        description="You can not edit the encryption after the document has been made."
        toggled={document.settings.encrypted}
        onToggle={() => console.error("You may not edit encrypted settings!")}
        toggleable={false}
      />
      <Setting
        title="Image embed"
        description="Toggle image embed on the document. This will generate an image of the document and will support rich embeds."
        toggled={document.settings.imageEmbed}
        onToggle={async () => {
          const update = await updateDocumentSettings(document, {
            imageEmbed: !document.settings.imageEmbed,
          });

          console.log(update);
        }}
      />
      <Setting
        title="Instant delete"
        description="Toggle instant delete on the document. After someone viewing the document, it will instantly delete."
        toggled={document.settings.instantDelete}
        onToggle={() => console.log("Toggled Instant delete")}
      />
      <Setting
        title="Toggle public"
        description="Toggle public status on the document. After enabled, the document will be public on our discovery page."
        toggled={document.settings.public}
        onToggle={() => console.log("Toggled Public")}
      />
    </>
  );
};
