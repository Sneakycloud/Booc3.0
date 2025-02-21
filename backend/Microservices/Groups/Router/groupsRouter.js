var express = require('express');
const {getGroup,
    getAllGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    leaveGroup} = require('../Controller/groupController');
var router = express.Router();

//Groups
router.get("/groups", getGroup);
router.all("/groups", getAllGroups);
router.post("/groups", createGroup);
router.put("/groups", updateGroup);
router.delete("/groups", deleteGroup);
router.checkout("/groups", leaveGroup);

module.exports = router;