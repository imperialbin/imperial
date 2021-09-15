import { FaCheck, FaEdit, FaRedo } from "react-icons/fa";
import styled from "styled-components";
import { Input, UserIcon, Setting } from "..";
import { useUser } from "../../hooks";
import { ThemeForStupidProps } from "../../types";

const Container = styled.div`
  display: inline-flex;
  height: 100%;
`;

const Overview = styled.div`
  flex: 1;
  background: ${({ theme }: ThemeForStupidProps) => theme.layoutDark};
  box-shadow: -1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25);
  padding: 10px;
  border-bottom-right-radius: 12px;
  border-top-right-radius: 12px;
`;

const UserOverview = styled.div`
  overflow-y: scroll;
  display: flex;
  align-items: center;
  margin: 15px 0 15px 15px;
`;

const Subtitle = styled.h1`
  font-size: 1.2em;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-size: 1.55em;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
`;

const UserID = styled.span`
  font-size: 1em;
  opacity: 0.6;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
`;

const Settings = styled.div`
  flex: 1;
  padding: 10px 30px;
  overflow-y: scroll;
`;

const Tiles = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Tile = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 10px;
  min-height: 47px;
  border-radius: 8px;
  font-size: 1.2em;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  background: ${({ theme }: ThemeForStupidProps) =>
    theme.layoutLightestOfTheBunch};
`;

const TileIcon = styled.img`
  width: 30px;
  height: auto;
  margin-right: 13px;
`;

const TitleInfo = styled.p`
  font-size: 0.8em;
  opacity: 0.6;
  margin: 0;
  padding-right: 10px;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
`;

export const UserSettings = (): JSX.Element => {
  const { user, isError, isLoading } = useUser();

  return (
    <>
      {user ? (
        <Container>
          <Overview>
            <UserOverview>
              <UserIcon
                URL={user.icon}
                width={60}
                height={60}
                style={{ marginRight: 15 }}
              />
              <UserInfo>
                <Username>{user.username}</Username>
                <UserID>user #{user.userId}</UserID>
              </UserInfo>
            </UserOverview>
            <Tiles>
              <Tile style={{ display: "unset" }}>
                {user.documentsMade}
                <TitleInfo>Documents made</TitleInfo>
              </Tile>
              <Tile>
                <TileIcon src="/img/discord.svg" />
                <TitleInfo style={{ fontSize: "1em" }}>
                  {user.discordId ? user.discordId : "Connect"}
                </TitleInfo>
              </Tile>
              <Tile>
                <TileIcon src="/img/github.svg" />
                <TitleInfo style={{ fontSize: "1em" }}>
                  {user.githubAccess ? user.githubAccess : "Connect"}
                </TitleInfo>
              </Tile>
            </Tiles>
          </Overview>

          <Settings>
            <Subtitle>Information</Subtitle>
            <Input
              label="User Icon"
              placeholder="GitHub username"
              icon={<FaCheck size={18} />}
              iconClick={() => console.log("Edit Icon")}
            />
            <Input
              label="Email"
              placeholder="Your email"
              value={user.email}
              icon={<FaEdit size={18} />}
              iconClick={() => console.log("Edit email")}
            />
            <Input
              label="API Token"
              placeholder="Your email"
              value={user.apiToken}
              icon={<FaRedo size={18} />}
              secretValue={true}
              iconClick={() => console.log("Regenerate API Token")}
              inputDisabled={true}
            />
            <br />
            <Subtitle>Editor settings</Subtitle>
            <Setting
              title="Clipboard"
              type="switch"
              onToggle={() => {
                console.log("changing clipboard");
              }}
              toggled={user.settings.clipboard}
              description="Let IMPERIAL automatically paste your clipboard."
            />
            <Setting
              title="Longer URLs"
              type="switch"
              onToggle={() => {
                console.log("changing Longer URLS");
              }}
              toggled={user.settings.longUrls}
              description="Create 32 character URLs."
            />
            <Setting
              title="Short URLs"
              type="switch"
              onToggle={() => {
                console.log("changing Short URLs");
              }}
              toggled={user.settings.shortUrls}
              description="Create 4 character URLs."
            />
            <Setting
              title="Instant Delete"
              type="switch"
              onToggle={() => {
                console.log("changing instant delete");
              }}
              toggled={user.settings.instantDelete}
              description="Instantly delete the document after being viewed."
            />
            <Setting
              title="Encrypted"
              type="switch"
              onToggle={() => {
                console.log("changing Encrypted");
              }}
              toggled={user.settings.encrypted}
              description="Encrypt documents with AES256 encryption."
            />
            <Setting
              title="Image Embed"
              type="switch"
              onToggle={() => {
                console.log("changing Image Embed");
              }}
              toggled={user.settings.imageEmbed}
              description="Have a sneak peak at a document's content with Open Graph embeds"
            />
            <Setting
              title="Font Lignatures"
              type="switch"
              onToggle={() => {
                console.log("changing Font lignatures");
              }}
              toggled={user.settings.fontLignatures}
              description="When enabled, the editor will have font lignatures"
            />
            <Setting
              title="White Space"
              type="switch"
              onToggle={() => {
                console.log("changing White space");
              }}
              toggled={user.settings.renderWhitespace}
              description="When enabled, the editor will render white space."
            />
            <Setting
              title="Word Wrapping"
              type="switch"
              onToggle={() => {
                console.log("changing Word wrapping");
              }}
              toggled={user.settings.wordWrap}
              description="When enabled, the editor will wrap instead of enabling overflow."
            />
            <Setting
              title="Expiration"
              type="dropdown"
              initialValue={user.settings.expiration}
              mode="expiration"
              onToggle={() => {
                console.log("changing Expiration");
              }}
              description="How long (in days) a document takes to delete."
            />
          </Settings>
        </Container>
      ) : (
        "Loading"
      )}
    </>
  );
};
