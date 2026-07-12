// Wraps an async controller so rejected promises/thrown errors reach the centralized
// error handler via next(), instead of every controller needing its own try/catch.
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
