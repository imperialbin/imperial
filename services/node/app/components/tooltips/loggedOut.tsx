import Link from "next/link";
import { DiscordURL, GitHubURL } from "../../utils/consts";
import { ListContainer, ListItem, Seperator } from "./styles";

export const LoggedOutTooltip = (): JSX.Element => {
  return (
    <ListContainer>
      <Link href="/login">
        <ListItem>Login</ListItem>
      </Link>
      <Link href="/signup">
        <ListItem>Signup</ListItem>
      </Link>
      <Seperator />
      <Link href={DiscordURL}>
        <ListItem>Discord</ListItem>
      </Link>
      <Link href={GitHubURL}>
        <ListItem>GitHub</ListItem>
      </Link>
    </ListContainer>
  );
};
