var express = require('express');
var router = express.Router();
var shoppingHandle = require('../controller/shoping/shop.js')
var categoryHandle = require('../controller/shoping/category.js')
var foodHandle = require('../controller/shoping/food')
var Check = require('../middlewares/check')
router.get('/restaurants', shoppingHandle.getRestaurants)
router.get('/v2/restaurant/category', categoryHandle.getCategories)
router.get('/v1/delivery_modes', categoryHandle.getDelivery_modes)
router.get('/v1/restaurants/activity_attributes', categoryHandle.getActivity)
router.get('/restaurant/:restaurant_id', shoppingHandle.getRestaurantDetail)
router.post('/updateshop', Check.checkAdmin, shoppingHandle.updateshop);
router.delete('/restaurant/:restaurant_id', Check.checkSuperAdmin, shoppingHandle.deleteResturant);
router.get('/restaurants/count', shoppingHandle.getShopCount);
router.post('/addshop', Check.checkAdmin, shoppingHandle.addRestaurant)
router.post('/addcategory', Check.checkAdmin, foodHandle.addCategory)
router.get('/getcategory/:restaurant_id', foodHandle.getCategory);
router.post('/addfood', Check.checkAdmin, foodHandle.addFood)
router.get('/v2/menu', foodHandle.getMenu)
router.get('/v2/menu/:category_id', foodHandle.getMenuDetail)
router.post('/v2/updatefood', Check.checkAdmin, foodHandle.updateFood);
router.delete('/v2/food/:food_id', Check.checkSuperAdmin, foodHandle.deleteFood);
router.get('/v2/foods/count', foodHandle.getFoodsCount);
router.get('/v2/foods', foodHandle.getFoods);
module.exports = router;