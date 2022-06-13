import styled from "styled-components";
import { PopoverBase } from "./popovers";

const Wrapper = styled.div``;

interface IUserPopover extends PopoverBase {}
const UserPopover = ({ close }: IUserPopover) => {
  return (
    <Wrapper>
      <h1 onClick={close}>yo</h1>
    </Wrapper>
  );
};

export default UserPopover;
