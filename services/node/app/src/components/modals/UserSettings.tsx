import { useCallback, useState } from "react";
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
  X,
} from "react-feather";
import styled, { useTheme } from "styled-components";
import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
import { connect, ConnectedProps } from "react-redux";

import Input from "../Input";
import { UserIcon } from "../UserIcon";
import { Tooltip } from "../Tooltip";
import { useRecentDocuments } from "../../hooks/useRecentDocuments";
import { request } from "../../utils/Request";
import { ImperialState } from "../../../state/reducers";
import { addNotification, closeModal, setUser } from "../../../state/actions";
import Setting from "../Setting";
import Header from "./components/Header";
import { SelfUser, UserSettings } from "../../types";

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
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
  border-radius: 10px;
  overflow: hidden;
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
  font-size: 1.4em;
  margin: 10px 0;
  color: ${({ theme }) => theme.text.light};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-size: 1.5em;
  font-weight: 600;
  color: ${({ theme }) => theme.text.light};
`;

const UserID = styled.span`
  font-size: 1.25em;
  font-weight: 400;
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
  margin-bottom: 20px;
`;

const Tile = styled.div`
  min-width: 38%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 10px;
  margin: 10px;
  min-height: 73px;
  border-radius: 8px;
  flex: 1;
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

  &:disabled {
    opacity: 0.5;
    cursor: initial;

    &:hover {
      opacity: 0.5;
    }
  }

  &:hover {
    opacity: 1;
  }
`;

const NotFoundSpan = styled.span`
  margin-left: 12px;
  color: ${({ theme }) => theme.text.dark};
`;

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

const UserSettings = ({ user, dispatch }: ReduxProps): JSX.Element => {
  const theme = useTheme();
  const { documents, isError: documentsError } = useRecentDocuments();

  const [iconValue, setIconValue] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const patchUser = useCallback(
    async <T extends keyof UserSettings>(
      setting: T,
      value: UserSettings[T],
    ) => {
      const { success, error, data } = await request<{ user: SelfUser }>(
        "/users/@me",
        "PATCH",
        {
          settings: {
            [setting]: value,
          },
        },
      );

      if (!success || !data)
        return dispatch(
          addNotification({
            icon: <X />,
            message: error?.message ?? "An unknown error occurred",
            type: "error",
          }),
        );

      dispatch(
        addNotification({
          icon: <Check />,
          message: "Successfully updated user settings",
          type: "success",
        }),
      );

      dispatch(setUser(data.user));
    },
    [],
  );

  return (
    <Wrapper>
      <Header />
      {user ? (
        <Container>
          <Overview>
            <UserOverview>
              <UserIcon
                URL={user.icon ?? "/img/pfp.png"}
                width={70}
                height={70}
                style={{ margin: "0 15px 0 0" }}
              />
              <UserInfo>
                <Username>{user.username}</Username>
                <UserID>user #{user.id}</UserID>
              </UserInfo>
            </UserOverview>
            <Tiles>
              <Tile style={{ display: "unset" }}>
                {user.documents_made}
                <TitleInfo>Documents made</TitleInfo>
              </Tile>
              <Link href="/link/discord" passHref>
                <Tile style={{ cursor: "pointer" }}>
                  <TileIcon src="/img/discord.svg" />
                  <TitleInfo style={{ fontSize: "1em" }}>
                    {user.discord_id ? "Connected" : "Connect"}
                  </TitleInfo>
                </Tile>
              </Link>
              <Link href="/" passHref>
                <Tile style={{ cursor: "pointer" }}>
                  <TileIcon src="/img/github.svg" />
                  <TitleInfo style={{ fontSize: "1em" }}>
                    {user.github_oauth ? "Connected" : "Connect"}
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
            <Link href="/logout" passHref>
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
                ?.match(/[^/]*.png/g)
                ?.toString()
                .replace(".png", "")}
              iconHoverColor={theme.system.success}
              tooltipTitle="Update icon"
              onChange={(e) => setIconValue(e.target.value)}
              iconClick={async () => {
                const { data, error, success } = await request<{
                  user: SelfUser;
                }>("/users/@me", "PATCH", {
                  icon: `https://github.com/${iconValue}.png`,
                });

                if (!success || !data)
                  return dispatch(
                    addNotification({
                      icon: <X />,
                      message:
                        error?.message ??
                        "An unknown error occurred whilst saving your icon.",
                      type: "error",
                    }),
                  );

                dispatch(
                  addNotification({
                    icon: <Check />,
                    message: "Successfully changes your icon",
                    type: "success",
                  }),
                );
                dispatch(setUser(data.user));
              }}
              hideIconUntilDifferent
            />
            <Input
              label="Email"
              placeholder="Your email"
              value={user.email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Edit size={18} />}
              iconHoverColor={theme.system.success}
              tooltipTitle="Update email"
              iconClick={async () => {
                if (!/^\S+@\S+\.\S+$/.test(email))
                  return dispatch(
                    addNotification({
                      icon: <X />,
                      message: "Invalid email!",
                      type: "error",
                    }),
                  );

                const { data, error } = await request<{ user: SelfUser }>(
                  "/users/@me",
                  "PATCH",
                  {
                    email,
                  },
                );

                if (error || !data)
                  return dispatch(
                    addNotification({
                      icon: <X />,
                      message: "An error occurred whilst changing your email.",
                      type: "error",
                    }),
                  );

                dispatch(
                  addNotification({
                    icon: <Check />,
                    message: "Successfully changed your email.",
                    type: "success",
                  }),
                );
                dispatch(setUser(data.user));
              }}
              hideIconUntilDifferent
            />
            <Tooltip title="Click to copy API Token" position="bottom">
              <Input
                label="API Token"
                placeholder="API Token"
                value={user.api_token}
                icon={<RefreshCw size={18} />}
                iconClick={async () => {
                  const { data, error } = await request<{ token: string }>(
                    "/user/@me/regenAPIToken",
                    "POST",
                  );

                  if (error || !data)
                    return dispatch(
                      addNotification({
                        icon: <X />,
                        message:
                          "An error occurred whilst regenerating your API token.",
                        type: "error",
                      }),
                    );

                  dispatch(
                    addNotification({
                      icon: <Check />,
                      message: "Successfully regenerated your API Token",
                      type: "success",
                    }),
                  );
                  dispatch(setUser({ ...user, api_token: data.token }));
                }}
                secretValue
                inputDisabled
              />
            </Tooltip>
            <br />
            <Subtitle>Editor settings</Subtitle>
            <Setting
              title="Clipboard"
              type="switch"
              onToggle={() => patchUser("clipboard", !user.settings.clipboard)}
              toggled={user.settings.clipboard}
              description="Let IMPERIAL automatically paste your clipboard."
            />
            <Setting
              title="Longer URLs"
              type="switch"
              onToggle={() => patchUser("long_urls", !user.settings.long_urls)}
              toggled={user.settings.long_urls}
              description="Create 32 character URLs."
            />
            <Setting
              title="Short URLs"
              type="switch"
              onToggle={() =>
                patchUser("short_urls", !user.settings.short_urls)
              }
              toggled={user.settings.short_urls}
              description="Create 4 character URLs."
            />
            <Setting
              title="Instant Delete"
              type="switch"
              onToggle={() =>
                patchUser("instant_delete", !user.settings.instant_delete)
              }
              toggled={user.settings.instant_delete}
              description="Instantly delete the document after being viewed."
            />
            <Setting
              title="Encrypted"
              type="switch"
              onToggle={() => patchUser("encrypted", !user.settings.encrypted)}
              toggled={user.settings.encrypted}
              description="Encrypt documents with AES256 encryption."
            />
            <Setting
              title="Image Embed"
              type="switch"
              onToggle={() =>
                patchUser("image_embed", !user.settings.image_embed)
              }
              toggled={user.settings.image_embed}
              description="Have a sneak peak at a document's content with Open Graph embeds"
            />
            <Setting
              title="Font Ligatures"
              type="switch"
              onToggle={() =>
                patchUser("font_ligatures", !user.settings.font_ligatures)
              }
              toggled={user.settings.font_ligatures}
              description="When enabled, the editor will have font ligatures"
            />
            <Setting
              title="White Space"
              type="switch"
              onToggle={() =>
                patchUser("render_whitespace", !user.settings.render_whitespace)
              }
              toggled={user.settings.render_whitespace}
              description="When enabled, the editor will render white space."
            />
            <Setting
              title="Word Wrapping"
              type="switch"
              onToggle={() => patchUser("word_wrap", !user.settings.word_wrap)}
              toggled={user.settings.word_wrap}
              description="When enabled, the editor will wrap instead of enabling overflow."
            />
            <Setting
              title="Font size"
              type="dropdown"
              initialValue={user.settings.font_size}
              mode="expiration"
              numberLimit={18}
              onToggle={(e) =>
                patchUser("font_size", parseInt(e?.target.value ?? "12"))
              }
              description="Change font size of the editor!"
            />
            <Setting
              title="Tab size"
              type="dropdown"
              initialValue={user.settings.tab_size}
              mode="expiration"
              numberLimit={8}
              onToggle={(e) =>
                patchUser("tab_size", parseInt(e?.target.value ?? "2"))
              }
              description="How big do you want your tabs?"
            />
            <Setting
              title="Expiration"
              type="dropdown"
              initialValue={user.settings.expiration ?? 0}
              mode="expiration"
              onToggle={(e) =>
                patchUser("expiration", parseInt(e?.target.value ?? "7"))
              }
              description="How long (in days) a document takes to delete."
            />
            <br />
            <Subtitle>Reset password</Subtitle>
            <Input
              label="Current password"
              placeholder="Enter your current password"
              onChange={(e) => setPassword(e.target.value)}
              icon={<Unlock size={18} />}
              iconClick={() => null}
              type="password"
            />
            <Input
              label="New password"
              placeholder="Enter your new password"
              icon={<Lock size={18} />}
              onChange={(e) => setNewPassword(e.target.value)}
              iconClick={() => null}
              type="password"
            />
            <Input
              label="Confirm password"
              placeholder="Re-enter new password."
              icon={<Lock size={18} />}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconClick={() => null}
              type="password"
            />
            <Btn
              onClick={async () => {
                if (newPassword !== confirmPassword)
                  return dispatch(
                    addNotification({
                      icon: <X />,
                      message:
                        "Your new password does not match confirm password",
                      type: "error",
                    }),
                  );

                if (
                  newPassword.length < 8 ||
                  confirmPassword.length < 8 ||
                  password.length < 8
                )
                  return dispatch(
                    addNotification({
                      icon: <X />,
                      message: "Password is not 8 characters long!",
                      type: "error",
                    }),
                  );

                const { error } = await request(
                  "/auth/reset_password",
                  "PATCH",
                  {
                    password: password,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                  },
                );

                if (error)
                  return dispatch(
                    addNotification({
                      icon: <X />,
                      message: error.message,
                      type: "error",
                    }),
                  );

                return dispatch(
                  addNotification({
                    icon: <X />,
                    message: "Successfully changed your password.",
                    type: "success",
                  }),
                );
              }}
              disabled={
                newPassword.length === 0 ||
                password.length === 0 ||
                confirmPassword.length === 0
              }
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
