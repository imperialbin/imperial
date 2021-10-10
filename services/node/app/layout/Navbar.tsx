/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
import { useAtom, atom } from "jotai";
import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";
import styled from "styled-components";
import Copy from "react-copy-to-clipboard";
import { runCode } from "../components/runner/RunCode";
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
  FaArrowRight,
  FaPlayCircle,
} from "react-icons/fa";

import { Tooltip, UserIcon } from "../components/ui";
import { UserIconSkeleton } from "../components/ui/skeletons";
import { CodeExecution } from "../components/runner/CodeExecution";
import {
  editingState,
  textState,
  languageState,
  executionsState,
} from "../state/editor";
import { Document, NavProps } from "../types";
import { request } from "../utils/requestWrapper";
import { useState } from "react";
import { LoggedInTooltip, LoggedOutTooltip } from "../components/ui/tooltips";
import { activeModal, documentEditors } from "../state/modal";
import { supportedLanguages } from "../lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { RuntimesContext } from "../components/runner/PistonRuntimesProvider";

const Wrapper = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 0;
  right: 0;
  z-index: 500;
  background: ${({ theme }) => theme.layoutDarkest};
  color: ${({ theme }) => theme.textLight};
  border-bottom-left-radius: 15px;
  box-shadow: 0px 0px 6px 3px rgb(0 0 0 / 25%);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const HideNavContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: center;
  padding: 0 5px;
  width: 15px;
  height: 100%;
  overflow: hidden;
  border-bottom-left-radius: 15px;
  opacity: 0;
  transition: all 0.15s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.layoutLightestOfTheBunch};
    opacity: 1;
  }
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
  cursor: pointer;
  color: ${({ theme }) => theme.textDarker};
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
  background: ${({ theme }) => theme.layoutLightestOfTheBunch};
  color: ${({ theme }) => theme.textLightest};
  cursor: pointer;
`;

const ArrowContainer = styled(motion.div)``;
const executedAtom = atom(false);

export const Nav = ({
  user,
  userLoading = true,
  creatingDocument = false,
  editor = false,
  document = null,
}: NavProps): JSX.Element => {
  const [editing, setEditing] = useAtom(editingState);
  const [language] = useAtom(languageState);
  const [text] = useAtom(textState);
  const [editors] = useAtom(documentEditors);
  const [, setActiveModal] = useAtom(activeModal);
  const [collapsed, setCollapsed] = useState(false);
  const [publicStatus, setPublic] = useState(false);
  const [, setExecutions] = useAtom(executionsState);
  const [executed, setExecuted] = useAtom(executedAtom);
  const findIcon = supportedLanguages.find(l => l.name === language)?.icon;
  const Icon = (findIcon ? findIcon : FaMinus) as React.ElementType;

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
        editors: user ? editors.map(user => user.username) : [],
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
    if (typeof window === "undefined" || !window.monaco) return;

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

    window.addEventListener("keydown", e => {
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

  const navAnimation = {
    initial: {
      x: 0,
    },
    collapsed: {
      x: "93.5%",
    },
  };

  return (
    <>
      <Wrapper
        initial={"initial"}
        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        animate={collapsed ? "collapsed" : "initial"}
        variants={navAnimation}
      >
        <HideNavContainer onClick={() => setCollapsed(!collapsed)}>
          <ArrowContainer
            transition={{ duration: 0.3 }}
            animate={collapsed ? { rotate: 180 } : { rotate: 0 }}
          >
            <FaArrowRight />
          </ArrowContainer>
        </HideNavContainer>
        <Container>
          <BrandContainer initial={"initial"} whileHover={"hover"}>
            <Link href="/" passHref>
              <Brand>IMPERIAL</Brand>
            </Link>
            {document && (
              <Tooltip title="Click to copy URL">
                <Copy
                  text={
                    process.env.NODE_ENV === "development"
                      ? `localhost:3000/${document.id}`
                      : `https://imperialb.in/${document.id}`
                  }
                  onCopy={() => console.log("testtt")}
                >
                  <DocumentID
                    transition={{ duration: 0.3 }}
                    variants={brandAnimation}
                  >
                    {document.id}
                  </DocumentID>
                </Copy>
              </Tooltip>
            )}
          </BrandContainer>
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
                          setActiveModal([
                            "documentSettings",
                            document as Document,
                          ])
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
                    <AnimatePresence>
                      {language !== "plaintext" && text.length > 0 && (
                        <motion.div
                          transition={{ duration: 0.22 }}
                          initial="initial"
                          animate={{ ...brandAnimation.hover, marginLeft: 0 }}
                          exit="initial"
                          variants={brandAnimation}
                        >
                          <Tooltip
                            style={{ margin: "0 10px" }}
                            title="Run Code"
                          >
                            <RuntimesContext.Consumer>
                              {context => (
                                <Btn
                                  onClick={async () => {
                                    const runtime = context.find(
                                      (l: any) => l.language === language,
                                    )?.version;
                                    const { data, error } = await runCode(
                                      language,
                                      runtime,
                                      text,
                                    );

                                    setExecutions((old: any) => [
                                      ...old,
                                      {
                                        output: data,
                                        date:
                                          new Date().toDateString() +
                                          " " +
                                          new Date().toLocaleTimeString(),
                                        error,
                                      },
                                    ]);

                                    setExecuted(true);
                                  }}
                                >
                                  <FaPlayCircle size={18} />
                                </Btn>
                              )}
                            </RuntimesContext.Consumer>
                          </Tooltip>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Tooltip
                      style={{ margin: "0 10px" }}
                      title="Change language"
                    >
                      <Btn
                        onClick={() => {
                          setActiveModal(["language", supportedLanguages]);
                        }}
                      >
                        <Icon size={18} />
                      </Btn>
                    </Tooltip>
                    <Tooltip
                      style={{ margin: "0 10px" }}
                      title="Change editors"
                    >
                      <Btn onClick={() => setActiveModal(["addUsers", null])}>
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
                      <Icon size={18} />
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
                        `/r/${location.pathname.substr(1)}${location.search}`,
                      )
                    }
                  >
                    <FaAlignLeft size={18} />
                  </Btn>
                </Tooltip>
                <Tooltip
                  style={{ margin: "0 10px" }}
                  title="Duplicate document"
                >
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
                  pointer={true}
                  URL={user ? user.icon : "/img/pfp.png"}
                />
              </Tooltip>
            ) : (
              <UserIconSkeleton
                style={{ margin: "0 10px", display: "block" }}
              />
            )}
          </Buttons>
        </Container>
      </Wrapper>
      <AnimatePresence>{executed && <CodeExecution />}</AnimatePresence>
    </>
  );
};
