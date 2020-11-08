import { BaseRoute } from "../BaseRoute";
import { Request, Response } from "express";

module.exports = class GetUsers extends BaseRoute {
  route = "/api/admin";
  method = "get";
  adminService;
  db;

  constructor({ adminService, db }) {
    super();
    this.adminService = adminService;
    this.db = db;
  }

  static getClassKey(): string {
    return "getAdmins";
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
    const { admins, error } = await this.adminService
      .getAdmin()
      .then((admins) => {
        return { admins };
      })
      .catch((error) => {
        return { error };
      });

    if (error) {
      return this.clientError(res, error);
    } else {
      return this.ok(res, admins);
    }
  }
};
