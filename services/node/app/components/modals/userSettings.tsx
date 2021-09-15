import { FaCheck, FaEdit, FaRedo } from "react-icons/fa";
import styled from "styled-components";
import { Input, UserIcon } from "..";
import { useUser } from "../../hooks";
import { ThemeForStupidProps } from "../../types";

const Container = styled.div`
  display: flex;
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
  padding: 10px 15px;
`;

const Tiles = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Tile = styled.div`
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  font-size: 1.2em;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  background: ${({ theme }: ThemeForStupidProps) =>
    theme.layoutLightestOfTheBunch};
`;

const TileIcon = styled.img`
  width: 20%;
  height: auto;
`;

const TitleInfo = styled.p`
  font-size: 0.8em;
  opacity: 0.6;
  margin: 0;
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
              <Tile>
                {user.documentsMade}
                <TitleInfo>Documents made</TitleInfo>
              </Tile>
              <Tile>
                <TileIcon src="/img/discord.svg" />
                {user.discordId ? user.discordId : "Connect"}
              </Tile>
              <Tile>
                <TileIcon src="/img/github.svg" />
                {user.githubAccess ? user.githubAccess : "Connect"}
              </Tile>
            </Tiles>
          </Overview>

          <Settings>
            <Subtitle>Information</Subtitle>
            <Input
              label="User Icon"
              placeholder="GitHub username or Gravatar email"
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
            />
          </Settings>
        </Container>
      ) : (
        "Loading"
      )}
    </>
  );
};
