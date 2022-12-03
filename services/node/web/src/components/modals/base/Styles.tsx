import { styled } from "../../../stitches";

export const Wrapper = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  borderRadius: 12,
  maxWidth: "90%",
  width: "50%",
  height: "80%",
  maxHeight: "90%",
  overflow: "auto",
  padding: 30,
  background: "$light",
});

export const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
});
