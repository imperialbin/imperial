import styled from "styled-components";
import { ThemeForStupidProps } from "../../types";

export const ListContainer = styled.ul`
  list-style: none;
  padding: 0 15px;
`;

export const ListItem = styled.li<{ danger?: boolean }>`
  cursor: pointer;
  margin: 4px 0;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ danger, theme }) => (danger ? theme.error : theme.textLight)};
  }
`;

export const Seperator = styled.span`
  display: flex;
  width: 100%;
  margin: 8px auto;
  opacity: 0.3;
  border-bottom: 1px solid;
`;

export const Anchor = styled.a`
  display: block;
  margin: 4px 0;
  text-decoration: none !important;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  }
`;
