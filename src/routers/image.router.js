import express from 'express';
import { getAll,uploadImg,getDetailImg ,deleteImg} from '../controllers/images.controller.js'; 
import { uploadCloud } from '../config/uploadCloud.js';




const imgeRouter = express.Router();
imgeRouter.get('/get-add-image',getAll)
//  chỗ đằng dưới có cái imgfile là tên trong body hehe,
// còn xử lí thì bên cái uploadImg
imgeRouter.post('/upload-image-cloud/:user_id', uploadCloud.single('imgfile'), uploadImg)
imgeRouter.get('/get-detail/:image_id',getDetailImg);
// thao tác với ảnh
imgeRouter.delete('/deleteimg/:image_id',deleteImg)
export default imgeRouter;
