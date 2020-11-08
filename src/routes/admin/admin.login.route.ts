import { BaseRoute } from "../BaseRoute";
import { Request, Response } from "express";
import joi from "joi";

module.exports = class AdminLogin extends BaseRoute {
  route = "/api/admin/login";
  method = "post";
  accountManagementService;
  db;

  constructor({ accountManagementService, db }) {
    super();
    this.accountManagementService = accountManagementService;
    this.db = db;
  }

  static getClassKey(): string {
    return "adminLogin";
  }

  generateRequestSchema() {
    const inboundSchema = joi.object().keys({
      email: joi.string().required(),
      password: joi.string().required(),
    });

    return {
      inboundSchema,
    };
  }

  generateSampleResponse(): object {
    return {
      example: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJzdHJpbmciLCJsYXN0TmFtZSI6InN0cmluZyIsImVtYWlsIjoianRuMTQ5MEBnbWFpbC5jb20iLCJpYXQiOjE2MDQ2NzkzNTcsImV4cCI6MTYwNDc2NTc1N30.p1seNl6Gg8B9ml7R1UA8a8nzQasdiqbWzqRXXwutB0s",
      },
    };
  }

  handler(req: Request, res: Response) {
    const { body } = req;
    return this.accountManagementService.login(body, "Admin").then((token) => {
      return res.send({
        token,
      });
    });
  }
};
