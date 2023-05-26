import { Container, Section } from "@react-email/components";
import React from "react";

export default function Header({
  subHeader,
  header,
}: {
  subHeader: string;
  header: string;
}) {
  return (
    <Section className="mb-1">
      <Container>
        <h2 className="text-sm font-medium text-zinc-400 m-0">{subHeader}</h2>
        <h1 className="text-2xl font-semibold text-zinc-800 m-0">{header}</h1>
      </Container>
    </Section>
  );
}
