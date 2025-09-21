import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

const model = initModels(sequelize);

const getAll = async (req, res) => {
   try {
      const data = await model.images.findAll();
      return res.status(200).json(data);
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "API falls" });
   }
};


const uploadImg = async (req, res) => {
   try {
      const { user_id } = req.params;
      const file = req.file;  // Đối tượng tệp sau khi upload
      const { image_name, tittle } = req.body;

      // Kiểm tra nếu `file` không tồn tại hoặc `file.path` không có giá trị
      if (!file || !file.path) {
         console.log("Không tìm thấy URL của ảnh trên Cloudinary.", file); // In ra để kiểm tra
         return res.status(400).json({ message: "Không tìm thấy URL của ảnh trên Cloudinary." });
      }

      // Tiến hành lưu ảnh vào cơ sở dữ liệu
      const data = await model.images.create({
         image_name: image_name,
         url: file.path,  // URL từ Cloudinary
         user_id: user_id,
         tittle: tittle,
      });
      // làm cho có chứ cần thiết lắm
      await model.saves.create({
         user_id:user_id,
         image_id:data.image_id,
         date_save: new Date().toISOString().slice(0, 10)
      })

      console.log('Ảnh đã upload và lưu thành công.');
      return res.status(200).json(data);
   } catch (error) {
      console.error("Lỗi trong quá trình upload ảnh:", error);
      return res.status(500).json({ message: error });
   }  
};
const getDetailImg = async(req,res) =>{
   try {
      let {image_id} = req.params;
      const data = await model.images.findOne({
         where:{image_id:image_id},
         include:[{
            model:model.comments,
            as:'comments',
            attributes:['comment_date','noi_dung','comment_id'],
            include:[{
               model: model.users,
               as:'user',
               attributes:['full_name','email','avartar']
            }]
         }]
      })
      if(!data){
         return res.status(404).json({message:'notfound'})
      }
      return res.status(200).json(data)

   } catch (error) {
      console.log(error);
      
      return res.status(500).json({message:'API error'})
   }
}
const deleteImg = async (req, res) => {
   try {
      // Lấy `image_id` từ params
      let { image_id } = req.params;

      // Tìm ảnh trong cơ sở dữ liệu
      let img = await model.images.findOne({
         where: { image_id }
      });

      // Kiểm tra nếu ảnh không tồn tại
      if (!img) {
         return res.status(404).json({ message: "Không tìm được ảnh" });
      }

      // Lấy URL của ảnh để xóa trong cloud
      const imgurl = img.url;
      await deleteImgCloud(imgurl); // Xóa trong cloud trước

      // Xóa ảnh trong các bảng phụ
      await model.saves.destroy({
         where: { image_id }
      });
      await model.comments.destroy({
         where: { image_id }
      });
      await model.images.destroy({
         where: { image_id }
      });

      // Trả về phản hồi thành công
      return res.status(200).json({ message: 'Xóa thành công' });

   } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi
      console.error("Lỗi khi xóa ảnh:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi khi xóa ảnh" });
   }
};

// chỗ này để xóa img trên cloud
const deleteImgCloud = async (imgurl) => {
   try {
      const publicId = imgurl.split('/').pop().split('.')[0];
      await cloudinary.v2.uploader.destroy(publicId);
      console.log('Ảnh đã được xóa khỏi Cloudinary');
   } catch (error) {
      console.error("Lỗi khi xóa ảnh trên cloud:", error);
      throw error; // Ném lỗi để deleteImg có thể xử lý
   }
};


export { getAll, uploadImg,getDetailImg,deleteImg };
