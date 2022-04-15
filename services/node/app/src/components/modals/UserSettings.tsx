/* 
For anyone looking at this component im so sorry and i hope you recover from looking at it
*/

/* eslint-disable no-console */
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Edit,
  Eye,
  Lock,
  RefreshCw,
  Trash,
  Unlock,
} from "react-feather";
import styled, { useTheme } from "styled-components";
import Input from "../Input";
import { UserIcon } from "../UserIcon";
import { Tooltip } from "../Tooltip";
import { useRecentDocuments } from "../../hooks/useRecentDocuments";
import { request } from "../../utils/Request";
import { updateUserSettings } from "../../utils/updateUserSettings";
import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
import { ImperialState } from "../../../state/reducers";
import { connect, ConnectedProps } from "react-redux";
import { closeModal, setUser } from "../../../state/actions";
import Setting from "../Setting";
import Header from "./components/Header";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
  max-width: 800px;
  min-height: 200px;
  height: 50%;
  max-height: 80%;
  border-radius: 12px;
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
`;

const Container = styled.div`
  display: inline-flex;
  height: 100%;
`;

const Overview = styled.div`
  flex: 1.25;
  background: ${({ theme }) => theme.background.dark};
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
  color: ${({ theme }) => theme.text.light};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-size: 1.55em;
  color: ${({ theme }) => theme.text.light};
`;

const UserID = styled.span`
  font-size: 1em;
  opacity: 0.6;
  color: ${({ theme }) => theme.text.dark};
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
  min-width: 38%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 13px 10px;
  margin: 10px;
  min-height: 47px;
  border-radius: 8px;
  font-size: 1.2em;
  color: ${({ theme }) => theme.text.light};
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
`;

const TileBtns = styled.div`
  position: absolute;
  top: 0px;
  right: 8px;
`;

const TileBtn = styled.div`
  display: inline-block;
  margin: 0 3px;
  color: ${({ theme }) => theme.text.dark};
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.text.light};
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
  color: ${({ theme }) => theme.text.dark};
`;

const Btn = styled.button<{ backgroundColor?: string }>`
  border: none;
  border-radius: 5px;
  margin-top: 8px;
  padding: 10px 15px;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.8;
  color: ${({ theme }) => theme.text.light};
  background: ${({ theme, backgroundColor }) =>
    backgroundColor || theme.background.dark};
  box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

const NotFoundSpan = styled.span`
  margin-left: 12px;
  color: ${({ theme }) => theme.text.dark};
`;

interface EmailState {
  newEmail: string;
  emailError: string | null;
  emailSuccess: boolean;
}

interface PasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string | null;
  passwordSuccess: boolean;
}

const UserSettings = ({ user, dispatch }: ReduxProps): JSX.Element => {
  const theme = useTheme();
  const { documents, isError: documentsError } = useRecentDocuments();
  const [iconValue, setIconValue] = useState("");
  const [email, setEmail] = useState<EmailState>({
    emailError: null,
    emailSuccess: false,
    newEmail: "",
  });
  const [password, setPassword] = useState<PasswordState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    passwordError: null,
    passwordSuccess: false,
  });

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
    <Wrapper>
      <Header />
      {user ? (
        <Container>
          <Overview>
            <UserOverview>
              <UserIcon
                URL={user.icon}
                width={60}
                height={60}
                margin="0 15px 0 0"
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
              <Link href="/link/discord" passHref={true}>
                <Tile style={{ cursor: "pointer" }}>
                  <TileIcon src="/img/discord.svg" />
                  <TitleInfo style={{ fontSize: "1em" }}>
                    {user.discordId ? "Connected" : "Connect"}
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
                {documentsError
                  ? "There was an error getting your recent documents!"
                  : null}
                {documents && documents.length > 0 ? (
                  documents.map((document, key) => {
                    const date = new Date(document.timestamps.expiration * 1000)
                      .toISOString()
                      .slice(0, 10);

                    return (
                      <Link href={`/${document.id}`} key={key} passHref>
                        <Tile
                          onClick={() => dispatch(closeModal())}
                          style={{
                            display: "unset",
                            padding: "17px 8px",
                            minWidth: 160,
                            cursor: "pointer",
                          }}
                        >
                          <TileBtns>
                            {document.settings.instantDelete ? (
                              <Tooltip title="Instantly deletes after being viewed">
                                <TileBtn>
                                  <Eye size={12} />
                                </TileBtn>
                              </Tooltip>
                            ) : null}
                            {document.settings.encrypted ? (
                              <Tooltip title="Encrypted">
                                <TileBtn>
                                  <Lock size={12} />
                                </TileBtn>
                              </Tooltip>
                            ) : null}
                            <Tooltip title="Delete document">
                              <TileBtn>
                                <Trash size={12} />
                              </TileBtn>
                            </Tooltip>
                          </TileBtns>
                          {document.id}
                          <TitleInfo>
                            Deletes {dayjs(date).calendar()}
                          </TitleInfo>
                        </Tile>
                      </Link>
                    );
                  })
                ) : (
                  <NotFoundSpan>You have no recent documents.</NotFoundSpan>
                )}
              </Tiles>
            </Tiles>
            <br />
            <Link href="/logout" passHref={true}>
              <Btn
                backgroundColor={theme.background.lightestOfTheBunch}
                style={{
                  marginLeft: 10,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ArrowLeft
                  style={{ color: theme.system.error, marginRight: 10 }}
                />
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
              icon={<Check size={18} />}
              value={user.icon
                .match(/[^/]*.png/g)
                ?.toString()
                .replace(".png", "")}
              iconHoverColor={theme.system.success}
              hideIconUntilDifferent={true}
              tooltipTitle="Update icon"
              onChange={e => setIconValue(e.target.value)}
              iconClick={async () => {
                const { data, error } = await request(
                  "/user/@me/icon",
                  "PATCH",
                  {
                    method: "github",
                    url: `https://github.com/${iconValue}.png`,
                  },
                );

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
              }}
            />
            {email.emailError ? (
              <p style={{ color: theme.system.error }}>{email.emailError}</p>
            ) : null}
            {email.emailSuccess ? (
              <p style={{ color: theme.system.success }}>
                Successfully changed your email!
              </p>
            ) : null}
            <Input
              label="Email"
              placeholder="Your email"
              value={user.email}
              onChange={e => {
                setEmail({
                  newEmail: e.target.value,
                  emailSuccess: false,
                  emailError: null,
                });
              }}
              icon={<Edit size={18} />}
              hideIconUntilDifferent={true}
              iconHoverColor={theme.system.success}
              tooltipTitle="Update email"
              iconClick={async () => {
                if (!/^\S+@\S+\.\S+$/.test(email.newEmail)) {
                  return setEmail({
                    ...email,
                    emailError: "Invalid email!",
                    emailSuccess: false,
                  });
                }

                const { data, error } = await request(
                  "/user/@me/email",
                  "PATCH",
                  {
                    newEmail: email.newEmail,
                  },
                );

                if (error)
                  return setEmail({
                    ...email,
                    emailError: error.message,
                    emailSuccess: false,
                  });

                setEmail({
                  ...email,
                  emailError: null,
                  emailSuccess: true,
                });

                dispatch(setUser(data));
              }}
            />
            <Tooltip title="Click to copy API Token" position="bottom">
              <Input
                label="API Token"
                placeholder="API Token"
                value={user.apiToken}
                icon={<RefreshCw size={18} />}
                secretValue={true}
                iconClick={async () => {
                  const { data, error } = await request(
                    "/user/@me/regenAPIToken",
                    "POST",
                  );

                  if (error && !data) {
                    return console.log(
                      "There was an error whilst editing document settings!",
                    );
                  }

                  console.log(data);
                  dispatch(setUser(data));
                }}
                inputDisabled={true}
              />
            </Tooltip>
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
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
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
              }}
              toggled={user.settings.wordWrap}
              description="When enabled, the editor will wrap instead of enabling overflow."
            />
            <Setting
              title="Font size"
              type="dropdown"
              initialValue={user.settings.fontSize}
              mode="expiration"
              numberLimit={18}
              onToggle={async e => {
                const { data, error } = await updateUserSettings({
                  fontSize: Number(e?.target.value),
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
              }}
              description="Change font size of the editor!"
            />
            <Setting
              title="Tab size"
              type="dropdown"
              initialValue={user.settings.tabSize}
              mode="expiration"
              numberLimit={8}
              onToggle={async e => {
                const { data, error } = await updateUserSettings({
                  tabSize: Number(e?.target.value),
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
              }}
              description="How big do you want your tabs?"
            />
            <Setting
              title="Expiration"
              type="dropdown"
              initialValue={user.settings.expiration}
              mode="expiration"
              onToggle={async e => {
                const { data, error } = await updateUserSettings({
                  expiration: Number(e?.target.value),
                });

                if (error && !data) {
                  return console.log(
                    "There was an error whilst editing document settings!",
                  );
                }

                dispatch(setUser(data));
              }}
              description="How long (in days) a document takes to delete."
            />
            <br />
            <Subtitle>Reset password</Subtitle>
            {password.passwordError ? (
              <p style={{ color: theme.system.error }}>
                {password.passwordError}
              </p>
            ) : null}
            {password.passwordSuccess ? (
              <p style={{ color: theme.system.success }}>
                Successfully reset your password!
              </p>
            ) : null}
            <Input
              label="Current password"
              placeholder="Enter your current password"
              onChange={e =>
                setPassword({
                  ...password,
                  currentPassword: e.target.value,
                  passwordSuccess: false,
                  passwordError: null,
                })
              }
              icon={<Unlock size={18} />}
              iconClick={() => null}
              type="password"
            />
            <Input
              label="New password"
              placeholder="Enter your new password"
              icon={<Lock size={18} />}
              onChange={e =>
                setPassword({
                  ...password,
                  newPassword: e.target.value,
                  passwordSuccess: false,
                  passwordError: null,
                })
              }
              iconClick={() => null}
              type="password"
            />
            <Input
              label="Confirm password"
              placeholder="Re-enter new password."
              icon={<Lock size={18} />}
              onChange={e =>
                setPassword({
                  ...password,
                  confirmPassword: e.target.value,
                  passwordSuccess: false,
                  passwordError: null,
                })
              }
              iconClick={() => null}
              type="password"
            />
            <Btn
              onClick={async () => {
                if (password.newPassword !== password.confirmPassword)
                  return setPassword({
                    ...password,
                    passwordSuccess: false,
                    passwordError:
                      "Your new password does not match confirm password!",
                  });

                if (
                  password.newPassword.length < 8 ||
                  password.confirmPassword.length < 8 ||
                  password.currentPassword.length < 8
                )
                  return setPassword({
                    ...password,
                    passwordSuccess: false,
                    passwordError:
                      "A password you provided isn't 8 characters!",
                  });

                const { error } = await request(
                  "/auth/resetInClient",
                  "PATCH",
                  {
                    currentPassword: password.currentPassword,
                    newPassword: password.newPassword,
                    confirmPassword: password.confirmPassword,
                  },
                );

                if (error)
                  return setPassword({
                    ...password,
                    passwordSuccess: false,
                    passwordError: error.message,
                  });

                setPassword({
                  confirmPassword: "",
                  currentPassword: "",
                  newPassword: "",
                  passwordSuccess: true,
                  passwordError: null,
                });
              }}
            >
              Reset password
            </Btn>
            <br />
            <br />
          </Settings>
        </Container>
      ) : null}
    </Wrapper>
  );
};

const mapStateToProps = ({ user }: ImperialState) => {
  return {
    user,
  };
};
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(UserSettings);
