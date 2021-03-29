function addHeadersKeys(req, res, next) {
  res.set('x-skillcrucial-user', 'f3ac20a0-bfe9-11e9-9a23-1914400a8e72');
  res.set('Access-Control-Expose-Headers', 'X-SKILLCRUCIAL-USER');
  next();
}
function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

module.exports = {
  notFound,
  errorHandler,
  addHeadersKeys
};
