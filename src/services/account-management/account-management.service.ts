import jwt from "jsonwebtoken";
import crypto from "crypto";

module.exports = class AccountManagementService {
  db;
  config;
  JWT_KEY;

  constructor({ db, config }) {
    this.db = db;
    this.config = config;
    this.JWT_KEY = this.config.JWT.KEY;
  }

  static getClassKey() {
    return "accountManagementService";
  }

  registerUser(user): void {
    const { pass_salt, pass_hash } = this.encryptPassword(user.password);
    return this.db.User.create({ ...user, ...{ pass_salt, pass_hash } });
  }

  registerAdmin(admin): void {
    const { pass_salt, pass_hash } = this.encryptPassword(admin.password);
    return this.db.Admin.create({ ...admin, ...{ pass_salt, pass_hash } });
  }

  async login(credentials, accountType) {
    const { email, password } = credentials;
    const userAccount = await this.db[accountType].findOne({
      email: email.toLowerCase(),
    });

    if (!userAccount) throw new Error();

    const { firstName, lastName, pass_salt, pass_hash } = userAccount;

    const encryptedPassword = crypto
      .pbkdf2Sync(password, pass_salt, 10000, 128, "sha512")
      .toString("hex");

    if (encryptedPassword === pass_hash) {
      const tokenContext = {
        firstName,
        lastName,
        email,
      };
      const expiration = this.config.JWT.EXPIRATION;
      return this.createJwt(tokenContext, expiration);
    } else {
      throw new Error();
    }
  }

  createJwt(ctx, expiration) {
    const { JWT_KEY } = this;
    return jwt.sign(ctx, JWT_KEY, {
      expiresIn: expiration,
    });
  }

  decryptJwt(token) {
    const { JWT_KEY } = this;
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_KEY, (err, decoded) => {
        if (err) reject(err);
        resolve({
          user: decoded,
        });
      });
    });
  }

  encryptPassword(password) {
    const pass_salt = crypto.randomBytes(64).toString("hex");
    return {
      pass_salt,
      pass_hash: crypto
        .pbkdf2Sync(password, pass_salt, 10000, 128, "sha512")
        .toString("hex"),
    };
  }
};
