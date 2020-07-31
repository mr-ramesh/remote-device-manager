const { Error } = require("mongoose");

class RDCException extends Error{

    constructor(exception) {
        this.name = "RDCExcption";
        this.message = exception.message;
        this.statusCode = exception.statusCode
    }

}