/* eslint-disable no-unused-vars */
import { styled } from "@web/stitches.config";
import { User } from "@web/types";
import { PopoverBase } from "./base/popover";
import Input from "../Input";
import { Lock } from "react-feather";
import { useState } from "react";
import Button from "../Button";

const Wrapper = styled("ul", {
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  gap: 5,
  padding: "$medium",

  "> h1": {
    fontSize: "1em",
  },

  "> button": {
    marginLeft: "auto",
  },
});

interface IPasswordPopoverProps extends PopoverBase {
  onSubmit: (password: string) => void;
}

function PasswordPopover({ close, onSubmit: onClick }: IPasswordPopoverProps) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <Wrapper>
      <Input
        label="Enter your password"
        placeholder="Enter your password"
        type="password"
        value={password}
        icon={{
          svg: <Lock />,
        }}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await onClick(password);
          setLoading(false);
        }}
      >
        Confirm
      </Button>
    </Wrapper>
  );
}

export default PasswordPopover;
