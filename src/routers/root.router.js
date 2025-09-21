import express from 'express';
import authRouter from './auth.router.js';
import imgeRouter from './image.router.js';
import userRouter from './user.router.js';

const rootRouter = express.Router();
rootRouter.use('/auth',authRouter)
// note lại thì bên chỗ user có bình luận với up ảnh với truy cập tưgnf cái ảnh
// rootRouter.use('/user',)
//  ảnh sẽ lấy ra được những cái comment, có lấy ra toàn bộ ảnh với có lấy toàn bộ ảnh của user đó
rootRouter.use('/image',imgeRouter);
rootRouter.use('/user',userRouter);
export default rootRouter