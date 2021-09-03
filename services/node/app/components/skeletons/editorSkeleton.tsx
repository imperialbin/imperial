import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { ThemeForStupidProps } from "../../types";

const Container = styled.div`
  display: flex;
  flex-direction row;
  width: 100vw;
  height: 100vh;
  padding: 0 30px;
  font-size: 14px;
`;

const CodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 25px;
`;

const Lines = styled.div`
  display flex;
  flex-direction: column;
`;

const Line = styled.span`
  display: block;
  font-size: 12px;
  margin-top: 1.8px;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLightest};
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
        <Line>10</Line>
        <Line>11</Line>
        <Line>12</Line>
        <Line>13</Line>
        <Line>14</Line>
        <Line>15</Line>
        <Line>16</Line>
        <Line>17</Line>
        <Line>18</Line>
        <Line>19</Line>
        <Line>20</Line>
        <Line>21</Line>
        <Line>22</Line>
        <Line>23</Line>
        <Line>24</Line>
        <Line>25</Line>
        <Line>26</Line>
        <Line>27</Line>
        <Line>28</Line>
      </Lines>
      <CodeContainer>
        {[...Array(4)].map((_, i) => {
          return (
            <Skeleton
              duration={0.5}
              style={{ display: "inline-block", marginTop: 3 }}
              key={i}
              width={Math.floor(Math.random() * 200) + 100}
              height={16}
            />
          );
        })}
        <Skeleton style={{ marginTop: 48 }} width={300} height={16} />
        {[...Array(10)].map((_, i) => {
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
};
