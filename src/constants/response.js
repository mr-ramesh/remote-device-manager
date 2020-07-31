module.exports = {
    SUCCESS: {
      message: "Done!",
      code: 200
    },
    FORBIDDEN: {
      message: "Please login to proceed!",
      code: 403
    },
    USER_EXISTS: {
      message: "User already exists! Please use different mail id to register.",
      code: 409
    },
    UN_AUTHORIZED: {
        message: "You're not authorized to do this operation",
        code: 401
    },
    SERVER_ERROR:  {
      message: "Sorry for the inconvinience happened. Please try again later",
      code: 500
    },
  };
  