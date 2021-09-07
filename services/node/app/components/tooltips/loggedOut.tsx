import Link from "next/link";
import { ListContainer, ListItem } from "./styles";

export const LoggedInTooltip = (): JSX.Element => {
  return (
    <ListContainer>
      <Link href="/account">
        <ListItem>User settings</ListItem>
      </Link>
      <Link href="/logout">
        <ListItem>Logout</ListItem>
      </Link>
    </ListContainer>
  );
};
