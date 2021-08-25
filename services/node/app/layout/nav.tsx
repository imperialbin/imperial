import { NavProps, User } from "../types";

export const Nav = ({ user }: NavProps): JSX.Element => {
  return <h1>hi {user?.username || "man login wtf"}</h1>;
};
