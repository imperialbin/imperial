import Link from "next/link";
import { store } from "../../../state";
import { openModal } from "../../../state/actions";
import { DiscordURL, GitHubURL } from "../../utils/Consts";
import { Anchor, ListContainer, ListItem, Seperator } from "./styles";

export const LoggedInTooltip = (): JSX.Element => {
  return (
    <ListContainer>
      <ListItem onClick={() => store.dispatch(openModal("user_settings"))}>
        User settings
      </ListItem>
      <Anchor href={DiscordURL} target="_blank" rel="noreferrer">
        Discord
      </Anchor>
      <Anchor href={GitHubURL} target="_blank" rel="noreferrer">
        GitHub
      </Anchor>
      <Seperator />
      <Link href="/logout" passHref={true}>
        <ListItem danger>Logout</ListItem>
      </Link>
    </ListContainer>
  );
};
