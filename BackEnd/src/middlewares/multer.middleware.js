import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,"./public/tmp")
    },
    filename: function (req,file,cb){
        // This takes 2 parameters -> error and filename
        cb(null,file.fieldname+'_'+Date.now()+'_'+file.originalname)
    }
})

export const upload = multer({
    storage
})