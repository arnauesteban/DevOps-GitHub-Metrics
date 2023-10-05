import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // version de Swagger/OpenAPI
    info: {
      title: 'API DevOps G14 A23', // nom de l'API
      version: '1.0.0', // Cambia esto a la versión de tu API.
    },
  },
  // Specify the files that contains JSDoc comments for the generation of swagger
  apis: ['../routes/AppRouter.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
