import { Sequelize } from "sequelize";
import configDB from '../config/connect_db.js';

const sequelize = new Sequelize(
   configDB.database,
   configDB.user,
   configDB.pass,
   {
      host: configDB.host,
      port: configDB.port,  // 3310 OK
      dialect: configDB.dialect,
      ssl: false,  // Disable để tránh issue
      pool: {
         max: 10,
         min: 0,
         acquire: 120000,
         idle: 30000
      },
      dialectOptions: {
         connectTimeout: 120000,
         socketTimeout: 120000,
         timezone: '+07:00',
      },
      logging: true,  // BẬT: Log query SQL + params (xem error ở đâu)
   }
);

// Test connect lúc init (tùy chọn, log nếu fail)
sequelize.authenticate()
   .then(() => console.log('✅ Sequelize initial connect OK!'))
   .catch(err => console.error('❌ Sequelize init fail:', err.message));

export default sequelize;