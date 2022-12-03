import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Copy from "react-copy-to-clipboard";
import {
  AlignLeft,
  ArrowRight,
  Check,
  Copy as CopyIcon,
  Edit2,
  FileText,
  Globe,
  Save,
  X,
} from "react-feather";
import { connect, ConnectedProps } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addNotification, openModal, setReadOnly } from "../state/actions";
import { ImperialState } from "../state/reducers";
import { styled } from "../stitches";
import { Document } from "../types";
import { makeRequest } from "../utils/Rest";
import Popover from "./popover/Popover";
import UserPopover from "./popover/UserPopover";
import Tooltip from "./Tooltip";
import { UserIcon } from "./UserIcon";

const Wrapper = styled(motion.div, {
  position: "fixed",
  display: "flex",
  top: 0,
  right: 0,
  zIndex: 100,
  background: "$primary",
  color: "$text-primary",
  borderBottomLeftRadius: "$large",
  padding: "0 15px",
  boxShadow: "$nav",
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const HideNavContainer = styled(motion.div, {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  left: 0,
  padding: "0 5px",
  width: "25px",
  height: "100%",
  overflow: "hidden",
  borderBottomLeftRadius: "$large",
  opacity: 0,
  cursor: "pointer",
  transition: "all 0.15s ease-in-out",

  "&:hover": {
    background: "$tertiary",
    opacity: 1,
  },
});

const BrandContainer = styled(motion.div, {
  display: "inline-flex",
  justifyContent: "center",
});

const Brand = styled("h1", {
  textAlign: "center",
  marginTop: 20,
  fontSize: "1.3em",
});

const DocumentID = styled(motion.h1, {
  textAlign: "center",
  marginTop: 20,
  fontSize: "1.1em",
  whiteSpace: "nowrap",
  overflow: "hidden",
  cursor: "pointer",
  color: "$text-muted",
});

const Buttons = styled("div", {
  display: "flex",
  alignItems: "center",
  margin: "0 20px 10px",
});

const Btn = styled("button", {
  padding: "8px 11px",
  borderRadius: "",
  border: "none",
  background: "$tertiary",
  color: "$text-primary",
  cursor: "pointer",
});

const StyledTooltip = styled(Tooltip, {
  margin: "0 10px",
});

const StyledUserIcon = styled(UserIcon, {
  marginLeft: "20px",
});

const NAV_ANIMATION = {
  initial: {
    x: 0,
  },
  collapsed: {
    x: "90%",
  },
};

const BRAND_ANIMATION = {
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
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();

  const saveDocument = useCallback(async () => {
    if (typeof window === "undefined" || !window.monaco) return;

    const content = window.monaco.editor.getModels()[0].getValue();
    if (content.length <= 0) return;

    const language = window.monaco.editor.getModels()[0].getLanguageId();

    const { success, data } = await makeRequest("POST", "/document", {
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
        })
      );
    }

    navigate(`/${data.id}`);
  }, [document, user]);

  const newDocument = () => {
    navigate("/");
  };

  const forkDocument = useCallback(() => {
    if (typeof window === "undefined" || !document) return;
    const editor = window.monaco.editor.getModels()[0];

    const content = document.content;
    navigate("/");

    editor.setValue(content);
  }, [document]);

  const prepareEdit = useCallback(() => {
    if (!user) return;
    if (!document) return;
    if (
      !(
        document.creator.username === user.username ||
        document.settings.editors.find(
          (editor) => editor.username === user.username
        )
      )
    )
      return;

    if (editing) {
      editDocument();
      setEditing(false);
    } else {
      setEditing(true);
      dispatch(setReadOnly(false));
    }
  }, [document, user, editing]);

  const editDocument = useCallback(async () => {
    if (!user || !document) return;
    /* if (typeof window === "undefined" || !window.monaco || !user || !document)
      return; */

    const editor = window.monaco.editor.getModels()[0];
    const content = editor.getValue();

    if (content === document.content) return;

    const { success } = await makeRequest("PATCH", "/document", {
      id: document.id,
      content,
    });

    if (!success)
      return dispatch(
        addNotification({
          icon: <X />,
          message: "There was an error updating this document",
          type: "error",
        })
      );

    setEditing(false);
    dispatch(setReadOnly(true));
    dispatch(
      addNotification({
        icon: <Check />,
        message: "Successfully edited document.",
        type: "success",
      })
    );
  }, [document, user]);

  /* Keybinds */
  useEffect(() => {
    const keypress = (e: KeyboardEvent) => {
      switch (true) {
        case (e.ctrlKey || e.metaKey) && e.key === "s":
          e.preventDefault();
          !document ? saveDocument() : prepareEdit();
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
      initial="initial"
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      animate={collapsed ? "collapsed" : "initial"}
      variants={NAV_ANIMATION}
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
        <BrandContainer initial="initial" whileHover="hover">
          <Link to="/">
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
                  variants={BRAND_ANIMATION}
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
                <Btn onClick={() => dispatch(openModal("language_selector"))}>
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
              {user ? (
                <StyledTooltip title="Edit document">
                  <Btn onClick={prepareEdit}>
                    {editing ? <Check size={20} /> : <Edit2 size={20} />}
                  </Btn>
                </StyledTooltip>
              ) : null}
              <StyledTooltip title="View raw">
                <Btn onClick={() => navigate(`/r/${document.id}`)}>
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
