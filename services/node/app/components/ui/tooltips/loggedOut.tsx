import Link from "next/link";
import { DiscordURL, GitHubURL } from "../../../lib/constants";
import { Anchor, ListContainer, ListItem, Seperator } from "./styles";

export const LoggedOutTooltip = (): JSX.Element => (
  <ListContainer>
    <Link href="/login" passHref={true}>
      <ListItem>Login</ListItem>
    </Link>
    <Link href="/signup" passHref={true}>
      <ListItem>Signup</ListItem>
    </Link>
    <Seperator />
    <Anchor href={DiscordURL} target="_blank" rel="noreferrer">
      Discord
    </Anchor>
    <Anchor href={GitHubURL} target="_blank" rel="noreferrer">
      GitHub
    </Anchor>
  </ListContainer>
);
