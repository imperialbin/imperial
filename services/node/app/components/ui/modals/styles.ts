import styled from "styled-components";

export const HeaderSecondary = styled.span`
  color: ${({ theme }) => theme.textDarker};
`;

export const Search = styled.input`
  display: inline-block;
  margin: 15px 15px 0;
  padding: 10px 0px;
  border: none;
  border-radius: 8px;
  font-size: 1.4em;
  background: ${({ theme }) => theme.layoutLightestOfTheBunch};
  color: ${({ theme }) => theme.textDarker};

  &:focus {
    outline: none;
  }

  &::placeholder {
    opacity: 0.4;
    color: ${({ theme }) => theme.textDarker};
  }
`;

export const FadeSlideUpAnimation = {
  initial: {
    opacity: 0,
    transform: "translateY(10px)",
  },
  isOpen: {
    opacity: 1,
    transform: "translateY(0px)",
  },
  exit: {
    opacity: 0,
    transform: "translateY(10px)",
  },
};

export const FadeAnimation = {
  initial: {
    opacity: 0,
  },
  isOpen: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
