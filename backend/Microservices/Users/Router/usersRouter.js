var express = require('express');
const {getCurrentUser,
    createUser, 
    deleteUser, 
    changePassword,
    changeStartPage} = require('../controller/usersController');
var router = express.Router();

//Users
router.get("/users", getCurrentUser);
router.post("/users", createUser);
router.put("/users", changeStartPage);
router.delete("/users", deleteUser);

//Password
router.put("/password", changePassword);

module.exports = router;