import Tooltip from "@web/components/Tooltip";
import { Permer } from "permer";
import { Heart, X } from "react-feather";
import { SelfUser } from "../../../../packages/commons/types";

// temporary icons for testing.
// TODO: sometimes badges look a little weird when placed
// next to each other, please look into!
const badges = [
  {
    id: "admin",
    tooltip: "imperialb.in Staff",
    icon: <Heart color="red" fill="red" />,
  },

  {
    id: "beta-tester",
    tooltip: "Beta Tester",
    icon: <Heart color="purple" fill="purple" />,
  },

  {
    id: "early-adopter",
    tooltip: "Early Adopter",
    icon: <Heart color="orange" fill="orange" />,
  },

  {
    id: "member-plus",
    tooltip: "Supporter of imperialb.in",
    icon: <X color="orange" />,
  },
] as const;

const badgeChecker = new Permer(
  badges.filter((b) => b.id !== "early-adopter").map((b) => b.id),
);

const getBadges = (user: SelfUser) => {
  const b = badges.filter((b) => badgeChecker.test(user.flags, b.id));

  // hacky way to implement early adopter, will always
  // push badge to last in array.
  if (user.early_adopter) {
    b.push(badges.find((b) => b.id === "early-adopter")!);
  }

  return b;
};

export const getBadgeIcons = (user: SelfUser) => {
  return getBadges(user).map((b) => {
    return <Tooltip title={b.tooltip}>{b.icon}</Tooltip>;
  });
};
