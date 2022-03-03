import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import UnauthorizedError from '../models/errors/unauthorizedError.error';

async function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader) {
                throw new UnauthorizedError('Credenciais não informadas');
            }

            const [authType, token] = authorizationHeader.split(' ');

            if (authType !== 'Bearer' || !token) {
                throw new UnauthorizedError('Tipo de autenticação inválida');
            }

            const tokenPayload = JWT.verify(token, 'my_secret_key');

            if (typeof tokenPayload !== 'object' || !tokenPayload.sub) {
                throw new UnauthorizedError('Token inválido');
            }

            const user = { uuid: tokenPayload.sub, username: tokenPayload.username };

            req.user = user;
            next();
        } catch (error) {
            throw new UnauthorizedError('Token inválido');
        }
    } catch (error) {
        next(error);
    }
}

export default jwtAuthMiddleware;
