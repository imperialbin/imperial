import { store } from "../../../state";
import { openModal } from "../../../state/actions";
import { DiscordURL, GitHubURL } from "../../utils/Consts";
import { Anchor, ListContainer, ListItem, Seperator } from "./styles";

export const LoggedOutTooltip = (): JSX.Element => {
  return (
    <ListContainer>
      <ListItem onClick={() => store.dispatch(openModal("login"))}>
        Login
      </ListItem>
      <ListItem onClick={() => store.dispatch(openModal("signup"))}>
        Signup
      </ListItem>
      <Seperator />
      <Anchor href={DiscordURL} target="_blank" rel="noreferrer">
        Discord
      </Anchor>
      <Anchor href={GitHubURL} target="_blank" rel="noreferrer">
        GitHub
      </Anchor>
    </ListContainer>
  );
};
