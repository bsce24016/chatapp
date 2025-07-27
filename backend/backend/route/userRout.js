import express from 'express';
import  isLogin  from '../middleware/isLogin.js';
import {getCurrentChatters,getUserBySearch } from '../routeControllers/userhandlerControler.js';
const router = express.Router();



router.get('/search',isLogin,getUserBySearch)
router.get('/currentchatters',isLogin,getCurrentChatters)








export default router;