import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import DatabaseError from '../models/errors/database.error.models';
import UnauthorizedError from '../models/errors/unauthorizedError.error';

function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    if (error instanceof DatabaseError) {
        statusCode = StatusCodes.BAD_REQUEST;
    } else if (error instanceof UnauthorizedError) {
        statusCode = StatusCodes.UNAUTHORIZED;
    }

    res.status(statusCode).json({ message: error.message });
}

export default errorHandler;
