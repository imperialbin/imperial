import { connect, ConnectedProps } from "react-redux";
import styled from "styled-components";
import { ImperialState } from "../../../state/reducers";
import { PopoverBase } from "./popovers";

const Wrapper = styled.div`
  padding: 15px 25px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
`;

const Item = styled.li<{ danger?: boolean }>`
  width: 100%;
  margin: 2.5px 10px;
  color: ${({ theme }) => theme.text.dark}5d;
  cursor: pointer;

  a {
    text-decoration: none;
    color: unset;
  }

  transition: color 0.15s ease-in-out;

  &:hover {
    color: ${({ theme, danger }) =>
      danger ? theme.system.error : theme.text.light};
  }
`;

const UserPopover = ({ close, user, dispatch }: PopoverBase & ReduxProps) => {
  return (
    <Wrapper>
      <List>
        <Item></Item>
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
