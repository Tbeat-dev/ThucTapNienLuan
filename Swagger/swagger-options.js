const path = require('path');

function createSwaggerOptions(port = process.env.PORT || 3000) {
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Hệ thống quản lý API cho rạp chiếu phim Cinestar',
        version: '1.0.0',
        description: 'Hệ thống tài liệu API quản lý rạp chiếu phim tập trung.',
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
                example: 'API rạp chiếu đang hoạt động bình thường!',
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
          Room: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              name: {
                type: 'string',
                example: 'Phòng A1',
              },
              capacity: {
                type: 'integer',
                example: 120,
              },
              type: {
                type: 'string',
                example: '2D',
              },
            },
          },
          RoomInput: {
            type: 'object',
            required: ['name', 'capacity', 'type'],
            properties: {
              name: {
                type: 'string',
                example: 'Phòng B1',
              },
              capacity: {
                type: 'integer',
                example: 80,
              },
              type: {
                type: 'string',
                example: '3D',
              },
            },
          },
          Schedule: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              movieId: {
                type: 'integer',
                example: 1,
              },
              roomId: {
                type: 'integer',
                example: 1,
              },
              startTime: {
                type: 'string',
                example: '2026-07-02T19:00:00',
              },
              endTime: {
                type: 'string',
                example: '2026-07-02T21:00:00',
              },
              price: {
                type: 'number',
                example: 80000,
              },
            },
          },
          ScheduleInput: {
            type: 'object',
            required: ['movieId', 'roomId', 'startTime', 'endTime', 'price'],
            properties: {
              movieId: {
                type: 'integer',
                example: 1,
              },
              roomId: {
                type: 'integer',
                example: 1,
              },
              startTime: {
                type: 'string',
                example: '2026-07-02T19:00:00',
              },
              endTime: {
                type: 'string',
                example: '2026-07-02T21:00:00',
              },
              price: {
                type: 'number',
                example: 80000,
              },
            },
          },
          Employee: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              fullName: {
                type: 'string',
                example: 'Nguyễn Văn An',
              },
              role: {
                type: 'string',
                example: 'Quản lý rạp',
              },
              phone: {
                type: 'string',
                example: '0900123456',
              },
              email: {
                type: 'string',
                example: 'an@cinema.com',
              },
            },
          },
          EmployeeInput: {
            type: 'object',
            required: ['fullName', 'role', 'phone', 'email'],
            properties: {
              fullName: {
                type: 'string',
                example: 'Trần Thị Bình',
              },
              role: {
                type: 'string',
                example: 'Nhân viên bán vé',
              },
              phone: {
                type: 'string',
                example: '0911223344',
              },
              email: {
                type: 'string',
                example: 'binh@cinema.com',
              },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Không tìm thấy phim.',
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
