import { useContext } from "react";
import { FaCheck, FaEdit, FaRedo } from "react-icons/fa";
import styled, { ThemeContext } from "styled-components";
import { Input, UserIcon, Setting } from "..";
import { useUser } from "../../hooks";
import { request } from "../../utils";
import { updateUserSettings } from "../../utils/updateUserSettings";

const Container = styled.div`
  display: inline-flex;
  height: 100%;
`;

const Overview = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.layoutDark};
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
  color: ${({ theme }) => theme.textLight};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-size: 1.55em;
  color: ${({ theme }) => theme.textLight};
`;

const UserID = styled.span`
  font-size: 1em;
  opacity: 0.6;
  color: ${({ theme }) => theme.textDarker};
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
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.layoutLightestOfTheBunch};
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
  color: ${({ theme }) => theme.textDarker};
`;

export const UserSettings = (): JSX.Element => {
  const theme = useContext(ThemeContext);
  const { user, isError, isLoading, mutate } = useUser();

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
              iconHoverColor={theme.success}
              hideIconUntilDifferent={true}
              tooltipTitle="Update icon"
              iconClick={() => console.log("Edit Icon")}
            />
            <Input
              label="Email"
              placeholder="Your email"
              value={user.email}
              icon={<FaEdit size={18} />}
              hideIconUntilDifferent={true}
              iconHoverColor={theme.success}
              tooltipTitle="Update email"
              iconClick={() => console.log("Edit email")}
            />
            <Input
              label="API Token"
              placeholder="Your email"
              value={user.apiToken}
              icon={<FaRedo size={18} />}
              secretValue={true}
              iconClick={async () => {
                const { data, error } = await request(
                  "/user/@me/regenAPIToken",
                  "POST"
                );

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              inputDisabled={true}
            />
            <br />
            <Subtitle>Editor settings</Subtitle>
            <Setting
              title="Clipboard"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  clipboard: !user.settings.clipboard,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.clipboard}
              description="Let IMPERIAL automatically paste your clipboard."
            />
            <Setting
              title="Longer URLs"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  longUrls: !user.settings.longUrls,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.longUrls}
              description="Create 32 character URLs."
            />
            <Setting
              title="Short URLs"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  shortUrls: !user.settings.shortUrls,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.shortUrls}
              description="Create 4 character URLs."
            />
            <Setting
              title="Instant Delete"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  instantDelete: !user.settings.instantDelete,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.instantDelete}
              description="Instantly delete the document after being viewed."
            />
            <Setting
              title="Encrypted"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  encrypted: !user.settings.encrypted,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.encrypted}
              description="Encrypt documents with AES256 encryption."
            />
            <Setting
              title="Image Embed"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  imageEmbed: !user.settings.imageEmbed,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.imageEmbed}
              description="Have a sneak peak at a document's content with Open Graph embeds"
            />
            <Setting
              title="Font Lignatures"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  fontLignatures: !user.settings.fontLignatures,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.fontLignatures}
              description="When enabled, the editor will have font lignatures"
            />
            <Setting
              title="White Space"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  renderWhitespace: !user.settings.renderWhitespace,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.renderWhitespace}
              description="When enabled, the editor will render white space."
            />
            <Setting
              title="Word Wrapping"
              type="switch"
              onToggle={async () => {
                const { data, error } = await updateUserSettings({
                  wordWrap: !user.settings.wordWrap,
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              toggled={user.settings.wordWrap}
              description="When enabled, the editor will wrap instead of enabling overflow."
            />
            <Setting
              title="Tab size"
              type="dropdown"
              initialValue={user.settings.tabSize}
              mode="expiration"
              numberLimit={8}
              onToggle={async (e) => {
                const { data, error } = await updateUserSettings({
                  tabSize: Number(e?.target.value),
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              description="How big do you want your tabs?"
            />
            <Setting
              title="Expiration"
              type="dropdown"
              initialValue={user.settings.expiration}
              mode="expiration"
              onToggle={async (e) => {
                const { data, error } = await updateUserSettings({
                  expiration: Number(e?.target.value),
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
              description="How long (in days) a document takes to delete."
            />
          </Settings>
        </Container>
      ) : (
        <>
          {isLoading && "Loading"}
          {isError && "Error" + isError}
        </>
      )}
    </>
  );
};
