import bcrypt from "bcrypt";

class bCrypt {
  private static get salt() {
    return 13;
  }

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, bCrypt.salt);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export { bCrypt };
