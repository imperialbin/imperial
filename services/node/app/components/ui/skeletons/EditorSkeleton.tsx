import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import {} from "../../../types";

const Container = styled.div`
  display: flex;
  flex-direction row;
  width: 100vw;
  height: 100vh;
  padding: 0 30px;
  font-size: 14px;
  margin-top: 5px;
`;

const CodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 25px;
`;

export const EditorSkeleton = (): JSX.Element => (
  <Container>
    <CodeContainer>
      {[...Array(9)].map((_, i) => (
        <Skeleton
          duration={0.5}
          style={{ display: "inline-block", marginTop: 3 }}
          key={i}
          width={Math.floor(Math.random() * 200) + 100}
          height={16}
        />
      ))}
      <Skeleton
        duration={0.5}
        style={{ marginTop: 48 }}
        width={300}
        height={16}
      />
      {[...Array(18)].map((_, i) => {
        const randomChance = Math.floor(Math.random() * 200);
        return (
          <Skeleton
            duration={0.5}
            style={{
              display: "block",
              margin: `${randomChance > 20 ? "3px" : "16px"} 25px`,
            }}
            key={i}
            width={randomChance + 120}
            height={16}
          />
        );
      })}
      <Skeleton
        duration={0.5}
        style={{ marginTop: 3 }}
        width={30}
        height={16}
      />
      <Skeleton
        duration={0.5}
        style={{ marginTop: 48 }}
        width={280}
        height={16}
      />
    </CodeContainer>
  </Container>
);
