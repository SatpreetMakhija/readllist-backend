//we create our own custom Error handling model to reduce code duplication
class HttpError extends Error {s
    constructor(message, errorCode) {
        super(message); //Adds a "message" property
        this.code = errorCode; //Adds a "code" property
    };
}

module.exports = HttpError;
//not working shows error "HttpError is not a constructor"