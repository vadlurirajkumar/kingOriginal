const multer = require("multer")
const path = require("path")

//? For upload the Image
const uploadImage = multer({
  storage: multer.diskStorage({}),
  profileImg: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type not supported"), false);
      console.log(`cd > ${cb}`);
    }
    cb(null, true);
  },
  limits: { fileSize: 5000000 },
});

//? For upload the CV
// const uploadCV = multer({
//   storage: multer.diskStorage({}),
//   fileFilter(req, file, cb) {
//     const ext = path.extname(file.originalname)
//     console.log("ext = "+ext)
//     if (!ext.match(/\.(pdf)$/)) {
//       return cb(
//         new Error(
//           "only upload PDF files format."
//         ),
//         false
//       );
//     }
//     cb(undefined, true);
//   },
//   limits: { fileSize: 5000000 }, // max file size is 5MB = 5000000 bytes
// });


module.exports = uploadImage;