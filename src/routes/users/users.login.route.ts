import { BaseRoute } from "../../routes/BaseRoute";
import { Request, Response } from "express";
import joi from "joi";

module.exports = class UserLogin extends BaseRoute {
  route = "/api/login";
  method = "post";
  accountManagementService;
  db;

  constructor({ accountManagementService, db }) {
    super();
    this.accountManagementService = accountManagementService;
    this.db = db;
  }

  static getClassKey(): string {
    return "userLogin";
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

  async handler(req: Request, res: Response) {
    const { body } = req;
    const { token, error } = await this.accountManagementService
      .login(body, "User")
      .then((token) => {
        return { token };
      })
      .catch((error) => {
        return { error };
      });

    if (error) {
      return this.unauthorized(res, "Wrong email or password");
    }

    return this.ok(res, token);
  }
};
