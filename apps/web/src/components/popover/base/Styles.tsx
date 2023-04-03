import { styled } from "../../../stitches.config";

const List = styled("ul", {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  minWidth: 130,
  margin: 5,
});

const Item = styled("li", {
  width: "100%",
  cursor: "pointer",
  padding: "5px 15px",
  borderRadius: "$tiny",
  color: "$text-secondary",
  opacity: 0.7,
  transition:
    "color 0.15s ease-in-out, background 0.15s ease-in-out,opacity 0.15s ease-in-out",

  a: {
    textDecoration: "none",
    color: "unset",
  },

  "&:hover": {
    color: "$text-primary",
    opacity: 1,
    background: "$contrast",
  },

  variants: {
    danger: {
      true: {
        "&:hover": {
          color: "$error",
        },
      },
    },
  },
});

const Separator = styled("span", {
  display: "block",
  margin: "8px auto",
  width: "80%",
  height: "1.5px",
  background: "$contrast",
});

export { List, Item, Separator };
