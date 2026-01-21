import express from "express";
import { signupController, loginController } from "../../controllers/v1/auth.js";


// Creating The Router 
const authRouter = express.Router();

// Routes




/**
 * @authRouter /api/v1/auth/signup
 * @description Send User's Information for Sign Up
 * @access public
 * @method POST
 */
authRouter.post("/signup", signupController);




/**
 * @authRouter /api/v1/auth/login
 * @description Send User's Information for Login
 * @access public
 * @method POST
 */
authRouter.post("/login", loginController);




// Exporting the router
export default authRouter;