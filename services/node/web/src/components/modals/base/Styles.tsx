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
  