import { motion, Variants } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { X } from "react-feather";
import styled from "styled-components";
import { GitHubLogo, Logo } from "../../components/Icons";
import { request } from "../../utils/Request";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 25px;
  left: 25px;

  svg {
    height: 55px;
  }
`;

const BrandContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;

  & > svg {
    height: 50px;
  }
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  max-width: 550px;
  width: 90%;
  background: ${({ theme }) => theme.background.darkest};
  box-shadow: -1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25);
`;

const Title = styled.h1`
  font-size: 2em;
`;

const Paragraph = styled.p`
  font-size: 1.15em;
  max-width: 40ch;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.text.dark};
`;

const StyledGitHubLogo = styled(GitHubLogo)`
  color: #acacac;
`;

const StyledX = styled(X)<{ error: boolean; success: boolean }>`
  color: ${({ theme, error, success }) =>
    error
      ? theme.system.error
      : success
      ? theme.system.success
      : theme.text.dark};
  margin: 0 25px;

  transition: color 0.15s ease-in-out;
`;

const CONTAINER_ANIMATION: Variants = {
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  initial: {
    y: 10,
    opacity: 0.8,
    scale: 0.95,
  },
};

const GitHub = () => {
  const [paragraphText, setParagraphText] = useState(
    "We're linking your GitHub with your IMPERIAL account.",
  );
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const code = router.query.code;
    if (!code) return;

    const fetchCallback = async () => {
      const { success } = await request(
        "GET",
        `/oauth/github/callback?code=${router.query.code}`,
      );

      if (!success) {
        setError(true);
        return setParagraphText(
          "There was an error connecting your GitHub account with your IMPERIAL account.",
        );
      }

      setError(false);
      setSuccess(true);
      setParagraphText(
        "Successfully connected your GitHub account with your IMPERIAL account. You can close this tab.",
      );
    };

    fetchCallback();
  }, [router]);

  return (
    <Wrapper>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <ContentWrapper
        animate="animate"
        initial="initial"
        variants={CONTAINER_ANIMATION}
      >
        <BrandContainer>
          <StyledGitHubLogo />
          <StyledX error={error} success={success} />
          <Logo />
        </BrandContainer>
        <Title>Connecting your GitHub</Title>
        <Paragraph>{paragraphText}</Paragraph>
      </ContentWrapper>
    </Wrapper>
  );
};

export default GitHub;
