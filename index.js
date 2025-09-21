import express from 'express';
import rootRouter from './src/routers/root.router.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import {createServer} from 'http'; 
import initModels from "./src/models/init-models.js";
import sequelize from "./src/models/connect.js";
const model = initModels(sequelize);
// nhận event từ cái server(socket);

//
const app = express();
// chuyển mọi thứ sang json
// socket tạo http server với socketIO server
   const server = createServer(app);
   const io = new Server(server,{
      cors:'*'
   }); 

//
app.use(express.json())
app.use(
   cors({
      origin: "http://localhost:3000", //
      credentials: true, // Nếu bạn sử dụng cookie, phải có cấu hình này
      preflightContinue: true,
   })
);
//middware để getifomation
app.use(cookieParser());
// 
app.use(rootRouter);
app.get('/',(req,res)=>{
   res.send('hehehe')
});
// đổi từ app.listen thành server.listen nếu muốn dùng socket (hoặc tí đổi lại)
server.listen(8080, () => {
   console.log("server on port 8080");
});

// express không hỗ trợ mình trực tiếp tạo socketIO mà mình phải dùng thư viện;
// để ý cái này ha, mình mở bao nhiêu cái tab thì nó sẽ nhảy ra bấy nhiêu cái otAuNBeLeXcl4sKiAAAC
// fEGLDOlhrMqPP4IZAAAD
// 