// backend/middlewares/errorMiddleware.js

const notFound = (req, res, next) => {
    const error = new Error(`No Encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Si el status code es 200, significa que el error fue lanzado
    // y debe ser un 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        // Solo enviamos el stack en modo de desarrollo
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
    });
};

module.exports = { notFound, errorHandler };