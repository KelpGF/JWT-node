import express, { NextFunction, Request, Response } from 'express';
import jwtAuthMiddleware from './middleware/jwt-auth.middleware';
import errorHandler from './middleware/error-handler.middleware';
import authRoute from './routes/auth.route';
import usersRouter from './routes/users.route';

const app = express();

// Configuração da aplicação
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de Rotas
app.use(authRoute);
app.use(jwtAuthMiddleware, usersRouter);
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ message: 'Hello' });
});

// Configuração dos Handlers de Erro
app.use(errorHandler);

app.listen(3000, () => {
    console.log('create server');
});
