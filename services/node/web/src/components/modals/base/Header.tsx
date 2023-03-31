import { ReactNode } from "react";
import { X } from "react-feather";
import { store } from "@web/state";
import { closeModal } from "@web/state/actions";
import { styled } from "@web/stitches.config";
import Tooltip from "@web/components/Tooltip";

const Wrapper = styled("div", {
  width: "100%",
  display: "flex",
  position: "relative",
  alignItems: "center",
  color: "white",
  zIndex: 1,
});

const Title = styled("h1", {
  margin: 0,
  fontSize: "1.55em",
  fontWeight: 600,
  flexGrow: 1,
});

interface IHeaderProps {
  children?: ReactNode;
  canClose?: boolean;
}

function Header({ children, canClose = true }: IHeaderProps) {
  return (
    <Wrapper
      style={!children ? { position: "absolute", top: 20, right: 20 } : undefined}
    >
      <Title>{children}</Title>
      {canClose ? (
        <Tooltip title="Close (esc)">
          <X
            size={23}
            style={{ cursor: "pointer" }}
            onClick={() => store.dispatch(closeModal())}
          />
        </Tooltip>
      ) : null}
    </Wrapper>
  );
}

export default Header;
