import Tooltip from "@web/components/Tooltip";
import { Permer } from "permer";
import { Code, Plus, Tool, Zap } from "react-feather";
import { SelfUser } from "@imperial/commons";
import { styled } from "@web/stitches.config";

const badges = [
  {
    id: "admin",
    tooltip: "imperialb.in Staff",
    icon: <Tool color="dark red" fill="red" />,
  },

  {
    id: "beta-tester",
    tooltip: "Beta Tester",
    icon: <Code color="dark purple" fill="purple" />,
  },

  {
    id: "early-adopter",
    tooltip: "Early Adopter",
    icon: <Zap color="dark orange" fill="orange" />,
  },

  {
    id: "member-plus",
    tooltip: "Supporter of imperialb.in",
    icon: <Plus color="pink" fill="pink" />,
  },
] as const;

const badgeChecker = new Permer(
  badges.filter((b) => b.id !== "early-adopter").map((b) => b.id),
);

const getBadges = (user: SelfUser) => {
  const b = badges.filter((b) => badgeChecker.test(user.flags, b.id));

  // Hacky way to implement early adopter, will always
  // push badge to last in array.
  if (user.early_adopter) {
    b.push(badges.find((b) => b.id === "early-adopter")!);
  }

  return b;
};

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginTop: "3.5px",
  marginLeft: "5px",
  height: "100%",

  "> svg": {
    width: "18px",
    maxWidth: "18px",
  },
});

export function UserBadges({ user }: { user: SelfUser }) {
  const badgeIcons = getBadges(user).map((b) => (
    <Tooltip key={b.id} title={b.tooltip}>
      {b.icon}
    </Tooltip>
  ));

  return <Wrapper>{badgeIcons}</Wrapper>;
}
