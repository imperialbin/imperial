import Tooltip from "@web/components/Tooltip";
import { Code, Plus, Tool, Zap } from "react-feather";
import { SelfUser, permer } from "@imperial/commons";
import { styled } from "@web/stitches.config";

const badges = [
  {
    id: "admin",
    tooltip: "IMPERIAL Staff",
    icon: <Tool color="dark red" fill="red" />,
  },

  {
    id: "beta-tester",
    tooltip: "Beta Tester",
    icon: <Code color="teal" strokeWidth={2.5} />,
  },

  {
    id: "early-adopter",
    tooltip: "Early Adopter",
    icon: <Zap color="dark orange" fill="orange" />,
  },

  {
    id: "member-plus",
    tooltip: "Supporter of IMPERIAL",
    icon: <Plus color="pink" fill="pink" strokeWidth={2.5} />,
  },
] as const;

export const getBadges = (user: SelfUser) => {
  const b = badges.filter(({ id }) => {
    if (id === "early-adopter") {
      return false;
    }

    return permer.test(user.flags, id);
  });

  // Hacky way to implement early adopter, will always
  // push badge to last in array.
  if (user.early_adopter) {
    b.push(badges.find(({ id }) => id === "early-adopter")!);
  }

  return b;
};
