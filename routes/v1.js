var express = require('express');
var router = express.Router();

const CityHandle = require('../controller/v1/cities')
const CartHandle = require('../controller/v1/carts')
const RemarkHandle = require('../controller/v1/remark')
const AddressHandle = require('../controller/v1/address')
const CaptchasHandle = require('../controller/v1/captchas')
const OrderHandle = require('../controller/v1/order')
const HongbaoHandle = require('../controller/promotion/hongbao')
const UserHandle = require('../controller/v2/user')
/* GET home page. */
router.get('/cities', CityHandle.getCity);
router.get('/cities/:id', CityHandle.getCityById);
router.get('/pois', CityHandle.search);
router.get('/pois/:geohash', CityHandle.getDetailAddress);
router.get('/carts/checkout', CartHandle.checkout)
router.get('/carts/:cart_id/remark', RemarkHandle.getRemarks)
router.get('/users/:user_id/addresses', AddressHandle.getAddresses)
router.post('/users/:user_id/addresses', AddressHandle.addAddress)
router.delete('/users/:user_id/addresses', AddressHandle.deleteAddress)
router.post('/users/:user_id/carts/:cart_id/orders', OrderHandle.postOrder);
router.post('/users/:user_id/hongbao/exchange', HongbaoHandle.exchange);
router.get('/users/list', UserHandle.getUserList);
router.get('/users/count', UserHandle.getUserCount);
router.get('/captchas', CaptchasHandle.getCaptchas)
router.get('/addresse/:address_id', AddressHandle.getAddAddressById)
router.get('/user/city/count', UserHandle.getUserCity)
module.exports = router;