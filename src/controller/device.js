const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
    console.log("req: ", req.body);
    res.write(`Device Created with id: ${req.body.devices[0].id}`);
});

router.post('/share', (req, res) => {
    res.write(`Device ${req.param.id} shared with user ${req.param.user}`);
});


router.get('/read', (req, res) => {
    let devices = [{
        "device_id":"a9b47f330080",
        "name":"device001",
        "devType":"AA",
        "currentState":1,
        "lastUpdated":"1588214153"
        }];
    res.json(devices);
});

router.put('/edit', (req, res) => {
    res.send("edit...");
});

router.put('/currentState', (req, res) => {
    res.send("stateEdit...");
});


router.delete('/delete', (req, res) => {
    res.send("delete...");
});

module.exports = router;