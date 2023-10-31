import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // version de Swagger/OpenAPI
    info: {
      title: 'API DevOps G14 A23', // nom de l'API
      version: '1.0.0', // Cambia esto a la versión de tu API.
    },
    servers : [
      {
        url: "http://localhost:8080"
      }
    ],
  },
  // Specify the files that contains JSDoc comments for the generation of swagger
  apis: ["**/routes/snapshotRouter.js", "**/routes/issuesRouter.js", "**/routes/pullRequestRouter.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
