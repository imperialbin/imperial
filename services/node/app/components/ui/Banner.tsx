import styled from "styled-components";
import type { NextComponentType } from "next";
import Image from "next/image";
import * as Logo from "../../public/img/logo_transparent.png";

const BannerContainer = styled.div`
  background: #242424;
  border-radius: 8px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
`;

const Name = styled.h2`
    font-size: 30px;
    font-weight: bold;
    margin-left: 15px;
`;

export const Banner: NextComponentType = () => (
  <BannerContainer>
    <Image alt="Imperial Logo" src={Logo} width={50} height={50}></Image>
    <Name>IMPERIAL</Name>
  </BannerContainer>
);
