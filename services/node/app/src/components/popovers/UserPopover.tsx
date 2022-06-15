import styled from "styled-components";
import { PopoverBase } from "./popovers";

const Wrapper = styled.div``;

const UserPopover = ({ close }: PopoverBase) => {
  return (
    <Wrapper>
      <h1 onClick={close}>yo</h1>
    </Wrapper>
  );
};

export default UserPopover;
