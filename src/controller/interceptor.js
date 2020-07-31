const constants = require("../constants/common");
const SecurtiyRepository = require("../repository/das/BaseSecurityRepository");
const responseCosntants = require("../constants/response");
const securityRespository = new SecurtiyRepository();

const RDCException = require("../exception/RDCException");

async function interceptor(req, res, next) {
  try {
    let response = await preProcessor(req);
    if (response.code === 200) next();
    else req.moduleResponse = response;
  } catch (error) {
    console.error("Error in interceptor : ", error);
    let response = responseCosntants.SERVER_ERROR;
    if (error instanceof RDCException) {
      response.code = error.code;
      response.message = error.message;
    }
    req.moduleResponse = response;
  } finally {
    console.info("Response in interceptor : ", req.moduleResponse);
    return postProcessor(req, res);
  }
}

async function preProcessor(req) {
  return requestValidator(req)
    ? (await jwtValidator(req))
      ? responseCosntants.SUCCESS
      : responseCosntants.FORBIDDEN
    : responseCosntants.UN_AUTHORIZED;
}

function postProcessor(req, res) {
  let response = req.moduleResponse;
  res.status(response.code).json(response);
}

function requestValidator(req) {
  return getTokenFromRequest(req) != null ? true : false;
}

async function jwtValidator(req) {
  return await validateToken(getTokenFromRequest(req));
}

function getTokenFromRequest(req) {
  const authHeader = req.headers[constants.AUTH_HEADER];
  return authHeader && authHeader.split(" ")[1];
}

async function validateToken(token) {
  await securityRespository.validateToken(token);
}

module.exports = interceptor;
