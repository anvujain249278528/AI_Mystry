import { AppError } from '../utils/errors.js';

export function notFound(_req, _res, next) {
  next(new AppError(404, 'That route could not be found.', 'NOT_FOUND'));
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_JSON', message: 'The request body must contain valid JSON.' } });
  }
  if (error?.name === 'CastError') {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'That record could not be found.' } });
  }
  if (error?.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Some of the submitted information is invalid.' } });
  }
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: { code: 'REQUEST_TOO_LARGE', message: 'That request is too large.' } });
  }

  const status = error instanceof AppError ? error.status : 500;
  const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';
  const message = error instanceof AppError ? error.message : 'Something went wrong on our end. Please try again.';
  if (status >= 500) console.error(error);
  return res.status(status).json({ success: false, error: { code, message } });
}
