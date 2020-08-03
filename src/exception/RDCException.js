class RDCException extends Error {
  constructor(exception) {
    super(exception.message);
    this.message = exception.message;
    this.statusCode = exception.code;
  }
}

function exceptionHandler(err, req, res, next) {
  if (err) {
    let code, message;
    if (err instanceof RDCException) {
      code = err.code;
      message = err.message;
    }
    code = code ? code : 500;
    message = message ? message : "Server error!";
    res.status(code).json({ code, message });
  }
}

module.exports = { RDCException, exceptionHandler };
