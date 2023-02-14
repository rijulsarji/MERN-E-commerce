// we will wrap all async functions in controller with asyncError so that we don't have to write error messages everytime.
module.exports = asyncError => (req, res, next) => {
  Promise.resolve(asyncError(req, res, next)).catch(next);
}