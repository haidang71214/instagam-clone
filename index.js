import express from 'express';
import rootRouter from './src/routers/root.router.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import {createServer} from 'http'; 
import sequelize from "./src/models/connect.js";
import dotenv from 'dotenv';  // Uncomment + import
dotenv.config();  // Load env ở đầu

let model;  // Declare global model

// Sync + init model
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected!");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced!");

    // Fix: Init model SAU sync
    const initModels = (await import("./src/models/init-models.js")).default;
    model = initModels(sequelize);
    global.model = model;  // Global để controller dùng
    console.log("✅ Models initialized!");

  } catch (err) {
    console.error("❌ Database error:", err);
  }
})();

const app = express();

const server = createServer(app);
const io = new Server(server, { cors: '*' });

app.use(express.json());
app.use((req, res, next) => {
   console.log(`ALL REQUEST INCOMING: ${req.method} ${req.url} from IP ${req.ip}`);  // Log tất cả request
   next();
});
app.use(cors({
   origin: "http://103.57.223.234:4003/",
   credentials: true,
   preflightContinue: true,
}));
app.use(cookieParser());

app.use(rootRouter);
app.get('/', (req, res) => {
   res.send('hehehe');
});

server.listen(8080, () => {
   console.log("server on port 4002");
});