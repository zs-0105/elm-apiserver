const CategoryModel = require('../../models/shopping/category')
const DeliveryModel = require('../../models/shopping/delivery')
const ActivityModel = require('../../models/shopping/activity')
const BaseComponent = require('../../prototype/baseComponent.js')
class Category extends BaseComponent {
    constructor() {
        super()
    }
    getCategoryById(id) {
        const CateEntity = CategoryModel.findOne({
            'sub_categories.id': id
        })
        let cateName = CateEntity.name
        CateEntity.sub_categories.forEach(item => {
            if (item.id == id) {
                cateName += '/' + item.name
            }
        })
        return cateName
    }
    async getCategories(req, res) {
        try {
            const categories = await CategoryModel.find({}, '-_id')
            res.json(categories)
        } catch (err) {
            console.log('获取categories失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取categories失败'
            })
        }
    }
    // 获取配送方式
    async getDelivery_modes(req, res) {
        try {
            const Delivery_modes = await DeliveryModel.find({}, '-_id')
            res.send(Delivery_modes)
        } catch (err) {
            console.log('获取配送方式数据失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取配送方式数据失败'
            })
        }
    }
    //获取活动列表
    async getActivity(req, res, next) {
        try {
            const activities = await ActivityModel.find({}, '-_id');
            res.send(activities)
        } catch (err) {
            console.log('获取活动数据失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取活动数据失败'
            })
        }
    }
    // 分类数量更新
    async addCategory(type) {
        try {
            await CategoryModel.addCategory(type)
        } catch (err) {
            console.log('增加category数量失败');
        }
    }
}
module.exports = new Category()