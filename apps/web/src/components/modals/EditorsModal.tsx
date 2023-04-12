import Button from "@web/components/Button";
import Input from "@web/components/Input";
import Tooltip from "@web/components/Tooltip";
import Popover from "@web/components/popover/Popover";
import SelectUsersPopover from "@web/components/popover/SelectUsersPopover";
import { addEditor, addNotification, removeEditor } from "@web/state/actions";
import { ImperialState } from "@web/state/reducers";
import { styled } from "@web/stitches.config";
import { User } from "@web/types";
import { makeRequest } from "@web/utils/Rest";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash/debounce";
import { useCallback, useState } from "react";
import { User as UserIcon, X } from "react-feather";
import { ConnectedProps, connect } from "react-redux";
import Header from "./base/Header";
import { Content, Footer, Paragraph, Wrapper } from "./base/Styles";
import { ModalProps } from "./base/modals";

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

function EditorsModal({ dispatch, editors, user, closeModal }: ModalProps & ReduxProps) {
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const fetchUsers = useCallback(
    debounce(async (search: string) => {
      if (search.length === 0) return;

      const { success, data, error } = await makeRequest<User[]>(
        "GET",
        `/users/search/${search}`,
      );

      if (!success || !data) {
        setSearchedUsers([]);
        return dispatch(
          addNotification({
            icon: <X />,
            message: error?.message ?? "An error occurred while searching for users",
            type: "error",
          }),
        );
      }

      setSearchedUsers(data.filter((filterUser) => filterUser.id !== user?.id));
    }, 250),
    [],
  );

  return (
    <Wrapper>
      <Header>Editors</Header>
      <Paragraph>
        Add and remove editors for your documents, you can change them at any time, just
        search by their username!
      </Paragraph>
      <Content>
        <Popover
          widthAtTarget
          active={searchedUsers.length > 0 && focused && input.length > 0}
          setPopover={() => setFocused(false)}
          render={(defaultProps) => (
            <SelectUsersPopover
              users={searchedUsers}
              onClick={(user) => {
                setInput("");
                dispatch(addEditor(user));
              }}
              {...defaultProps}
            />
          )}
          toggleOnTargetClick={false}
          clickToClose={false}
        >
          <Input
            value={input}
            placeholder="Search by username"
            icon={<UserIcon />}
            onChange={({ target: { value } }) => {
              setInput(value);
              fetchUsers(value);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </Popover>
        <EditorsWrapper>
          <AnimatePresence initial={false}>
            {editors.map((editor) => (
              <motion.div
                key={editor.id}
                animate={EDITOR_ANIMATION.animate}
                initial={EDITOR_ANIMATION.initial}
                exit={EDITOR_ANIMATION.initial}
                style={{ overflow: "hidden" }}
              >
                <Editor>
                  <img src={editor.icon ?? "/img/pfp.png"} alt={editor.username} />
                  <div>
                    <h1>{editor.username}</h1>
                    <span>{editor.documents_made} documents made</span>
                  </div>
                  <Tooltip title="Remove editor">
                    <X size={20} onClick={() => dispatch(removeEditor(editor.id))} />
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
}

const mapStateToProps = ({ user, ui_state: { editors } }: ImperialState) => ({
  editors,
  user,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(EditorsModal);
