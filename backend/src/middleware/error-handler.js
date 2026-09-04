function errorHandler(err, req, res, next) {
  console.error('Unhandled application error:', err);

  if (err.code === '23505') {
    return res.status(409).json({
      error: {
        code: 'DUPLICATE_RESOURCE',
        message: 'Employee with the same employee code or email already exists',
      },
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    },
  });
}

module.exports = errorHandler;