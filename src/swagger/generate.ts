import express from "express";
import { baseSwaggerConfig } from "./swagger.config";
import j2s from "joi-to-swagger";

const makeRequestBody = (generateRequestSchema) => {
  if (generateRequestSchema()) {
    const args = generateRequestSchema();
    const { mediaType = "application/json", inboundSchema } = args;
    const { swagger: schema } = j2s(inboundSchema, {});

    return {
      content: {
        [mediaType]: {
          schema,
        },
      },
    };
  }

  return false;
};

const makeSampleResponse = (generateSampleResponse) => {
  if (generateSampleResponse) {
    const params = generateSampleResponse();
    const {
      mediaType = "application/json",
      description = "",
      example,
    } = params;

    return {
      description,
      content: {
        [mediaType]: {
          example,
        },
      },
    };
  }

  return false;
};

const generateSwaggerSpec = (app: express.Application, container) => {
  const finalSwaggerSpec = Object.assign({}, baseSwaggerConfig);
  const containerRegistrations = container.registrations;
  Object.entries(containerRegistrations).forEach(([key]) => {
    const registeredClass = container.resolve(key);

    if (registeredClass.method) {
      const {
        method,
        route,
        generateRequestSchema = false,
        generateRequestParameters = false,
        generateSampleResponse = () => {
          return false;
        },
      } = registeredClass;

      const requestBody = makeRequestBody(generateRequestSchema);
      const sampleResponse = makeSampleResponse(generateSampleResponse);

      if (finalSwaggerSpec.paths[route]) {
        finalSwaggerSpec.paths[route][method] = {
          tags: [],
          parameters: generateRequestParameters || [],
          responses: {
            200: sampleResponse,
          },
          security: [
            {
              "Bearer Token": [],
            },
          ],
          ...(requestBody ? { requestBody } : {}),
        };
      } else {
        finalSwaggerSpec.paths[route] = {
          [method]: {
            tags: [],
            parameters: generateRequestParameters || [],
            responses: {
              200: sampleResponse,
            },
            security: [
              {
                "Bearer Token": [],
              },
            ],
            ...(requestBody ? { requestBody } : {}),
          },
        };
      }
    }
  });

  return finalSwaggerSpec;
};

export { generateSwaggerSpec };
