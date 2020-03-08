/**
 * @param {object} res
 * @param {integer} code
 * @param {string} message
 * @param {string} token
 * @returns {object} response
 * @description Returns a successful response
 */
const successResponse = async (res, code, message, token) => res.status(code).json({
  message,
  token
});

/**
 * @param {object} res response object
 * @param {integer} code status code
 * @param {string} error error message
 * @returns {object} response json object
 * @description Returns an error response
 */
const errorResponse = async (res, code, error) => res.status(code).json({
  error,
});

export default {
  successResponse,
  errorResponse,
};