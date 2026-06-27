require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const port = Number(process.env.PORT) || 3000;

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
app.use(cors());
app.use(express.json());
app.use(
  pinoHttp({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  if (isProduction) {
    res.status(500).json({
      message: 'Internal server error',
    });
  } else {
    res.status(500).json({
      message: err.stack,
    });
  }
});
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
