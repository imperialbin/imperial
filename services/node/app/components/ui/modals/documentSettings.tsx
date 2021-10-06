/* eslint-disable no-console */
import { useState } from "react";
import { Document } from "../../../types";
import { HeaderSecondary } from "./styles";
import { Setting } from "../setting";
import { request, updateDocumentSettings } from "../../../utils";
import { useAtom } from "jotai";
import { languageState } from "../../../state/editor";
import styled from "styled-components";
import Router from "next/router";
import { activeModal } from "../../../state/modal";

const DangerArea = styled.h1`
  margin-top: 30px;
  color: ${({ theme }) => theme.error};
  font-size: 1.3em;
  font-weight: 500;
  margin-bottom: 0;
`;

const Btn = styled.button`
  display: block;
  margin-top: 25px;
  padding: 10px 15px;
  background: ${({ theme }) => theme.layoutDark};
  color: ${({ theme }) => theme.textLight};
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.error};
    box-shadow: 0px 0px 6px 3px rgb(0 0 0 / 15%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DocumentSettings = ({
  document,
}: {
  document: Document;
}): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const [, setLanguage] = useAtom(languageState);
  const [, setActiveModal] = useAtom(activeModal);

  return (
    <>
      <HeaderSecondary>
        Change document settings for document {document.id}
      </HeaderSecondary>
      {error && error}
      <br />
      <br />
      <Setting
        title="Language"
        description="Change the language of the document."
        type="dropdown"
        mode="languages"
        initialValue={document.settings.language}
        onToggle={async e => {
          const newLanguage = e?.target.value as string;
          const { data, error } = await updateDocumentSettings(document, {
            language: newLanguage,
          });

          if (error && !data) {
            return setError(
              "There was an error whilst editing document settings!",
            );
          }

          document.settings.language = newLanguage;
          setLanguage(newLanguage);
        }}
      />
      <Setting
        title="Expiration"
        description="Change the date when the document expires."
        type="dropdown"
        mode="expiration"
        initialValue={
          new Date(document.timestamps.expiration * 1000).getDate() -
          new Date().getDate()
        }
        onToggle={async e => {
          const { data, error } = await updateDocumentSettings(document, {
            expiration: Number(e?.target.value),
          });

          if (error && !data) {
            return setError(
              "There was an error whilst editing document settings!",
            );
          }

          document.timestamps.expiration = data.data.timestamps.expiration;
        }}
      />
      <Setting
        title="Encrypted"
        description="You can not edit the encryption after the document has been made."
        toggled={document.settings.encrypted}
        onToggle={() => console.error("You may not edit encrypted settings!")}
        disabled={true}
      />
      <Setting
        title="Image embed"
        description="Toggle image embed on the document. This will generate an image of the document and will support rich embeds."
        toggled={document.settings.imageEmbed}
        onToggle={async () => {
          const { data, error } = await updateDocumentSettings(document, {
            imageEmbed: !document.settings.imageEmbed,
          });

          if (error && !data) {
            return setError(
              "There was an error whilst editing document settings!",
            );
          }

          document.settings.imageEmbed = !document.settings.imageEmbed;
        }}
      />
      <Setting
        title="Instant delete"
        description="Toggle instant delete on the document. After someone viewing the document, it will instantly delete."
        toggled={document.settings.instantDelete}
        onToggle={async () => {
          const { data, error } = await updateDocumentSettings(document, {
            instantDelete: !document.settings.instantDelete,
          });

          if (error && !data) {
            return setError(
              "There was an error whilst editing document settings!",
            );
          }

          document.settings.instantDelete = !document.settings.instantDelete;
        }}
      />
      <Setting
        title="Toggle public"
        description="Toggle public status on the document. After enabled, the document will be public on our discovery page."
        toggled={document.settings.public}
        onToggle={async () => {
          const { data, error } = await updateDocumentSettings(document, {
            public: !document.settings.public,
          });

          if (error && !data) {
            return setError(
              "There was an error whilst editing document settings!",
            );
          }

          document.settings.public = !document.settings.public;
        }}
      />

      <DangerArea>Danger Zone</DangerArea>
      <HeaderSecondary>
        Initiating any &quot;Danger Zone&quot; action will be permanent!
      </HeaderSecondary>
      <Btn
        disabled={document.settings.instantDelete}
        onClick={async () => {
          const { data, error } = await request(
            `/document/${document.id}`,
            "DELETE",
          );

          if (error) {
            return console.error(
              "an error occurred whilst deleting the document",
              error,
            );
          }

          setActiveModal([null, null]);
          Router.push("/");
          return data;
        }}
      >
        Delete document
      </Btn>
    </>
  );
};