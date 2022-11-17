function logger(req, res, next) {
  console.log(`[${Date.now()}] ${req.method} ${req.url}`);
  next();
}

module.export = this.logger;
