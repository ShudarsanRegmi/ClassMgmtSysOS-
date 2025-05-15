const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ClassRoom Management System API",
      version: "1.0.0",
      description: "API docs for the school management system",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./routes/*.js"], // location of your route files with Swagger comments
};

module.exports = swaggerJsdoc(options);
