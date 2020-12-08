const middleware = function(req, res, next) {
  if (!req.user) {
    return res.status(401).end();
  }
  next();
};

module.exports = middleware;
