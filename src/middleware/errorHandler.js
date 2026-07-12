import createHttpError, { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const httpError =
    err instanceof HttpError ? err : createHttpError(500, err.message || 'Internal Server Error');

  if (res.headersSent) {
    return next(err);
  }

  res.status(httpError.statusCode).json({
    message:
      process.env.NODE_ENV === 'development'
        ? httpError.message
        : httpError.statusCode === 500
          ? 'Internal Server Error'
          : httpError.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
