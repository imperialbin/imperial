import { addNotification, logoutUser, openModal } from "@/state/actions";
import { ImperialState } from "@/state/reducers";
import { styled } from "@/stitches.config";
import { getRole } from "@/utils/Permissions";
import Link from "next/link";
import { X } from "react-feather";
import { connect, ConnectedProps } from "react-redux";
import { makeRequest } from "../../utils/Rest";
import { PopoverBase } from "./base/popover";
import { Item, List, Separator } from "./base/Styles";

const Wrapper = styled("div", {
  background: "$tertiary",
  borderRadius: "$medium",
});

const UserPopover = ({ close, user, dispatch }: PopoverBase & ReduxProps) => {
  const logout = async () => {
    const { success, error } = await makeRequest("DELETE", "/auth/logout");

    if (!success) {
      dispatch(
        addNotification({
          type: "error",
          icon: <X />,
          message: error?.message ?? "An error occurred whilst logging out",
        })
      );

      return;
    }

    dispatch(logoutUser());
  };

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
              <Link href="/discord" target="_blank">
                Discord
              </Link>
            </Item>
            <Item>
              <Link href="/github" target="_blank">
                GitHub
              </Link>
            </Item>
            <Separator />
            {getRole(user.flags) === "Admin" ? <Item>Admin</Item> : null}
            <Item>
              <Link href="/terms" target="_blank">
                Terms
              </Link>
            </Item>
            <Item onClick={logout} danger>
              Logout
            </Item>
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
              <Link href="/discord" target="_blank">
                Discord
              </Link>
            </Item>
            <Item>
              <Link href="/github" target="_blank">
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
