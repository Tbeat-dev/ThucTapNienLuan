const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const { createSwaggerOptions } = require('./swagger-options');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Du lieu gia lap
let movies = [
  { id: 1, title: 'Inception', director: 'Christopher Nolan' },
  { id: 2, title: 'Avatar', director: 'James Cameron' },
];

let nextMovieId = 3;

function validateMoviePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Du lieu gui len khong hop le.';
  }

  if (typeof payload.title !== 'string' || payload.title.trim() === '') {
    return 'Vui long nhap ten phim.';
  }

  if (typeof payload.director !== 'string' || payload.director.trim() === '') {
    return 'Vui long nhap ten dao dien.';
  }

  return null;
}

function parseMovieId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'ID phim khong hop le.' });
    return null;
  }

  return id;
}

// 1. Cau hinh thong tin chuan OpenAPI/Swagger cho rap chieu phim
const swaggerDocs = swaggerJsDoc(createSwaggerOptions(PORT));

if (process.env.WRITE_SWAGGER_FILE !== 'false') {
  fs.writeFileSync(
    path.join(__dirname, 'swagger.json'),
    JSON.stringify(swaggerDocs, null, 2),
  );
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 2. Dinh nghia API: Kiem tra trang thai he thong
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Kiem tra tinh trang hoat dong cua server
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Server hoat dong binh thuong
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Cinema API is running smoothly!',
  });
});

/**
 * @swagger
 * /movie:
 *   get:
 *     summary: Lay danh sach phim
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Tra ve danh sach phim
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
app.get('/movie', (req, res) => {
  res.json(movies);
});

/**
 * @swagger
 * /movie/{id}:
 *   get:
 *     summary: Lay thong tin mot phim theo ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua phim can xem
 *     responses:
 *       200:
 *         description: Tra ve thong tin phim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: ID phim khong hop le
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Khong tim thay phim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/movie/:id', (req, res) => {
  const id = parseMovieId(req, res);
  if (id === null) {
    return;
  }

  const movie = movies.find(item => item.id === id);
  if (!movie) {
    res.status(404).json({ message: 'Khong tim thay phim.' });
    return;
  }

  res.json(movie);
});

/**
 * @swagger
 * /movie:
 *   post:
 *     summary: Them phim moi
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *           examples:
 *             newMovie:
 *               summary: Phim moi
 *               value:
 *                 title: Interstellar
 *                 director: Christopher Nolan
 *     responses:
 *       201:
 *         description: Da them phim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Du lieu gui len khong hop le
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/movie', (req, res) => {
  const validationError = validateMoviePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const newMovie = {
    id: nextMovieId,
    title: req.body.title.trim(),
    director: req.body.director.trim(),
  };

  nextMovieId += 1;
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

/**
 * @swagger
 * /movie/{id}:
 *   put:
 *     summary: Cap nhat thong tin phim
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua phim can cap nhat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieInput'
 *           examples:
 *             updateMovie:
 *               summary: Thong tin cap nhat
 *               value:
 *                 title: Inception
 *                 director: Christopher Nolan
 *     responses:
 *       200:
 *         description: Da cap nhat phim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: ID hoac du lieu gui len khong hop le
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Khong tim thay phim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.put('/movie/:id', (req, res) => {
  const id = parseMovieId(req, res);
  if (id === null) {
    return;
  }

  const validationError = validateMoviePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const movieIndex = movies.findIndex(item => item.id === id);
  if (movieIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay phim.' });
    return;
  }

  movies[movieIndex] = {
    id,
    title: req.body.title.trim(),
    director: req.body.director.trim(),
  };

  res.json(movies[movieIndex]);
});

/**
 * @swagger
 * /movie/{id}:
 *   delete:
 *     summary: Xoa phim theo ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua phim can xoa
 *     responses:
 *       204:
 *         description: Da xoa phim
 *       400:
 *         description: ID phim khong hop le
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Khong tim thay phim
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.delete('/movie/:id', (req, res) => {
  const id = parseMovieId(req, res);
  if (id === null) {
    return;
  }

  const movieIndex = movies.findIndex(item => item.id === id);
  if (movieIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay phim.' });
    return;
  }

  movies.splice(movieIndex, 1);
  res.status(204).send();
});

// 3. Khoi dong server
app.listen(PORT, () => {
  console.log(`[Server] dang chay tai: http://localhost:${PORT}`);
  console.log(`Xem tai lieu API tai: http://localhost:${PORT}/api-docs`);
});
