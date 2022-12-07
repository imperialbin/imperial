import { useState } from "react";
import { Check, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { addNotification, setLanguage } from "../../state/actions";
import { styled } from "../../stitches";
import { Document } from "../../types";
import { SupportedLanguagesID } from "../../utils/Constants";
import { makeRequest } from "../../utils/Rest";
import Button from "../Button";
import Setting from "../Setting";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Content, Paragraph, Wrapper } from "./base/Styles";

const StyledWrapper = styled(Wrapper, {
  maxWidth: "80%",
  maxHeight: "70%",
});

const DangerArea = styled("h1", {
  marginTop: 30,
  color: "$error",
  fontSize: "1.3em",
  fontWeight: 500,
  marginBottom: 0,
});

interface IDocumentSettings extends ModalProps {
  data: { document: Document };
}

export const DocumentSettings = ({
  data: { document },
  dispatch,
  closeModal,
}: IDocumentSettings): JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const patchDocument = async <T extends keyof Document["settings"]>(
    setting: T,
    value: Document["settings"][T]
  ) => {
    const { success, error, data } = await makeRequest<{ document: Document }>(
      "PATCH",
      "/document",
      {
        id: document.id,
        settings: {
          [setting]: value,
        },
      }
    );

    if (!success || !data)
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An unknown error occurred",
          type: "error",
        })
      );

    dispatch(
      addNotification({
        icon: <Check />,
        message: "Successfully updated user settings",
        type: "success",
      })
    );

    document = data.document;
  };

  return (
    <StyledWrapper>
      <Header>Document Settings</Header>
      <Paragraph>
        Change document settings for document <b>{document.id}</b>
      </Paragraph>
      <Content>
        <Setting
          title="Language"
          description="Change the language of the document."
          type="dropdown"
          mode="languages"
          initialValue={document.settings.language}
          onToggle={async (e) => {
            const newLanguage = e?.target.value as SupportedLanguagesID;

            await patchDocument("language", newLanguage);

            dispatch(setLanguage(newLanguage));
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
          onToggle={async (e) => {
            /* @ts-expect-error todo fix this */
            await patchDocument("expiration", Number(e?.target.value));
          }}
        />
        <Setting
          title="Encrypted"
          description="You can not edit the encryption after the document has been made."
          toggled={document.settings.encrypted}
          onToggle={() => null}
          disabled
        />
        <Setting
          title="Image embed"
          description="Toggle image embed on the document. This will generate an image of the document and will support rich embeds."
          toggled={document.settings.image_embed}
          onToggle={async () => {
            await patchDocument("image_embed", !document.settings.image_embed);
          }}
        />
        <Setting
          title="Instant delete"
          description="Toggle instant delete on the document. After someone viewing the document, it will instantly delete."
          toggled={document.settings.instant_delete}
          onToggle={async () => {
            await patchDocument(
              "instant_delete",
              !document.settings.instant_delete
            );
          }}
        />
        <Setting
          title="Toggle public"
          description="Toggle public status on the document. After enabled, the document will be public on our discovery page."
          toggled={document.settings.public}
          onToggle={async () => {
            await patchDocument("public", !document.settings.public);
          }}
        />

        <DangerArea>Danger Zone</DangerArea>
        <Paragraph>
          Initiating any &quot;Danger Zone&quot; action will be permanent!
        </Paragraph>
        <Button
          style={{ marginTop: 10, alignSelf: "flex-start" }}
          disabled={document.settings.instant_delete}
          onClick={async () => {
            const { success, error } = await makeRequest(
              "DELETE",
              `/document/${document.id}`
            );

            if (!success) {
              return dispatch(
                addNotification({
                  icon: <X />,
                  message:
                    error?.message ??
                    "An error occurred whilst deleting document",
                  type: "error",
                })
              );
            }

            closeModal();
            navigate("/");
          }}
        >
          Delete document
        </Button>
      </Content>
    </StyledWrapper>
  );
};
