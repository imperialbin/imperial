import { useAtom } from "jotai";
import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";
import styled from "styled-components";
import {
  FaUserFriends,
  FaMinus,
  FaEdit,
  FaSave,
  FaAlignLeft,
  FaFileAlt,
  FaCopy,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaCog,
} from "react-icons/fa";

import { Tooltip, UserIcon } from "../components";
import { UserIconSkeleton } from "../components/skeletons";
import { editingState } from "../state/editor";
import { Document, NavProps, ThemeForStupidProps } from "../types";
import { request } from "../utils/requestWrapper";
import { useState } from "react";
import { LoggedInTooltip, LoggedOutTooltip } from "../components/tooltips";
import { activeModal, documentEditors } from "../state/modal";
import { supportedLanguages } from "../utils/consts";
import { motion } from "framer-motion";

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  z-index: 500;
  background: ${({ theme }: ThemeForStupidProps) => theme.layoutDarkest};
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  border-bottom-left-radius: 15px;
  box-shadow: 0px 0px 6px 3px rgb(0 0 0 / 25%);
`;

const BrandContainer = styled(motion.div)`
  display: inline-flex;
  justify-content: center;
`;

const Brand = styled.h1`
  text-align: center;
  margin-top: 20px;
  font-size: 1.1em;
`;

const DocumentID = styled(motion.h1)`
  text-align: center;
  margin-top: 20px;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0px 20px 10px;
`;

const Btn = styled.button`
  padding: 8px 11px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }: ThemeForStupidProps) =>
    theme.layoutLightestOfTheBunch};
  color: ${({ theme }: ThemeForStupidProps) => theme.textLightest};
  cursor: pointer;
`;

export const Nav = ({
  user,
  userLoading = true,
  creatingDocument = false,
  editor = false,
  document = null,
}: NavProps): JSX.Element => {
  const [editing, setEditing] = useAtom(editingState);
  const [editors] = useAtom(documentEditors);
  const [, setActiveModal] = useAtom(activeModal);

  // I forgot that public is a reserved name in javacrip
  const [publicStatus, setPublic] = useState(false);

  const createDocument = async () => {
    if (
      typeof window === "undefined" ||
      !window.monaco ||
      !creatingDocument ||
      (!editor && !editing)
    )
      return;

    const content = window.monaco.editor.getModels()[0].getValue();
    const language =
      window.monaco.editor.getModels()[0]._languageIdentifier.language;

    if (content < 1) return;

    const { data, error } = await request("/document", "POST", {
      content,
      settings: {
        longUrls: user ? user.settings.longUrls : false,
        shortUrls: user ? user.settings.shortUrls : false,
        instantDelete: user ? user.settings.instantDelete : false,
        encrypted: user ? user.settings.encrypted : false,
        imageEmbed: user ? user.settings.imageEmbed : false,
        expiration: user ? user.settings.expiration : 14,
        public: publicStatus,
        editors: user ? editors.map((user) => user.username) : [],
        language,
      },
    });

    if (error) console.log(error);

    creatingDocument = false;
    setEditing(false);
    Router.push(`/${data.data.id}`);
  };
  const newDocument = () => Router.push("/");
  const allowEdit = () => setEditing(!editing);

  const editDocument = async () => {
    if (typeof window === "undefined") return;
    if (!window.monaco) return;

    const content = window.monaco.editor.getModels()[0].getValue();
    if (content < 1) return;

    const { data, error } = await request("/document", "PATCH", {
      id: location.pathname.substr(1),
      content,
    });

    if (error) return console.error(error);

    setEditing(false);
    return data;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", (e) => {
      if (
        e.key === "s" &&
        (creatingDocument || editing) &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();

        if (editor && editing) return editDocument();

        createDocument();
      }

      if (e.key === "n" && e.altKey) {
        e.preventDefault();
        newDocument();
      }
    });
  }, [editing, editors]);

  const brandAnimation = {
    initial: {
      opacity: 0,
      width: 0,
      marginLeft: 0,
    },
    hover: {
      opacity: 1,
      width: "unset",
      marginLeft: 10,
    },
  };

  return (
    <Container>
      <Link href="/">
        <BrandContainer initial={"initial"} whileHover={"hover"}>
          <Brand>IMPERIAL</Brand>
          {document && (
            <DocumentID
              transition={{ duration: 0.3 }}
              variants={brandAnimation}
            >
              {document.id}
            </DocumentID>
          )}
        </BrandContainer>
      </Link>
      <Buttons>
        {editor &&
          !document?.settings.encrypted &&
          !document?.settings.instantDelete && (
            <>
              <Tooltip
                style={{ margin: "0 10px" }}
                title={!editing ? "Edit document" : "Save document"}
              >
                <Btn onClick={!editing ? allowEdit : editDocument}>
                  {editing ? <FaCheck size={18} /> : <FaEdit size={18} />}
                </Btn>
              </Tooltip>
              {user.username === document?.creator && (
                <Tooltip
                  style={{ margin: "0 10px" }}
                  title="Edit document settings"
                >
                  <Btn
                    onClick={() =>
                      setActiveModal(["documentSettings", document as Document])
                    }
                  >
                    <FaCog size={18} />
                  </Btn>
                </Tooltip>
              )}
            </>
          )}
        {creatingDocument ? (
          <>
            {user ? (
              <>
                <Tooltip style={{ margin: "0 10px" }} title="Public status">
                  <Btn onClick={() => setPublic(!publicStatus)}>
                    {publicStatus ? (
                      <FaEye size={18} />
                    ) : (
                      <FaEyeSlash size={18} />
                    )}
                  </Btn>
                </Tooltip>
                <Tooltip style={{ margin: "0 10px" }} title="Change language">
                  <Btn
                    onClick={() => {
                      setActiveModal(["language", supportedLanguages]);
                    }}
                  >
                    <FaMinus size={18} />
                  </Btn>
                </Tooltip>
                <Tooltip style={{ margin: "0 10px" }} title="Change editors">
                  <Btn onClick={() => setActiveModal(["addUsers", "balls"])}>
                    <FaUserFriends size={18} />
                  </Btn>
                </Tooltip>
              </>
            ) : (
              <Tooltip style={{ margin: "0 10px" }} title="Change language">
                <Btn
                  onClick={() => {
                    setActiveModal(["language", supportedLanguages]);
                  }}
                >
                  <FaMinus size={18} />
                </Btn>
              </Tooltip>
            )}
            <Tooltip style={{ margin: "0 10px" }} title="Save document">
              <Btn onClick={createDocument}>
                <FaSave size={18} />
              </Btn>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip style={{ margin: "0 10px" }} title="View Raw">
              <Btn
                onClick={() =>
                  Router.push(
                    `/r/${location.pathname.substr(1)}${location.search}`
                  )
                }
              >
                <FaAlignLeft size={18} />
              </Btn>
            </Tooltip>
            <Tooltip style={{ margin: "0 10px" }} title="Duplicate document">
              <Btn onClick={createDocument}>
                <FaCopy size={18} />
              </Btn>
            </Tooltip>
          </>
        )}
        <Tooltip style={{ margin: "0 10px" }} title="New document">
          <Btn onClick={newDocument}>
            <FaFileAlt size={18} />
          </Btn>
        </Tooltip>
        {!userLoading ? (
          <Tooltip
            style={{ margin: "0 10px" }}
            trigger="click"
            position="bottom-end"
            interactive={true}
            useContext={true}
            html={user ? <LoggedInTooltip /> : <LoggedOutTooltip />}
            arrow
          >
            <UserIcon
              style={{ cursor: "pointer" }}
              URL={user ? user.icon : "/img/pfp.png"}
            />
          </Tooltip>
        ) : (
          <UserIconSkeleton style={{ margin: "0 10px", display: "block" }} />
        )}
      </Buttons>
    </Container>
  );
};
