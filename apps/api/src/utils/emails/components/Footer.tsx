import { Container, Link } from "@react-email/components";
import React from "react";

export default function Footer() {
  return (
    <Container className="relative mt-[30px] pt-[20px] max-w-none w-full border-solid border-zinc-200 border-t-[1px]">
      <Link
        className="text-xs mr-2 text-zinc-400"
        href="https://imperialb.in/terms"
      >
        Terms of Service
      </Link>
      <Link
        className="text-xs mr-2 text-zinc-400"
        href="https://imperialb.in/privacy"
      >
        Privacy Policy
      </Link>
      <Link
        className="text-xs mr-2 text-zinc-400"
        href="https://discord.gg/cTm85eW49D"
      >
        Discord
      </Link>
      <code className="!font-mono text-xs float-right text-zinc-500">
        &copy; IMPERIAL 2023
      </code>
    </Container>
  );
}
