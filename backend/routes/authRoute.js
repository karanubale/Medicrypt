import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);


//protected User route auth
// router.get("/user-auth", requireSignIn, (req, res) => {
//   res.status(200).send({ ok: true });
// });

//protected Admin route auth
// router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
//   res.status(200).send({ ok: true });
// });



export default router;