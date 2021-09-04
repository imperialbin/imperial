import styled from "styled-components";
import Link from "next/link";

const ListContainer = styled.ul`
  list-style: none;
`;

const ListItem = styled.li`
  cursor: pointer;
`;

export const LoggedInTooltip = (): JSX.Element => {
  return (
    <ListContainer>
      <Link href="/account">
        <ListItem>User settings</ListItem>
      </Link>
      <Link href="/logout">
        <ListItem>Logout</ListItem>
      </Link>
    </ListContainer>
  );
};
