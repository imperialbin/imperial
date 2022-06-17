import { connect, ConnectedProps } from "react-redux";
import styled from "styled-components";
import { addNotification, openModal } from "../../../state/actions";
import { ImperialState } from "../../../state/reducers";
import { ROLES, TestPermission } from "../../utils/Permissions";
import { C } from "../Icons";
import { PopoverBase } from "./popovers";

const Wrapper = styled.div`
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
  padding: 10px 25px;
  border-radius: 10px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
`;

const Item = styled.li`
  text-align: center;
  margin: 2.5px 10px;
  color: ${({ theme }) => theme.text.dark}5d;

  transition: color 0.15s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.text.light};
  }
`;

const Separator = styled.span`
  display: block;
  margin: 8px auto;
  width: 100%;
  height: 1.5px;
  background: ${({ theme }) => theme.text.darkest};
`;

const UserPopover = ({ close, user, dispatch }: PopoverBase & ReduxProps) => {
  return (
    <Wrapper>
      <List>
        {user ? (
          <>
            <Item onClick={() => dispatch(openModal("user_settings"))}>
              User profile
            </Item>
            <Item>Terms</Item>
            <Item>Privacy</Item>
            <Separator />
            <Item>Discord</Item>
            <Item>GitHub</Item>
            {TestPermission(user.flags, ROLES.ADMIN) ? (
              <Item>Admin</Item>
            ) : null}
            <Item>Logout</Item>
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
                  }),
                );
              }}
            >
              Signup
            </Item>
            <Separator />
            <Item>Discord</Item>
            <Item>GitHub</Item>
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
