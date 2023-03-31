import { permer } from "@api/utils/permissions";

export const getRole = (bitfield: number) => {
  switch (true) {
    case permer.test(bitfield, "admin"):
      return "Admin";
    case permer.test(bitfield, "beta-tester"):
      return "Beta Tester";
    case permer.test(bitfield, "member-plus"):
      return "Member Plus";
    case permer.test(bitfield, "member"):
      return "Member";
    default:
      return "Member";
  }
};
