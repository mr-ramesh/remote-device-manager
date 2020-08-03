const constants = require("../constants/common");
const SecurtiyRepository = require("../repository/das/BaseSecurityRepository");
const responseCosntants = require("../constants/response");
const securityRespository = new SecurtiyRepository();

const RDCException = require("../exception/RDCException");

async function preProcessor(req, res, next) {
  if (isAuthenticationRequired(req)) {
    if (requestValidator(req)) {
      try {
        req.user = await jwtValidator(req);
        next();
      } catch (error) {
        next(error);
      }
    } else {
      next(new RDCException(responseCosntants.UN_AUTHORIZED));
    }
  } else {
    if (loginAndSignupValidation(req).code === 200) next();
    else next(new RDCException(responseCosntants.FORBIDDEN));
  }
}

function isAuthenticationRequired(req) {
  let path = req.url.toString();
  return path.includes("login") || path.includes("signup") ? false : true;
}

function loginAndSignupValidation() {
  return responseCosntants.SUCCESS;
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

function postProcessor(req, res) {
  let response = req.moduleResponse;
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
  } else {
    res.status(500).json(responseCosntants.SERVER_ERROR);
  }
}

module.exports = {
  preProcessor,
  postProcessor,
};
