function logger(req, res, next) {
  let dateString = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  let stringLog = `[${dateString}] ${req.method} ${req.url}`
  // console.log(
  //   `-----------------[${dateString}] ${req.method} ${req.url} ----------------------`
  // );
  // console.log("body: ", req.body);
  // console.log("params: ", req.params);
  // console.log(
  //   "-------------------------------------- END -------------------------------------------"
  // );

  console.log(stringLog, "body:", req.body, "params:", req.params, "query:", req.query)
  next();
}

module.exports = { logger };
