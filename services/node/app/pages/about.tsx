import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { GitHubUser } from "../types/GitHubUser";
import { Banner } from "../components/ui";

const Contributor = styled(Image)`
  border-radius: 8px;
  margin-right: 12px;
  padding: 500px;
  transition: all 300ms ease;
  margin-bottom: 8px;

  &:hover {
    opacity: 0.8;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const AboutContainer = styled.div`
  font-size: 16px;
  max-width: 750px;

  @media (max-width: 768px) {
    max-width: 90vw;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: -5px;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
`;

const Text = styled.p`
  font-size: 1rem;
`;

const Contributors = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/imperialbin/imperial/contributors?per_page=100",
    )
      .then(response => response.json())
      .then(contributors =>
        setContributors(
          contributors.filter(
            (contributor: GitHubUser) => !contributor.login.endsWith("[bot]"),
          ),
        ),
      );
  }, []);

  return (
    <div>
      {contributors.map((contributor: GitHubUser) => (
        <a
          key={contributor.id}
          href={contributor.html_url}
          target="_blank"
          rel="noreferrer"
        >
          <Contributor
            alt={contributor.login}
            src={contributor.avatar_url}
            width={32}
            height={32}
          />
        </a>
      ))}
    </div>
  );
};

const About: NextPage = () => (
  <Wrapper>
    <AboutContainer>
      <Banner />
      <Title>About Imperial</Title>
      <Text>
        Imperial is a open source, free, and fast way to share text, focusing on
        user experience. With Imperial, you can share small snippets of text,
        passwords, API keys, code and more.
      </Text>
      <Text>Here are some features Imperial offers:</Text>
      <p>&#8226; Encryption</p>
      <p>&#8226; Customizability</p>
      <p>&#8226; Supports 56+ coding languages</p>
      <p>&#8226; Integration with GitHub Gists & Discord</p>
      <p>&#8226; Official Discord Bot</p>
      <p>&#8226; API Wrappers</p>
      <Subtitle>Contributors</Subtitle>

      <Contributors />
    </AboutContainer>
  </Wrapper>
);

export default About;
