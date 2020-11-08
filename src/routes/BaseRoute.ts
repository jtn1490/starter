// https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-consistent-expressjs-controllers/

import { InboundContract, IOutboundContract, IError } from "src/models";
import { Response, Request, NextFunction } from "express";

export abstract class BaseRoute {
  route: string;
  method: string;
  inboundContract: InboundContract;
  outboundContract: IOutboundContract;

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.validateInboundRequest(req, res);
      await this.handler(req, res);
    } catch (error) {
      console.error(`Uncaught error: ${error}`);
      this.fail(res, "An unexpected error occurred");
    }
  }

  protected abstract handler(req: Request, res: Response);
  protected abstract generateRequestSchema(): object | void;

  private async validateInboundRequest(
    req: Request,
    res: Response
  ): Promise<Response<any> | Request<any>> {
    const schema = this.generateRequestSchema();
    if (schema) {
      const { body } = req;
      const { error, value } = schema["inboundSchema"].validate(body);
      req.body = value;
      if (error) {
        return this.clientError(res, error);
      }
    }
    return req;
  }

  public unauthorized(res: Response, message?: string) {
    return BaseRoute.jsonResponse(res, 401, message ? message : "Unauthorized");
  }

  public clientError(res: Response, message?: string) {
    return BaseRoute.jsonResponse(res, 400, message ? message : "Unauthorized");
  }

  public fail(res: Response, error: Error | string) {
    console.error(`Fail: ${error}`);
    return res.status(500).json({
      message: error.toString(),
    });
  }

  public ok<T>(res: Response, dto?: T) {
    if (!!dto) {
      res.type("application/json");
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }
}
