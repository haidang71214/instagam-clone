import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import initModels from '../models/init-models.js';
import  sequelize  from '../models/connect.js';

let accessTokenPrivateKey = fs.readFileSync('access_token.private.key');
let accessTokenPublicKey = fs.readFileSync('access_token.public.key');
let refreshTokenPrivateKey = fs.readFileSync('refresh_token.private.key');
let refreshTokenPublicKey = fs.readFileSync("refresh_token.public.key");
//đọc file env
dotenv.config();
const model = initModels(sequelize)

// login bất đối xứng
export const createTokenAsyncKey = async(data)=>{
   return jwt.sign({payload:data},accessTokenPrivateKey,{
      algorithm:'RS256',
      expiresIn:'7d'
   })
};

export const createRefTokenAsyncKey = async(data) =>{
   return jwt.sign({payload:data},refreshTokenPrivateKey,{
      algorithm:'RS256',
      expiresIn:'7d'
   })
};
export const verifyTokenAsyncKey = async(data) =>{
   try {
       jwt.sign({payload:data}, accessTokenPublicKey);
       return true;
   } catch (error) {
      return false;
   }
}
export const middlewareTokenAsyncKey = async(req,res,next) =>{
   let {token} = req.headers;
   let checkToken = verifyTokenAsyncKey(token);
   if(checkToken){
      // nếu hợp lệ thì qua chỗ khác làm tiếp
      next()
   }else{
     return res.status(404).json({message:'kh có quyền'})
   }
}