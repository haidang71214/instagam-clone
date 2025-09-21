import express from 'express';
import { changePass, extendToken, forgotPass, loginAsyncKey, loginFaceBook, logOut, register, updateMyself } from '../controllers/auth.controller.js'; 
import { uploadCloudAvarta } from '../config/uploadCloudAvatar.js';
import { middlewareTokenAsyncKey } from '../config/jwt.js';

const authRouter = express.Router();
authRouter.post('/register', register); 
authRouter.post('/login',loginAsyncKey);
authRouter.post('/forgotPass', forgotPass)
authRouter.post('/changePass',changePass);
authRouter.post('/extend-token', extendToken)
//login facebook tí check trên FE
authRouter.post('/loginFaceBook',loginFaceBook);
//Logout
authRouter.post('/logout', logOut)
authRouter.put('/updateUser/:user_id', uploadCloudAvarta.single('avatainsta'),updateMyself);
export default authRouter;
