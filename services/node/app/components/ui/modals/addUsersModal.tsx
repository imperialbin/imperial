import { useState } from "react";
import { useAtom } from "jotai";
import styled from "styled-components";
import { documentEditors } from "../../../state/modal";
import {
  FadeAnimation,
  FadeSlideUpAnimation,
  HeaderSecondary,
  Search,
} from "./styles";
import { request } from "../../../utils/requestWrapper";
import { DocumentEditor } from "../../../types";
import { Tooltip } from "../tooltip";
import { UserIcon } from "../userIcon";
import { FaUserMinus, FaUserPlus, FaUserSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const UserSearch = styled.div`
  color: ${({ theme }) => theme.textDarker};
`;

const AddInput = styled(Search)`
  margin: 10px 15px 0;
`;

const User = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 300px;
`;

const Username = styled.p`
  margin-left: 10px;
  font-weight: 400;
  font-size: 1.1em;
  flex-grow: 1;
`;

const NoEditors = styled(motion.div)`
  display: flex;
  height: 140px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  user-select: none;
  color: ${({ theme }) => theme.textDarker};
`;

export const AddUsersModal = (): JSX.Element => {
  const [editors, setEditors] = useAtom(documentEditors);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const removeEditor = (username: string) =>
    setEditors(editors.filter(user => user.username !== username));

  return (
    <>
      <HeaderSecondary>
        Who do you want to add to this document?
      </HeaderSecondary>
      {error && error}
      <UserSearch>
        <FaUserPlus size={18} />
        <AddInput
          onChange={e => setInput(e.target.value)}
          placeholder="Username"
          value={input}
          onKeyDown={async ({ key }) => {
            if (key === "Enter" && input.length > 0) {
              if (editors.some(user => user.username === input))
                return setError("You cannot add a person twice!");

              const { data, error } = await request(`/user/${input}`, "GET");

              if (error) return setError(error);

              setEditors([...editors, data.data]);
              setInput("");
            }
          }}
          autoFocus
        />
      </UserSearch>
      {editors.length > 0 ? (
        <>
          {editors.map((user: DocumentEditor, key: number) => (
            <User
              transition={{ duration: 0.2 }}
              variants={FadeAnimation}
              key={key}
            >
              <UserIcon height={30} width={30} URL={user.icon} />
              <Username>{user.username}</Username>
              <Tooltip
                style={{ display: "inline-flex" }}
                title={`Remove ${user.username}`}
              >
                <FaUserMinus
                  style={{ cursor: "pointer" }}
                  onClick={() => removeEditor(user.username)}
                />
              </Tooltip>
            </User>
          ))}
        </>
      ) : (
        <NoEditors
          transition={{ duration: 0.3 }}
          variants={FadeSlideUpAnimation}
        >
          <FaUserSlash size={50} />
          <p>There are no allowed editors for this document.</p>
        </NoEditors>
      )}
    </>
  );
};
