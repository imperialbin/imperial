import Link from "next/link";
import { DiscordURL, GitHubURL } from "../../utils/consts";
import { ListContainer, ListItem, Seperator } from "./styles";

export const LoggedInTooltip = (): JSX.Element => {
  return (
    <ListContainer>
      <Link href="/account">
        <ListItem>User settings</ListItem>
      </Link>
      <Link href={DiscordURL}>
        <ListItem>Discord</ListItem>
      </Link>
      <Seperator />
      <Link href={GitHubURL}>
        <ListItem>GitHub</ListItem>
      </Link>
      <Link href="/logout">
        <ListItem>Logout</ListItem>
      </Link>
    </ListContainer>
  );
};
