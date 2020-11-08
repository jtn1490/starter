import { BaseRoute } from "../../routes/BaseRoute";
import { Request, Response } from "express";

module.exports = class GetUsers extends BaseRoute {
  route = "/api/users";
  method = "get";
  userService;
  db;

  constructor({ userService, db }) {
    super();
    this.userService = userService;
    this.db = db;
  }

  static getClassKey(): string {
    return "getUsers";
  }

  generateRequestSchema() {}

  generateSampleResponse(): object {
    return {
      example: [
        {
          _id: "yomama",
          firstName: "Darth",
          lastName: "Vader",
          email: "vader@deathstar.org",
        },
        {
          _id: "yobabymamasmama",
          firstName: "Luke",
          lastName: "Skywalker",
          email: "skywalker@deathstar.org",
        },
      ],
    };
  }

  async handler(req: Request, res: Response) {
    const { users, error } = await this.userService
      .getUsers()
      .then((users) => {
        return { users };
      })
      .catch((error) => {
        return { error };
      });

    if (error) {
      return this.clientError(res, error);
    }

    return this.ok(res, users);
  }
};
