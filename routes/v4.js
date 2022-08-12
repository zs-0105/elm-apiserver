var express = require('express');
var router = express.Router();
var shoppingHandle = require('../controller/shoping/shop.js')

router.get('/restaurants', shoppingHandle.searchRestaurants)

module.exports = router;