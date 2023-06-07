import { styled } from "@web/stitches.config";
import Tooltip from "./Tooltip";
import { SelfUser } from "@imperial/commons";
import { getBadges } from "@web/utils/badge";

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginTop: "3.5px",
  marginLeft: "10px",
  height: "100%",
  background: "$primary600",
  padding: "4px 8px",
  borderRadius: "$medium",
  border: "1px solid $primary400",

  "> svg": {
    width: "18px",
    height: "auto",
    maxWidth: "18px",
  },
});

export function UserBadges({ user, className }: { user: SelfUser; className?: string }) {
  const badgeIcons = getBadges(user).map((b) => (
    <Tooltip key={b.id} title={b.tooltip}>
      {b.icon}
    </Tooltip>
  ));

  return <Wrapper className={className}>{badgeIcons}</Wrapper>;
}
