export enum PERMISSIONS {
  CAN_ENCRYPT_DOCUMENTS = 1 << 0,
  HIGH_QUALITY_SCREENSHOTS = 1 << 1,
  VANITY_URL = 1 << 2,
  BAN_USERS = 1 << 6,
}

export const roles = {
  member: PERMISSIONS.CAN_ENCRYPT_DOCUMENTS,
  betaTester: PERMISSIONS.CAN_ENCRYPT_DOCUMENTS | PERMISSIONS.VANITY_URL,
  memberPlus: PERMISSIONS.CAN_ENCRYPT_DOCUMENTS | PERMISSIONS.VANITY_URL,
  admin:
    PERMISSIONS.CAN_ENCRYPT_DOCUMENTS |
    PERMISSIONS.VANITY_URL |
    PERMISSIONS.BAN_USERS,
};

export const TestPermission = (bitfield: number, flag: PERMISSIONS) => {
  return Boolean(bitfield & flag);
};

export const getRole = (bitfield: number) => {
  switch (bitfield) {
    case roles.member:
      return "Member";

    case roles.betaTester:
      return "Beta Tester";

    case roles.memberPlus:
      return "Member+";

    case roles.admin:
      return "Admin";
  }
};
