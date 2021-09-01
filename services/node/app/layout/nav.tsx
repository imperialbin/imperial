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
} from "react-icons/fa";

import { Tooltip, UserIcon } from "../components";
import { UserIconSkeleton } from "../components/skeletons";
import { editingState, languageState } from "../state/editor";
import { NavProps, Theme, ThemeForStupidProps } from "../types";
import { request } from "../utils/requestWrapper";

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  z-index: 9999;
  background: ${({ theme }: ThemeForStupidProps) => theme.layoutDarkest};
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  border-bottom-left-radius: 15px;
`;

const Brand = styled.h1`
  text-align: center;
  margin-top: 17px;
  font-size: 1em;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 17px 20px 10px;
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
  creatingDocument = false,
  editor = false,
}: NavProps): JSX.Element => {
  const [language, setLanguage] = useAtom(languageState);
  const [editing, setEditing] = useAtom(editingState);

  const createDocument = async () => {
    if (typeof window === "undefined") return;
    if (!window.monaco) return;

    const content = window.monaco.editor.getModels()[0].getValue();
    const language =
      window.monaco.editor.getModels()[0]._languageIdentifier.language;

    if (content < 1) return;

    const { data, error } = await request("/document", "POST", {
      content,
      settings: {
        language,
      },
    });

    if (error) console.log(error);

    Router.push(`/${data.data.id}`);
    creatingDocument = false;
  };
  const newDocument = () => Router.push("/");
  const changeLanguage = (language: string) => setLanguage(language);
  const allowEdit = () => setEditing(!editing);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setEditing(creatingDocument ? true : false);
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "s" && e.metaKey && creatingDocument) ||
        (e.key === "s" && e.ctrlKey && creatingDocument)
      ) {
        e.preventDefault();
        createDocument();
      }

      if (e.key === "n" && e.altKey) {
        e.preventDefault();
        newDocument();
      }
    });
  }, []);

  return (
    <Container>
      <Link href="/">
        <Brand>IMPERIAL</Brand>
      </Link>
      <Buttons>
        {editor && (
          <Tooltip style={{ margin: "0 10px" }} title="Edit Document">
            <Btn onClick={allowEdit}>
              <FaEdit size={17.5} />
            </Btn>
          </Tooltip>
        )}
        {creatingDocument ? (
          <>
            <Tooltip style={{ margin: "0 10px" }} title="Change language">
              <Btn onClick={() => changeLanguage("javascript")}>
                <FaMinus size={17.5} />
              </Btn>
            </Tooltip>
            <Tooltip style={{ margin: "0 10px" }} title="Change editors">
              <Btn>
                <FaUserFriends size={17.5} />
              </Btn>
            </Tooltip>
            <Tooltip style={{ margin: "0 10px" }} title="Save document">
              <Btn onClick={createDocument}>
                <FaSave size={17.5} />
              </Btn>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip style={{ margin: "0 10px" }} title="View Raw">
              <Btn onClick={createDocument}>
                <FaAlignLeft size={17.5} />
              </Btn>
            </Tooltip>
            <Tooltip style={{ margin: "0 10px" }} title="Duplicate document">
              <Btn onClick={createDocument}>
                <FaCopy size={17.5} />
              </Btn>
            </Tooltip>
          </>
        )}
        <Tooltip style={{ margin: "0 10px" }} title="New document">
          <Btn onClick={newDocument}>
            <FaFileAlt size={17.5} />
          </Btn>
        </Tooltip>
        {user ? (
          <Tooltip
            style={{ margin: "0 10px" }}
            position="bottom-end"
            title="test"
            arrow
          >
            <UserIcon URL={user ? user.icon : "/img/pfp.png"} />
          </Tooltip>
        ) : (
          <UserIconSkeleton style={{ marginLeft: 10 }} />
        )}
      </Buttons>
    </Container>
  );
};
