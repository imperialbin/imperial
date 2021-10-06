import { motion } from "framer-motion";
import { useState } from "react";
import { FaCheck, FaEnvelope } from "react-icons/fa";
import styled from "styled-components";
import { Input } from "..";
import { request } from "../../../utils";
import { HeaderSecondary } from "./styles";

import Image from "next/image";

const FullContainer = styled.div`
  display: inline-flex;
  height: 100%;
  width: 100%;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.8;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.layoutDark};
  box-shadow: -1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25);
  padding: 10px;
  border-bottom-right-radius: 12px;
  border-top-right-radius: 12px;
`;

const LeftBtn = styled.button`
  border: none;
  border-radius: 5px;
  margin-top: 8px;
  padding: 10px 15px;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.8;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.layoutDarkest};
  box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:last-of-type {
    margin-top: 15px;
  }
`;

const Right = styled.div`
  flex: 1.25;
  max-height: 300px;
  padding: 10px 30px;
  overflow: scroll;
`;

const BtnContainer = styled.div`
  align-self: flex-start;
  margin-left: 10px;
`;

const Subtitle = styled.h1`
  font-size: 1.2em;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textLight};
`;

const Container = styled.form``;

const SuccessContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 40px;
`;

const Check = styled(FaCheck)`
  color: ${({ theme }) => theme.success};
`;

const SuccessTitle = styled.h1`
  text-align: center;
  font-size: 1.4em;
  font-weight: 500;
  margin-bottom: 0;
  color: ${({ theme }) => theme.textDarker};
`;

const SuccessSpan = styled.span`
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  color: ${({ theme }) => theme.textDarker}8d;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Error = styled.span`
  color: ${({ theme }) => theme.error};
  font-size: 1.2em;
`;

const showAnimation = {
  initial: {
    opacity: 0,
    transform: "scale(0.95)",
  },
  animate: {
    opacity: 1,
    transform: "scale(1)",
  },
};

export const ResetPassword = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email) return setError("You need to have a email");

    const { data, error } = await request("/auth/requestReset", "POST", {
      email,
    });
    setLoading(false);

    if (!data.success && error) return setError(data.message);

    setLoading(false);
    setSuccess(true);
  };

  return (
    <FullContainer>
      <Left>
        <Image
          src="/img/logo_transparent.png"
          width={90}
          height={80}
          draggable={false}
        />
      </Left>
      <Right>
        {error && (
          <>
            <br />
            <Error>{error}</Error>
            <br />
          </>
        )}
        {!success ? (
          <>
            <Subtitle>Reset your password.</Subtitle>
            <Container onSubmit={submit}>
              <Input
                label="Email"
                icon={<FaEnvelope />}
                iconClick={() => null}
                iconDisabled={true}
                placeholder="Enter your email"
                onChange={e => setEmail(e.target.value)}
                inputProps={{ required: true, type: "email" }}
              />
              <Btn disabled={loading} type="submit">
                Request reset
              </Btn>
            </Container>
            <br />
            <br />
          </>
        ) : (
          <SuccessContainer
            transition={{ duration: 0.25 }}
            variants={showAnimation}
            initial="initial"
            animate="animate"
            exit="initial"
          >
            <Check size={40} />
            <SuccessTitle>
              Successfully requested a password reset!
            </SuccessTitle>
            <SuccessSpan>Make sure to check your email ({email})</SuccessSpan>
            <br />
            <br />
          </SuccessContainer>
        )}
      </Right>
    </FullContainer>
  );
};
