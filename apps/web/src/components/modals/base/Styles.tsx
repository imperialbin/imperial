import { styled } from "@web/stitches.config";

export const Wrapper = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  padding: 25,
  margin: 10,
  background: "$primary800",
  borderRadius: 8,
  overflow: "auto",
  maxHeight: "90%",
  minWidth: 200,
});

export const Paragraph = styled("p", {
  color: "$text-secondary",
  fontSize: "0.9em",
  maxWidth: "48ch",
  margin: "5px 0",
});

export const Footer = styled("div", {
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  marginTop: 10,
  gap: 10,
});

export const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  margin: "10px 0",
});

export const LeftBtn = styled("button", {
  border: "none",
  borderRadius: 5,
  marginTop: 8,
  padding: "10px 15px",
  fontSize: "0.9em",
  cursor: "pointer",
  opacity: 0.8,
  color: "$text-muted",
  background: "",
  boxShadow: "0px 0px 13px rgba(0, 0, 0, 0.25)",
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    opacity: 1,
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
  "&:last-of-type": {
    marginTop: 15,
  },
});
