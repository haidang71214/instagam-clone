import dotenv from 'dotenv';
//  đọc file .env
dotenv.config();

//  chỗ ở dưới ni quan trọng nè

export default {
  user: process.env.DB_USER || "root",
  pass: process.env.DB_PASS || "123456",  // pass = không có gì
  host: process.env.DB_HOST || "103.57.223.234",
  database: process.env.DB_DATABASE || "instagraaa",
  dialect: process.env.DB_DIALECT || "mysql",
  port: process.env.DB_PORT || 3310, 
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false } 
};