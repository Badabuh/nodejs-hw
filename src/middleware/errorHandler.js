import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof HttpError ? err.message : err.message || 'Internal Server Error';

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({ message });
};
