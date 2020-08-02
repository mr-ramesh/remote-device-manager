const constants = require("../constants/common");
const SecurtiyRepository = require("../repository/das/BaseSecurityRepository");
const responseCosntants = require("../constants/response");
const securityRespository = new SecurtiyRepository();

const RDCException = require("../exception/RDCException");

async function interceptor(req, res, next) {
  try {
    await preProcessor(req);
    await next();
  } catch (error) {
    let response = responseCosntants.SERVER_ERROR;
    if (error instanceof RDCException) {
      response.code = error.statusCode;
      response.message = error.message;
    }
    req.moduleResponse = response;
    console.error("Error Response in interceptor : ", response);
  }
  postProcessor(req, res);
}

async function preProcessor(req) {
  let flag = isAuthenticationRequired(req);
  if (flag) {
    if (requestValidator(req)) {
      try {
        let user = await jwtValidator(req);
        return (req.user = user);
      } catch (error) {
        throw error;
      }
    } else {
      throw new RDCException(responseCosntants.UN_AUTHORIZED);
    }
  } else {
    if (loginAndSignupValidation(req).code === 200) return req;
    else throw new RDCException(responseCosntants.FORBIDDEN);
  }
}

function isAuthenticationRequired(req) {
  let path = req.url.toString();
  return path.includes("login") || path.includes("signup") ? false : true;
}

function loginAndSignupValidation() {
  return responseCosntants.SUCCESS;
}

function postProcessor(req, res) {
  let response = req.moduleResponse;
  console.log("Here resp : ", response);
  if (response) {
    let code = response.code ? response.code : 500;
    if (code === 401)
      res.render("form", {
        action: "login",
        buttonLabel: "Login",
        message: "Please login to continue",
        messageClass: "alert-danger",
      });
    else res.status(code).json(response);
  }
}

function requestValidator(req) {
  return req.cookies["AuthToken"] != null ? true : false;
}

async function jwtValidator(req) {
  try {
    return await validateToken(req.cookies["AuthToken"]);
  } catch (error) {
    throw error;
  }
}

async function validateToken(token) {
  let user = await securityRespository
    .validateToken(token)
    .then((user) => user)
    .catch((err) => {
      throw new RDCException(err);
    });
  return user;
}

module.exports = interceptor;
