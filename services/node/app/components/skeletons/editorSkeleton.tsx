import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 0 10px;
`;

const CodeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Lines = styled.div`
  display flex;
  flex-direction: column;
`;

const Line = styled.span`
  display: block;
`;

export const EditorSkeleton = (): JSX.Element => {
  return (
    <Container>
      <Lines>
        <Line>1</Line>
        <Line>2</Line>
        <Line>3</Line>
        <Line>4</Line>
        <Line>5</Line>
        <Line>6</Line>
        <Line>7</Line>
        <Line>8</Line>
        <Line>9</Line>
      </Lines>
      <CodeContainer>
        {[...Array(10)].map((_, i) => {
          return (
            <Skeleton
              style={{ display: "block", marginTop: 2 }}
              key={i}
              width={Math.floor(Math.random() * 200) + 50}
              height={16}
            />
          );
        })}
      </CodeContainer>
    </Container>
  );
};
