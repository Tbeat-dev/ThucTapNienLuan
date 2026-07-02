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

let rooms = [
  { id: 1, name: 'Phòng A1', capacity: 120, type: '2D' },
  { id: 2, name: 'Phòng B1', capacity: 80, type: '3D' },
];

let nextRoomId = 3;

let schedules = [
  {
    id: 1,
    movieId: 1,
    roomId: 1,
    startTime: '2026-07-02T19:00:00',
    endTime: '2026-07-02T21:00:00',
    price: 80000,
  },
  {
    id: 2,
    movieId: 2,
    roomId: 2,
    startTime: '2026-07-02T20:00:00',
    endTime: '2026-07-02T22:00:00',
    price: 90000,
  },
];

let nextScheduleId = 3;

let employees = [
  { id: 1, fullName: 'Nguyễn Văn An', role: 'Quản lý rạp', phone: '0900123456', email: 'an@cinema.com' },
  { id: 2, fullName: 'Trần Thị Bình', role: 'Nhân viên bán vé', phone: '0911223344', email: 'binh@cinema.com' },
];

let nextEmployeeId = 3;

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

function validateRoomPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Du lieu gui len khong hop le.';
  }

  if (typeof payload.name !== 'string' || payload.name.trim() === '') {
    return 'Vui long nhap ten phong chieu.';
  }

  if (!Number.isInteger(payload.capacity) || payload.capacity <= 0) {
    return 'Vui long nhap suc chua hop le.';
  }

  if (typeof payload.type !== 'string' || payload.type.trim() === '') {
    return 'Vui long nhap loai phong.';
  }

  return null;
}

function validateSchedulePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Du lieu gui len khong hop le.';
  }

  if (!Number.isInteger(payload.movieId) || payload.movieId <= 0) {
    return 'Vui long nhap ID phim hop le.';
  }

  if (!Number.isInteger(payload.roomId) || payload.roomId <= 0) {
    return 'Vui long nhap ID phong hop le.';
  }

  if (typeof payload.startTime !== 'string' || payload.startTime.trim() === '') {
    return 'Vui long nhap thoi gian bat dau.';
  }

  if (typeof payload.endTime !== 'string' || payload.endTime.trim() === '') {
    return 'Vui long nhap thoi gian ket thuc.';
  }

  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    return 'Vui long nhap gia ve hop le.';
  }

  return null;
}

function validateEmployeePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Du lieu gui len khong hop le.';
  }

  if (typeof payload.fullName !== 'string' || payload.fullName.trim() === '') {
    return 'Vui long nhap ho ten nhan vien.';
  }

  if (typeof payload.role !== 'string' || payload.role.trim() === '') {
    return 'Vui long nhap chuc vu.';
  }

  if (typeof payload.phone !== 'string' || payload.phone.trim() === '') {
    return 'Vui long nhap so dien thoai.';
  }

  if (typeof payload.email !== 'string' || payload.email.trim() === '') {
    return 'Vui long nhap email.';
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

function parsePositiveId(req, res, entityName) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: `ID ${entityName} khong hop le.` });
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

/**
 * @swagger
 * /room:
 *   get:
 *     summary: Lay danh sach phong chieu
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: Tra ve danh sach phong chieu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
app.get('/room', (req, res) => {
  res.json(rooms);
});

/**
 * @swagger
 * /room/{id}:
 *   get:
 *     summary: Lay thong tin mot phong chieu theo ID
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua phong chieu
 *     responses:
 *       200:
 *         description: Tra ve thong tin phong chieu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
app.get('/room/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'phong chieu');
  if (id === null) {
    return;
  }

  const room = rooms.find(item => item.id === id);
  if (!room) {
    res.status(404).json({ message: 'Khong tim thay phong chieu.' });
    return;
  }

  res.json(room);
});

/**
 * @swagger
 * /room:
 *   post:
 *     summary: Them phong chieu moi
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomInput'
 *     responses:
 *       201:
 *         description: Da them phong chieu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
app.post('/room', (req, res) => {
  const validationError = validateRoomPayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const newRoom = {
    id: nextRoomId,
    name: req.body.name.trim(),
    capacity: req.body.capacity,
    type: req.body.type.trim(),
  };

  nextRoomId += 1;
  rooms.push(newRoom);
  res.status(201).json(newRoom);
});

/**
 * @swagger
 * /room/{id}:
 *   put:
 *     summary: Cap nhat thong tin phong chieu
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua phong chieu can cap nhat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomInput'
 *     responses:
 *       200:
 *         description: Da cap nhat phong chieu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
app.put('/room/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'phong chieu');
  if (id === null) {
    return;
  }

  const validationError = validateRoomPayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const roomIndex = rooms.findIndex(item => item.id === id);
  if (roomIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay phong chieu.' });
    return;
  }

  rooms[roomIndex] = {
    id,
    name: req.body.name.trim(),
    capacity: req.body.capacity,
    type: req.body.type.trim(),
  };

  res.json(rooms[roomIndex]);
});

/**
 * @swagger
 * /room/{id}:
 *   delete:
 *     summary: Xoa phong chieu theo ID
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua phong chieu can xoa
 *     responses:
 *       204:
 *         description: Da xoa phong chieu
 */
app.delete('/room/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'phong chieu');
  if (id === null) {
    return;
  }

  const roomIndex = rooms.findIndex(item => item.id === id);
  if (roomIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay phong chieu.' });
    return;
  }

  rooms.splice(roomIndex, 1);
  res.status(204).send();
});

/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Lay danh sach lich chieu
 *     tags:
 *       - Schedules
 *     responses:
 *       200:
 *         description: Tra ve danh sach lich chieu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 */
app.get('/schedule', (req, res) => {
  res.json(schedules);
});

/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Lay thong tin mot lich chieu theo ID
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua lich chieu
 *     responses:
 *       200:
 *         description: Tra ve thong tin lich chieu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 */
app.get('/schedule/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'lich chieu');
  if (id === null) {
    return;
  }

  const schedule = schedules.find(item => item.id === id);
  if (!schedule) {
    res.status(404).json({ message: 'Khong tim thay lich chieu.' });
    return;
  }

  res.json(schedule);
});

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Them lich chieu moi
 *     tags:
 *       - Schedules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleInput'
 *     responses:
 *       201:
 *         description: Da them lich chieu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 */
app.post('/schedule', (req, res) => {
  const validationError = validateSchedulePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const newSchedule = {
    id: nextScheduleId,
    movieId: req.body.movieId,
    roomId: req.body.roomId,
    startTime: req.body.startTime.trim(),
    endTime: req.body.endTime.trim(),
    price: req.body.price,
  };

  nextScheduleId += 1;
  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

/**
 * @swagger
 * /schedule/{id}:
 *   put:
 *     summary: Cap nhat lich chieu
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua lich chieu can cap nhat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleInput'
 *     responses:
 *       200:
 *         description: Da cap nhat lich chieu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 */
app.put('/schedule/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'lich chieu');
  if (id === null) {
    return;
  }

  const validationError = validateSchedulePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const scheduleIndex = schedules.findIndex(item => item.id === id);
  if (scheduleIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay lich chieu.' });
    return;
  }

  schedules[scheduleIndex] = {
    id,
    movieId: req.body.movieId,
    roomId: req.body.roomId,
    startTime: req.body.startTime.trim(),
    endTime: req.body.endTime.trim(),
    price: req.body.price,
  };

  res.json(schedules[scheduleIndex]);
});

/**
 * @swagger
 * /schedule/{id}:
 *   delete:
 *     summary: Xoa lich chieu theo ID
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua lich chieu can xoa
 *     responses:
 *       204:
 *         description: Da xoa lich chieu
 */
app.delete('/schedule/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'lich chieu');
  if (id === null) {
    return;
  }

  const scheduleIndex = schedules.findIndex(item => item.id === id);
  if (scheduleIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay lich chieu.' });
    return;
  }

  schedules.splice(scheduleIndex, 1);
  res.status(204).send();
});

/**
 * @swagger
 * /employee:
 *   get:
 *     summary: Lay danh sach nhan vien
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: Tra ve danh sach nhan vien
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 */
app.get('/employee', (req, res) => {
  res.json(employees);
});

/**
 * @swagger
 * /employee/{id}:
 *   get:
 *     summary: Lay thong tin mot nhan vien theo ID
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua nhan vien
 *     responses:
 *       200:
 *         description: Tra ve thong tin nhan vien
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 */
app.get('/employee/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'nhan vien');
  if (id === null) {
    return;
  }

  const employee = employees.find(item => item.id === id);
  if (!employee) {
    res.status(404).json({ message: 'Khong tim thay nhan vien.' });
    return;
  }

  res.json(employee);
});

/**
 * @swagger
 * /employee:
 *   post:
 *     summary: Them nhan vien moi
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       201:
 *         description: Da them nhan vien
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 */
app.post('/employee', (req, res) => {
  const validationError = validateEmployeePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const newEmployee = {
    id: nextEmployeeId,
    fullName: req.body.fullName.trim(),
    role: req.body.role.trim(),
    phone: req.body.phone.trim(),
    email: req.body.email.trim(),
  };

  nextEmployeeId += 1;
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

/**
 * @swagger
 * /employee/{id}:
 *   put:
 *     summary: Cap nhat thong tin nhan vien
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua nhan vien can cap nhat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       200:
 *         description: Da cap nhat nhan vien
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 */
app.put('/employee/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'nhan vien');
  if (id === null) {
    return;
  }

  const validationError = validateEmployeePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const employeeIndex = employees.findIndex(item => item.id === id);
  if (employeeIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay nhan vien.' });
    return;
  }

  employees[employeeIndex] = {
    id,
    fullName: req.body.fullName.trim(),
    role: req.body.role.trim(),
    phone: req.body.phone.trim(),
    email: req.body.email.trim(),
  };

  res.json(employees[employeeIndex]);
});

/**
 * @swagger
 * /employee/{id}:
 *   delete:
 *     summary: Xoa nhan vien theo ID
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: ID cua nhan vien can xoa
 *     responses:
 *       204:
 *         description: Da xoa nhan vien
 */
app.delete('/employee/:id', (req, res) => {
  const id = parsePositiveId(req, res, 'nhan vien');
  if (id === null) {
    return;
  }

  const employeeIndex = employees.findIndex(item => item.id === id);
  if (employeeIndex === -1) {
    res.status(404).json({ message: 'Khong tim thay nhan vien.' });
    return;
  }

  employees.splice(employeeIndex, 1);
  res.status(204).send();
});

// 3. Khoi dong server
app.listen(PORT, () => {
  console.log(`[Server] dang chay tai: http://localhost:${PORT}`);
  console.log(`Xem tai lieu API tai: http://localhost:${PORT}/api-docs`);
});
