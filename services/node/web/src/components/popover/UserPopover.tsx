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
  padding: "15px 25px",
  borderRadius: "$medium",
});

const List = styled("ul", {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
});

const Item = styled("li", {
  width: "100%",
  margin: "2.5px 10px",
  color: "",
  cursor: "pointer",

  a: {
    textDecoration: "none",
    color: "unset",
  },

  transition: "color 0.15s ease-in-out",

  "&:hover": {
    color: "$text-primary",
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
  background: "$primary",
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
              <Link to="/discord">
                <a target="_blank">Discord</a>
              </Link>
            </Item>
            <Item>
              <Link to="/github">
                <a target="_blank">GitHub</a>
              </Link>
            </Item>
            <Separator />
            {getRole(user.flags) === "Admin" ? <Item>Admin</Item> : null}
            <Item>
              <Link to="/terms">
                <a target="_blank">Terms</a>
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
                dispatch(
                  addNotification({
                    icon: <C />,
                    message: "Fuck",
                    type: "error",
                  })
                );
              }}
            >
              Signup
            </Item>
            <Separator />
            <Item>
              <Link to="/discord">
                <a target="_blank">Discord</a>
              </Link>
            </Item>
            <Item>
              <Link to="/github">
                <a target="_blank">GitHub</a>
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
