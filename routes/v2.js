var express = require('express');
var router = express.Router();
const Entry = require('../controller/v2/entry')
const User = require('../controller/v2/user')
router.get('/index_entry', Entry.getEntry);
router.post('/login', User.login)
router.get('/signout', User.signout)
router.post('/changepassword', User.chanegPassword)
module.exports = router;