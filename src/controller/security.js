const express = require('express');
const router = express.Router();

router.post('/signup', (req, res) => {
    res.write(`Device Created with id: ${res.body.devices[0].id}`);
});

router.post('/login', (req, res) => {
    res.write(`Device ${req.param.id} shared with user ${req.param.user}`);
});

module.exports = router;