import { useAtom } from "jotai";
import Link from "next/link";
import { DiscordURL, GitHubURL } from "../../lib/constants";
import { activeModal } from "../../state/modal";
import { Anchor, ListContainer, ListItem, Seperator } from "./styles";

export const LoggedOutTooltip = (): JSX.Element => {
  const [, setActiveModal] = useAtom(activeModal);

  return (
    <ListContainer>
      <ListItem onClick={() => setActiveModal(["login", null])}>Login</ListItem>
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
};
