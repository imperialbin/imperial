import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { addNotification, openModal } from "../../state/actions";
import { ImperialState } from "../../state/reducers";
import { styled } from "../../stitches";
import { getRole } from "../../utils/Permissions";
import { C } from "../Icons";
import { PopoverBase } from "./base/popover";

const Wrapper = styled("div", {
  background: "$tertiary",
  borderRadius: "$medium",
});

const List = styled("ul", {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  minWidth: 130,
  margin: 5,
});

const Item = styled("li", {
  width: "100%",
  cursor: "pointer",
  padding: "5px 15px",
  borderRadius: "$tiny",
  color: "$text-muted",
  transition: "color 0.15s ease-in-out, background 0.15s ease-in-out",

  a: {
    textDecoration: "none",
    color: "unset",
  },

  "&:hover": {
    color: "$text-primary",
    background: "$contrast",
  },

  variants: {
    danger: {
      true: {
        "&:hover": {
          color: "error",
        },
      },
    },
  },
});

const Separator = styled("span", {
  display: "block",
  margin: "8px auto",
  width: "80%",
  height: "1.5px",
  background: "$contrast",
});

const UserPopover = ({ close, user, dispatch }: PopoverBase & ReduxProps) => {
  return (
    <Wrapper>
      <List>
        {user ? (
          <>
            <Item
              onClick={() => {
                dispatch(openModal("user_settings"));
                close();
              }}
            >
              User profile
            </Item>
            <Item>
              <Link to="/discord" target="_blank">
                Discord
              </Link>
            </Item>
            <Item>
              <Link to="/github" target="_blank">
                GitHub
              </Link>
            </Item>
            <Separator />
            {getRole(user.flags) === "Admin" ? <Item>Admin</Item> : null}
            <Item>
              <Link to="/terms" target="_blank">
                Terms
              </Link>
            </Item>
            <Item danger>Logout</Item>
          </>
        ) : (
          <>
            <Item
              onClick={() => {
                dispatch(openModal("login"));
                close();
              }}
            >
              Login
            </Item>
            <Item
              onClick={() => {
                dispatch(openModal("signup"));
                close();
              }}
            >
              Signup
            </Item>
            <Separator />
            <Item>
              <Link to="/discord" target="_blank">
                Discord
              </Link>
            </Item>
            <Item>
              <Link to="/github" target="_blank">
                GitHub
              </Link>
            </Item>
          </>
        )}
      </List>
    </Wrapper>
  );
};

const mapStateToProps = ({ user }: ImperialState) => {
  return { user };
};

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(UserPopover);
