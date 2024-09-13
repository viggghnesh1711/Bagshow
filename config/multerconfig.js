const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const { storage } = require('./cloudinaryConfig');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12,function(err, name){
        const fn=name.toString('hex')+path.extname(file.originalname)
        cb(null, fn)
      })
    }
  })
  
  const fileFilter = (req, file, cb) => {
    // Check if the file is a PNG image
    const allowedTypes = /png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
  
    if (extname && mimetype) {
      cb(null, true);  // Accept the file
    } else {
      cb(null, false);  // Reject the file
    }
  };
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
})

  module.exports=  upload