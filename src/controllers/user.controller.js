import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
const model = initModels(sequelize);

const userComment = async (req, res) => {
   try {
      const { image_id } = req.params;
      const { user_id, comments } = req.body;
      if (!image_id || !user_id || !comments) {
         return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
      }

      const commentDate = new Date().toISOString().slice(0, 10);

      const newComment = await model.comments.create({
         image_id: image_id,
         user_id: Number(user_id),
         noi_dung: comments,
         comment_date: commentDate,
      });

      console.log(newComment);
      return res.status(200).json({
         message: 'comment thành công',
         data: newComment,
      });
   } catch (error) {
      console.error(error); // In ra log để dễ dàng debug
      return res.status(500).json({ message: 'API error' });
   }
};

const getInforUser = async (req,res) =>{
   try {
      let {user_id} = req.params;
      const data = await model.users.findOne({
         where:{user_id:user_id},
         attributes:['full_name','age','avartar','email'],
         include:[{
            model: model.images,
            as:'images'
         }]
      })
      return res.status(200).json(data)
   } catch (error) {
      return res.status(500).json({message:'API Error'})
   }
};
const getUser = async (req, res) => {
   try {
     const data = await model.users.getAll();
     return res.status(200).json(data);
   } catch (error) {
     console.error(error); // Để dễ dàng debug nếu có lỗi
     return res.status(500).json({ message: 'Error fetching users' });
   }
};



export {userComment,getInforUser,getUser};