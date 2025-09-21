import multer from "multer";
//  để v2 vì nó có nhiều version á, v1 v2 v3, ỗi cái scos 1 cách dùng khá nhau
import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();
// cấu hình cloudinary để kết nối tới bên thứ 3 
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret :process.env.CLOUDINARY_API_SECRET
});
// cấu hình cho multer lưu trũ file vào loudinary
const storage = new CloudinaryStorage({
   // tức là mình sẽ truyền cái trên vô đây
   cloudinary,
   params:{
      //  foulder tên gì cũng được
      folder:"avatainstagaaaaaaaaa", // define folder treen cloudinary
      // định nghĩa cái được đẩy lên
      format: async (req,file)=> {
         //định nghĩa những file img cho phép "img jpg,bla bla"
         const validImgFormat = ['png','webp','heic','gif','jpeg'];
         // lấy định dạng file từ file 
         // abc.jpg chẳng hạn
         const fileFormat = file.mimetype.split('/')[1];
         if(fileFormat.includes(fileFormat)){
            return fileFormat
         }
         // trả lỗi
         return '.png'
      },
      //  define tên ảnh
      public_id : (req,file) =>file.originalname.split(".")[0]
   }
}); // đằng trên là setup mọi thứ định nghĩa bla bla
// khởi tạo multer với cloudinary storage
   export const uploadCloudAvarta = multer({storage})
// imginstagramsfile