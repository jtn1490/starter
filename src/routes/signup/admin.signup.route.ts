import { BaseRoute } from "../BaseRoute";
import { Request, Response } from "express";
import joi from "joi";

module.exports = class AdminSignup extends BaseRoute {
  route = "/api/admin/signup";
  method = "post";
  accountManagementService;
  db;

  constructor({ db, accountManagementService }) {
    super();
    this.db = db;
    this.accountManagementService = accountManagementService;
  }

  static getClassKey() {
    return "adminSignup";
  }

  generateRequestSchema() {
    const inboundSchema = joi.object().keys({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
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
        _id: "5fa4fb5166dd9f724f51d354",
        firstName: "Darth",
        lastName: "Vader",
        email: "vader@deathstar.org",
      },
    };
  }

  async handler(req: Request, res: Response) {
    const { body: admin } = req;

    const { results, error } = await this.accountManagementService
      .registerAdmin(admin)
      .then((results) => {
        return { results };
      })
      .catch((error) => {
        return { error };
      });

    if (error) {
      return this.clientError(res, error);
    }

    return this.ok(res, results);
  }
};
