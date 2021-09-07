import Link from "next/link";
import { DiscordURL, GitHubURL } from "../../utils/consts";
import { Anchor, ListContainer, ListItem, Seperator } from "./styles";

export const LoggedInTooltip = (): JSX.Element => {
  return (
    <ListContainer>
      <Link href="/account">
        <ListItem>User settings</ListItem>
      </Link>
      <Anchor href={DiscordURL} target="_blank" rel="noreferrer">
        Discord
      </Anchor>
      <Seperator />
      <Anchor href={GitHubURL} target="_blank" rel="noreferrer">
        GitHub
      </Anchor>
      <Link href="/logout">
        <ListItem>Logout</ListItem>
      </Link>
    </ListContainer>
  );
};
