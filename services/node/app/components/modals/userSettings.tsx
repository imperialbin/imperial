import { useState, useContext } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCheck,
  FaCode,
  FaEdit,
  FaEye,
  FaLock,
  FaRedo,
  FaTrash,
  FaUnlock,
} from "react-icons/fa";
import styled, { ThemeContext } from "styled-components";
import { Input, UserIcon, Setting } from "..";
import { useRecentDocuments, useUser } from "../../hooks";
import { request } from "../../utils";
import { updateUserSettings } from "../../utils/updateUserSettings";
import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";

const Container = styled.div`
  display: inline-flex;
  height: 100%;
`;

const Overview = styled.div`
  flex: 1.25;
  background: ${({ theme }) => theme.layoutDark};
  box-shadow: -1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25);
  padding: 10px;
  border-bottom-right-radius: 12px;
  border-top-right-radius: 12px;
  overflow-y: scroll;
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
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const Tile = styled.div`
  min-width: 40%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 13px 10px;
  margin: 10px;
  min-height: 47px;
  border-radius: 8px;
  font-size: 1.3em;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.layoutLightestOfTheBunch};
`;

const TileBtns = styled.div`
  position: absolute;
  top: 0px;
  right: 8px;

  &: ;
`;

const TileBtn = styled.div`
  display: inline-block;
  margin: 0 3px;
  color: ${({ theme }) => theme.textDarker};
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.textLight};
  }
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

const Btn = styled.button<{ backgroundColor?: string }>`
  border: none;
  border-radius: 5px;
  margin-top: 8px;
  padding: 10px 15px;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.8;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme, backgroundColor }) =>
    backgroundColor || theme.layoutDark};
  box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

export const UserSettings = (): JSX.Element => {
  const theme = useContext(ThemeContext);
  const { user, isError, isLoading, mutate } = useUser();
  const {
    documents,
    isError: documentsError,
    isLoading: documentsLoading,
  } = useRecentDocuments();
  const [iconValue, setIconValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  dayjs.extend(calender);
  dayjs.extend(updateLocale);

  dayjs.updateLocale("en", {
    calendar: {
      lastDay: "[Yesterday]",
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      lastWeek: "[last] dddd",
      nextWeek: "[next week]",
    },
  });

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
              <Link href="/" passHref={true}>
                <Tile style={{ cursor: "pointer" }}>
                  <TileIcon src="/img/discord.svg" />
                  <TitleInfo style={{ fontSize: "1em" }}>
                    {user.discordId ? user.discordId : "Connect"}
                  </TitleInfo>
                </Tile>
              </Link>
              <Link href="/" passHref={true}>
                <Tile style={{ cursor: "pointer" }}>
                  <TileIcon src="/img/github.svg" />
                  <TitleInfo style={{ fontSize: "1em" }}>
                    {user.githubAccess ? "Connected" : "Connect"}
                  </TitleInfo>
                </Tile>
              </Link>
            </Tiles>
            <Subtitle style={{ marginLeft: 12 }}>Recent documents</Subtitle>
            <Tiles>
              <Tiles>
                {documentsLoading && "Documents loading..."}
                {documentsError &&
                  "There was an error getting your recent documents!"}
                {documents && documents.length > 0
                  ? documents.map((document, key) => {
                      const date = new Date(
                        document.timestamps.expiration * 1000
                      )
                        .toISOString()
                        .slice(0, 10);

                      return (
                        <Link
                          href={`/${document.id}`}
                          passHref={true}
                          key={key}
                        >
                          <Tile
                            style={{
                              display: "unset",
                              padding: "17px 8px",
                              minWidth: 160,
                              cursor: "pointer",
                            }}
                          >
                            <TileBtns>
                              {document.settings.instantDelete && (
                                <TileBtn>
                                  <FaEye size={12} />
                                </TileBtn>
                              )}
                              {document.settings.encrypted && (
                                <TileBtn>
                                  <FaLock size={12} />
                                </TileBtn>
                              )}
                              <TileBtn>
                                <FaTrash size={12} />
                              </TileBtn>
                            </TileBtns>
                            {document.id}
                            <TitleInfo>
                              Deletes {dayjs(date).calendar()}
                            </TitleInfo>
                          </Tile>
                        </Link>
                      );
                    })
                  : "You don't have an recent documents"}
              </Tiles>
            </Tiles>
            <br />
            <br />
            <Link href="/logout" passHref={true}>
              <Btn
                backgroundColor={theme.layoutLightestOfTheBunch}
                style={{
                  marginLeft: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaArrowLeft style={{ color: theme.error, marginRight: 10 }} />
                Logout
              </Btn>
            </Link>
            <br />
          </Overview>

          <Settings>
            <Subtitle>Information</Subtitle>
            <Input
              label="User Icon"
              placeholder="GitHub username"
              icon={<FaCheck size={18} />}
              value={user.icon
                .match(/[^/]*.png/g)
                ?.toString()
                .replace(".png", "")}
              iconHoverColor={theme.success}
              hideIconUntilDifferent={true}
              tooltipTitle="Update icon"
              onChange={(e) => setIconValue(e.target.value)}
              iconClick={async () => {
                const { data, error } = await request(
                  "/user/@me/icon",
                  "PATCH",
                  {
                    method: "github",
                    url: `https://github.com/${iconValue}.png`,
                  }
                );

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!"
                  );
                }

                mutate({ ...data }, false);
              }}
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
              placeholder="API Token"
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
            <br />
            <Subtitle>Reset password</Subtitle>
            <Input
              label="Current password"
              placeholder="Enter your current password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={<FaUnlock size={18} />}
              iconClick={() => null}
            />
            <Input
              label="New password"
              placeholder="Enter your new password"
              icon={<FaLock size={18} />}
              onChange={(e) => setNewPassword(e.target.value)}
              iconClick={() => null}
            />
            <Input
              label="Confirm password"
              placeholder="Re-enter new password."
              icon={<FaLock size={18} />}
              onChange={(e) => setCurrentPassword(e.target.value)}
              iconClick={() => null}
            />
            <Btn
              onClick={() => {
                if (newPassword !== confirmPassword) return;
                console.log("bruh");
              }}
            >
              Reset password
            </Btn>
            <br />
            <br />
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
