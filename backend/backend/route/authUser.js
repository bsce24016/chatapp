import express from "express";
const router = express.Router();
import { userRegister,userLogin,userLogout} from '../routeControllers/userrouteController.js';



router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', userLogout);


export default router;
