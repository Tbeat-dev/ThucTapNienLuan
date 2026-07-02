const path = require('path');

function createSwaggerOptions(port = process.env.PORT || 3000) {
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'He thong quan ly API cho rap chieu',
        version: '1.0.0',
        description: 'He thong tai lieu API quan ly rap chieu phim tap trung.',
      },
      servers: [{ url: '/' }],
      components: {
        schemas: {
          HealthResponse: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'OK',
              },
              message: {
                type: 'string',
                example: 'Cinema API is running smoothly!',
              },
            },
          },
          Movie: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              title: {
                type: 'string',
                example: 'Inception',
              },
              director: {
                type: 'string',
                example: 'Christopher Nolan',
              },
            },
          },
          MovieInput: {
            type: 'object',
            required: ['title', 'director'],
            properties: {
              title: {
                type: 'string',
                example: 'Interstellar',
              },
              director: {
                type: 'string',
                example: 'Christopher Nolan',
              },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Khong tim thay phim.',
              },
            },
          },
        },
      },
    },
    apis: [path.join(__dirname, 'index.js')],
  };
}

module.exports = {
  createSwaggerOptions,
};
