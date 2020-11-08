import bodyParser from "body-parser";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import glob from "glob";
import swaggerUi from "swagger-ui-express";
import { createContainer, asClass, asValue, InjectionMode } from "awilix";
import { generateSwaggerSpec } from "./swagger/generate";
import { database } from "./db/Database";

export class Server {
  app: express.Application;
  container;
  BASE_DIR;
  config;

  constructor(app: express.Application) {
    this.app = app;
    this.BASE_DIR = path.join(__dirname);
    this.config = require("./config");
  }

  start(): void {
    const { APP_PORT, NODE_ENV } = this.config;
    this.registerMiddleware();
    this.registerContainer();
    this.registerConfig();
    this.registerDB();
    this.registerRoutes();

    this.registerSwagger();
    this.app.listen(APP_PORT || 3000, () => {
      console.log(
        `App listening on port ${APP_PORT} on environment ${NODE_ENV}`
      );
    });
  }

  registerMiddleware(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );

    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    });
  }

  registerContainer(): void {
    this.container = createContainer({
      injectionMode: InjectionMode.PROXY,
    });

    const { BASE_DIR } = this;
    const ext = BASE_DIR.includes("/dist") ? "js" : "ts";

    glob
      .sync(`**/*.route.${ext}`, {
        cwd: `${BASE_DIR}/routes`,
      })
      .map((filename) => {
        return require(`${BASE_DIR}/routes/${filename}`);
      })
      .forEach((api) => {
        const key = api.getClassKey();
        this.container.register({
          [key]: asClass(api),
        });
      });

    glob
      .sync(`**/*.service.${ext}`, {
        cwd: `${BASE_DIR}/services`,
      })
      .map((filename) => {
        return require(`${BASE_DIR}/services/${filename}`);
      })
      .forEach((service) => {
        const key = service.getClassKey();
        this.container.register({
          [key]: asClass(service),
        });
      });
  }

  registerRoutes(): void {
    const containerRegistrations = this.container.registrations;
    Object.entries(containerRegistrations).forEach(([key]) => {
      const registeredClass = this.container.resolve(key);
      if (registeredClass.method) {
        const { method, route, execute } = registeredClass;
        const e = execute.bind(registeredClass);
        this.app[method](route, e);
        console.log(`Registered route: ${method.toUpperCase()} - ${route}`);
      }
    });
  }

  registerSwagger(): void {
    const swaggerSpec = generateSwaggerSpec(this.app, this.container);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  registerDB(): void {
    const { BASE_DIR, config } = this;
    const db = database({
      BASE_DIR,
      config,
    });

    this.container.register({
      db: asValue(db),
    });
  }

  registerConfig() {
    const { config } = this;
    this.container.register({
      config: asValue(config),
    });
  }
}
