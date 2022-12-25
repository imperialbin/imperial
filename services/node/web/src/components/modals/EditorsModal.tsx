import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash/debounce";
import { useCallback, useState } from "react";
import { User as UserIcon, X } from "react-feather";
import { connect, ConnectedProps } from "react-redux";
import { addNotification, removeEditor } from "../../state/actions";
import { ImperialState } from "../../state/reducers";
import { styled } from "../../stitches";
import { User } from "../../types";
import { makeRequest } from "../../utils/Rest";
import Button from "../Button";
import Input from "../Input";
import EditorsPopover from "../popover/EditorsPopover";
import Popover from "../popover/Popover";
import Tooltip from "../Tooltip";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Content, Footer, Paragraph, Wrapper } from "./base/Styles";

const EditorsWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minWidth: 350,
  height: "100%",
  overflow: "auto",
});

const Editor = styled(motion.div, {
  display: "flex",
  gap: 10,
  alignItems: "center",
  borderRadius: "$medium",
  color: "$text-secondary",
  border: "1.5px solid $contrast",
  transition: "background 0.2s ease-in-out",
  padding: 10,
  overflow: "hidden",
  marginTop: 10,

  "&:hover": {
    background: "$tertiary",
  },

  "> img": {
    width: 35,
    height: 35,
    borderRadius: "50%",
  },

  "> div": {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,

    "> h1": {
      fontSize: "1em",
      color: "$text-primary",
    },

    "> span": {
      fontSize: "0.85em",
      color: "$text-secondary",
    },
  },

  "> svg": {
    cursor: "pointer",
    transition: "color 0.15s ease-in-out",

    "&:hover": {
      color: "$error",
    },
  },
});

const EDITOR_ANIMATION = {
  animate: {
    height: "auto",
    opacity: 1,
  },
  initial: {
    height: 0,
    opacity: 0,
  },
};

const EditorsModal = ({
  dispatch,
  editors,
  user,
  closeModal,
}: ModalProps & ReduxProps) => {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const fetchUsers = useCallback(
    debounce(async (search: string) => {
      if (search.length === 0) return;

      const { success, data, error } = await makeRequest<User[]>(
        "GET",
        `/users/search/${search}`
      );

      if (!success || !data) {
        setSearchedUsers([]);
        return dispatch(
          addNotification({
            icon: <X />,
            message:
              error?.message ?? "An error occurred while searching for users",
            type: "error",
          })
        );
      }

      setSearchedUsers(data.filter((filterUser) => filterUser.id !== user?.id));
    }, 250),
    []
  );

  return (
    <Wrapper>
      <Header>Editors</Header>
      <Paragraph>
        Add and remove editors for your documents, you can change them at any
        time, just search by their username!
      </Paragraph>
      <Content>
        <Popover
          active={searchedUsers.length > 0 && focused && input.length > 0}
          setPopover={(boolean) => setFocused(false)}
          render={(defaultProps) => (
            <EditorsPopover users={searchedUsers} {...defaultProps} />
          )}
          widthAtTarget
          toggleOnTargetClick={false}
          clickToClose={false}
        >
          <Input
            value={input}
            onChange={({ target: { value } }) => {
              setInput(value);
              fetchUsers(value);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search by username"
            icon={<UserIcon />}
          />
        </Popover>
        <EditorsWrapper>
          <AnimatePresence initial={false}>
            {editors.map((editor) => (
              <motion.div
                animate={EDITOR_ANIMATION.animate}
                initial={EDITOR_ANIMATION.initial}
                exit={EDITOR_ANIMATION.initial}
                key={editor.id}
                style={{ overflow: "hidden" }}
              >
                <Editor>
                  <img
                    src={editor.icon ?? "/img/pfp.png"}
                    alt={editor.username}
                  />
                  <div>
                    <h1>{editor.username}</h1>
                    <span>{editor.documents_made} documents made</span>
                  </div>
                  <Tooltip title="Remove editor">
                    <X
                      onClick={() => dispatch(removeEditor(editor.id))}
                      size={20}
                    />
                  </Tooltip>
                </Editor>
              </motion.div>
            ))}
          </AnimatePresence>
        </EditorsWrapper>
      </Content>
      <Footer>
        <Button btnType="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button onClick={() => closeModal()}>Save</Button>
      </Footer>
    </Wrapper>
  );
};

const mapStateToProps = ({ user, ui_state: { editors } }: ImperialState) => {
  return {
    editors,
    user,
  };
};
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(EditorsModal);
