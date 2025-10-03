import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
// import mã hóa
import bcrypt from "bcrypt";
import crypto from "crypto";
import transporter from "../config/transporter.js";
import { createRefTokenAsyncKey, createTokenAsyncKey } from "../config/jwt.js";
const model = initModels(sequelize);const register = async (req, res) => {
   console.log('=== REGISTER HIT: Route matched! ===');  // Log 1: Xác nhận vào hàm
   
   console.log('Sequelize instance check:', !!sequelize);  // Log 2: Check sequelize có tồn tại không
   console.log('Model.users check:', !!model?.users);  // Log 3: Check model load OK
   
   try {
      console.log('Starting try block...');  // Log 4: Vào try
      
      // Test connect NGAY ĐẦU (trước req.body)
      console.log('Step 1: Authenticating DB...');
      const testAuth = await sequelize.authenticate();
      console.log('Step 1 OK: Auth result:', testAuth ? 'SUCCESS' : 'FAIL');  // Phải là undefined nếu OK (Sequelize convention)
      
      console.log('Step 2: Testing findOne...');
      const testUser = await model.users.findOne({ where: { email: 'test@fake.com' } });
      console.log('Step 2 OK: Test user found?', !!testUser);  // false nếu không tồn tại
      
      console.log('Step 3: Req body:', req.body);  // Log 5: Giờ mới log body
      const { full_name, email, pass_word, age } = req.body;
      
      // Validate (tránh crash)
      if (!email || !pass_word || !full_name || age === undefined) {
         console.log('Validation fail: Missing fields');
         return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
      }
      
      console.log('Step 4: Checking existing user...');
      const user = await model.users.findOne({ where: { email } });
      console.log('Step 4 OK: User exists?', !!user);
      
      if (user) {
         console.log('User exists, returning 409');
         return res.status(409).json({ message: "Email đã tồn tại trong hệ thống" });
      }
      
      console.log('Step 5: Creating user...');
      const newUser = await model.users.create({
         email,
         full_name,
         pass_word: bcrypt.hashSync(pass_word, 10),
         age,
      });
      console.log('Step 5 OK: New user ID:', newUser.user_id);
      
      // Mail part (await để chờ)
      console.log('Step 6: Sending mail...');
      const mailOption = {
         from: "dangpnhde170023@fpt.edu.vn",
         to: email,
         subject: "Welcome to our service",
         text: "Best regards!",
      };
      await transporter.sendMail(mailOption);  // Await để sync
      console.log('Step 6 OK: Mail sent');
      
      return res.status(201).json({
         message: "Đăng kí thành công",
         data: { id: newUser.user_id, email: newUser.email, full_name: newUser.full_name }
      });
      
   } catch (error) {
      console.error('=== CATCH BLOCK: REGISTER ERROR ===');
      console.error('- Error name:', error.name);
      console.error('- Error message:', error.message);
      console.error('- Error code:', error.code || 'N/A');  // Sequelize error code (ER_ACCESS_DENIED_ERROR, etc.)
      console.error('- Error stack:', error.stack);
      if (error.parent) {  // Sequelize wrap MySQL error
         console.error('- MySQL original error:', error.parent.message);
      }
      console.log("AAAAAAAAAAA");
      
      return res.status(500).json({ 
         message: "Lỗi: " + (error.message || "Unknown DB error")  // Return error cụ thể hơn
      });
   }
};
// lưu trữ gia hạn người dùng mỗi khi hết phiên đăng nhập
const extendToken = async (req, res) => {
   try {
      // lấy refreshToken trên cookie của req
      let refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
         return res.status(404);
      }
      // check refresh token trong db
      let userRefToken = await model.users.findOne({
         where: {
            refresh_token: refreshToken,
         },
      });
      if (!userRefToken) {
         return res.status(400).json({ message: "không tìm thấy cái ref token " });
      }
      let newAccessToken = createTokenAsyncKey({ user_id: users.user_id });
      return res.status(200).json({ data: newAccessToken });
   } catch (error) {}
};
// login bất đối xứng
const loginAsyncKey = async (req, res) => {
   try {
      const { email, pass_word } = req.body;
      const user = await model.users.findOne({
         where: { email: email },
      });

      if (!user) {
         return res.status(400).json({ message: "User không tồn tại" });
      }

      const checkPassWord = bcrypt.compareSync(pass_word, user.pass_word);

      if (!checkPassWord) {
         return res.status(400).json({ message: "Mật khẩu không đúng" });
      }

      let accessToken = await createTokenAsyncKey({ user_id: user.user_id });
      let refToken = await createRefTokenAsyncKey({ user_id: user.user_id });

      // Kiểm tra giá trị của refToken trước khi cập nhật
      console.log("Refresh Token:", refToken);

      await model.users.update(
         {
            refresh_token: refToken,
         },
         {
            where: { user_id: user.user_id },
         }
      );

      res.cookie("refreshToken", refToken, {
         httpOnly: true,
         secure: false,
         sameSite: "Lax",
         maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      if (!accessToken) {
         console.log("token fail");
         return res.status(500).json({ message: "Token fail" });
      }
      return res.status(200).json({ message: "Login success", accessToken, user_id: user.user_id });
   } catch (error) {
      return res.status(500).json({ message: "Error 500, wrong in API" });
   }
};
// lấy mail
const forgotPass = async (req, res) => {
   try {
      const { email } = req.body;
      const user = await model.users.findOne({
         where: { email: email },
      });
      if (!user) {
         return res.status(404).json({ message: "email không tìm thấy trong database" });
      }
      //  else
      let randomCode = crypto.randomBytes(5).toString("hex");

      // cái code xác nhận thay bằng expried_code trong users;
      await model.users.update(
         { expried_code: randomCode },
         {
            where: {
               user_id: user.user_id,
            },
         }
      );
      // gửi mail
      const mailOption = {
         from: "dangpnhde170023@fpt.edu.vn",
         to: email,
         subject: `Reset Token : ${randomCode}`,
         text: "best regart",
      };
      // trong chỗ database có code rồi, thêm 1 cái xác nhận nữa
      transporter.sendMail(mailOption, (err, info) => {
         if (err) {
            return res.status(500).json({ message: "sending mail error" });
         }
         return res.status(200).json({ message: "sending mail success", data: user });
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "error 500,wrong in" });
   }
};
//change pass
const changePass = async (req, res) => {
   try {
      const { expried_code, pass_word } = req.body;

      // Tìm người dùng theo expried_code
      const user = await model.users.findOne({
         where: { expried_code },
      });

      if (!user) {
         return res.status(404).json({ message: "Mã code không hợp lệ hoặc không tồn tại" });
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = bcrypt.hashSync(pass_word, 10);

      // Cập nhật mật khẩu của người dùng và đặt expried_code về null để vô hiệu hóa mã
      await model.users.update(
         { pass_word: hashedPassword, expried_code: null }, // Đặt expried_code về null sau khi sử dụng
         { where: { expried_code } }
      );

      return res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công" });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
   }
};


const loginFaceBook = async (req, res) => {
   try {
      const { id, full_name, email } = req.body;
      // Tìm user bằng email trước
      let user = await model.users.findOne({
         where: {
            email: email,
         },
      });
      // Nếu user tồn tại nhưng không có face_app_id, cập nhật face_app_id
      if (user && !user.face_app_id) {
         await model.users.update({ face_app_id: id }, { where: { email: email } });
         user.face_app_id = id; // Cập nhật vào đối tượng user để tránh fetch lại
      }

      // Nếu không có user với email hoặc face_app_id, tạo user mới
      if (!user) {
         user = await model.users.create({
            full_name: full_name,
            face_app_id: id,
            email: email,
         });
      }

      // Tạo accessToken và refreshToken
      let accessToken = createTokenAsyncKey({ user_id: user.user_id });
      let refreshToken = createRefTokenAsyncKey({ user_id: user.user_id });

      // Cập nhật refreshToken vào database 
      // chỗ refresh bị lỗi cập nhật
      await model.users.update(
         { refresh_token: String(refreshToken)  },
         { where: { user_id: user.user_id } }
      );

      // Thiết lập cookie với refreshToken
      res.cookie("refreshToken", refreshToken, {
         httpOnly: true,
         secure: false,
         sameSite: "Lax",
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      // Kiểm tra nếu accessToken bị lỗi
      if (!accessToken) {
         console.log("Token creation failed");
         return res.status(500).json({ message: "Lỗi tạo token." });
      }

      // Trả về accessToken và thông tin user
      //FROM `users` AS `users` WHERE `users`.`email` = 'haidang71214@gmail.com' LIMIT 1;
// string violation: refresh_token cannot be an array or an object
      return res.status(200).json({
         message: "success",
         data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
               user_id: user.user_id,
               full_name: user.full_name,
               email: user.email,
            },
         },
      });
   } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "API fails" });
   }
};

const logOut = async (req, res) => {
   try {
      let { user_id } = req.body;
      let user = await model.users.findOne({
         where: {
            user_id,
         },
      });
      if (user) {
         await model.users.update(
            {
               refresh_token: null,
            },
            {
               where: {
                  user_id: user_id,
               },
            }
         );
         res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
         });
         return res.status(200).json({ message: "logout thành công" });
      } else {
         console.log("=))) thực ra trong trường hợp này đéo có else");
      }
   } catch (error) {
      return res.status(500).json({ message: "API fails" });
   }
};
// Cập nhật thông tin người dùng
const updateMyself = async (req, res) => {
   const user_id = req.params.user_id;
   const { new_name, new_pass, new_age } = req.body;
   // lấy file
   const file = req.file;

   // Tìm người dùng
   const user = await model.users.findOne({
      where: { user_id: user_id }
   });

   if (!user) {
      return res.status(404).json({ message: 'User not found' });
   }
   let paspas;
   if (new_pass) {
      paspas = bcrypt.hashSync(new_pass, 10);
   } else {
      paspas = user.pass_word;
   }

   
   // Cập nhật
   try {
      const data = await model.users.update({
         avartar: file ? file.path : user.avatar,
         full_name: new_name || user.full_name,
         age: new_age || user.age,
         pass_word: paspas,
      }, { where: { user_id: user_id } });

      return res.status(200).json({ message: 'User updated successfully' });
   } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: 'An error occurred' });
   }
};


export {
   register,
   extendToken,
   loginAsyncKey,
   forgotPass,
   changePass,
   loginFaceBook,
   logOut,
   updateMyself,
};
