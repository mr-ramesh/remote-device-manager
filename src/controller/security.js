const express = require('express');
const router = express.Router();

const SecurityRepository = require('../repository/das/BaseSecurityRepository');
const repository = new SecurityRepository();

router.post('/signup', async (req, res) => {
    let {email, pass} = req.body;
    let moduleResponse = await repository.signup(email, pass);
    if(moduleResponse.code === 200) {
        moduleResponse = res.redirect('/login');
    }
    res.status(response.code).json(response);
});

router.post('/login', async (req, res) => {
    let {email, pass} = req.body;
    let response = await repository.login(email, pass);
    if(response.code === 200) {
        console.info(repository.token);
        res.status(200).json(repository.token);
    } else {
    res.status(response.code).json(response);

    }
});

module.exports = router;