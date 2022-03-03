import { NextFunction, Request, Response, Router } from 'express';
import JWT, { SignOptions } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import basicAuthenticationMiddleware from '../middleware/basic-authorization.middleware';
import UnauthorizedError from '../models/errors/unauthorizedError.error';
import jwtAuthMiddleware from '../middleware/jwt-auth.middleware';

const authRoute = Router();

authRoute.post('/login', basicAuthenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user } = req;

        if (!user) {
            throw new UnauthorizedError('Usuário não informado');
        }

        const jwtPayload = { username: user.username };
        const jwtOptions: SignOptions = { subject: user.uuid, expiresIn: '1m' };
        const secretKey = 'my_secret_key';

        const jwtToken = JWT.sign(jwtPayload, secretKey, jwtOptions);

        res.status(StatusCodes.OK).json({ token: jwtToken });
    } catch (error) {
        next(error);
    }
});

authRoute.get('/token-validation', jwtAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

export default authRoute;
