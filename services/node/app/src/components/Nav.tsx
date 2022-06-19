import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import styled from "styled-components";
import { ImperialState } from "../../state/reducers";
import {
  ArrowRight,
  Globe,
  Save,
  FileText,
  X,
  Copy as CopyIcon,
  AlignLeft,
  Edit2,
} from "react-feather";
import { Tooltip } from "./Tooltip";
import Link from "next/link";
import Copy from "react-copy-to-clipboard";
import { UserIcon } from "./UserIcon";
import { Document } from "../types";
import { request } from "../utils/Request";
import Router from "next/router";
import Popover from "./popovers/Popover";
import UserPopover from "./popovers/UserPopover";
import { addNotification } from "../../state/actions";

const Wrapper = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 0;
  right: 0;
  z-index: 100;
  background: ${({ theme }) => theme.background.darkest};
  color: ${({ theme }) => theme.text.light};
  border-bottom-left-radius: 15px;
  padding: 0 15px;
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
  left: 0;
  padding: 0 5px;
  width: 25px;
  height: 100%;
  overflow: hidden;
  border-bottom-left-radius: 15px;
  opacity: 0;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.background.lightestOfTheBunch};
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
  font-size: 1.3em;
`;

const DocumentID = styled(motion.h1)`
  text-align: center;
  margin-top: 20px;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  color: ${({ theme }) => theme.text.dark};
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0 20px 10px;
`;

const Btn = styled.button`
  padding: 8px 11px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
  color: ${({ theme }) => theme.text.lightest};
  cursor: pointer;
`;

const StyledTooltip = styled(Tooltip)`
  margin: 0 10px;
`;

const StyledUserIcon = styled(UserIcon)`
  margin-left: 20px;
`;

const navAnimation = {
  initial: {
    x: 0,
  },
  collapsed: {
    x: "90%",
  },
};

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

interface INavProps extends ReduxProps {
  document?: Document;
}
const Nav = ({ user, document, dispatch }: INavProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userPopover, setUserPopover] = useState(false);

  const saveDocument = useCallback(async () => {
    if (typeof window === "undefined" || !window.monaco) return;

    const content = window.monaco.editor.getModels()[0].getValue();
    if (content.length <= 0) return;

    const language = window.monaco.editor.getModels()[0].getLanguageId();

    const { success, data } = await request("POST", "/document", {
      content,
      settings: {
        long_urls: user ? user.settings.long_urls : false,
        short_urls: user ? user.settings.short_urls : false,
        instant_delete: user ? user.settings.instant_delete : false,
        encrypted: user ? user.settings.encrypted : false,
        image_embed: user ? user.settings.image_embed : false,
        expiration: user ? user.settings.expiration : 14,
        public: false,
        language,
      },
    });

    if (!success) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "An error occurred whilst creating document",
          type: "error",
        }),
      );
    }

    Router.push(`/${data.id}`);
  }, [document, user]);

  const newDocument = useCallback(() => {
    Router.push("/");
  }, []);

  const forkDocument = useCallback(() => {
    if (typeof window === "undefined" || !window.monaco) return;
    const editor = window.monaco.editor.getModels()[0];

    const content = editor.getValue();
    Router.push("/");

    editor.setValue(content);
  }, []);

  const editDocument = useCallback(() => {
    if (typeof window === "undefined" || !window.monaco || !user || !document)
      return;
    if (
      document.creator !== user.username ||
      !document.settings.editors.find(
        (editor) => editor.username === user.username,
      )
    )
      return;
  }, [document, user]);

  /* Keybinds */
  useEffect(() => {
    const keypress = (e: KeyboardEvent) => {
      switch (true) {
        case (e.ctrlKey || e.metaKey) && e.key === "s":
          e.preventDefault();
          !document ? saveDocument() : editDocument();
          break;
      }
    };

    window.addEventListener("keydown", keypress);
    return () => {
      window.removeEventListener("keydown", keypress);
    };
  }, [document]);

  return (
    <Wrapper
      initial={"initial"}
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      animate={collapsed ? "collapsed" : "initial"}
      variants={navAnimation}
    >
      <HideNavContainer onClick={() => setCollapsed(!collapsed)}>
        <motion.div
          transition={{ duration: 0.3 }}
          animate={collapsed ? { rotate: 180 } : { rotate: 0 }}
        >
          <ArrowRight size={20} />
        </motion.div>
      </HideNavContainer>
      <Container>
        <BrandContainer initial={"initial"} whileHover={"hover"}>
          <Link href="/" passHref>
            <Brand>IMPERIAL</Brand>
          </Link>
          {document ? (
            <Tooltip title="Click to copy URL">
              <Copy
                text={
                  process.env.NODE_ENV === "development"
                    ? `localhost:3000/${document.id}`
                    : `https://imperialb.in/${document.id}`
                }
              >
                <DocumentID
                  transition={{ duration: 0.3 }}
                  variants={brandAnimation}
                >
                  {document.id}
                </DocumentID>
              </Copy>
            </Tooltip>
          ) : null}
        </BrandContainer>
        <Buttons>
          {!document ? (
            <>
              <StyledTooltip title="Change language">
                <Btn onClick={() => null}>
                  <Globe size={20} />
                </Btn>
              </StyledTooltip>
              <StyledTooltip title="Save document">
                <Btn onClick={saveDocument}>
                  <Save size={20} />
                </Btn>
              </StyledTooltip>
            </>
          ) : (
            <>
              <StyledTooltip title="Edit document">
                <Btn onClick={forkDocument}>
                  <Edit2 size={20} />
                </Btn>
              </StyledTooltip>
              <StyledTooltip title="View raw">
                <Btn onClick={() => Router.push(`/r/${document.id}`)}>
                  <AlignLeft size={20} />
                </Btn>
              </StyledTooltip>
              <StyledTooltip title="Duplicate document">
                <Btn onClick={forkDocument}>
                  <CopyIcon size={20} />
                </Btn>
              </StyledTooltip>
            </>
          )}
          <StyledTooltip title="New document">
            <Btn onClick={newDocument}>
              <FileText size={20} />
            </Btn>
          </StyledTooltip>
          <Popover
            active={userPopover}
            render={(defaults) => <UserPopover {...defaults} />}
            placement="bottom-end"
            setPopover={setUserPopover}
          >
            <StyledUserIcon URL={user?.icon ?? "/img/pfp.png"} pointer />
          </Popover>
        </Buttons>
      </Container>
    </Wrapper>
  );
};

const mapStateToProps = ({ user }: ImperialState) => {
  return { user };
};
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Nav);
