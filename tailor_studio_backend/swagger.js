const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tailor Studio Backend API',
      version: '1.0.0',
      description:
        'REST API for handling contact form submissions and newsletter subscriptions for the Tailor Studio website.',
    },
    tags: [
      { name: 'Health', description: 'Service health and status' },
      { name: 'Forms', description: 'Contact form and newsletter subscription endpoints' },
    ],
  },
  // Paths to scan for OpenAPI JSDoc annotations
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
