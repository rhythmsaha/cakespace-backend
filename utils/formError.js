const AppError = require("./AppError");

class FormError extends AppError {
    constructor(message, statusCode, type = "FORM_ERROR", fields) {
        super(message, statusCode, (type = undefined));
        this.fields = fields;
    }
}

module.exports = FormError;
