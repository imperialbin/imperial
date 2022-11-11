import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  max-width: 90%;
  width: 50%;
  height: 80%;
  max-height: 90%;
  overflow: auto;
  padding: 30px;
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
