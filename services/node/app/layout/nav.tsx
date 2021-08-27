import { NavProps } from "../types";
import Link from "next/link";
import styled from "styled-components";
import { UserIcon } from "../components/userIcon";

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  z-index: 9999;
  background: tomato;
`;

const Brand = styled.h1`
  text-align: center;
  font-size: 1em;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0 20px 10px;
`;

const Btn = styled.button`
  margin: 0 10px;
`;

export const Nav = ({ user }: NavProps): JSX.Element => {
  return (
    <Container>
      <Link href="/">
        <Brand>IMPERIAL</Brand>
      </Link>
      <Buttons>
        <Btn>p</Btn>
        <Btn>l</Btn>
        <Btn>e</Btn>
        <Btn>s</Btn>
        <Btn>n</Btn>
        {user ? <UserIcon URL={user.icon} /> : <UserIcon URL="/img/pfp.png" />}
      </Buttons>
    </Container>
  );
};
