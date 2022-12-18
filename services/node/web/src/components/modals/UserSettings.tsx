import { useCallback, useState } from "react";
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
import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
import { connect, ConnectedProps } from "react-redux";

import Input from "../Input";
import { UserIcon } from "../UserIcon";

import Header from "./base/Header";
import { SelfUser, UserSettings as UserSettingsType } from "../../types";
import { getRole } from "../../utils/Permissions";
import { ModalProps } from "./base/modals";
import { Link } from "react-router-dom";
import { makeRequest } from "../../utils/Rest";
import { styled } from "../../stitches";
import {
  addNotification,
  closeModal,
  openModal,
  setUser,
} from "../../state/actions";
import Tooltip from "../Tooltip";
import { ImperialState } from "../../state/reducers";
import Setting from "../Setting";
import { useRecentDocuments } from "../../hooks/useRecentDocuments";
import { DiscordLogo, GitHubLogo } from "../Icons";
import Button from "../Button";
import CopyToClipboard from "react-copy-to-clipboard";

const Wrapper = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "80%",
  maxWidth: "800px",
  minHeight: "200px",
  height: "50%",
  maxHeight: "80%",
  background: "$secondary", // needs to be changed to
  borderRadius: "10px",
  overflow: "hidden",
});

const Container = styled("div", {
  display: "inline-flex",
  height: "100%",
});

const Overview = styled("div", {
  flex: "1.25",
  background: "$secondary",
  boxShadow: "-1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25)",
  padding: "10px",
  borderBottomRightRadius: "12px",
  borderTopRightRadius: "12px",
  overflowY: "scroll",
});

const UserOverview = styled("div", {
  overflowY: "scroll",
  display: "flex",
  alignItems: "center",
  margin: "15px 0 15px 0",
});

const Subtitle = styled("h1", {
  fontSize: "1.4em",
  margin: "10px 0",
  color: "$text-white",
});

const UserInfo = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const Username = styled("span", {
  fontSize: "1.5em",
  fontWeight: 600,
  color: "$text-white",
});

const UserID = styled("span", {
  fontSize: "1.25em",
  fontWeight: "400",
  opacity: "0.6",
  color: "$text-secondary",
});

const Settings = styled("div", {
  flex: 1,
  padding: "10px 30px",
  overflowY: "scroll",
});

const Tiles = styled("div", {
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  gap: 10,

  "> a, > div": {
    flex: "1 1",
    minWidth: "48%",
  },
});

const InputWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

const Tile = styled("div", {
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "13px 10px",
  minHeight: "73px",
  borderRadius: "8px",
  flex: 1,
  fontSize: "1.2em",
  color: "$text-white",
  background: "$tertiary",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",

  "> svg": {
    width: "30px",
    height: "auto",
    marginRight: "13px",
  },

  "> span": {
    paddingRight: 10,
  },
});

const TileBtns = styled("div", {
  position: "absolute",
  top: "0px",
  right: "8px",
});

const TileBtn = styled("div", {
  display: "inline-block",
  margin: "15px 5px",
  color: "$text-secondary",
  cursor: "pointer",
  transition: "color 0.2s ease-in-out",

  "&:hover": {
    color: "$test-primary",
  },
});

const TitleInfo = styled("p", {
  fontSize: "0.8em",
  opacity: "0.6",
  margin: "0",
  color: "$text-secondary",
});

const HeaderParagraph = styled("p", {
  fontSize: "1em",
  margin: "0",
  marginBottom: 10,
  color: "$text-secondary",
});

const NotFoundSpan = styled("span", {
  marginLeft: 12,
  color: "$text-muted",
});

const StyledEditBtn = styled(Edit, {
  "&:hover": {
    color: "$success",
  },
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

const UserSettings = ({
  user,
  dispatch,
}: ReduxProps & ModalProps): JSX.Element => {
  const documents = useRecentDocuments();

  const [iconValue, setIconValue] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const patchUser = useCallback(
    async <T extends keyof UserSettingsType>(
      setting: T,
      value: UserSettingsType[T]
    ) => {
      const { success, error, data } = await makeRequest<{ user: SelfUser }>(
        "PATCH",
        "/users/@me",
        {
          settings: {
            [setting]: value,
          },
        }
      );

      if (!success || !data)
        return dispatch(
          addNotification({
            icon: <X />,
            message: error?.message ?? "An unknown error occurred",
            type: "error",
          })
        );

      dispatch(
        addNotification({
          icon: <Check />,
          message: "Successfully updated user settings",
          type: "success",
        })
      );

      dispatch(setUser(data.user));
    },
    []
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
              <Tile
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {user.documents_made}
                <TitleInfo>Documents made</TitleInfo>
              </Tile>
              <Tile
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {getRole(user.flags)}
                <TitleInfo>Role</TitleInfo>
              </Tile>
              <Tile
                style={!user.discord ? { cursor: "pointer" } : {}}
                onClick={() =>
                  !user.discord ? window.open("/link/discord") : null
                }
              >
                <DiscordLogo />
                <TitleInfo style={{ fontSize: "1em" }}>
                  {user.discord ? "Connected" : "Connect"}
                </TitleInfo>
              </Tile>
              <Tile
                style={!user.github ? { cursor: "pointer" } : undefined}
                onClick={() =>
                  !user.github ? window.open("/link/github") : null
                }
              >
                <GitHubLogo />
                <TitleInfo style={{ fontSize: "1em" }}>
                  {user.github ? "Connected" : "Connect"}
                </TitleInfo>
              </Tile>
            </Tiles>
            <Subtitle>Recent documents</Subtitle>
            <Tiles>
              {documents && documents.length > 0 ? (
                documents.map((document, key) => {
                  return (
                    <Link
                      style={{ display: "flex" }}
                      to={`/${document.id}`}
                      state={document}
                      key={key}
                    >
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
                          {document.settings.instant_delete ? (
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
                              <Trash size={15} />
                            </TileBtn>
                          </Tooltip>
                        </TileBtns>
                        <span>{document.id}</span>
                        <TitleInfo>
                          {document.timestamps.expiration &&
                          !isNaN(
                            Date.parse(
                              document.timestamps.expiration.toString()
                            )
                          ) ? (
                            <>
                              Deletes{" "}
                              {dayjs(document.timestamps.expiration).calendar()}
                            </>
                          ) : (
                            "Never expires"
                          )}
                        </TitleInfo>
                      </Tile>
                    </Link>
                  );
                })
              ) : (
                <NotFoundSpan>You have no recent documents.</NotFoundSpan>
              )}
            </Tiles>
            <br />

            <Subtitle style={{ margin: 0 }}>Devices</Subtitle>
            <HeaderParagraph>
              View all devices logged into your IMPERIAL account
            </HeaderParagraph>
            <Button
              style={{ marginBottom: 25 }}
              onClick={() => dispatch(openModal("devices"))}
            >
              View Devices
            </Button>

            <br />
            <Link to="/logout">
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ArrowLeft
                  size={15}
                  style={{ color: "var(--error)", marginRight: 10 }}
                />
                Logout
              </Button>
            </Link>
            <br />
          </Overview>

          <Settings>
            <Subtitle>Information</Subtitle>
            <InputWrapper>
              <Input
                label="User Icon"
                placeholder="GitHub username"
                icon={<Check size={18} />}
                value={user.icon
                  ?.match(/[^/]*.png/g)
                  ?.toString()
                  .replace(".png", "")}
                iconHoverColor="var(--success)"
                tooltipTitle="Update icon"
                onChange={(e) => setIconValue(e.target.value)}
                iconPosition="right"
                iconClick={async () => {
                  const { data, error, success } = await makeRequest<{
                    user: SelfUser;
                  }>("PATCH", "/users/@me", {
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
                      })
                    );

                  dispatch(
                    addNotification({
                      icon: <Check />,
                      message: "Successfully changes your icon",
                      type: "success",
                    })
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
                icon={<StyledEditBtn />}
                tooltipTitle="Update email"
                iconPosition="right"
                iconClick={async () => {
                  if (!/^\S+@\S+\.\S+$/.test(email))
                    return dispatch(
                      addNotification({
                        icon: <X />,
                        message: "Invalid email!",
                        type: "error",
                      })
                    );

                  const { data, error } = await makeRequest<{ user: SelfUser }>(
                    "PATCH",
                    "/users/@me",
                    {
                      email,
                    }
                  );

                  if (error || !data)
                    return dispatch(
                      addNotification({
                        icon: <X />,
                        message:
                          "An error occurred whilst changing your email.",
                        type: "error",
                      })
                    );

                  dispatch(
                    addNotification({
                      icon: <Check />,
                      message: "Successfully changed your email.",
                      type: "success",
                    })
                  );
                  dispatch(setUser(data.user));
                }}
                hideIconUntilDifferent
              />
              <CopyToClipboard
                text={user.api_token}
                onCopy={() =>
                  dispatch(
                    addNotification({
                      icon: <Check />,
                      message: "Copied API Token",
                      type: "success",
                    })
                  )
                }
              >
                <Tooltip
                  title="Click to copy API Token"
                  placement="bottom-start"
                >
                  <Input
                    label="API Token"
                    placeholder="API Token"
                    value={user.api_token}
                    icon={<RefreshCw size={18} />}
                    iconPosition="right"
                    iconClick={async () => {
                      const { data, error } = await makeRequest<{
                        token: string;
                      }>("POST", "/users/@me/regenAPIToken");

                      if (error || !data)
                        return dispatch(
                          addNotification({
                            icon: <X />,
                            message:
                              "An error occurred whilst regenerating your API token.",
                            type: "error",
                          })
                        );

                      dispatch(
                        addNotification({
                          icon: <Check />,
                          message: "Successfully regenerated your API Token",
                          type: "success",
                        })
                      );
                      dispatch(setUser({ ...user, api_token: data.token }));
                    }}
                    secretValue
                    inputDisabled
                  />
                </Tooltip>
              </CopyToClipboard>
            </InputWrapper>
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
              type="dropdown"
              title="Font size"
              items={Array(18)
                .fill(0)
                .map((_, i) => ({
                  title: `${i + 1}`,
                  value: i + 1,
                  selected: user.settings.font_size === i + 1,
                }))}
              onSelect={(item) => patchUser("font_size", item.value)}
              description="Change font size of the editor!"
            />
            <Setting
              title="Tab size"
              type="dropdown"
              items={Array(8)
                .fill(0)
                .map((_, i) => ({
                  title: `${i + 1}`,
                  value: i + 1,
                  selected: user.settings.tab_size === i + 1,
                }))}
              onSelect={(item) => patchUser("tab_size", item.value)}
              description="How big do you want your tabs?"
            />
            <Setting
              title="Expiration"
              type="dropdown"
              items={[
                {
                  title: "Never",
                  value: null,
                  selected: user.settings.expiration === null,
                },
                {
                  title: "1 day",
                  value: 1,
                  selected: user.settings.expiration === 1,
                },
                {
                  title: "7 days",
                  value: 2,
                  selected: user.settings.expiration === 7,
                },
                {
                  title: "1 month",
                  value: 30,
                  selected: user.settings.expiration === 30,
                },
                {
                  title: "2 months",
                  value: 60,
                  selected: user.settings.expiration === 60,
                },
                {
                  title: "3 months",
                  value: 90,
                  selected: user.settings.expiration === 90,
                },
                {
                  title: "6 months",
                  value: 180,
                  selected: user.settings.expiration === 180,
                },
                {
                  title: "1 year",
                  value: 365,
                  selected: user.settings.expiration === 365,
                },
              ]}
              onSelect={(item) => patchUser("expiration", item.value)}
              description="How long (in days) a document takes to delete."
            />
            <br />
            <Subtitle>Reset password</Subtitle>
            <InputWrapper>
              <Input
                label="Current password"
                placeholder="Enter your current password"
                onChange={(e) => setPassword(e.target.value)}
                icon={<Unlock size={18} />}
                type="password"
              />
              <Input
                label="New password"
                placeholder="Enter your new password"
                icon={<Lock size={18} />}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
              />
              <Input
                label="Confirm password"
                placeholder="Re-enter new password."
                icon={<Lock size={18} />}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
              />
              <Button
                style={{ alignSelf: "flex-start" }}
                onClick={async () => {
                  if (newPassword !== confirmPassword)
                    return dispatch(
                      addNotification({
                        icon: <X />,
                        message:
                          "Your new password does not match confirm password",
                        type: "error",
                      })
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
                      })
                    );

                  const { error } = await makeRequest(
                    "PATCH",
                    "/auth/reset_password",
                    {
                      password: password,
                      new_password: newPassword,
                      confirm_password: confirmPassword,
                    }
                  );

                  if (error)
                    return dispatch(
                      addNotification({
                        icon: <X />,
                        message:
                          error.message ??
                          "An error occurred whilst resetting password",
                        type: "error",
                      })
                    );

                  return dispatch(
                    addNotification({
                      icon: <X />,
                      message: "Successfully changed your password.",
                      type: "success",
                    })
                  );
                }}
                disabled={
                  newPassword.length === 0 ||
                  password.length === 0 ||
                  confirmPassword.length === 0
                }
              >
                Reset password
              </Button>
            </InputWrapper>
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
