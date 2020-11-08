export const baseSwaggerConfig = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Starter",
    description: "Starter API Documentation",
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "Local environment",
    },
  ],
  tags: [],
  paths: {},
  components: {
    securitySchemes: {
      "Bearer Token": {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};
