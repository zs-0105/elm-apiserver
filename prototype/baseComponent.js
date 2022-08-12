const axios = require('axios')
const Ids = require('../models/ids')
const path = require('path')
const fs = require('fs')
const qiniu = require('qiniu')
const gm = require('gm')
const AsyncLock = require('async-lock')
var lock = new AsyncLock()
qiniu.conf.ACCESS_KEY = 'Ep714TDrVhrhZzV2VJJxDYgGHBAX-KmU1xV1SQdS';
qiniu.conf.SECRET_KEY = 'XNIW2dNffPBdaAhvm9dadBlJ-H6yyCTIJLxNM_N6';

const request = axios.create({
    baseURL: '',
    timeout: 3000,
})

module.exports = class BaseComponent {
    constructor() {
        this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
        this.imgTypeList = ['shop', 'food', 'avatar', 'default'];
        this.request = request
        this.qiniu = this.qiniu.bind(this)
    }
    async getId(type) {
        if (!this.idList.includes(type)) {
            console.log('id类型错误')
            throw new Error('id类型错误')
        }
        try {
            const res = await lock.acquire(type, async function (done) {
                let idData = await Ids.findOne()
                idData[type]++
                await idData.save()
                done(null, idData[type])
            })
            return res
        } catch (err) {
            console.log('获取ID数据失败');
            throw new Error(err)
        }
    }
    async qiniu(req, type = 'default') {
        return new Promise(async (resolve, reject) => {
            const file = req.file
            const repath = './public/img/' + file.filename;
            const key = file.filename
            const token = this.uptoken('node-elm', key);
            try {
                const qiniuImg = await this.uploadFile(token.toString(), key, repath);
                fs.unlinkSync(repath);
                resolve(qiniuImg)
            } catch (err) {
                console.log('保存至七牛失败', err);
                fs.unlinkSync(repath)
                reject('保存至七牛失败')
            }
        })
    }
    uptoken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
    }
    uploadFile(uptoken, key, localFile) {
        return new Promise((resolve, reject) => {
            var extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
                if (!err) {
                    resolve(ret.key)
                } else {
                    console.log('图片上传至七牛失败', err);
                    reject(err)
                }
            });

        })
    }
}