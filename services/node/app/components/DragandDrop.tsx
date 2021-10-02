import styled from "styled-components";

const DropArea = styled.input.attrs({ type: "file" })`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.layoutDarkest}3d;
`;

export const DragandDrop = () => {
  return <DropArea />;
};
