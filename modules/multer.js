const multer = require('multer')
const path = require('path')
module.exports = {
    upCover() {
        var storage = multer.diskStorage({
            destination: async function (req, file, cb) {
                cb(null, 'public/img/')
            },
            filename: function (req, file, cb) {
                let extname = path.extname(file.originalname)
                cb(null, Date.now() + extname)
            }
        })
        upload = multer({
            storage: storage,
            limits: {
                fileSize: 5000 * 1000
            },
            fileFilter(req, file, cb) {
                const ename = path.extname(file.originalname)
                if (['.jpg', '.png', '.jpeg', '.svg', '.pic', '.bmp', '.webp'].includes(ename)) {
                    cb(null, true)
                } else {
                    cb('只能接受.jpg,.png,.jpeg,.svg,.pic,.bmp,.webp后缀的图片')
                }
            }
        }) //限制文件大小5000kb
        return upload
    },
}