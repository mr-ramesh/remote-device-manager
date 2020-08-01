const express = require("express");
const router = express.Router();

const SecurityRepository = require("../repository/das/BaseSecurityRepository");
const common = require("../constants/common");
const repository = new SecurityRepository();

router.get("/signup", (req, res) => {
  res.render("form", { action: "signup", buttonLabel: "Register" });
});

router.post("/signup", async (req, res) => {
  let { email, pass } = req.body;
  await repository
    .signup(email, pass)
    .then((resp) => {
      res.redirect("/login");
    })
    .catch((err) => {
      res.status(err.code).json(err);
    });
});

router.get("/login", (req, res) => {
  res.render("form", {
    action: "login",
    buttonLabel: "Login",
    message: "Please login to continue",
    messageClass: "alert-danger",
  });
});

router.post("/login", async (req, res) => {
  let { email, pass } = req.body;
  await repository
    .login(email, pass)
    .then((resp) => {
      console.info(repository.token);
      res.cookie('AuthToken', repository.token);
      res.redirect("/device/manager");
    })
    .catch((err) => {
      let code = err && err.code ? err.code : 500;
      res.status(code).json(err);
    });
});

module.exports = router;
