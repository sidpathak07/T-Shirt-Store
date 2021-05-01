const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signin, signout, signup, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name should be of atleast 3 characters"),
    body("email").isEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be of minimum 8 characters"),
  ],
  signup
);

router.post(
  "/signin",
  [
    body("email").isEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password length should be of minimum 8 characters"),
  ],
  signin
);

router.get("/signout", signout);

// router.get("/testroute", isSignedIn, (req, res) => {
//   res.json(req.auth);
// });

module.exports = router;
