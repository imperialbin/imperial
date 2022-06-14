import { useAtom } from "jotai";
import Link from "next/link";
import { activeModal } from "../../../state/modal";
import { DiscordURL, GitHubURL } from "../../../lib/constants";
import { Anchor, ListContainer, ListItem, Seperator } from "./styles";

export const LoggedInTooltip = (): JSX.Element => {
  const [, setActiveModal] = useAtom(activeModal);

  return (
    <ListContainer>
      <ListItem onClick={() => setActiveModal(["userSettings", null])}>
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