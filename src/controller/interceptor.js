const constants = require('../../constants');

function interceptor(req, res, next) {
    if(preProcessor(req, res)) next();
    postProcessor(res);
}

function preProcessor(req, res) {
    if(requestValidator(req))
        if(jwtValidator(req))
            return true;
        else
            res.sendStatus(403); //Forbidden
    else
        res.sendStatus(401); //Unathorized
}

function postProcessor(res) {
    res.end();
}


requestValidator = req => { 
    return getTokenFromRequest(req) != null ? true : false;  
}

jwtValidator = req => {
    return validateToken(getTokenFromRequest(req));
}

function getTokenFromRequest(req) {
    const authHeader = req.headers[constants.AUTH_HEADER];
    return authHeader && authHeader.split(' ')[1];
}

function validateToken(token) {
    
}

module.exports = interceptor;