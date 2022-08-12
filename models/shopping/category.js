'use strict';

const mongoose = require('mongoose')
const categoryData = require('../../InitData/category')
const AsyncLock = require('async-lock')
const lock = new AsyncLock()
const Schema = mongoose.Schema;

const categorySchema = new Schema({
	count: Number,
	id: Number,
	ids: [],
	image_url: String,
	level: Number,
	name: String,
	sub_categories: [{
		count: Number,
		id: Number,
		image_url: String,
		level: Number,
		name: String
	}, ]
});

categorySchema.statics.addCategory = async function (type) {
	const categoryName = type.split('/');
	try {
		lock.acquire('upCategoryNum', async (done) => {
			const allcate = await this.findOne();
			const subcate = await this.findOne({
				name: categoryName[0]
			});
			allcate.count++;
			subcate.count++;
			subcate.sub_categories.map(item => {
				if (item.name == categoryName[1]) {
					return item.count++
				}
			})
			await allcate.save();
			await subcate.save();
			console.log('保存cetegroy成功');
			done()
		})
		return
	} catch (err) {
		console.log('保存cetegroy失败');
		throw new Error(err)
	}
}

const Category = mongoose.model('Category', categorySchema)

Category.findOne((err, data) => {
	if (!data) {
		for (let i = 0; i < categoryData.length; i++) {
			Category.create(categoryData[i]);
		}
	}
})

module.exports = Category