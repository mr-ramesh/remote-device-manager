const { Error } = require("mongoose");

class RDCException extends Error{

    constructor(exception) {
        super(exception.message)
        this.message = exception.message;
        this.statusCode = exception.code
    }

}

module.exports = RDCException;