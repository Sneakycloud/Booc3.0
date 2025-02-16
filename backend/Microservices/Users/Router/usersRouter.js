var express = require('express');
const {getCurrentUser,
    getUser,
    createUser, 
    deleteUser, 
    changePassword,
    changeStartPage} = require('../Controller/usersController');
var router = express.Router();

//Users
router.get("/users", getCurrentUser);
router.post("/users", createUser);
router.put("/users", changeStartPage);
router.delete("/users", deleteUser);

//Auth
router.get("/auth", getUser);

//Password
router.put("/password", changePassword);

module.exports = router;