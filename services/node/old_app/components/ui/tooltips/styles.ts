import styled from "styled-components";

export const ListContainer = styled.ul`
  list-style: none;
  margin: 10px 0;
  padding: 0 15px 0 5px;
`;

export const ListItem = styled.li<{ danger?: boolean }>`
  cursor: pointer;
  margin: 4px 0;
  color: ${({ theme }) => theme.textDarker};
  transition: color 0.2s ease-in-out;
  text-align: left;

  &:hover {
    color: ${({ danger, theme }) => (danger ? theme.error : theme.textLight)};
  }
`;

export const Seperator = styled.span`
  display: flex;
  width: 100%;
  margin: 14px auto;
  opacity: 0.3;
  border-bottom: 1px solid;
`;

export const Anchor = styled.a`
  display: block;
  text-align: left;
  margin: 8px 0;
  text-decoration: none !important;
  color: ${({ theme }) => theme.textDarker};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.textLight};
  }
`;
