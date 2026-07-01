const swaggerJsDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');
const { createSwaggerOptions } = require('./swagger-options');

const PORT = process.env.PORT || 3000;
const swaggerSpec = swaggerJsDoc(createSwaggerOptions(PORT));
const outputPath = path.join(__dirname, 'swagger.json');

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
console.log(`Swagger file updated: ${outputPath}`);
