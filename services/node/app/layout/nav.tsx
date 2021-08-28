import { NavProps } from "../types";
import Link from "next/link";
import styled from "styled-components";
import { UserIcon } from "../components/userIcon";
import { request } from "../utils/requestWrapper";
import Router from "next/router";

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  z-index: 9999;
  background: tomato;
  border-bottom-left-radius: 15px;
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
  const createDocument = async () => {
    if (typeof window === "undefined") return;
    if (!window.monaco) return;

    const content = window.monaco.editor.getModels()[0].getValue();
    const language =
      window.monaco.editor.getModels()[0]._languageIdentifier.language;

    if (content < 1) return;

    const { data, error } = await request("/document", "POST", {
      content,
      settings: {
        language,
      },
    });

    if (error) console.log(error);

    console.log(data.data);
    Router.push(`/${data.data.id}`);
  };
  return (
    <Container>
      <Link href="/">
        <Brand>IMPERIAL</Brand>
      </Link>
      <Buttons>
        <Btn onClick={createDocument}>p</Btn>
        <Btn>l</Btn>
        <Btn>e</Btn>
        <Btn>s</Btn>
        <Btn>n</Btn>
        {user ? <UserIcon URL={user.icon} /> : <UserIcon URL="/img/pfp.png" />}
      </Buttons>
    </Container>
  );
};
