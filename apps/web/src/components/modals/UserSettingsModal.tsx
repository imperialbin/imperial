import dayjs from "dayjs";
import calender from "dayjs/plugin/calendar";
import updateLocale from "dayjs/plugin/updateLocale";
import { useEffect, useState } from "react";
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
import { ConnectedProps, connect } from "react-redux";

import { addNotification, openModal, setUser } from "@web/state/actions";
import { ImperialState } from "@web/state/reducers";
import { styled } from "@web/stitches.config";
import { Document, SelfUser, UserSettings as UserSettingsType } from "@web/types";
import { makeRequest } from "@web/utils/rest";
import Link from "next/link";
import { getRole } from "@web/utils/permissions";
import Button from "../Button";
import { DiscordLogo, GitHubLogo } from "../Icons";
import Input from "../Input";
import Setting from "../Setting";
import Tooltip from "../Tooltip";
import UserIcon from "../UserIcon";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { AnimatePresence, motion } from "framer-motion";

const Wrapper = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "80%",
  maxWidth: "800px",
  minHeight: "200px",
  height: "60%",
  maxHeight: "80%",
  background: "$primary800",
  borderRadius: "10px",
  overflow: "auto",
});

const Container = styled("div", {
  display: "flex",
  width: "100%",
  height: "100%",
  alignSelf: "baseline",

  "@media (max-width: 680px)": {
    flexDirection: "column",
  },
});

const Overview = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  background: "$primary800",
  boxShadow: "-1px 6px 36px 8px rgba(0, 0, 0, 0.25)",
  padding: "20px",
  borderBottomRightRadius: "12px",
  borderTopRightRadius: "12px",
  overflowY: "scroll",

  // Move logout button to the bottom but make sure theres atleast 15px between the last element and the button
  "& > *:nth-last-child(2)": {
    marginBottom: 15,
  },

  "& > *:last-child": {
    marginTop: "auto",
    alignSelf: "flex-start",
  },

  "@media (max-width: 680px)": {
    height: "unset",
    boxShadow: "unset",
    overflow: "unset",
  },
});

const UserOverview = styled("div", {
  display: "flex",
  alignItems: "center",
  margin: "15px 0 15px 0",
  gap: 15,
});

const Subtitle = styled("h1", {
  fontSize: "1.4em",
  margin: "10px 0",
  color: "$text-white",
});

const UserInfo = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const Username = styled("span", {
  fontSize: "1.5em",
  fontWeight: 600,
  color: "$text-white",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const UserRole = styled("span", {
  fontSize: "1.25em",
  fontWeight: "400",
  opacity: "0.6",
  color: "$text-secondary",

  "> a": {
    fontSize: "0.9rem",
    fontWeight: "400",
    textDecoration: "none",
  },
});

const TileSpan = styled("span", {
  fontSize: "1em",
  fontWeight: 600,
  color: "$text-secondary",
  width: "100%",
});

const Tiles = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "1fr",
  gap: "10px",
  width: "100%",
});

const Tile = styled(motion.div, {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  color: "$text-white",
  background: "$primary700",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  padding: "13px 10px",
  fontSize: "1.2em",
  borderRadius: "8px",
  border: "1px solid $primary400",

  "> span": {
    fontSize: "0.8em",
    opacity: "0.6",
    margin: "0",
    color: "$text-secondary",
  },

  "> div": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    color: "$text-secondary",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "100%",
    textOverflow: "ellipsis",

    "> *": {
      maxWidth: "70%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },

    "> svg": {
      width: "30px",
      height: "auto",
      color: "$text-primary",
    },
  },

  variants: {
    centered: {
      true: {
        alignItems: "center",
      },
    },
    clickable: {
      true: {
        cursor: "pointer",
      },
    },
  },
});

const DocumentTitle = styled("div", {
  display: "flex",
  alignItems: "center",
  width: "100%",

  "> h1": {
    fontSize: "1em",
    color: "$text-primary",
    marginRight: "auto",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  "> div": {
    display: "flex",
    gap: 5,
    color: "$text-secondary",

    "> svg": {
      width: "18px",
      height: "auto",
    },
  },
});

const DocumentSettingIconWrapper = styled("div", {
  "> svg": {
    width: "18px",
    height: "auto",
  },
});

const Settings = styled("div", {
  flexGrow: 1,
  padding: 20,
  overflow: "auto",
  width: "100%",

  "@media (max-width: 680px)": {
    height: "unset",
    overflow: "unset",
  },
});

const InputWrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 15,
});

const ResetButton = styled(Button, {
  alignSelf: "flex-end",
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

const DeleteConnectionContainer = styled(motion.button, {
  background: "unset",
  border: "unset",
  outline: "unset",
  position: "absolute",
  right: 8,
  top: 8,
  cursor: "pointer",
  opacity: 0.8,
  transition: "opacity 0.15s ease-in-out",

  "> svg": {
    width: "16px",
    color: "$error",
  },

  "&:hover": {
    opacity: 1,
  },
});

const DELETE_CONNECTION_ANIMATION = {
  initial: { x: "150%" },
  animate: { x: 0 },
  exit: { x: "150%" },
};

function UserSettings({ user, dispatch, closeModal }: ReduxProps & ModalProps) {
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [iconValue, setIconValue] = useState(
    user?.icon
      ?.match(/[^/]*.png/g)
      ?.toString()
      .replace(".png", ""),
  );
  const [email, setEmail] = useState(user?.email ?? "");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) {
    dispatch(openModal("login"));
    return null;
  }

  const removeConnection = async (connection: "github" | "discord") => {
    const { success, error } = await makeRequest("DELETE", `/oauth/${connection}`);

    if (!success) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An unknown error occurred",
          type: "error",
        }),
      );
    }

    dispatch(
      setUser({
        ...user,
        [connection]: null,
      }),
    );
  };

  const patchUser = async <T extends keyof UserSettingsType>(
    setting: T,
    value: UserSettingsType[T],
  ) => {
    const { success, error, data } = await makeRequest<SelfUser>("PATCH", "/users/@me", {
      settings: {
        [setting]: value,
      },
    });

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

    dispatch(setUser(data));
  };

  const patchUserEmailOrIcon = async (type: "email" | "icon") => {
    if (type === "email" && !/^\S+@\S+\.\S+$/.test(email)) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Invalid email!",
          type: "error",
        }),
      );
    }

    const payload =
      type === "email" ? { email } : { icon: `https://github.com/${iconValue}.png` };

    const { data, error, success } = await makeRequest<SelfUser>(
      "PATCH",
      "/users/@me",
      payload,
    );

    if (!success || !data)
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An unknown error occurred whilst updating user.",
          type: "error",
        }),
      );

    dispatch(
      addNotification({
        icon: <Check />,
        message:
          type === "email" ? "Successfully updated email." : "Successfully updated icon.",
        type: "success",
      }),
    );
    dispatch(setUser(data));
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword)
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Your new password does not match confirm password",
          type: "error",
        }),
      );

    if (newPassword.length < 8 || confirmPassword.length < 8 || password.length < 8)
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Password is not 8 characters long!",
          type: "error",
        }),
      );

    const { success, error } = await makeRequest("POST", "/auth/reset_password", {
      old_password: password,
      new_password: newPassword,
    });

    if (!success)
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst resetting password",
          type: "error",
        }),
      );

    dispatch(
      addNotification({
        icon: <Check />,
        message: "Successfully changed your password.",
        type: "success",
      }),
    );

    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    const fetchRecentDocuments = async () => {
      const { data, error, success } = await makeRequest<Document[]>(
        "GET",
        "/users/@me/recent",
      );

      if (!success || !data) {
        return dispatch(
          addNotification({
            icon: <X />,
            message: error?.message ?? "An unknown error occurred",
            type: "error",
          }),
        );
      }

      setRecentDocuments(data);
    };

    fetchRecentDocuments();
  }, []);

  const userRole = getRole(user.flags);

  return (
    <Wrapper>
      <Header />
      <Container>
        <Overview>
          <UserOverview>
            <UserIcon URL={user.icon ?? "/img/pfp.png"} size={70} />
            <UserInfo>
              <Username>{user.username}</Username>
              <UserRole>
                {userRole}{" "}
                {userRole === "Member" ? (
                  <Link href="/auth/upgrade" onClick={closeModal}>
                    (Upgrade)
                  </Link>
                ) : null}
              </UserRole>
            </UserInfo>
          </UserOverview>
          <Tiles>
            <Tile>
              {user.documents_made}
              <span>Documents Made</span>
            </Tile>
            <Tile>
              {user.early_adopter ? "Early Adopter" : "Late Adopter"}
              <span>Status</span>
            </Tile>
            <Tile
              clickable
              centered
              whileHover="animate"
              initial="initial"
              animate="exit"
              onClick={() => (!user.discord ? window.open("/link/discord") : null)}
            >
              <AnimatePresence>
                {user.discord ? (
                  <DeleteConnectionContainer
                    key="remove_discord"
                    variants={DELETE_CONNECTION_ANIMATION}
                    transition={{ duration: 0.15 }}
                    onClick={() => removeConnection("discord")}
                  >
                    <Trash />
                  </DeleteConnectionContainer>
                ) : null}
              </AnimatePresence>
              <div>
                <DiscordLogo />
                <span>
                  {user.discord
                    ? `${user.discord.username}#${user.discord.discriminator}`
                    : "Connect"}
                </span>
              </div>
            </Tile>

            <Tile
              centered
              clickable
              whileHover="animate"
              initial="initial"
              animate="exit"
              onClick={() => (!user.github ? window.open("/link/github") : null)}
            >
              <AnimatePresence>
                {user.github ? (
                  <DeleteConnectionContainer
                    key="remove_github"
                    variants={DELETE_CONNECTION_ANIMATION}
                    transition={{ duration: 0.15 }}
                    onClick={() => removeConnection("github")}
                  >
                    <Trash />
                  </DeleteConnectionContainer>
                ) : null}
              </AnimatePresence>
              <div>
                <GitHubLogo />
                {user.github ? user.github.login : "Connect"}
              </div>
            </Tile>
          </Tiles>
          <Subtitle>Recent Documents</Subtitle>
          {recentDocuments.length > 0 ? (
            <Tiles>
              {recentDocuments.map((document) => (
                <Link
                  key={document.id}
                  style={{ display: "inherit" }}
                  href={`/${document.id}`}
                  onClick={closeModal}
                >
                  <Tile>
                    <DocumentTitle>
                      <h1>{document.id}</h1>
                      <div>
                        {document.settings.public ? (
                          <Tooltip title="Public Document">
                            <DocumentSettingIconWrapper>
                              <Eye />
                            </DocumentSettingIconWrapper>
                          </Tooltip>
                        ) : null}

                        {document.settings.encrypted ? (
                          <Tooltip title="Encrypted">
                            <DocumentSettingIconWrapper>
                              <Lock />
                            </DocumentSettingIconWrapper>
                          </Tooltip>
                        ) : null}

                        {document.settings.instant_delete ? (
                          <Tooltip title="Deletes after being viewed">
                            <DocumentSettingIconWrapper>
                              <Eye color="var(--error)" />
                            </DocumentSettingIconWrapper>
                          </Tooltip>
                        ) : null}
                      </div>
                    </DocumentTitle>
                    <span>
                      {document.timestamps.expiration
                        ? `Deletes ${dayjs(document.timestamps.expiration).calendar()}`
                        : "Never expires"}
                    </span>
                  </Tile>
                </Link>
              ))}
            </Tiles>
          ) : (
            <TileSpan>You have no recent documents</TileSpan>
          )}
          <Button>
            <ArrowLeft color="var(--error)" />
            Logout
          </Button>
        </Overview>
        <Settings>
          <Subtitle>Information</Subtitle>
          <InputWrapper>
            <Input
              key={user.icon}
              label="User Icon"
              placeholder="GitHub username"
              button={{
                svg: <Check size={18} />,
                hideUntilChanged: true,
                hoverColor: "var(--success)",
                tooltip: "Update icon",
                async onClick() {
                  patchUserEmailOrIcon("icon");
                },
              }}
              value={iconValue}
              onChange={(e) => {
                setIconValue(e.target.value);
              }}
            />
            <Input
              label="Email"
              placeholder="Your email"
              value={email}
              button={{
                svg: <Edit />,
                tooltip: "Update email",
                hideUntilChanged: true,
                hoverColor: "var(--success)",
                async onClick() {
                  patchUserEmailOrIcon("email");
                },
              }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              secretValue
              disabled
              label="API Token"
              placeholder="API Token"
              value={user.api_token}
              button={{
                svg: <RefreshCw size={18} />,
                tooltip: "Regenerate API Token",
                async onClick() {
                  const { data, error } = await makeRequest<SelfUser>(
                    "POST",
                    "/users/@me/regenerate_api_token",
                    {},
                  );

                  if (error || !data)
                    return dispatch(
                      addNotification({
                        icon: <X />,
                        message: "An error occurred whilst regenerating your API token.",
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
                  dispatch(setUser(data));
                },
              }}
            />
          </InputWrapper>
          <Subtitle>Editor Settings</Subtitle>
          {/*           <Setting
            title="Clipboard"
            type="switch"
            toggled={user.settings.clipboard}
            description="Let IMPERIAL automatically paste your clipboard."
            onToggle={() => patchUser("clipboard", !user.settings.clipboard)}
          /> */}
          <Setting
            title="Longer URLs"
            type="switch"
            toggled={user.settings.long_urls}
            description="Create 32 character URLs."
            onToggle={() => patchUser("long_urls", !user.settings.long_urls)}
          />
          <Setting
            title="Short URLs"
            type="switch"
            toggled={user.settings.short_urls}
            description="Create 4 character URLs."
            onToggle={() => patchUser("short_urls", !user.settings.short_urls)}
          />
          <Setting
            title="Instant Delete"
            type="switch"
            toggled={user.settings.instant_delete}
            description="Instantly delete the document after being viewed."
            onToggle={() => patchUser("instant_delete", !user.settings.instant_delete)}
          />
          <Setting
            title="Encrypted"
            type="switch"
            toggled={user.settings.encrypted && userRole === "Member+"}
            description="Encrypt documents with AES256 encryption."
            disabled={userRole !== "Member+"}
            disabledText="You must be a Member+ to use this feature."
            onToggle={() => patchUser("encrypted", !user.settings.encrypted)}
          />
          <Setting
            title="Image Embed"
            type="switch"
            toggled={user.settings.image_embed && userRole === "Member+"}
            description="Have a sneak peak at a document's content with Open Graph embeds"
            disabled={userRole !== "Member+"}
            disabledText="You must be a Member+ to use this feature."
            onToggle={() => patchUser("image_embed", !user.settings.image_embed)}
          />
          <Setting
            title="Create Gist"
            type="switch"
            disabled={!user.github}
            disabledText="You must have GitHub connected."
            toggled={user.settings.create_gist && Boolean(user.github)}
            description="Save all your IMPERIAL documents to your GitHub account with gists."
            onToggle={() => patchUser("create_gist", !user.settings.create_gist)}
          />
          <Setting
            title="Font Ligatures"
            type="switch"
            toggled={user.settings.font_ligatures}
            description="When enabled, the editor will have font ligatures"
            onToggle={() => patchUser("font_ligatures", !user.settings.font_ligatures)}
          />
          <Setting
            title="White Space"
            type="switch"
            toggled={user.settings.render_whitespace}
            description="When enabled, the editor will render white space."
            onToggle={() =>
              patchUser("render_whitespace", !user.settings.render_whitespace)
            }
          />
          <Setting
            title="Word Wrapping"
            type="switch"
            toggled={user.settings.word_wrap}
            description="When enabled, the editor will wrap instead of enabling overflow."
            onToggle={() => patchUser("word_wrap", !user.settings.word_wrap)}
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
            description="Change font size of the editor!"
            onSelect={(item) => patchUser("font_size", item.value)}
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
            description="How big do you want your tabs?"
            onSelect={(item) => patchUser("tab_size", item.value)}
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
                value: 7,
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
            description="How long (in days) a document takes to delete."
            onSelect={(item) => patchUser("expiration", item.value)}
          />
          <Subtitle>Reset Password</Subtitle>
          <InputWrapper>
            <Input
              label="Current password"
              placeholder="Enter your current password"
              icon={{
                svg: <Unlock size={18} />,
              }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="New password"
              placeholder="Enter your new password"
              icon={{
                svg: <Lock size={18} />,
              }}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm password"
              placeholder="Re-enter new password."
              icon={{
                svg: <Lock size={18} />,
              }}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <ResetButton
              disabled={
                newPassword.length === 0 ||
                password.length === 0 ||
                confirmPassword.length === 0
              }
              onClick={resetPassword}
            >
              Reset password
            </ResetButton>
          </InputWrapper>
        </Settings>
      </Container>
    </Wrapper>
  );
}

const mapStateToProps = ({ user }: ImperialState) => ({
  user,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(UserSettings);
