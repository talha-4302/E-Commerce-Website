// Single place that formats every error into this API's response shape.
// Must be registered last, after all routes, in app.js.
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 200).json({
        success: false,
        message: err.message || "Something went wrong"
    });
};

export default errorHandler;
