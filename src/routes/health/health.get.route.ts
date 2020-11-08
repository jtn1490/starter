import { BaseRoute } from "../BaseRoute";
import { Request, Response } from "express";

module.exports = class GetUsers extends BaseRoute {
  route = "/api/health";
  method = "get";

  constructor() {
    super();
  }

  static getClassKey(): string {
    return "health";
  }

  generateRequestSchema() {}

  generateSampleResponse(): object {
    return {
      example: {
        healthy: true,
      },
    };
  }

  async handler(req: Request, res: Response) {
    const config = require("../../config");
    const environment = config.NODE_ENV;
    this.ok(res, {
      healthy: true,
      environment,
    });
  }
};
