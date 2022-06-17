export enum PERMISSIONS {
  CAN_ENCRYPT_DOCUMENTS = 1 << 0,
  HIGH_QUALITY_SCREENSHOTS = 1 << 1,
  VANITY_URL = 1 << 2,
  MEMBER_PLUS_BADGE = 1 << 3,
  BETA_BADGE = 1 << 4,
  ADMIN_BADGE = 1 << 5,
  BAN_USERS = 1 << 6,
}

export enum ROLES {
  DEFAULT,
  BETA_TESTER,
  MEMBER_PLUS,
  ADMIN,
}

export const TestPermission = (bitfield: number, flag: ROLES | PERMISSIONS) => {
  return (bitfield & flag) == flag;
};
