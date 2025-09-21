import { Sequelize } from "sequelize";
import configDB from '../config/connect_db.js';

const sequelize = new Sequelize(
   configDB.database,
   configDB.user,
   //  password thực sự là gì ta
   configDB.pass,
   {
      host:configDB.host,
      port:configDB.port,
      dialect:"mysql",
      // hình như muốn test thì phải sửa cái này 
   }
)
export default sequelize;