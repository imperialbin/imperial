import styled from "styled-components";
import { store } from "../../../../state";
import { closeModal } from "../../../../state/actions";
import { X } from "react-feather";
import { Tooltip } from "../../Tooltip";

const Wrapper = styled.div<{
  noHeader: boolean;
}>`
  width: 100%;
  display: flex;
  position: ${({ noHeader }) => (noHeader ? "absolute" : "relative")};
  right: ${({ noHeader }) => noHeader && "10px"};
  top: ${({ noHeader }) => noHeader && "15px"};
  flex-direction: row;
  align-items: center;
  color: white;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.55em;
  font-weight: 600;
  flex-grow: 1;
`;

interface IHeaderProps {
  title?: string;
}

const Header = ({ title = "" }: IHeaderProps) => {
  return (
    <Wrapper noHeader={title.length <= 0}>
      {/* Remove header for some modals */}
      {title.length > 0 ? <Title>{title}</Title> : null}
      <Tooltip
        style={{
          display: "inline-flex",
          marginRight: 8,
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
