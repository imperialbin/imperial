import styled from "styled-components";
import { store } from "../../../../state";
import { closeModal } from "../../../../state/actions";
import { X } from "react-feather";
import { Tooltip } from "../../Tooltip";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  color: white;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.55em;
  font-weight: 600;
`;

interface IHeaderProps {
  children?: React.ReactChild;
}

const Header = ({ children }: IHeaderProps) => {
  return (
    <Wrapper style={!children ? { position: "absolute", top: 0 } : undefined}>
      <Title>{children}</Title>
      <Tooltip
        style={{
          display: "inline-flex",
          marginRight: 8,
          marginLeft: "auto",
        }}
        title="Close (esc)"
      >
        <X
          size={23}
          style={{ cursor: "pointer" }}
          onClick={() => store.dispatch(closeModal())}
        />
      </Tooltip>
    </Wrapper>
  );
};

export default Header;
