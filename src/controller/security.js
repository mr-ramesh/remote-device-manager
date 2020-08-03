const express = require("express");
const router = express.Router();

const SecurityRepository = require("../repository/das/BaseSecurityRepository");
const repository = new SecurityRepository();

router.get("/signup", (req, res) => {
  res.render("form", { action: "signup", buttonLabel: "Register" });
});

router.post("/signup", async (req, res) => {
  let { email, pass } = req.body;
  await repository
    .signup(email, pass)
    .then((resp) => {
      res.render("form", {
        action: "login",
        buttonLabel: "Login",
        message: "User registered successfully! Please login to continue.",
        messageClass: "alert-success",
      });
    })
    .catch((err) => {
      res.render("form", {
        action: "signup",
        buttonLabel: "Register",
        message: "User exist already, Please use diffrent email!",
        messageClass: "alert-danger",
      });
    });
});

router.get("/login", (req, res) => {
  res.render("form", {
    action: "login",
    buttonLabel: "Login"
  });
});

router.post("/login", async (req, res) => {
  let { email, pass } = req.body;
  await repository
    .login(email, pass)
    .then((resp) => {
      if (!resp) {
        res.render("form", {
          action: "signup",
          buttonLabel: "Register",
          message: "User not exist. Please register to continue!",
          messageClass: "alert-danger",
        });
      } else {
        console.info(repository.token);
        res.cookie("AuthToken", repository.token);
        res.redirect("/device/manager");
      }
    })
    .catch((err) => {
      let code = err && err.code ? err.code : 500;
      if(code === 401) {
        res.render("form", {
          action: "login",
          buttonLabel: "Login",
          message: "Email or Password is Invalid!. Please use valid details.",
          messageClass: "alert-danger",
        });
      }
      res.status(code).json(err);
    });
});

module.exports = router;
