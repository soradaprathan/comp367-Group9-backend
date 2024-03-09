function errorHandler(err, req, res, next) {
    console.error("Error stack:", err.stack);

    if (err.name === 'UnauthorizedError' || err.message === 'Access denied. Admin privileges required.') {
        return res.status(401).json({ message: err.message });
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    } else {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = errorHandler;