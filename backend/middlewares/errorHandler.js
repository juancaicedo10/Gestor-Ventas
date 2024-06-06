// errorHandler.js

function errorHandler(err, req, res, next) {
    // Handle the error here
    // You can log the error, send a custom error response, etc.

    // Example: Sending a generic error response
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { errorHandler };