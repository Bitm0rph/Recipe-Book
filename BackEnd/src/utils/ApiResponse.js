
// Error class is pre-defined in node.js
class ApiResponse extends Error{
    constructor(
        statusCode,
        data,
        message = "Success"
    ){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400
    }
}

export {ApiResponse}