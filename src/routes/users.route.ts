import { Router, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import DatabaseError from '../models/errors/database.error.models';
import userRepository from '../repositories/user.repository';

const usersRouter = Router();

usersRouter.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    const users = await userRepository.findAll();

    res.status(StatusCodes.OK).send(users);
});

usersRouter.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const { uuid } = req.params;

        const user = await userRepository.findById(uuid);

        res.status(StatusCodes.OK).send({ user });
    } catch (error) {
        next(error);
    }
});

usersRouter.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    const { body: newUser } = req;

    const uuid = await userRepository.create(newUser);

    res.status(StatusCodes.CREATED).send({ uuid });
});

usersRouter.put('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const { uuid } = req.params;
    const { body: modifyUser } = req;

    modifyUser.uuid = uuid;

    await userRepository.update(modifyUser);

    res.status(StatusCodes.OK).send({ result: 'ok' });
});

usersRouter.delete('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const { uuid } = req.params;

    await userRepository.remove(uuid);

    res.status(StatusCodes.OK).send({ result: 'ok' });
});

export default usersRouter;
