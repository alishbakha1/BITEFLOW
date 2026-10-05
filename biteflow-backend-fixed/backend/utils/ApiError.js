// Lightweight error class so controllers can `throw new ApiError(404, 'Not found')`
// and let the centralized error middleware turn it into a JSON response.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
