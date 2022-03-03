import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../models/errors/unauthorizedError.error';
import userRepository from '../repositories/user.repository';

async function basicAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            throw new UnauthorizedError('Credenciais não informadas');
        }

        const [authType, token] = authorizationHeader.split(' ');

        if (authType !== 'Basic' || !token) {
            throw new UnauthorizedError('Tipo de autenticação inválidoss');
        }

        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');

        const [username, password] = tokenContent.split(':');

        if (!username || !password) {
            throw new UnauthorizedError('Crendenciais não preeenchidas');
        }

        const user = await userRepository.findByUserNameAndPassword(username, password);

        if (!user) {
            throw new UnauthorizedError('Crendenciais inválidas');
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}

export default basicAuthenticationMiddleware;
