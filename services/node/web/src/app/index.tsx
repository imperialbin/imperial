import { styled } from "@stitches/react";

const Button = styled("button", {
  backgroundColor: "gainsboro",
  borderRadius: "9999px",
  fontSize: "13px",
  padding: "10px 15px",
  "&:hover": {
    backgroundColor: "lightgray",
  },
});

function Index() {
  return (
    <div>
      <Button>hey x</Button>
    </div>
  );
}

export default Index;
