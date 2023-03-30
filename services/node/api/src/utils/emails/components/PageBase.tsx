import React from "react";
import {
  Container,
  Head,
  Html,
  Img,
  Section,
  Tailwind,
} from "@react-email/components";
import Footer from "./Footer";

interface IPageBaseProps {
  children: React.ReactNode;
  title: string;
}

export default function PageBase({
  children,
  title,
  ...props
}: IPageBaseProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#191919",
            },
          },
        },
      }}
    >
      <Html>
        <Head>
          <style>
            {`
             *,*::before,*::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box!important;
                font-family: Helvetica, Arial!important;
              }`}
          </style>
        </Head>
        <Section className="my-0 mx-auto w-full h-full bg-white">
          <Container className="my-40 mx-auto p-5 max-w-[500px] min-h-[400px] bg-white rounded-lg border-[1px] border-solid border-zinc-200">
            <Img
              src="https://cdn.impb.in/assets/IMPERIAL_TRANSPARENT.png"
              className="block h-[50px] my-[30px]"
            />
            {children}
            <Footer />
          </Container>
        </Section>
      </Html>
    </Tailwind>
  );
}
